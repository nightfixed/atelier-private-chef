package ai

import (
	"context"
	"fmt"
	"strings"
)

// MockProvider returns realistic-looking responses without calling any external API.
// Replace with a real provider (see openai.go / anthropic.go) when ready.
type MockProvider struct{}

var seasonalCourses = map[string][]MenuCourse{
	"Primăvară": {
		{Num: 1, Category: "Amuse-bouche", Name: "Lichen și piatră de izvor", Ingredient: "Licheni Carpatici"},
		{Num: 2, Category: "Pâine", Name: "Pâinea Atelierului · muguri de mesteacăn", Ingredient: "Muguri de Mesteacăn"},
		{Num: 3, Category: "Supă", Name: "Consommé de primăvară · rășină tânără", Ingredient: "Rășină de Molid"},
		{Num: 4, Category: "Aperitiv rece", Name: "Somon afumat · hrean de Turda · icre", Ingredient: "Hrean de Turda"},
		{Num: 5, Category: "Aperitiv cald", Name: "Foie gras · caramel de molid · brioche", Ingredient: "Rășină de Molid"},
		{Num: 6, Category: "Intermezzo", Name: "Sorbet de cenușă de fag · lămâie verde", Ingredient: "Cenușă de Fag"},
		{Num: 7, Category: "Pește", Name: "Calcan · unt de mesteacăn · legume de primăvară", Ingredient: "Muguri de Mesteacăn"},
		{Num: 8, Category: "Carne · Specialitatea Casei", Name: "Rață dry-aged · lichen · jus de pădure", Ingredient: "Licheni Carpatici"},
		{Num: 9, Category: "Desert", Name: "Panna cotta de bivoliță · caramel de brad", Ingredient: "Lapte de Bivoliță"},
	},
	"Vară": {
		{Num: 1, Category: "Amuse-bouche", Name: "Gazpacho de roșii · hrean de Turda · gheață", Ingredient: "Hrean de Turda"},
		{Num: 2, Category: "Pâine", Name: "Pâinea Atelierului · tărâțe prăjite", Ingredient: "Tărâțe de Grâu Prăjite"},
		{Num: 3, Category: "Supă rece", Name: "Vichyssoise · lichen · ulei de muguri", Ingredient: "Licheni Carpatici"},
		{Num: 4, Category: "Aperitiv rece", Name: "Tartă de legume · cenușă de fag · flori", Ingredient: "Cenușă de Fag"},
		{Num: 5, Category: "Aperitiv cald", Name: "Foie gras · cireșe · rășină de molid", Ingredient: "Rășină de Molid"},
		{Num: 6, Category: "Intermezzo", Name: "Granita de mesteacăn · mentă · ierburi", Ingredient: "Muguri de Mesteacăn"},
		{Num: 7, Category: "Pește", Name: "Somon · crustă de tărâțe · legume de vară", Ingredient: "Tărâțe de Grâu Prăjite"},
		{Num: 8, Category: "Carne · Specialitatea Casei", Name: "Vițel · unt de bivoliță · trufe de vară", Ingredient: "Lapte de Bivoliță"},
		{Num: 9, Category: "Desert", Name: "Înghețată de bivoliță · cenușă · caramel", Ingredient: "Lapte de Bivoliță"},
	},
	"Toamnă": {
		{Num: 1, Category: "Amuse-bouche", Name: "Tartă de ciuperci sălbatice · lichen", Ingredient: "Licheni Carpatici"},
		{Num: 2, Category: "Pâine", Name: "Pâine de hrișcă · unt de miso · tărâțe", Ingredient: "Tărâțe de Grâu Prăjite"},
		{Num: 3, Category: "Supă", Name: "Bisque de homar · rășină de molid · smântână", Ingredient: "Rășină de Molid"},
		{Num: 4, Category: "Aperitiv rece", Name: "Terrine de foie gras · cenușă · brioche", Ingredient: "Cenușă de Fag"},
		{Num: 5, Category: "Aperitiv cald", Name: "Creveți · unt de mesteacăn · zucchini", Ingredient: "Muguri de Mesteacăn"},
		{Num: 6, Category: "Intermezzo", Name: "Sorbet de mere · hrean · ghimbir", Ingredient: "Hrean de Turda"},
		{Num: 7, Category: "Pește", Name: "Calcan · crustă de cenușă · cartofi violeti", Ingredient: "Cenușă de Fag"},
		{Num: 8, Category: "Carne · Specialitatea Casei", Name: "Vânat · lichen · fructe de pădure · jus", Ingredient: "Licheni Carpatici"},
		{Num: 9, Category: "Desert", Name: "Cremă de bivoliță · caramel de molid · nuc", Ingredient: "Rășină de Molid"},
	},
	"Iarnă": {
		{Num: 1, Category: "Amuse-bouche", Name: "Consommé de trufe · foie gras · aur", Ingredient: "Cenușă de Fag"},
		{Num: 2, Category: "Pâine", Name: "Pâinea Atelierului · unt de bivoliță · sare roz", Ingredient: "Lapte de Bivoliță"},
		{Num: 3, Category: "Supă", Name: "Cremă de scorțișoară · rășină · smântână acidă", Ingredient: "Rășină de Molid"},
		{Num: 4, Category: "Aperitiv rece", Name: "Somon afumat la rece · hrean · icre negre", Ingredient: "Hrean de Turda"},
		{Num: 5, Category: "Aperitiv cald", Name: "Foie gras · lichen · caramel de fag", Ingredient: "Licheni Carpatici"},
		{Num: 6, Category: "Intermezzo", Name: "Granita de brad · cenușă de fag · citrice", Ingredient: "Cenușă de Fag"},
		{Num: 7, Category: "Pește", Name: "Calcan · crustă de tărâțe · trufă neagră", Ingredient: "Tărâțe de Grâu Prăjite"},
		{Num: 8, Category: "Carne · Specialitatea Casei", Name: "Bou dry-aged · unt de bivoliță · lichen negru", Ingredient: "Licheni Carpatici"},
		{Num: 9, Category: "Desert", Name: "Fondant de ciocolată neagră · cenușă · aur", Ingredient: "Cenușă de Fag"},
	},
}

var occasionNotes = map[string]string{
	// New labels
	"Romantic":  "Am construit această seară pentru doi — fiecare preparat crește în intensitate, ca orice poveste bună de dragoste.",
	"Celebrare": "Meniurile de celebrare sunt cele mai personale pe care le creez. Am ales ingrediente care să marcheze momentul — unele fermentate, unele coapte, toate cu răbdare.",
	"Intim":     "O cină intimă cere să las tehnica în umbră și să las ingredientele să vorbească. Am ales preparate care invită la conversație.",
	"Business":  "Excellence fără ostentație. Fiecare preparat spune ceva despre calitate și atenție la detaliu — exact ce reprezintă și afacerea dumneavoastră.",
	"Surpriză":  "Cel mai frumos meniu este cel pe care cineva nu îl așteaptă. Am construit fiecare preparat ca o mică revelație.",
	// Legacy labels (backward compat)
	"Cină romantică":      "Am construit această seară pentru doi — fiecare preparat crește în intensitate, ca orice poveste bună de dragoste.",
	"Aniversare":          "Meniurile de aniversare sunt cele mai personale pe care le creez. Am ales ingrediente care să marcheze momentul — unele fermentate, unele coapte, toate cu răbdare.",
	"Corporate":           "Excellence fără ostentație. Fiecare preparat spune ceva despre calitate și atenție la detaliu — exact ce reprezintă și afacerea dumneavoastră.",
	"Cerere în căsătorie": "Cel mai important preparat nu e pe masă — e întrebarea. Eu mă ocup de tot ce o înconjoară, ca momentul să fie perfect.",
}

// GenerateMenu returns a seasonally and contextually appropriate mock menu.
func (m *MockProvider) GenerateMenu(_ context.Context, req MenuRequest) (*MenuResponse, error) {
	season := req.Season
	if season == "" {
		season = "Toamnă"
	}

	courses, ok := seasonalCourses[season]
	if !ok {
		courses = seasonalCourses["Toamnă"]
	}

	name := req.HostName
	if name == "" {
		name = "dumneavoastră"
	}

	note, ok := occasionNotes[req.Occasion]
	if !ok {
		note = "Am creat acest meniu cu ingredientele cele mai bune pe care le-am găsit în acest sezon."
	}

	chefNote := note
	if req.Protein != "" {
		chefNote += " " + req.Protein + " va fi inima preparatelor principale."
	}
	if req.TasteProfile != "" {
		chefNote += " Note dominante de " + strings.ToLower(req.TasteProfile) + "."
	}
	if req.Love != "" {
		chefNote += " Am inclus " + req.Love + " — știam că îți place."
	}
	chefNote += " Abia aștept să gătesc pentru " + name + "."

	subtitle := "Meniu de degustare · 9 preparate · " + season
	if req.GuestCount != "" {
		subtitle += " · " + req.GuestCount + " persoane"
	}
	if req.Protein != "" {
		subtitle += " · " + req.Protein
	}

	occasionTitles := map[string]string{
		"Romantic": "Romantică", "Celebrare": "de Celebrare",
		"Intim": "Intimă", "Business": "de Afaceri", "Surpriză": "Surpriză",
	}
	title := "Seara lui " + name
	if ot, ok := occasionTitles[req.Occasion]; ok {
		title = "Seara " + ot + " a lui " + name
	}

	tags := []string{"Herbarium", season, req.Occasion}
	if req.Protein != "" {
		tags = append(tags, req.Protein)
	}
	if req.TasteProfile != "" {
		tags = append(tags, req.TasteProfile)
	}
	if len(req.Dietary) > 0 && !(len(req.Dietary) == 1 && strings.EqualFold(req.Dietary[0], "Niciuna")) {
		tags = append(tags, req.Dietary...)
	}

	return &MenuResponse{
		Title:    title,
		Subtitle: subtitle,
		Courses:  courses,
		ChefNote: chefNote,
		Tags:     tags,
	}, nil
}

// GenerateCodex returns a mock Codex menu and story based on the sensory profile.
func (m *MockProvider) GenerateCodex(_ context.Context, req CodexRequest) (*CodexResponse, error) {
	name := req.GuestName
	if name == "" {
		name = "Oaspete"
	}
	courses := []CodexCourse{
		{Tip: "Amuse-bouche", Nume: "Bun-venit al bucătăriei", Descriere: "O îmbucătură de sezon — delicată, concentrată, care anunță intenția serii."},
		{Tip: "Pâine", Nume: "Pâinea Atelierului", Descriere: "Pâine de casă cu maia, coaptă în fontă, servită cu unt artizanal și sare de calitate."},
		{Tip: "Supă", Nume: "Consommé de legume rădăcinoase", Descriere: "Un bulion limpede și aromat, cu ierburi proaspete și un fir de ulei extravirgin."},
		{Tip: "Aperitiv", Nume: "Tartă cu somon afumat la rece", Descriere: "Somon afumat 48h, cremă acidă, ierburi fine, servit pe o tartă crocantă."},
		{Tip: "Intermezzo", Nume: "Sorbet de citrice & ghimbir", Descriere: "Un moment de pauză — acid, viu, care curăță palatul și deschide a doua parte a serii."},
		{Tip: "Fel principal", Nume: "Proteina zilei · gătită sous-vide", Descriere: "Gătită precis sub vid, finisată la cărbune, cu jus concentrat și legume de sezon."},
		{Tip: "Desert", Nume: "Cremă · caramel · textură crocantă", Descriere: "Un desert elegant, echilibrat între dulce și sărat, cu flori și ierburi proaspete."},
	}
	story := "Seara lui " + name + " se construiește preparat cu preparat, fiecare farfurie o decizie luată cu grijă. " +
		"Nu există rețetă standard — există o combinație gândită pentru această ocazie, pentru aceste persoane, pentru această seară. " +
		"La final, nu vei ști exact ce ai mâncat — vei ști doar cum te-ai simțit."
	return &CodexResponse{Menu: courses, Story: story}, nil
}

// GenerateArtifact returns a mock post-dinner artifact.
func (m *MockProvider) GenerateArtifact(_ context.Context, req ArtifactRequest) (*ArtifactResponse, error) {
	return &ArtifactResponse{
		Title:    "Seara Memoriei și a Focului",
		Subtitle: fmt.Sprintf("Capitol #%d — %s", req.ChapterNum, req.Date),
		Text:     "Seara lui " + req.GuestName + " a început înainte de primul preparat. A început cu tăcerea dinaintea primului cuvânt, cu mirosul care a sosit înaintea gustului. Fiecare farfurie a purtat o amintire deghizată în tehnică, fiecare pauză a fost un capitol în sine. La finalul serii, nimic nu s-a terminat cu adevărat.",
	}, nil
}

func (m *MockProvider) GenerateBreviar(_ context.Context, req BreviarRequest) (*BreviarResponse, error) {
	return &BreviarResponse{
		Titlu:     fmt.Sprintf("Seara Echipei din %s", req.Industry),
		Profilul:  "O echipă cu gusturi precise și o energie care caută autenticitate — nu spectacol. Profilul gustativ al grupului indică o preferință pentru contrast: ceva cunoscut, completat de ceva complet neașteptat.",
		Meniu:     "DESCHIDERE: Recunoașterea — aperitive individuale care provoacă o primă conversație.\nINIMA SERII: Confluența — fel principal sharing, construit pe ingredientul care unește.\nINCHEIEREA: Memoria — un desert care lasă o singură imagine, nu mai multe gusturi.",
		Ritualuri: "1. Fiecare participant primește un card cu o întrebare despre echipă — citit cu voce tare înainte de primul fel.\n2. La finalul serii, fiecare scrie pe hârtie un cuvânt care descrie seara — adunate și citite de chef.",
		Intentie:  "Vor pleca știind că sunt o echipă — nu doar colegi care lucrează împreună.",
		Raw:       "",
	}, nil
}

func (m *MockProvider) GenerateMatricea(_ context.Context, req MatriceaRequest) (*MatriceaResponse, error) {
	return &MatriceaResponse{
		ProfilulCulinar:      fmt.Sprintf("Un brand din domeniul %s care servește mâncare bună fără să știe de ce e bună. Identitatea culinară există implicit — în alegeri, în ingrediente, în modul în care se prezintă — dar nu a fost niciodată articulată, sistematizată sau transmisă.", req.Type),
		GolulEsential:        "Lipsește limbajul intern. Bucătarul știe ce face, dar nu știe să explice de ce. Când pleacă el, pleacă tot. Asta nu e o problemă de rețete — e o problemă de sistem care nu există.",
		ParametriiSenzoriali: "TEMPERATURA: contrast deliberat — cald la miezul preparatului, rece la periferie\nTEXTURA: crocant exterior, cremă la interior — tensiune rezolvată în fiecare înghițitură\nCONTRASTUL ACTIV: acid / bogat — fiecare preparat trebuie să aibă un element care taie\nAMINTIREA TARGET: masa din copilărie la bunici — familiarul ridicat la rang de eleganță\nCE NU TREBUIE SA FIE NICIODATA: neutru, inofensiv, ușor de uitat",
		SistemulPropus:       "1. Cartografierea — o jumătate de zi la fața locului, exerciții senzoriale cu echipa cheie, harta brută a identității\n2. Traducerea — parametrii senzoriali transformați în limbaj culinar precis, codex intern al brandului\n3. Livrabilul — document fizic, legat, tipărit: biblia culinară internă care rămâne indiferent de cine gătește",
		PrimiiPasi:           "1. Scrieți 3 preparate din oferta actuală pe care le considerați definitorii și explicați de ce — nu ce ingrediente au, ci ce simt oaspeții.\n2. Rugați 5 clienți fideli să descrie brandul vostru într-un singur cuvânt legat de gust sau senzație.\n3. Identificați un preparat care nu a funcționat niciodată — și întrebați-vă onest de ce era acolo.",
		Raw:                  "",
	}, nil
}

// Chat handles conversational messages about Atelier Private Dining.
func (m *MockProvider) Chat(_ context.Context, req ChatRequest) (*ChatResponse, error) {
	if len(req.Messages) == 0 {
		return &ChatResponse{Reply: "Cu ce vă pot ajuta?"}, nil
	}
	last := strings.ToLower(req.Messages[len(req.Messages)-1].Content)

	switch {
	case contains(last, "pret", "cost", "preț", "cât costă", "tarif"):
		return &ChatResponse{Reply: "Prețul variază în funcție de numărul de persoane, complexitatea meniului și locație. Vă invit să completați formularul de rezervare sau să ne scrieți la exquisitefoodtravel@yahoo.com pentru un deviz personalizat."}, nil
	case contains(last, "rezerv", "booking", "book", "disponibil"):
		return &ChatResponse{Reply: "Vă rog să completați formularul din secțiunea Rezervare — acolo puteți alege ocazia, data și numărul de persoane. Vă vom contacta în 24 de ore."}, nil
	case contains(last, "meniu", "menu", "preparate", "feluri"):
		return &ChatResponse{Reply: "Fiecare meniu este creat de la zero pentru seara voastră. Puteți folosi generatorul \"Compune Seara\" pentru o propunere personalizată sau ne puteți scrie direct preferințele."}, nil
	case contains(last, "alerg", "vegeta", "vegan", "gluten", "lactoz", "restricț"):
		return &ChatResponse{Reply: "Construim meniurile de la zero, deci orice restricție alimentară este gestionabilă. Specificați în formularul de rezervare și Chef Răzvan va adapta fiecare preparat."}, nil
	case contains(last, "unde", "locatie", "locație", "cluj", "adres"):
		return &ChatResponse{Reply: "Atelier Private Dining este bazat în Cluj-Napoca, România. Gătim în casa dumneavoastră sau în orice spațiu privat din regiune."}, nil
	case contains(last, "contact", "email", "telefon", "scrie"):
		return &ChatResponse{Reply: "Ne puteți contacta la exquisitefoodtravel@yahoo.com. Chef Răzvan răspunde personal în maximum 24 de ore."}, nil
	case contains(last, "herbarium", "ingredient", "local", "carpat"):
		return &ChatResponse{Reply: "Herbarium-ul Atelier este o colecție de ingrediente carpatice rare — licheni, rășină de molid, muguri de mesteacăn, cenușă de fag. Fiecare ingredient are o poveste și un loc precis de origine."}, nil
	default:
		return &ChatResponse{Reply: "Vă mulțumim pentru mesaj. Pentru detalii specifice, vă invit să ne scrieți la exquisitefoodtravel@yahoo.com — Chef Răzvan vă va răspunde personal în maximum 24 de ore."}, nil
	}
}

func contains(s string, keywords ...string) bool {
	for _, k := range keywords {
		if strings.Contains(s, k) {
			return true
		}
	}
	return false
}
