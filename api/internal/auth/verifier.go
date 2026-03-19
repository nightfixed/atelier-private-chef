// Package auth provides Firebase ID-token verification.
package auth

import (
	"context"
	"fmt"
	"os"

	firebase "firebase.google.com/go/v4"
	firebaseAuth "firebase.google.com/go/v4/auth"
)

// TokenClaims holds the verified claims extracted from a Firebase ID token.
type TokenClaims struct {
	UID     string
	Email   string
	Picture string
}

// TokenVerifier is the interface that wraps Firebase token verification.
type TokenVerifier interface {
	VerifyIDToken(ctx context.Context, idToken string) (*TokenClaims, error)
}

// FirebaseVerifier is the production TokenVerifier backed by the Firebase Admin SDK.
type FirebaseVerifier struct {
	client *firebaseAuth.Client
}

// NewFirebaseVerifier creates a FirebaseVerifier using FIREBASE_PROJECT_ID env var.
func NewFirebaseVerifier(ctx context.Context) (*FirebaseVerifier, error) {
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	if projectID == "" {
		return nil, fmt.Errorf("FIREBASE_PROJECT_ID env var is not set")
	}

	app, err := firebase.NewApp(ctx, &firebase.Config{ProjectID: projectID})
	if err != nil {
		return nil, fmt.Errorf("firebase app: %w", err)
	}

	client, err := app.Auth(ctx)
	if err != nil {
		return nil, fmt.Errorf("firebase auth client: %w", err)
	}

	return &FirebaseVerifier{client: client}, nil
}

// VerifyIDToken validates the token against Firebase and returns the verified claims.
func (v *FirebaseVerifier) VerifyIDToken(ctx context.Context, idToken string) (*TokenClaims, error) {
	t, err := v.client.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, fmt.Errorf("verify firebase id token: %w", err)
	}

	email, _ := t.Claims["email"].(string)
	picture, _ := t.Claims["picture"].(string)

	return &TokenClaims{
		UID:     t.UID,
		Email:   email,
		Picture: picture,
	}, nil
}
