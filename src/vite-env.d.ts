/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}
