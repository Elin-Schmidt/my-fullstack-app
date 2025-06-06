# Rapport: "Not Found" vid reload på Render – Orsak och Lösning

## Bakgrund

Vid deployment av en fullstack-applikation med React (Vite) frontend och Express backend på Render uppstod problemet att sidan visade "Not Found" när man laddade om en route direkt (t.ex. `/profile`). Lokalt fungerade allt som förväntat.

---

## Orsak till problemet

Problemet berodde på hur Express-servern hanterade inkommande requests:

-   **SPA (Single Page Application):** React-router hanterar routing på klientsidan. Vid reload måste servern alltid returnera `index.html` för okända routes (utom API och statiska filer).
-   **Fel i serverns route-ordning:**
    SPA-fallbacken (som skickar tillbaka `index.html` för okända routes) låg **före** API-routes i Express-koden.
    Det gjorde att även anrop till `/api/...` och andra backend-routes fångades upp av fallbacken och returnerade `index.html` istället för API-data eller 404.

---

## Lösning

1. **Flytta API-routes före SPA-fallbacken**
   Alla API-routes (`/api/auth`, `/api/users`, `/api/posts`) måste registreras **före** SPA-fallbacken i Express-koden.
2. **SPA-fallback sist**
   Efter att alla API- och statiska routes är definierade, lägg till fallbacken som returnerar `index.html` för alla andra requests (utom `/api` och `/uploads`).

**Korrekt kodexempel:**

```typescript
// API och statiska routes först!
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

if (process.env.SERVE_FRONTEND === 'true') {
    app.use(express.static(path.resolve(__dirname, '../../client/dist')));
    app.use((req, res, next) => {
        if (!req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
            res.sendFile(
                path.resolve(__dirname, '../../client/dist/index.html')
            );
        } else {
            next();
        }
    });
}
```

---

## Resultat

Efter att API-routes flyttades före SPA-fallbacken och rätt miljövariabler sattes på Render, fungerar nu:

-   Alla frontend-routes även vid reload (SPA-routing).
-   Alla API-anrop fungerar som de ska.
-   Ingen "Not Found" längre vid reload på Render.

---

## Slutsats

Problemet berodde på fel ordning av routes i Express.
Lösningen var att alltid lägga SPA-fallbacken **sist**, efter alla API- och statiska routes.

---

**Tips:**
Denna struktur är standard för alla Node/Express-appar med SPA frontend och bör alltid följas vid deployment till t.ex. Render, Heroku eller liknande plattformar.
