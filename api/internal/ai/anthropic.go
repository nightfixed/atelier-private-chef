package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

const (
	anthropicAPIURL = "https://api.anthropic.com/v1/messages"
	anthropicModel  = "claude-sonnet-4-6"
	anthropicVersion = "2023-06-01"
)

// AnthropicProvider calls the Anthropic Messages API.
// Inject via main.go when ANTHROPIC_API_KEY is set.
type AnthropicProvider struct {
	apiKey string
	client *http.Client
}

// NewAnthropicProvider creates a new provider. Panics if apiKey is empty.
func NewAnthropicProvider(apiKey string) *AnthropicProvider {
	return &AnthropicProvider{
		apiKey: apiKey,
		client: &http.Client{},
	}
}

// anthropicRequest is the body sent to POST /v1/messages.
type anthropicRequest struct {
	Model     string              `json:"model"`
	MaxTokens int                 `json:"max_tokens"`
	System    string              `json:"system"`
	Messages  []anthropicMessage  `json:"messages"`
}

type anthropicMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// anthropicResponse is the subset of the Anthropic response we care about.
type anthropicResponse struct {
	Content []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	} `json:"content"`
	Error *struct {
		Type    string `json:"type"`
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func (p *AnthropicProvider) call(ctx context.Context, system, userMsg string, maxTokens int) (string, error) {
	body := anthropicRequest{
		Model:     anthropicModel,
		MaxTokens: maxTokens,
		System:    system,
		Messages:  []anthropicMessage{{Role: "user", Content: userMsg}},
	}
	payload, err := json.Marshal(body)
	if err != nil {
		return "", fmt.Errorf("marshal: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicAPIURL, bytes.NewReader(payload))
	if err != nil {
		return "", fmt.Errorf("new request: %w", err)
	}
	req.Header.Set("x-api-key", p.apiKey)
	req.Header.Set("anthropic-version", anthropicVersion)
	req.Header.Set("content-type", "application/json")

	resp, err := p.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("http: %w", err)
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read body: %w", err)
	}

	var ar anthropicResponse
	if err := json.Unmarshal(raw, &ar); err != nil {
		return "", fmt.Errorf("unmarshal: %w", err)
	}
	if ar.Error != nil {
		return "", fmt.Errorf("anthropic error %s: %s", ar.Error.Type, ar.Error.Message)
	}
	if len(ar.Content) == 0 {
		return "", fmt.Errorf("empty response from Anthropic")
	}
	return ar.Content[0].Text, nil
}

// GenerateMenu calls Claude to produce a structured tasting menu JSON.
func (p *AnthropicProvider) GenerateMenu(ctx context.Context, req MenuRequest) (*MenuResponse, error) {
	system := SystemPrompt(req)
	text, err := p.call(ctx, system, "Generează meniul acum.", 2048)
	if err != nil {
		return nil, err
	}

	// Claude sometimes wraps JSON in ```json ... ``` — strip it.
	text = strings.TrimSpace(text)
	if idx := strings.Index(text, "{"); idx > 0 {
		text = text[idx:]
	}
	if idx := strings.LastIndex(text, "}"); idx >= 0 && idx < len(text)-1 {
		text = text[:idx+1]
	}

	var menu MenuResponse
	if err := json.Unmarshal([]byte(text), &menu); err != nil {
		return nil, fmt.Errorf("parse menu JSON: %w (raw: %.200s)", err, text)
	}
	return &menu, nil
}

// GenerateCodex calls Claude to produce a Codex tasting menu + story from a sensory profile.
func (p *AnthropicProvider) GenerateCodex(ctx context.Context, req CodexRequest) (*CodexResponse, error) {
	profile := "Oaspete: " + req.GuestName
	if req.Occasion != "" {
		profile += "\nOcazie: " + req.Occasion
	}
	if req.GuestCount > 0 {
		profile += fmt.Sprintf("\nNumăr persoane: %d", req.GuestCount)
	}
	if req.Season != "" {
		profile += "\nAnotimp: " + req.Season
	}
	if req.Protein != "" {
		profile += "\nProteina preferată: " + req.Protein
	}
	if req.TasteProfile != "" {
		profile += "\nProfil de gust: " + req.TasteProfile
	}
	if req.Avoid != "" {
		profile += "\nDe evitat: " + req.Avoid
	}
	profile += "\nAmintire culinară din copilărie: " + req.Memory +
		"\nSenzație căutată: " + req.Sensation +
		"\nRitm la masă: " + req.Rhythm +
		"\nIngredient de atracție: " + req.Element +
		"\nStare dorită la final: " + req.End +
		"\nFilosofia personală despre o masă bună: " + req.Philosophy

	menuSystem := `Ești chef-ul și scribul Atelier Private Dining, un atelier de fine dining din Cluj-Napoca cu o filozofie culinară profundă, bazată pe tehnici internaționale de fine dining și experiențe senzoriale imersive.

Pe baza profilului senzorial al oaspetelui, compune un meniu personalizat de 6-7 cursuri. Fiecare curs trebuie să aibă:
- "tip": tipul cursului (ex: Amuse-bouche, Entrée, Intermezzo, Fel principal, Pre-desert, Desert)
- "nume": un nume poetic și evocator în română sau bilingv ro/fr
- "descriere": 1-2 rânduri elegante despre ingrediente și tehnică

Răspunde STRICT cu JSON valid, fără markdown, fără text suplimentar:
[{"tip":"...","nume":"...","descriere":"..."}]`

	menuText, err := p.call(ctx, menuSystem, profile, 900)
	if err != nil {
		return nil, fmt.Errorf("menu generation: %w", err)
	}

	// Strip markdown fences if present
	menuText = strings.TrimSpace(menuText)
	if idx := strings.Index(menuText, "["); idx > 0 {
		menuText = menuText[idx:]
	}
	if idx := strings.LastIndex(menuText, "]"); idx >= 0 && idx < len(menuText)-1 {
		menuText = menuText[:idx+1]
	}

	var courses []CodexCourse
	if err := json.Unmarshal([]byte(menuText), &courses); err != nil {
		return nil, fmt.Errorf("parse codex menu JSON: %w (raw: %.200s)", err, menuText)
	}

	storySystem := `Ești scribul Atelier Private Dining, un atelier de fine dining din Cluj-Napoca cu o filozofie culinară profundă, bazată pe tehnici internaționale de fine dining și experiențe senzoriale imersive.

Pe baza profilului senzorial al oaspetelui, scrie povestea serii — un text de 200-240 cuvinte în română care evocă atmosfera, preparatele, ingredientele cheie și starea pe care o va trăi oaspetele. Tonul: cald, literar, imersiv, ca o scrisoare intimă. Integrează subtil detalii din profil. Nu enumera cursuri sec.

Răspunde DOAR cu textul poveștii, fără titlu, fără introducere, fără explicații.`

	story, err := p.call(ctx, storySystem, profile, 800)
	if err != nil {
		return nil, fmt.Errorf("story generation: %w", err)
	}

	return &CodexResponse{Menu: courses, Story: strings.TrimSpace(story)}, nil
}

// GenerateArtifact calls Claude to produce a post-dinner personal artifact (title + text).
func (p *AnthropicProvider) GenerateArtifact(ctx context.Context, req ArtifactRequest) (*ArtifactResponse, error) {
	profile := fmt.Sprintf("Oaspete: %s\nAmintire culinară din copilărie: %s\nSenzație căutată: %s\nRitm la masă: %s\nIngredient de atracție: %s\nStare dorită la final: %s\nFilosofia personală despre o masă bună: %s",
		req.GuestName, req.Memory, req.Sensation, req.Rhythm, req.Element, req.End, req.Philosophy)

	system := fmt.Sprintf(`Ești arhivarul Codex Atelier — sistemul care documentează fiecare seară ca un capitol unic, ireplicabil.

Pe baza profilului senzorial al oaspetelui, scrie un artefact post-cină în română.

Răspunde STRICT în formatul:
TITLU: [un titlu poetic de 3-6 cuvinte]
SUBTITLU: [Capitol #%d — %s]
TEXT: [200-250 cuvinte — text literar care evocă seara tocmai încheiată, ca un jurnal scris de un martor invizibil. Nu descrie cursuri sec. Descrie momente, stări, tranziții senzoriale. Integrează subtil detalii din profil.]`, req.ChapterNum, req.Date)

	raw, err := p.call(ctx, system, profile, 1000)
	if err != nil {
		return nil, fmt.Errorf("artifact generation: %w", err)
	}

	title := extractLine(raw, "TITLU:")
	subtitle := extractLine(raw, "SUBTITLU:")
	text := extractAfter(raw, "TEXT:")

	if title == "" {
		title = "Capitol Personal"
	}
	if subtitle == "" {
		subtitle = fmt.Sprintf("Capitol #%d — %s", req.ChapterNum, req.Date)
	}
	if text == "" {
		text = strings.TrimSpace(raw)
	}

	return &ArtifactResponse{Title: title, Subtitle: subtitle, Text: strings.TrimSpace(text)}, nil
}

func extractLine(s, prefix string) string {
	for _, line := range strings.Split(s, "\n") {
		if strings.HasPrefix(strings.TrimSpace(line), prefix) {
			return strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(line), prefix))
		}
	}
	return ""
}

func extractAfter(s, prefix string) string {
	idx := strings.Index(s, prefix)
	if idx < 0 {
		return ""
	}
	return strings.TrimSpace(s[idx+len(prefix):])
}

// Chat handles multi-turn conversation using Claude.
func (p *AnthropicProvider) Chat(ctx context.Context, req ChatRequest) (*ChatResponse, error) {
	system := `Ești asistentul virtual al Atelier — un colectiv de doi chefi din Cluj-Napoca care a redefinit ce înseamnă o masă privată.

Atelier nu e un restaurant. Nu primești meniu, nu alegi dintr-o listă. Fiecare experiență e construită exclusiv pentru tine.

═══════════════════════════════
POVESTEA ATELIERULUI
═══════════════════════════════
Atelier este creat de doi chefi:

RĂZVAN — Chef & Fondator (autor). Format în bucătăriile de fine dining din România și Europa, Răzvan a transformat obsesia pentru ingredient în filosofie culinară. Ingredientele carpatice rare și tehnicile precise sunt inima fiecărui meniu Atelier. Peste 18 ani de fine dining, 200+ meniuri unice create.

ROLAND — Chef & Partner. Cu o carieră construită în restaurante de top din România, Roland aduce precizie tehnică și un simț al echilibrului care completează viziunea Atelierului. Împreună, cei doi chefi creează experiențe imposibil de reprodus.

═══════════════════════════════
FILOZOFIA ATELIERULUI
═══════════════════════════════
"Ingredientul este primul. Tehnica este în slujba lui. Farfuria este ultimul cuvânt."

Trei piloni:
- CRAFT: Fiecare preparat este construit de la zero, cu ingrediente selectate personal.
- DISCREȚIE: Evenimentele rămân ale clienților. Confidențialitate absolută.
- EXCELENȚĂ: Nu există compromis — nici în ingredient, nici în execuție.

Principii din Manifestul Atelier:
- "Tehnica este japoneză. Ingredientul este al nostru." — identitate autentică vs. import de tendințe.
- "Un meniu fix este o declarație de indiferență față de cel care mănâncă." — personalizare radicală.
- "Dacă nu știu de unde vine, nu îl pun pe masă." — trasabilitate și poveste în fiecare ingredient.
- "Răbdarea nu este virtute. Este ingredient." — despre procesul lung al excelenței.

═══════════════════════════════
MENIU PRESTABILIT DE DEGUSTARE (9 cursuri)
═══════════════════════════════
Compus de Chef Răzvan, rafinat de-a lungul sezoanelor. Ingrediente carpatice rare + tehnici fine dining european. Când clientul întreabă de meniu, poți descrie cursurile în mod poetic:

I. Amuse-bouche — Icre de nisetru și burrata: icre negre de nisetru românesc, cremă de burrata italiană, blini cald cu maia, ulei de trufe negre, ceapă roșie murată.
II. Pâine · Unt — Pâine la vatră, miso și Parma: pâine cu maia la vatră, unt bătut cu miso alb, Prosciutto di Parma, sare de Slănic Moldova.
III. Supă — Bisque de creveți și gălbiori: bisque de creveți tigru, smântână de casă, gălbiori de Ardeal sotați, ulei de paprika afumată, cimbru proaspăt.
IV. Pește · Starter — Somon și avocado: somon norvegian curat la 52°C, avocado, icre de somon roz, sos de soia și citrice, crocant de capere.
V. ✦ Signature — Foie Gras, Cotnari și smochine: foie gras poêlé, reducție de Cotnari Grasă de Cotnari, smochine caramelizate, Parmigiano crocant, brioche cu maia.
VI. Intermediar — Risotto cu hribi și Parmigiano: risotto Arborio, hribi uscați de Bucovina, Parmigiano Reggiano 24 luni, vin alb de Dealu Mare, unt brun cu salvie.
VII. Pește — Calcan de Marea Neagră și miso: calcan sălbatic, glazură de miso alb și unt brun, shiitake, lămâie murată, piure de țelină.
VIII. ✦ Specialitatea Casei — Entrecôte dry-aged și măduvă: entrecôte dry-aged 45 zile, jus cu vin roșu de Dealu Mare, os de măduvă la cuptor, unt de trufe, piure cu mascarpone.
IX. Desert — Valrhona, miere de brad și pralin: mousse Valrhona Guanaja 70%, caramel de miere de brad, mascarpone bătut, pralin de alune, fleur de sel.

═══════════════════════════════
GELATO & SORBETURI ARTIZANALE
═══════════════════════════════
"Gelato-ul lui Răzvan nu este gelato. Este o teorie despre gust aplicată la temperaturi sub zero. Fiecare aromă e construită în jurul unui ingredient carpatic — sezonier, local, imposibil de replicat industrial."

Cu lapte de bivoliță transilvăneană (Câmpia Transilvaniei):
- Lămâie Kulfi: tehnica kulfi-ului indian — fiert lent, nu churned. Lămâie confită, cardamom verde, lapte de bivoliță redus. Disponibil tot anul.
- Matcha Shincha & Miere de Salcâm: matcha de prima recoltă de primăvară, disponibil doar Aprilie–Mai. Amarul nobil al ceaiului japonez echilibrat de mierea de salcâm ardelenească.
- Flori de Salcâm (O săptămână pe an): alb pe alb. Parfumul pe care nu îl aștepți. Disponibil o singură săptămână — în Mai, 7 zile.

Sorbeturi fără lactate:
- Sevă de Mesteacăn & Lămâie Verde (primăvară, 10 zile/an): recoltată manual de pe Dealul Feleac, Cluj.
- Măceșe Fermentate & Ghimbir (toamnă).
- Agriș Verde & Verbena (vară).

IMPORTANT: Gelato-urile sezoniere (flori de salcâm, sevă de mesteacăn, muguri) apar pe meniu doar în fereastra lor naturală de câteva zile. Nu se produc în afara sezonului. Nu există stoc.

═══════════════════════════════
INGREDIENTE EMBLEMATICE (Herbariumul Atelier)
═══════════════════════════════
- Licheni Carpatici (Cetraria islandica): Primul lichen pe o farfurie românească de fine dining. Gust mineral-iodic, ca piatra udă după ploaie de munte. Carpații Orientali, 1.400m.
- Cenușă de Fag: cel mai dramatic ingredient vizual. Negrul absolut dintr-un copac carpatin. Utilizat în cruste, terrine foie, pește.
- Muguri de Mesteacăn (7 zile/an): Parfum bălsamic imposibil de găsit în orice ingredient comercial. Dealul Feleac, Cluj. Cel mai scurt sezon — 7 zile. Cea mai persistentă aromă — 12 luni.
- Miso de Fasole Românească: tehnica e japoneză, fasolea e din Ardeal, fermentarea e în borcane numerotate în bucătăria Atelierului. 90–180 zile maturare.
- Hrișcă Transilvăneană Prăjită: nu orez, nu quinoa — garnitura care completează preparatul fără să ceară atenție.

═══════════════════════════════
CELE TREI PRODUSE UNICE
═══════════════════════════════
- CODEX: ritual de inițiere pentru o cină privată. Răspunzi la câteva întrebări despre gusturi, senzații, amintiri din copilărie. AI-ul Atelier compune un meniu de degustare unic — imposibil de reprodus. Plus un artefact literar: povestea serii tale, scrisă ca un capitol dintr-o carte. Exclusiv pentru 2–6 persoane, private dining.
- BREVIAR: pentru echipe corporate. Nu este team building obișnuit — este un instrument de diagnostic. Fiecare participant completează un profil senzorial-comportamental. AI-ul cartografiază tensiunile și confluențele grupului și generează un document fizic — cartografia colectivă a echipei.
- MATRICEA: pentru branduri premium. Atelier construiește identitatea culinară a unui brand — documentată, sistematizată, livrată fizic. Nu catering. Un produs intelectual.

═══════════════════════════════
PROCESUL ATELIER
═══════════════════════════════
I. Contact → II. Consultație (discutăm ocazia, preferințe, restricții, așteptări — construim meniul împreună) → III. Pregătire (achiziționăm ingredientele, gătim la locația ta) → IV. Experiența.

ÎNTREBĂRI FRECVENTE (răspunsuri corecte):
- Rezervare: minimum 7–10 zile pentru un eveniment privat standard; 3–4 săptămâni pentru corporate sau ingrediente de sezon.
- Alergii/preferințe: absolut adaptabile — nu există meniu fix, construim de la zero.
- Prețul include: consultația, crearea meniului, achiziționarea ingredientelor, gătitul complet la locația ta, serviciul de masă și curățenia bucătăriei.

═══════════════════════════════
NAVIGAREA SITE-ULUI
═══════════════════════════════
Îndrumă natural spre pagina potrivită, în funcție de context:
- Vrea să rezerve o cină privată sau să înceapă Codex → /manifest
- Vrea să înțeleagă filozofia, cheffy, povestea → /filozofie
- Corporate, echipă → /breviar
- Consultanță brand → /matricea
- Vrea să înceapă Codex direct → /codex-guest-system.html

═══════════════════════════════
REGULI DE CONVERSAȚIE
═══════════════════════════════
- Fii interactiv și curios. Nu da toate informațiile dintr-o dată.
- Explorează mai întâi: povestește despre filozofie, meniu, gelato, ingrediente — fă clientul să simtă universul Atelier înainte de a-l trimite la o pagină.
- Pune o întrebare, înțelege contextul, apoi îndrumă natural.
- Dacă întreabă de meniu, descrie 1–2 cursuri în mod poetic, nu lista întreagă.
- Dacă întreabă de gelato, prezintă ca pe o obsesie — nu ca pe un produs.
- Citează principiile din Manifest doar când rezonează natural cu ce spune clientul.
- Când sugerezi o pagină, scrie calea exact (fără punct sau virgulă după): /manifest sau /filozofie etc. — sistemul le face automat linkuri.
- Nu inventa prețuri sau disponibilitate.
- Răspunzi în română, elegant, în maximum 4 propoziții pe răspuns.`

	if req.GuestName != "" {
		system += "\n\nNumele clientului este " + req.GuestName + ". Adresează-te lui/ei pe nume în mod natural când e firesc, fără să exagerezi." +
			"\n\nDacă acesta este primul răspuns după ce ai aflat numele (adică conversația are doar 1 mesaj de la user), răspunde exact în această structură:" +
			"\n1. Salut pe nume și spune că te bucuri că e aici." +
			"\n2. Recomandă /manifest ca loc de început pentru a înțelege esența Atelier." +
			"\n3. Adaugă o propoziție de genul: \"Dar dacă ai curiozitatea deplină și apetitul de a parcurge întreaga poveste, te invit cu drag în secțiunea /filozofie\"" +
			"\n4. Pune o întrebare neașteptată și personală — ceva de genul: \"Și înainte să mergem mai departe — ce fel de seară îți e greu să uiți?\" sau \"Care e ultima masă care te-a surprins cu adevărat?\" Formulează natural, diferit de fiecare dată." +
			"\nSCRIE CĂILE EXACT: /manifest și /filozofie — fără punct sau virgulă imediat după cale."
	}

	if len(req.Messages) == 0 {
		return &ChatResponse{Reply: "Cu ce vă pot ajuta?"}, nil
	}

	// Convert conversation history — Anthropic requires alternating user/assistant roles
	// and the first message must be "user".
	var msgs []anthropicMessage
	for _, m := range req.Messages {
		role := m.Role
		if role == "bot" || role == "assistant" {
			role = "assistant"
		} else {
			role = "user"
		}
		// Skip consecutive same-role messages (keep last)
		if len(msgs) > 0 && msgs[len(msgs)-1].Role == role {
			msgs[len(msgs)-1].Content = m.Content
		} else {
			msgs = append(msgs, anthropicMessage{Role: role, Content: m.Content})
		}
	}
	// Anthropic requires first message to be "user"
	for len(msgs) > 0 && msgs[0].Role != "user" {
		msgs = msgs[1:]
	}
	if len(msgs) == 0 {
		return &ChatResponse{Reply: "Cu ce vă pot ajuta?"}, nil
	}

	// Build a single user turn that embeds the full history for simplicity,
	// or send the last user message if history is short.
	lastUser := msgs[len(msgs)-1].Content
	if msgs[len(msgs)-1].Role != "user" {
		lastUser = "Continuă conversația."
	}

	// Use multi-turn if there's prior context
	var callMessages []anthropicMessage
	if len(msgs) > 1 {
		callMessages = msgs
	} else {
		callMessages = []anthropicMessage{{Role: "user", Content: lastUser}}
	}

	body := anthropicRequest{
		Model:     anthropicModel,
		MaxTokens: 512,
		System:    system,
		Messages:  callMessages,
	}
	payload, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("marshal: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicAPIURL, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("new request: %w", err)
	}
	httpReq.Header.Set("x-api-key", p.apiKey)
	httpReq.Header.Set("anthropic-version", anthropicVersion)
	httpReq.Header.Set("content-type", "application/json")

	resp, err := p.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("http: %w", err)
	}
	defer resp.Body.Close()

	raw, _ := io.ReadAll(resp.Body)
	var ar anthropicResponse
	if err := json.Unmarshal(raw, &ar); err != nil {
		return nil, fmt.Errorf("unmarshal: %w", err)
	}
	if ar.Error != nil {
		return nil, fmt.Errorf("anthropic error %s: %s", ar.Error.Type, ar.Error.Message)
	}
	if len(ar.Content) == 0 {
		return nil, fmt.Errorf("empty response")
	}
	return &ChatResponse{Reply: ar.Content[0].Text}, nil
}
