package main

import (
	"context"
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	gcstorage "cloud.google.com/go/storage"
	"github.com/nightfixed/atelier-private-chef/api/internal/ai"
	"github.com/nightfixed/atelier-private-chef/api/internal/auth"
	"github.com/nightfixed/atelier-private-chef/api/internal/database"
	"github.com/nightfixed/atelier-private-chef/api/internal/handler"
	"github.com/nightfixed/atelier-private-chef/api/internal/middleware"
	"github.com/nightfixed/atelier-private-chef/api/internal/migration"
	"github.com/nightfixed/atelier-private-chef/api/internal/repository"
	"github.com/nightfixed/atelier-private-chef/api/internal/storage"
)

//go:embed migrations/*.sql
var rawMigrationsFS embed.FS

func main() {
	ctx := context.Background()

	db, err := database.Open()
	if err != nil {
		log.Fatalf("db open: %v", err)
	}

	migrationsFS, err := fs.Sub(rawMigrationsFS, "migrations")
	if err != nil {
		log.Fatalf("migrations sub-fs: %v", err)
	}

	if err := migration.RunMigrations(db, migrationsFS.(fs.ReadDirFS)); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	verifier, err := auth.NewFirebaseVerifier(ctx)
	if err != nil {
		log.Fatalf("firebase verifier: %v", err)
	}

	gcsClient, err := gcstorage.NewClient(ctx)
	if err != nil {
		log.Fatalf("gcs client: %v", err)
	}

	imagesBucket := os.Getenv("IMAGES_BUCKET")
	if imagesBucket == "" {
		log.Fatalf("IMAGES_BUCKET environment variable is required")
	}

	cdnBaseURL := os.Getenv("CDN_BASE_URL")

	dishRepo := repository.NewDishRepository(db)
	recipeRepo := repository.NewRecipeRepository(db)
	galleryRepo := repository.NewGalleryRepository(db)
	contactRepo := repository.NewContactRepository(db)
	herbariumRepo := repository.NewHerbariumRepository(db)
	availabilityRepo := repository.NewAvailabilityRepository(db)
	reservationRepo := repository.NewReservationRepository(db)
	gcsSigner := storage.NewGCSSigner(gcsClient)
	gcsDeleter := storage.NewGCSObjectDeleter(gcsClient)
	authMiddleware := middleware.RequireAuth(verifier)

	var aiProvider ai.Provider
	if key := os.Getenv("ANTHROPIC_API_KEY"); key != "" {
		log.Println("AI: using Anthropic Claude Sonnet")
		aiProvider = ai.NewAnthropicProvider(key)
	} else {
		log.Println("AI: ANTHROPIC_API_KEY not set, using MockProvider")
		aiProvider = &ai.MockProvider{}
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/health", handler.NewHealthHandler(db))

	// Dishes
	mux.Handle("/api/dishes", handler.NewDishesHandler(dishRepo, authMiddleware))
	mux.Handle("/api/dishes/featured", handler.NewFeaturedDishesHandler(dishRepo))
	mux.Handle("/api/dishes/{id}", handler.NewDishByIDHandler(dishRepo, cdnBaseURL, gcsDeleter, authMiddleware))

	// Recipes
	mux.Handle("/api/recipes", handler.NewRecipesHandler(recipeRepo, authMiddleware))
	mux.Handle("/api/recipes/{id}", handler.NewRecipeByIDHandler(recipeRepo, authMiddleware))

	// Gallery
	mux.Handle("/api/gallery", handler.NewGalleryHandler(galleryRepo, authMiddleware))
	mux.Handle("/api/gallery/{id}", handler.NewGalleryItemByIDHandler(galleryRepo, cdnBaseURL, gcsDeleter, authMiddleware))

	// Contact
	mux.Handle("/api/contact", handler.NewContactHandler(contactRepo, authMiddleware))
	mux.Handle("/api/contact/{id}", handler.NewContactByIDHandler(contactRepo, authMiddleware))

	// Herbarium
	mux.Handle("/api/herbarium", handler.NewHerbariumHandler(herbariumRepo, authMiddleware))
	mux.Handle("/api/herbarium/{id}", handler.NewHerbariumSpecimenByIDHandler(herbariumRepo, authMiddleware))

	// AI — menu generator + codex ritual + chat
	mux.Handle("/api/generate-menu", handler.NewGenerateHandler(aiProvider, herbariumRepo))
	mux.Handle("/api/generate-codex", handler.NewCodexHandler(aiProvider))
	mux.Handle("/api/generate-artifact", handler.NewArtifactHandler(aiProvider))
	mux.Handle("/api/generate-breviar", handler.NewBreviarHandler(aiProvider))
	mux.Handle("/api/chat", handler.NewChatHandler(aiProvider))

	// Upload (signed GCS PUT URL)
	mux.Handle("/api/upload", authMiddleware(handler.NewUploadHandler(gcsSigner, imagesBucket, cdnBaseURL)))

	// Availability windows (public GET, admin POST/PUT/DELETE)
	mux.Handle("/api/availability", handler.NewAvailabilityHandler(availabilityRepo, authMiddleware))
	mux.Handle("/api/availability/", handler.NewAvailabilityByIDHandler(availabilityRepo, authMiddleware))

	// Reservations (public POST, admin GET/PUT)
	mux.Handle("/api/reservations", handler.NewReservationsHandler(reservationRepo, authMiddleware))
	mux.Handle("/api/reservations/", handler.NewReservationByIDHandler(reservationRepo, authMiddleware))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, middleware.CORS(mux)))
}
