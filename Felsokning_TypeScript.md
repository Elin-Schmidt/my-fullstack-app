\*\*\* ✅ Sammanfattning av felsökning: TypeScript + Vite + Expo-konflikter

\*\*🔧 Problem 1: Felmeddelanden om filändelser

-   Fel:
    Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'.

-   Orsak:
    Med moduleResolution: "node16" kräver TypeScript att du anger filändelser i relativa imports, t.ex.:

    import App from './App'; // ❌
    import App from './App.tsx'; // ✅

-   Lösning:
    Du la till **, \*\*** eller \*\*`` i alla relativa imports beroende på filen du importerade.

\*\* 📂 Problem 2: App.tsx låg utanför rootDir

-   Fel:
    File is not under 'rootDir'. 'rootDir' is expected to contain all source files.

-   Orsak:
    App.tsx låg i projektets rotmapp, men rootDir var satt till "src", vilket gav konflikt.

-   Lösning:
    Du flyttade App.tsx till ``-mappen för att allt skulle ligga under rootDir.

\*\* ⚙️ Problem 3: Expo-konflikt med TypeScript-konfiguration

-   Fel:
    Option 'customConditions' can only be used when 'moduleResolution' is set to 'node16', 'nodenext', or 'bundler'.

-   Orsak:
    Expo har en grundkonfiguration (expo/tsconfig.base) som bland annat använder customConditions.Den kräver att moduleResolution är "node16" (vilket du redan justerade).

-   Lösning:
    Du satte:

    "module": "node16",
    "moduleResolution": "node16"

    vilket gjorde att Expo-konfigurationen fungerade som tänkt.

\*\* 🧱 Problem 4: Alias (t.ex. @/ eller @components) fungerade inte

-   Orsak:
    Vite behöver en plugin för att förstå aliasen från tsconfig.json.

-   Lösning:
    Du installerade och konfigurerade vite-plugin-tsconfig-paths:

    npm install vite-plugin-tsconfig-paths --save-dev

    Och i vite.config.ts:

    import tsconfigPaths from 'vite-plugin-tsconfig-paths';
    export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    });

\*\* 📁 Final justering: allowImportingTsExtensions

-   För att kunna importera .ts/.tsx-filer med filändelse direkt:
    "allowImportingTsExtensions": true

Tidsförlopp: 3 timmar
