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
