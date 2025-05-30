# Problem: TypeScript "No overload matches this call" vid användning av controller i Express-router

## Bakgrund

När jag försökte använda en controller-funktion (t.ex. `updateNote`) direkt i vår Express-router i TypeScript-projektet, fick jag följande felmeddelande:
"No overload matches this call."

Detta hände på raden:

```typescript
router.put('/:id', updateNote);
```

---

## Orsak

TypeScript kräver att funktioner som används som route-handlers i Express har rätt typ. Om en controller-funktion inte är explicit typad som en RequestHandler (eller om TypeScript inte kan härleda typen automatiskt), kan man få detta fel.

Detta är vanligt när man skriver sina controllers som asynkrona funktioner utan att ange typen RequestHandler från Express.

---

## Lösning

Jag löste det genom att type-casta controller-funktionen till RequestHandler direkt i routern:

import { RequestHandler } from 'express';
router.put('/:id', updateNote as RequestHandler);

Detta talar om för TypeScript att updateNote är av rätt typ för att användas som en route-handler, även om funktionen är asynkron och inte explicit typad.
