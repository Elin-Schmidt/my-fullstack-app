# Problem:

Jag kan gå till /login via ett button onclick.
Jag kan inte gå till /login via adressfältet i webbläsaren.

# Lösning:

Efter att ha suttit i 4 timmar och försökt att få det att fungera så har jag tagit beslutet att lägga det åt sidan just nu.
Jag fick det att fungera med localhost då jag med denna funktion i index.ts anropa klienten att ta hand om routingen:

// Serve static files from the frontend
app.use(express.static(path.resolve(\_\_dirname, '../client/dist')));

// Serve frontend for unknown routes
app.use((req, res, next) => {
if (!req.url.startsWith('/api')) {
res.sendFile(path.resolve(\_\_dirname, '../client/dist/index.html'));
} else {
next();
}
});

Dock så fungerade inte detta på Render då backend och frontend är på olika ställen och inte kan hitta varandras filer.
Jag förökte lösa detta genom att skapa en render-build.sh som backend skulle läsa ifrån under bygget och på så sätt få in både frontend och backend kod.
Jag fick dock bara fail efter fail under bygget på Render, vilket jag försökte fixa, men då jag hela tiden jobbade under main-branch så kände jag tillslut att jag började komma för långt bort från tryggheten att jag valde att återställa till punkten innan allt fallerade.

Jag får just nu nöja mig med att navigera mellan sidorna via buttons eller länkar och undvika adressfältet.

Men nu medan jag skrev detta så kom jag på en minor lösning på problemet.
Om jag skapar en variabel i .env satt till true, så kan jag i index.ts kolla om den kan läsas av eller inte. Om den kan det så ska ovanstående kod anropas och köras men om variabeln inte kan läsas så ska inte koden köras.
Detta gör att eftersom variabeln ligger i .env som inte skickas upp till GitHub så kommer koden köras lokalt men inte via Render.

---

# Problem:

När projektet deployades till Render fungerade API-rutter som /api/users/6 och /api/posts/user/6 inte – de gav 404 eller "Not Found". Lokalt fungerade allt som det skulle.

# Orsak:

Frontend och backend låg på olika ställen: Render körde backend och frontend som separata tjänster eller i olika miljöer, så backend kunde inte hitta frontendens byggda filer (index.html) med den vanliga statiska serverkoden.
Felaktig hantering av frontend-rutter: Kod som fungerade lokalt (app.use(express.static(...)) och res.sendFile(...)) fungerade inte på Render eftersom sökvägarna inte stämde eller frontendfilerna inte fanns där backend förväntade sig dem.
API-anrop i frontend använde relativa paths eller lokal proxy: I produktion måste frontend veta exakt vilken backend-URL som ska användas, annars försöker den anropa sin egen server eller fel adress.

# Lösning:

Miljövariabel för backend-URL:
Infördes VITE_BACKEND_URL i .env och .env.production i frontendprojektet.
Alla API-anrop i frontend ändrades till att använda denna variabel, t.ex.
Korrekt hantering av statiska filer:
Backend serverar frontend endast om en särskild miljövariabel (SERVE_FRONTEND) är satt, vilket gör att koden fungerar både lokalt och på Render.
Bygg och deploy:
Frontend byggs separat och deployas till rätt plats.
Backend deployas till Render och använder rätt miljövariabler.

# Resultat:

Alla API-anrop från frontend går nu till rätt backend-URL, både lokalt och i produktion.
Frontend och backend fungerar tillsammans på Render utan 404-problem på API-rutter.
Routing i frontend fungerar som förväntat även vid uppdatering av sidan eller direktlänkning.
