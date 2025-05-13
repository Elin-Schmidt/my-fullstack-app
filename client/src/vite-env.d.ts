/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    // Lägg till fler miljövariabler här om det behövs
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
