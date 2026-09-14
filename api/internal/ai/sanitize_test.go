package ai

import "testing"

func TestSanitizeRomanian(t *testing.T) {
	cases := map[string]string{
		"Dar mă curiozează un lucru: care e povestea?":      "Dar mă intrigă un lucru: care e povestea?",
		"Mă curioazează... adică, mă întreb dacă e corect.": "Mă intrigă... adică, mă întreb dacă e corect.",
		"Asta curiozează pe oricine.":                       "Asta intrigă pe oricine.",
		"Sunt curioasă și curiozitatea mea crește.":         "Sunt curioasă și curiozitatea mea crește.",
	}
	for input, want := range cases {
		if got := sanitizeRomanian(input); got != want {
			t.Errorf("sanitizeRomanian(%q) = %q, want %q", input, got, want)
		}
	}
}
