// Package ai defines the provider interface for all LLM integrations.
// Swap in any real provider (OpenAI, Anthropic, Gemini) by implementing Provider.
package ai

import "context"

// SpecimenContext is a lightweight view of a herbarium specimen passed to the LLM.
type SpecimenContext struct {
	NameRo string   `json:"name_ro"`
	Latin  string   `json:"latin_name"`
	DescRo string   `json:"desc_ro"`
	Pills  []string `json:"pills,omitempty"` // taste notes
}

// MenuRequest contains the answers from the "Compune Seara" generator.
type MenuRequest struct {
	Occasion     string            `json:"occasion"`
	GuestCount   string            `json:"guest_count"`
	Season       string            `json:"season"`
	Dietary      []string          `json:"dietary"`
	HostName     string            `json:"host_name"`
	Protein      string            `json:"protein,omitempty"`
	TasteProfile string            `json:"taste_profile,omitempty"`
	Love         string            `json:"love,omitempty"`
	Avoid        string            `json:"avoid,omitempty"`
	Wish         string            `json:"wish,omitempty"`
	Date         string            `json:"date,omitempty"`
	Specimens    []SpecimenContext `json:"specimens"` // injected server-side from DB
}

// MenuCourse is one course in the generated tasting menu.
type MenuCourse struct {
	Num        int    `json:"num"`
	Category   string `json:"category"`
	Name       string `json:"name"`
	Ingredient string `json:"ingredient"` // featured herbarium ingredient
}

// MenuResponse is the full generated tasting menu.
type MenuResponse struct {
	Title    string       `json:"title"`
	Subtitle string       `json:"subtitle"`
	Courses  []MenuCourse `json:"courses"`
	ChefNote string       `json:"chef_note"`
	Tags     []string     `json:"tags"`
}

// ChatMessage is a single turn in the conversation.
type ChatMessage struct {
	Role    string `json:"role"` // "user" | "assistant"
	Content string `json:"content"`
}

// ChatRequest is the payload sent to the chat endpoint.
type ChatRequest struct {
	Messages  []ChatMessage `json:"messages"`
	GuestName string        `json:"guest_name,omitempty"`
}

// ChatResponse is the reply from the AI.
type ChatResponse struct {
	Reply string `json:"reply"`
}

// CodexRequest contains the sensory profile answers from the Codex ritual.
type CodexRequest struct {
	GuestName    string `json:"guest_name"`
	GuestCount   int    `json:"guest_count,omitempty"`
	Occasion     string `json:"occasion,omitempty"`
	Season       string `json:"season,omitempty"`
	Protein      string `json:"protein,omitempty"`
	TasteProfile string `json:"taste_profile,omitempty"`
	Avoid        string `json:"avoid,omitempty"`
	Memory       string `json:"memory"`
	Sensation    string `json:"sensation"`
	Rhythm       string `json:"rhythm"`
	Element      string `json:"element"`
	End          string `json:"end"`
	Philosophy   string `json:"philosophy"`
}

// CodexCourse is one course in the Codex-generated tasting menu.
type CodexCourse struct {
	Tip       string `json:"tip"`
	Nume      string `json:"nume"`
	Descriere string `json:"descriere"`
}

// CodexResponse contains the generated menu and story for the Codex ritual.
type CodexResponse struct {
	Menu  []CodexCourse `json:"menu"`
	Story string        `json:"story"`
}

// ArtifactRequest contains the sensory profile for generating a post-dinner artifact.
type ArtifactRequest struct {
	GuestName  string `json:"guest_name"`
	ChapterNum int    `json:"chapter_num"`
	Date       string `json:"date"`
	Memory     string `json:"memory"`
	Sensation  string `json:"sensation"`
	Rhythm     string `json:"rhythm"`
	Element    string `json:"element"`
	End        string `json:"end"`
	Philosophy string `json:"philosophy"`
}

// ArtifactResponse contains the generated artifact title, subtitle, and text.
type ArtifactResponse struct {
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Text     string `json:"text"`
}

// BreviarRequest contains the team profile answers from the Breviar generator.
type BreviarRequest struct {
	Industry     string `json:"industry"`
	Culture      string `json:"culture"`
	Achievement  string `json:"achievement"`
	Challenge    string `json:"challenge"`
	Feeling      string `json:"feeling"`
	Energy       string `json:"energy"`
	Participants string `json:"participants"`
	Restrictions string `json:"restrictions"`
	Dynamics     string `json:"dynamics"`
}

// BreviarResponse contains the generated team gustatory portrait.
type BreviarResponse struct {
	Titlu     string `json:"titlu"`
	Profilul  string `json:"profilul"`
	Meniu     string `json:"meniu"`
	Ritualuri string `json:"ritualuri"`
	Intentie  string `json:"intentie"`
	Raw       string `json:"raw"`
}

// MatriceaRequest contains the brand profile answers from the Matricea generator.
type MatriceaRequest struct {
	Type    string `json:"type"`
	Problem string `json:"problem"`
	Tried   string `json:"tried"`
	Goal    string `json:"goal"`
	Diff    string `json:"diff"`
	Email   string `json:"email,omitempty"`
}

// MatriceaResponse contains the generated brand culinary identity preview.
type MatriceaResponse struct {
	ProfilulCulinar      string `json:"profilul_culinar"`
	GolulEsential        string `json:"golul_esential"`
	ParametriiSenzoriali string `json:"parametrii_senzoriali"`
	SistemulPropus       string `json:"sistemul_propus"`
	PrimiiPasi           string `json:"primii_pasi"`
	Raw                  string `json:"raw"`
}

// Provider is the interface every LLM backend must implement.
// To connect a real model, implement this interface and inject it in main.go.
type Provider interface {
	GenerateMenu(ctx context.Context, req MenuRequest) (*MenuResponse, error)
	GenerateCodex(ctx context.Context, req CodexRequest) (*CodexResponse, error)
	GenerateArtifact(ctx context.Context, req ArtifactRequest) (*ArtifactResponse, error)
	GenerateBreviar(ctx context.Context, req BreviarRequest) (*BreviarResponse, error)
	GenerateMatricea(ctx context.Context, req MatriceaRequest) (*MatriceaResponse, error)
	Chat(ctx context.Context, req ChatRequest) (*ChatResponse, error)
}

// SystemPrompt returns the full context prompt used with any real LLM provider.
// It encodes the chef's voice, the herbarium ingredients, and the user's answers.
func SystemPrompt(req MenuRequest) string {
	prompt := `Ești Chef Răzvan, bucătarul-chef al Atelier Private Dining din Cluj-Napoca, România.
Atelier este un serviciu de private dining de lux — gătești în casele oaspeților sau în spații private.
Filosofia ta: fine dining tehnic de calitate superioară, personalizare completă.
Vocea ta: caldă, poetică, elegantă — niciodată comercială.`

	prompt += "\n\nGenerează un meniu de degustare de 9 preparate pentru:"
	prompt += "\n- Ocazie: " + req.Occasion
	prompt += "\n- Persoane: " + req.GuestCount
	prompt += "\n- Sezon: " + req.Season
	if req.Protein != "" {
		prompt += "\n- Proteina principală: " + req.Protein
	}
	if req.TasteProfile != "" {
		prompt += "\n- Nota de gust dominantă: " + req.TasteProfile
	}
	if len(req.Dietary) > 0 {
		prompt += "\n- Restricții: "
		for i, d := range req.Dietary {
			if i > 0 {
				prompt += ", "
			}
			prompt += d
		}
	}
	if req.Love != "" {
		prompt += "\n- Ingredient iubit de gazdă: " + req.Love
	}
	if req.Avoid != "" {
		prompt += "\n- De evitat: " + req.Avoid
	}
	if req.Wish != "" {
		prompt += "\n- Dorință specială: " + req.Wish
	}
	prompt += "\n- Gazdă: " + req.HostName

	prompt += `

Răspunde DOAR cu JSON valid, fără text suplimentar, în formatul:
{
  "title": "Titlul serii",
  "subtitle": "Subtitlu scurt",
  "courses": [
    {"num": 1, "category": "Amuse-bouche", "name": "Numele preparatului", "ingredient": "Ingredient Herbarium folosit"}
  ],
  "chef_note": "Notă personală de la Chef Răzvan (max 3 propoziții, adresată gazdei pe nume)",
  "tags": ["tag1", "tag2", "tag3"]
}`

	return prompt
}
