import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Share, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // If it's iOS and not already in standalone mode, show instructions
    if (isIOSDevice && !(window.navigator as any).standalone) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
      toast.success("Obrigado por instalar nosso app!");
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mx-auto max-w-sm rounded-xl border bg-card p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg shadow-inner">
            <img 
              src="/__l5e/assets-v1/f07ba323-b911-4b49-b63e-e1220330a276/candidate.png" 
              alt="Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold leading-none">Instalar Aplicativo</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adicione Lovable à sua tela inicial para acesso rápido e offline.
            </p>
          </div>
          <button 
            onClick={() => setShowPrompt(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">Fechar</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isIOS ? (
          <div className="mt-4 space-y-3 rounded-lg bg-muted/50 p-3 text-xs border border-muted-foreground/10">
            <p className="font-medium text-foreground/90">Instruções para Safari no iOS:</p>
            <ol className="space-y-2 text-muted-foreground ml-1">
              <li className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">1</span>
                <span>Toque no botão de compartilhamento <Share className="inline h-3 w-3 align-middle mx-1" /></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">2</span>
                <span>Role para baixo e selecione "Adicionar à Tela de Início" <PlusSquare className="inline h-3 w-3 align-middle mx-1" /></span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Instalar Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}