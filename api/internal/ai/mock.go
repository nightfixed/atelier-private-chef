package ai

import (
"context"
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
"Romantic":   "Am construit această seară pentru doi — fiecare preparat crește în intensitate, ca orice poveste bună de dragoste.",
"Celebrare":  "Meniurile de celebrare sunt cele mai personale pe care le creez. Am ales ingrediente care să marcheze momentul — unele fermentate, unele coapte, toate cu răbdare.",
"Intim":      "O cină intimă cere să las tehnica în umbră și să las ingredientele să vorbească. Am ales preparate care invită la conversație.",
"Business":   "Excellence fără ostentație. Fiecare preparat spune ceva despre calitate și atenție la detaliu — exact ce reprezintă și afacerea dumneavoastră.",
"Surpriză":   "Cel mai frumos meniu este cel pe care cineva nu îl așteaptă. Am construit fiecare preparat ca o mică revelație.",
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
		{Tip: "Amuse-bouche", Nume: "Lichen & piatră de izvor", Descriere: "Un bun-venit mineral, rece — licheni carpatici deshidratați, apă de izvor gelificată, ulei de brad."},
		{Tip: "Pâine", Nume: "Pâinea Atelierului", Descriere: "Maia de trei zile, coaptă în fontă, servită cu unt de bivoliță afumat și sare de Praid."},
		{Tip: "Supă", Nume: "Consommé de rădăcini & rășină de molid", Descriere: "Un bulion limpede de rădăcini carpatice, cu o picătură de rășină tânără și petale de gălbenele."},
		{Tip: "Aperitiv", Nume: "Tartă de hrean & somon afumat la rece", Descriere: "Hrean de Turda fermentat, somon afumat 48h, cremă acidă, icre de păstrăv."},
		{Tip: "Intermezzo", Nume: "Sorbet de cenușă de fag & lămâie verde", Descriere: "Un moment de pauză — sorbet fumuriu, acid, care curăță palatul și deschide a doua parte a serii."},
		{Tip: "Fel principal", Nume: "Rață dry-aged & jus de pădure", Descriere: "Rață maturată 14 zile, gătită sous-vide, cu jus de fructe de pădure, lichen prăjit și legume rădăcinoase caramelizate."},
		{Tip: "Desert", Nume: "Panna cotta de bivoliță & caramel de brad", Descriere: "Cremă de lapte de bivoliță, caramel de rășină de brad, praf de cenușă de fag și flori de sezon."},
	}
	story := "Seara lui " + name + " începe înainte ca prima farfurie să apară pe masă — în liniștea din care se naște atenția. " +
		"Fiecare preparat poartă ceva din pădurile Ardealului: un miros de rășină, o textură de scoarță, o aciditate vie ca un izvor de munte. " +
		"Nu este o cină în care mănânci și pleci. Este o seară în care rămâi cu tine însuți, ascultat de ingrediente care au crescut cu răbdare. " +
		"La final, nu vei ști exact ce ai mâncat — vei ști doar cum te-ai simțit."
	return &CodexResponse{Menu: courses, Story: story}, nil
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
