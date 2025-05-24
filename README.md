# Boply – Fullstack Social App

## Beskrivning

Det här projektet är en fullstack-applikation byggd med **React**, **TypeScript**, **Node.js/Express** och **PostgreSQL**. Applikationen är ett socialt nätverk där användare kan skapa konto, logga in, posta inlägg, gilla och kommentera andras inlägg, samt hantera sin profil. Gränssnittet är modernt, responsivt och användarvänligt.

**Funktioner:**

-   Skapa konto och logga in
-   Profil med omslagsbild, profilbild och bio
-   Skapa, visa och ta bort inlägg
-   Gilla andras inlägg (en gång per inlägg)
-   Kommentera inlägg (med användarnamn och datum)
-   Se alla användare
-   Responsiv design för mobil och desktop
-   Logout-funktion
-   Flyout-menyer och sökfält

## Tekniker och verktyg

-   React (med TypeScript)
-   Vite
-   Node.js + Express
-   PostgreSQL
-   CSS Modules
-   Ikonbibliotek: react-icons
-   Axios för API-anrop
-   ESLint för kodkvalitet

## Kom igång

1. **Klona repot och installera beroenden:**

    ```bash
    git clone https://github.com/ditt-användarnamn/ditt-repo.git
    cd ditt-repo
    npm install
    cd server
    npm install
    cd ../client
    npm install
    ```

2. **Starta backend:**

    ```bash
    cd server
    npm run dev
    ```

3. **Starta frontend:**

    ```bash
    cd client
    npm run dev
    ```

4. **Miljövariabler:**
    - Se till att `.env`-filer finns i både `/server` och `/client` med rätt inställningar för databas och API-url.

## Struktur

```
my-fullstack-app/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── pages/
│   │   │   ├── auth/
│   │   │   └── ...
│   │   ├── context/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.css
│   ├── public/
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── db/
│   │   └── ...
│   ├── uploads/
│   └── ...
│
└── dokumentation/
    └── Laboration 3 Fullstackapplikation.md
```

## Funktioner

-   **Användarhantering:** Registrering, inloggning, profilredigering, profil- och omslagsbild.
-   **Inlägg:** Skapa, visa, ta bort, gilla (en gång per användare och inlägg).
-   **Kommentarer:** Skriv och visa kommentarer, med användarnamn och datum.
-   **Responsivitet:** Anpassad för både mobil och desktop.
-   **Sök och navigering:** Sökfält, flyout-menyer, logout.

## Licens

MIT License
