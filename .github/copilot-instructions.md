# Instrucțiuni repo — atelier-private-chef

## Reguli obligatorii

- **`.focus()` ia mereu `{ preventScroll: true }`.** Un `.focus()` programatic fără el lasă browserul să scroleze singur spre câmp și taie textul/întrebarea de deasupra (bug recurent, reparat de mai multe ori în `oglinda.html`, `TesaturaGenerator.tsx`, `TemeliaGenerator.tsx`). Regula e verificată automat: `web/eslint.config.mjs` (regulă `no-restricted-syntax`) pentru `.ts`/`.tsx`, plus un grep dedicat în `.github/workflows/deploy-pages.yml` pentru `web/public/*.html`. Rulează `npm run lint` în `web/` înainte de commit.
- După orice modificare de cod: `npm run build` în `web/` (dacă s-a atins `web/`) → `git add -A && git commit && git push`. Deploy e automat (Cloudflare Pages + Cloud Run) după push pe `main`.
- Când adaugi un formular nou cu pași (step-form) sau orice `.focus()` la schimbare de conținut, adaugă și un scroll explicit spre începutul noului conținut (`scrollIntoView({ block: 'start' })` pe containerul întrebării/mesajului), nu doar pe input.
