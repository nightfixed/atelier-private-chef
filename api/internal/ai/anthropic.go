package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"strings"
)

const (
	anthropicAPIURL  = "https://api.anthropic.com/v1/messages"
	anthropicModel   = "claude-sonnet-4-6"
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
	Model       string             `json:"model"`
	MaxTokens   int                `json:"max_tokens"`
	Temperature float64            `json:"temperature,omitempty"`
	System      string             `json:"system"`
	Messages    []anthropicMessage `json:"messages"`
}

// culinarySeeds holds practical fine-dining influences and techniques
// that are realistic for a private chef (no complex home fermentation).
var culinaryInfluences = []string{
	"japoneză (dashi, mirin, soia, yuzu, wasabi proaspăt)",
	"franceză clasică (fond brun, beurre blanc, confit, galantine)",
	"mediteraneană (zaatar, harissa ușoară, lămâie prezervată, capere)",
	"nordică (afumare la rece, murături rapide, ierburi sălbatice, unt brun)",
	"peruviană (leche de tigre, ají amarillo, quinoa prăjită, chimichurri)",
	"georgiană (nucă, rodie, fenugreek, tkemali, adjika blândă)",
	"marocană (chermoula, ras el hanout, curmale, sofran, portocală amară)",
	"asiatică de fuziune (galangal, lemongrass, lapte de cocos, nam pla)",
	"est-europeană rafinată (hrean, sfeclă, smântână fermentată, mărar)",
	"iberică (pimentón afumat, manchego, romesco, migdale prăjite)",
	"românească tradițională din Moldova (borș de pui cu tarhon, smântână de casă, mămăligă prăjită, brânză de burduf, leuștean)",
	"românească tradițională din Ardeal (afumături ușoare, cartofi cu untură, varză călită, fasole cu costiță, papricaș)",
	"românească tradițională din Muntenia (ciorbă acrită cu zeamă de varză, sarmale fine, mujdei de usturoi, ardei copți, miere de salcâm)",
	"românească de sezon carpatic (ciuperci de pădure, fructe de pădure, vânat nobil, ierburi montane — urzici, lobodă, leurdă, măcriș)",
	"românească rafinată de fine dining (ingrediente autohtone — must de struguri, vin de Dealu Mare, iaurt de oaie, cașcaval de Rucăr — cu tehnici moderne)",
}

var culinaryTechniques = []string{
	"glazurare și lăcuire la cuptor",
	"emulsionare la rece (vinaigrette complexe, spume fără lecitină)",
	"confit lent în grăsime (rață, usturoi, lămâie)",
	"afumare rapidă cu lemn aromatic (cireș, măr, stejar)",
	"coacere en papillote cu ierburi proaspete",
	"reducție lungă — jus concentrat și siropuri savuroase",
	"searing la temperatură înaltă urmat de odihnă",
	"marinare la rece peste noapte în citrice și ierburi",
	"roasting de legume întregi la temperaturi ridicate",
	"sos pan — deglazat cu vin și montat cu unt rece",
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

	// Random seed: pick a culinary influence + technique for this specific guest
	influence := culinaryInfluences[rand.Intn(len(culinaryInfluences))]
	technique := culinaryTechniques[rand.Intn(len(culinaryTechniques))]

	menuSystem := fmt.Sprintf(`Ești chef-ul și scribul Atelier Private Dining, un atelier de fine dining din Cluj-Napoca cu o filozofie culinară profundă, bazată pe tehnici internaționale de fine dining și experiențe senzoriale imersive.

Pentru această seară specifică, meniul trebuie să aibă o identitate distinctă construită în jurul:
- Influență culinară dominantă: %s
- Tehnică principală: %s
Integrează aceste elemente organic, nu forțat. Ele ghidează personalitatea meniului, nu îl limitează.

Pe baza profilului senzorial al oaspetelui, compune un meniu personalizat de 6-7 cursuri. Fiecare curs trebuie să aibă:
- "tip": tipul cursului (ex: Amuse-bouche, Entrée, Intermezzo, Fel principal, Pre-desert, Desert)
- "nume": un nume poetic și evocator în română sau bilingv ro/fr
- "descriere": 1-2 rânduri elegante despre ingrediente și tehnică

Folosește ingrediente reale, procurabile, evitând fermentații de lungă durată sau tehnici de laborator. Prioritizează ingredient carpatic + influență aleasă.

Răspunde STRICT cu JSON valid, fără markdown, fără text suplimentar:
[{"tip":"...","nume":"...","descriere":"..."}]`, influence, technique)

	menuReq := anthropicRequest{
		Model:       anthropicModel,
		MaxTokens:   900,
		Temperature: 1.0,
		System:      menuSystem,
		Messages:    []anthropicMessage{{Role: "user", Content: profile}},
	}
	menuPayload, err := json.Marshal(menuReq)
	if err != nil {
		return nil, fmt.Errorf("marshal menu: %w", err)
	}
	menuHTTPReq, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicAPIURL, bytes.NewReader(menuPayload))
	if err != nil {
		return nil, fmt.Errorf("menu request: %w", err)
	}
	menuHTTPReq.Header.Set("x-api-key", p.apiKey)
	menuHTTPReq.Header.Set("anthropic-version", anthropicVersion)
	menuHTTPReq.Header.Set("content-type", "application/json")
	menuResp, err := p.client.Do(menuHTTPReq)
	if err != nil {
		return nil, fmt.Errorf("menu http: %w", err)
	}
	defer menuResp.Body.Close()
	menuRaw, err := io.ReadAll(menuResp.Body)
	if err != nil {
		return nil, fmt.Errorf("menu read: %w", err)
	}
	var menuAR anthropicResponse
	if err := json.Unmarshal(menuRaw, &menuAR); err != nil {
		return nil, fmt.Errorf("menu unmarshal: %w", err)
	}
	if menuAR.Error != nil {
		return nil, fmt.Errorf("anthropic menu error: %s", menuAR.Error.Message)
	}
	if len(menuAR.Content) == 0 {
		return nil, fmt.Errorf("empty menu response")
	}
	menuText := menuAR.Content[0].Text

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

Atelier are trei produse unice, inexistente în altă parte în România:
- CODEX: un ritual de inițiere pentru o cină privată. Răspunzi la câteva întrebări despre gusturi, senzații, amintiri din copilărie. AI-ul Atelier compune un meniu de degustare unic — imposibil de reprodus. Plus un artefact literar: povestea serii tale, scrisă ca un capitol dintr-o carte.
- BREVIAR: pentru echipe corporate. Fiecare participant completează un profil senzorial-comportamental. AI-ul cartografiază tensiunile și confluențele grupului și generează un document fizic — cartografia colectivă a echipei.
- MATRICEA: pentru branduri premium. Atelier construiește identitatea culinară a unui brand — documentată, sistematizată, livrată fizic. Nu catering. Un produs intelectual.

Site-ul Atelier are pagini specifice la care poți îndruma clientul în mod natural, în funcție de context:
- Vrea să înceapă Codex sau să rezerve o cină privată → trimite-l la pagina /manifest (acolo găsește tot procesul și formularul de rezervare). Nu îi da email, nu îi spune să completeze un formular generic — spune-i să deschidă Manifestul.
- Vrea să înțeleagă cine sunt Răzvan și Roland, filozofia lor, de ce e Atelier diferit → trimite-l la /filozofie.
- Vrea să afle mai multe despre Breviar (corporate) → /breviar.
- Vrea să afle mai multe despre Matricea (consultanță brand) → /matricea.
- Vrea să vadă meniul sau să înceapă Codex direct → /codex-guest-system.html.

Când clientul e interesat de BRAND sau CONSULTANȚĂ (Matricea), citează natural unul dintre aceste principii din Manifestul Atelier, ca să arăți că înțelegi lumea lor:
- "Tehnica este japoneză. Ingredientul este al nostru." — despre identitate autentică vs. import de tendințe.
- "Un meniu fix este o declarație de indiferență față de cel care mănâncă." — despre personalizare vs. produse generice.
- "Dacă nu știu de unde vine, nu îl pun pe masă." — despre trasabilitate și poveste de brand.
Citează-l scurt, natural, ca pe o idee care rezonează cu ce spune clientul — nu ca pe o lecție.

Când clientul e interesat de CORPORATE sau ECHIPĂ (Breviar), menționează că Breviar nu e team building obișnuit — e un instrument de diagnostic: fiecare participant completează un profil senzorial, iar AI-ul construiește o hartă a echipei. Citează dacă e natural: "Răbdarea nu este virtute. Este ingredient." — și aplică-l la dinamica de echipă.

Rolul tău: fii interactiv și curios. Nu da toate informațiile dintr-o dată. Pune o întrebare, înțelege contextul, apoi îndrumă natural spre pagina potrivită. Fă-l pe client să vrea să exploreze. Când sugerezi o pagină, scrie calea exact așa (fără punct sau altceva după): /manifest sau /filozofie sau /breviar sau /matricea — sistemul le face automat linkuri clickabile. Exemplu corect: "îl găsești la /manifest" — și atât, fără punct după cale.
Nu inventezi prețuri sau disponibilitate. Răspunzi în română, elegant, în maximum 4 propoziții.`

	if req.GuestName != "" {
		system += "\n\nNumele clientului este " + req.GuestName + ". Adresează-te lui/ei pe nume în mod natural când e firesc, fără să exagerezi." +
			"\n\nDacă acesta este primul răspuns după ce ai aflat numele (adică conversația are doar 1 mesaj de la user), răspunde EXACT cu următorul text, înlocuind doar [NUME] cu numele clientului și fără nicio altă modificare:" +
			"\n\"Bună, [NUME] — mă bucur că ești aici. Cel mai bun loc de unde poți începe să înțelegi ce e Atelier cu adevărat e /manifest — acolo găsești esența, procesul și tot ce face această experiență unică. Dar dacă ai curiozitatea deplină și apetitul de a parcurge întreaga poveste, te invit cu drag în secțiunea /filozofie cât și întregul concept pe pagina principală. Dar înainte să-ți începi călătoria culinară aș vrea să te întreb ceva — care e ultima masă care te-a surprins cu adevărat, în care ai simțit că cineva a gătit *pentru tine*, nu pentru toată lumea?\"" +
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

// breviarDynamicSeeds adds variety to Breviar generation — practical group dynamics + culinary format seeds.
var breviarDynamics = []string{
	"serving format: sharing plates în centrul mesei — fiecare atinge ce vrea, conversația se naște natural",
	"serving format: meniu plated în 4 acte — fiecare fel vine cu o pauză intenționată de reflecție",
	"serving format: degustare în stil izakaya — mici porții succesive, ritm alert, energie de descoperire",
	"serving format: banchet cu fel principal comun și aperitive individuale — unitate prin diferență",
	"serving format: meniu cu un ingredient surpriză revelat la finalul serii — curiozitate susținută",
}

var breviarMoods = []string{
	"atmosfera serii: lumânări și liniște — spațiul vorbește, nu oamenii",
	"atmosfera serii: muzică low-fi, nu jazz de restaurant — energie de concentrare relaxată",
	"atmosfera serii: totul în aer liber sau semi-outdoor — deschidere și expansivitate",
	"atmosfera serii: spațiu industrial transformat — contrast între brut și rafinat",
	"atmosfera serii: living privat — intimitate maximă, formalitate zero",
}

// GenerateBreviar generates a team gustatory portrait using a dedicated prompt.
func (p *AnthropicProvider) GenerateBreviar(ctx context.Context, req BreviarRequest) (*BreviarResponse, error) {
	dynamic := breviarDynamics[rand.Intn(len(breviarDynamics))]
	mood := breviarMoods[rand.Intn(len(breviarMoods))]

	system := fmt.Sprintf(`Ești Chef Răzvan de la Atelier Private Dining Cluj-Napoca.
Ești specialist în experiențe culinare revelatorii pentru echipe corporative.
Filozofia ta: o masă bine gândită poate face ceea ce nici un workshop de team building nu reușește.

Pentru această seară specifică, folosești ca punct de plecare:
- %s
- %s
Integrează aceste elemente organic în recomandările tale.

Generează Portretul Gustativ al echipei. Include EXACT aceste 5 secțiuni, în ordine, fără formatare markdown (fără ** sau * sau # sau ---):

TITLU: titlul serii (max 7 cuvinte, poetic și specific domeniului și caracterului echipei)

PROFILUL: profilul gustativ al echipei — ce gusturi colective le rezonează și de ce, legat de valorile și cultura lor (2-3 propoziții). Fii specific, nu generic.

MENIU: un concept de meniu în 3 acte (câte un rând per act):
DESCHIDERE: [Nume act] — [Intenție 1 propoziție]
INIMA SERII: [Nume act] — [Intenție]
INCHEIEREA: [Nume act] — [Intenție]

RITUALURI: 2 momente de ritualizare propuse în cursul serii. Concrete, specifice, legate de provocarea și intenția echipei. Un ritual pe rând.

INTENTIE: ce va rămâne din această seară în memoria echipei — 1 propoziție memorabilă, specifică lor.

Adaptează totul la numărul de participanți și dinamica grupului. Ține cont de restricțiile alimentare.
Limbaj cald, uman, specific. Fără corporatism. Fără clișee HR.`, dynamic, mood)

	profile := fmt.Sprintf(
		"Industria: %s\nCultura echipei: %s\nCea mai importantă realizare colectivă: %s\nProvocarea actuală: %s\nCe doresc să simtă la final: %s\nEnergia dorită după masă: %s\nNumăr participanți: %s\nRestricții alimentare: %s\nDinamica grupului: %s",
		req.Industry, req.Culture, req.Achievement, req.Challenge, req.Feeling,
		req.Energy, req.Participants, req.Restrictions, req.Dynamics,
	)

	brevReq := anthropicRequest{
		Model:       anthropicModel,
		MaxTokens:   1000,
		Temperature: 1.0,
		System:      system,
		Messages:    []anthropicMessage{{Role: "user", Content: profile}},
	}
	payload, err := json.Marshal(brevReq)
	if err != nil {
		return nil, fmt.Errorf("marshal breviar: %w", err)
	}
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicAPIURL, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("breviar request: %w", err)
	}
	httpReq.Header.Set("x-api-key", p.apiKey)
	httpReq.Header.Set("anthropic-version", anthropicVersion)
	httpReq.Header.Set("content-type", "application/json")

	resp, err := p.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("breviar http: %w", err)
	}
	defer resp.Body.Close()
	rawBytes, _ := io.ReadAll(resp.Body)
	var ar anthropicResponse
	if err := json.Unmarshal(rawBytes, &ar); err != nil {
		return nil, fmt.Errorf("breviar unmarshal: %w", err)
	}
	if ar.Error != nil {
		return nil, fmt.Errorf("anthropic breviar error: %s", ar.Error.Message)
	}
	if len(ar.Content) == 0 {
		return nil, fmt.Errorf("empty breviar response")
	}
	return parseBreviarText(ar.Content[0].Text), nil
}

// matriceaSectorSeeds adds variety by anchoring each generation in a specific industry angle.
var matriceaSectorSeeds = []string{
	"sector: fine dining independent — identitate construită pe chef, nu pe brand corporativ",
	"sector: hotel boutique de lux — ospitalitate cu personalitate proprie, nu standardizare de lanț",
	"sector: brand alimentar premium — produs fizic care trebuie să poarte o poveste de gust",
	"sector: catering corporate pentru evenimente VIP — mâncarea ca instrument de reprezentare",
	"sector: bistro urban cu ambiții de fine dining — potențial nevalorificat, identitate in formare",
	"sector: winery sau cram cu experiențe oenoturistice — gustul vinului trebuie să trăiască și în mâncare",
	"sector: spa sau resort cu restaurant propriu — coerența senzorială între spațiu și farfurie",
	"sector: brand retail alimentar artizanal — de la produs la experiență culinară completă",
}

// matriceaProblemSeeds adds variety by centering the diagnostic lens on a specific tension.
var matriceaProblemSeeds = []string{
	"diagnostic lens: identitate culinară difuză — brandul nu știe ce gust are",
	"diagnostic lens: meniu generic fără poveste — zece pagini, zero personalitate",
	"diagnostic lens: inconsistență între promisiunea de brand și experiența culinară reală",
	"diagnostic lens: prețuri subevaluate pentru calitatea oferită — brandul nu știe ce valorează",
	"diagnostic lens: experiență fragmentată — fiecare eveniment arată diferit, nimic nu rămâne",
	"diagnostic lens: dependență de personalul cheie — identitatea culinară moare când pleacă bucătarul",
}

// GenerateMatricea generates a brand culinary identity preview using a dedicated diagnostic prompt.
func (p *AnthropicProvider) GenerateMatricea(ctx context.Context, req MatriceaRequest) (*MatriceaResponse, error) {
	sector := matriceaSectorSeeds[rand.Intn(len(matriceaSectorSeeds))]
	lens := matriceaProblemSeeds[rand.Intn(len(matriceaProblemSeeds))]

	system := fmt.Sprintf(`Ești Chef Răzvan de la Atelier Private Dining Cluj-Napoca.
Ești consultant de identitate culinară pentru branduri premium din România.
Filozofia ta: nu îmbunătățești meniuri — construiești sisteme. Nu dai rețete — schimbi perspectiva pentru totdeauna.
Principiul tău fundamental: "Nu am venit să vă îmbunătățim meniul. Am venit să vă găsim gustul."

Pentru acest diagnostic specific, folosești următoarele filtre de analiză:
- %s
- %s
Integrează aceste perspective organic — ele ascuți diagnosticul, nu îl limitează.

Un potențial client îți prezintă situația afacerii sale. Generează un diagnostic de identitate culinară.
Include EXACT aceste 5 secțiuni, în ordine, fără formatare markdown (fără ** sau * sau # sau ---):

PROFILUL CULINAR: ce ești tu de fapt, văzut din exterior — un diagnostic senzorial concret al brandului (2-3 propoziții directe, specifice, fără clișee). Nu ce cred ei că sunt. Ce ești.

GOLUL ESENTIAL: ce lipsește în mod fundamental — fără menajamente, fără diplomatic (1-2 propoziții dure și clare). Asta e valoarea reală a unui consultant care nu vrea să fie plăcut.

PARAMETRII SENZORIALI: traducerea identității în limbaj culinar concret. 5 parametri, fiecare pe o linie separată, format "PARAMETRU: valoare specifică":
TEMPERATURA: [rece și precision / cald și expansiv / contrast termic deliberat]
TEXTURA: [definitoriu pentru brand în 3-5 cuvinte]
CONTRASTUL ACTIV: [ce contrast senzorial trebuie prezent în fiecare fel]
AMINTIREA TARGET: [ce amintire trebuie declanșată la un client VIP — specifică, concretă]
CE NU TREBUIE SA FIE NICIODATA: [un interdicție categorică pentru identitatea culinară a brandului]

SISTEMUL PROPUS: cum ar arăta procesul Atelier pentru această afacere concretă (3 pași numerotați, fiecare pe linie):
1. [Etapa] — [ce presupune, ce produce]
2. [Etapa] — [ce presupune, ce produce]
3. [Etapa] — [ce presupune, ce produce]

PRIMII PASI: 3 acțiuni interne concrete pe care clientul le poate face singur înainte de prima noastră întâlnire (3 rânduri, format "1. / 2. / 3." — scurt, direct, acționabil)

Limbaj direct, profesional, fără adjective inutile. Specifică, nu generic. Spune lucruri pe care nu le mai aude de la nimeni.`, sector, lens)

	profile := fmt.Sprintf(
		"Tip activitate: %s\nProvocarea principală: %s\nExperiență anterioară cu consultanță: %s\nObiectiv în 6 luni: %s\nCum cred că se diferențiază: %s",
		req.Type, req.Problem, req.Tried, req.Goal, req.Diff,
	)

	matReq := anthropicRequest{
		Model:       anthropicModel,
		MaxTokens:   1400,
		Temperature: 1.0,
		System:      system,
		Messages:    []anthropicMessage{{Role: "user", Content: profile}},
	}
	payload, err := json.Marshal(matReq)
	if err != nil {
		return nil, fmt.Errorf("matricea marshal: %w", err)
	}
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicAPIURL, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("matricea request: %w", err)
	}
	httpReq.Header.Set("x-api-key", p.apiKey)
	httpReq.Header.Set("anthropic-version", anthropicVersion)
	httpReq.Header.Set("content-type", "application/json")
	resp, err := p.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("matricea http: %w", err)
	}
	defer resp.Body.Close()
	rawBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("matricea read: %w", err)
	}
	var ar anthropicResponse
	if err := json.Unmarshal(rawBytes, &ar); err != nil {
		return nil, fmt.Errorf("matricea unmarshal: %w", err)
	}
	if ar.Error != nil {
		return nil, fmt.Errorf("anthropic matricea error: %s", ar.Error.Message)
	}
	if len(ar.Content) == 0 {
		return nil, fmt.Errorf("empty matricea response")
	}
	return parseMatriceaText(ar.Content[0].Text), nil
}

func parseMatriceaText(text string) *MatriceaResponse {
	text = strings.NewReplacer("**", "", "*", "").Replace(text)
	lines := strings.Split(strings.TrimSpace(text), "\n")
	sections := map[string][]string{}
	cur := ""
	sectionKeys := []string{"PROFILUL CULINAR", "GOLUL ESENTIAL", "PARAMETRII SENZORIALI", "SISTEMUL PROPUS", "PRIMII PASI"}
	for _, line := range lines {
		matched := false
		for _, key := range sectionKeys {
			prefix := key + ":"
			if strings.HasPrefix(strings.TrimSpace(strings.ToUpper(line)), prefix) {
				cur = key
				rest := strings.TrimSpace(line[strings.Index(strings.ToUpper(line), prefix)+len(prefix):])
				if rest != "" {
					sections[cur] = append(sections[cur], rest)
				}
				matched = true
				break
			}
		}
		if !matched && cur != "" && strings.TrimSpace(line) != "" {
			sections[cur] = append(sections[cur], strings.TrimSpace(line))
		}
	}
	get := func(k string) string { return strings.TrimSpace(strings.Join(sections[k], "\n")) }
	return &MatriceaResponse{
		ProfilulCulinar:      get("PROFILUL CULINAR"),
		GolulEsential:        get("GOLUL ESENTIAL"),
		ParametriiSenzoriali: get("PARAMETRII SENZORIALI"),
		SistemulPropus:       get("SISTEMUL PROPUS"),
		PrimiiPasi:           get("PRIMII PASI"),
		Raw:                  strings.TrimSpace(text),
	}
}

func parseBreviarText(text string) *BreviarResponse {
	// Strip markdown
	text = strings.NewReplacer("**", "", "*", "").Replace(text)
	lines := strings.Split(strings.TrimSpace(text), "\n")
	sections := map[string][]string{}
	cur := ""
	for _, line := range lines {
		for _, prefix := range []string{"TITLU:", "PROFILUL:", "MENIU:", "RITUALURI:", "INTENTIE:"} {
			if strings.HasPrefix(strings.TrimSpace(strings.ToUpper(line)), strings.TrimSuffix(prefix, ":")+":") {
				cur = strings.TrimSuffix(prefix, ":")
				rest := strings.TrimSpace(line[strings.Index(strings.ToUpper(line), prefix)+len(prefix):])
				if rest != "" {
					sections[cur] = append(sections[cur], rest)
				}
				goto nextLine
			}
		}
		if cur != "" && strings.TrimSpace(line) != "" {
			sections[cur] = append(sections[cur], strings.TrimSpace(line))
		}
	nextLine:
	}
	get := func(k string) string { return strings.TrimSpace(strings.Join(sections[k], "\n")) }
	raw := strings.TrimSpace(text)
	return &BreviarResponse{
		Titlu:     get("TITLU"),
		Profilul:  get("PROFILUL"),
		Meniu:     get("MENIU"),
		Ritualuri: get("RITUALURI"),
		Intentie:  get("INTENTIE"),
		Raw:       raw,
	}
}
