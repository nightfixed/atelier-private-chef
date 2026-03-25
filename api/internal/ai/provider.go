// Package ai defines the provider interface for all LLM integrations.
// Swap in any real provider (OpenAI, Anthropic, Gemini) by implementing Provider.
package ai

import "context"

// SpecimenContext is a lightweight view of a herbarium specimen passed to the LLM.
type SpecimenContext struct {
NameRo string `json:"name_ro"`
Latin  string `json:"latin_name"`
DescRo string `json:"desc_ro"`
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
Messages []ChatMessage `json:"messages"`
}

// ChatResponse is the reply from the AI.
type ChatResponse struct {
Reply string `json:"reply"`
}

// CodexRequest contains the sensory profile answers from the Codex ritual.
type CodexRequest struct {
	GuestName  string `json:"guest_name"`
	Memory     string `json:"memory"`
	Sensation  string `json:"sensation"`
	Rhythm     string `json:"rhythm"`
	Element    string `json:"element"`
	End        string `json:"end"`
	Philosophy string `json:"philosophy"`
}

// CodexCourse is one course in the Codex-generated tasting menu.
type CodexCourse struct {
	Tip      string `json:"tip"`
	Nume     string `json:"nume"`
	Descriere string `json:"descriere"`
}

// CodexResponse contains the generated menu and story for the Codex ritual.
type CodexResponse struct {
	Menu  []CodexCourse `json:"menu"`
	Story string        `json:"story"`
}

// Provider is the interface every LLM backend must implement.
// To connect a real model, implement this interface and inject it in main.go.
type Provider interface {
	GenerateMenu(ctx context.Context, req MenuRequest) (*MenuResponse, error)
	GenerateCodex(ctx context.Context, req CodexRequest) (*CodexResponse, error)
	Chat(ctx context.Context, req ChatRequest) (*ChatResponse, error)
}

// SystemPrompt returns the full context prompt used with any real LLM provider.
// It encodes the chef's voice, the herbarium ingredients, and the user's answers.
func SystemPrompt(req MenuRequest) string {
prompt := `Ești Chef Răzvan, bucătarul-chef al Atelier Private Dining din Cluj-Napoca, România.
Atelier este un serviciu de private dining de lux — gătești în casele oaspeților sau în spații private.
Filosofia ta: ingrediente carpatice rare, fine dining tehnic, personalizare completă.
Vocea ta: caldă, poetică, elegantă — niciodată comercială.

Herbarium — ingredientele tale de semnătură:`

for _, s := range req.Specimens {
prompt += "\n- " + s.NameRo + " (" + s.Latin + "): " + s.DescRo
}

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
if i > 0 { prompt += ", " }
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
