/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CLOUD_MACHINE_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
