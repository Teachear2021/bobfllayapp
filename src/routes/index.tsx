import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  FileText,
  Heart,
  Home,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Stethoscope,
  MapPin,
  Clock,
  Send,
  User,
  Users,
  Bell,
  ChevronRight,
  ArrowUpRight,
  Share2,
  Vote,
  Trophy,
  Copy,
  Building2,
  Award,
  PlayCircle,
  Check,
  TrendingUp,
  LogOut,
} from "lucide-react";
import candidateAsset from "@/assets/candidate.png.asset.json";
const candidatePhoto = candidateAsset.url;
import splashImg from "../assets/splash.png";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/AuthModal";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bob Fllay 13567 | Início | App Oficial" },
      {
        name: "description",
        content:
          "Participe da campanha de Bob Fllay 13567. Veja propostas, agenda e torne-se um multiplicador oficial.",
      },
    ],
  }),
  component: AppShell,
});

function AppShell() {
  const [tab, setTab] = useState<"home" | "agenda" | "propostas" | "apoie" | "perfil">("home");
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Reduzido de 2500ms para 1500ms para um carregamento mais ágil
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-screen overflow-x-hidden bg-[oklch(0.985_0.005_330)]"
        >
      <Toaster position="top-center" />
      {/* ambient pink wash */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,oklch(0.92_0.08_350)_0%,transparent_70%)]" />
      <div className="mx-auto max-w-md">
        <TopBar />
        <main key={tab} className="px-5 pb-32 pt-2 animate-[fade-in_220ms_ease-out]">
          {tab === "home" && <HomeScreen onNavigate={setTab} user={user} openAuth={() => setShowAuthModal(true)} />}
          {tab === "agenda" && <SimpleScreen title="Agenda" subtitle="Próximos encontros e eventos" />}
          {tab === "propostas" && <SimpleScreen title="Propostas" subtitle="Tudo que vamos defender" />}
          {tab === "apoie" && <SimpleScreen title="Apoie" subtitle="Some-se à campanha" />}
          {tab === "perfil" && <ProfileScreen user={user} openAuth={() => setShowAuthModal(true)} />}
        </main>
      </div>
      <BottomNav tab={tab} setTab={setTab} />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={() => setTab("home")}
      />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function TopBar() {
  const [open, setOpen] = useState(false);
  const notifications = [
    { id: 1, title: "Nova proposta publicada", desc: "Confira a proposta em destaque desta semana.", time: "agora" },
    { id: 2, title: "Evento próximo", desc: "Encontro no bairro neste sábado às 10h.", time: "2h" },
    { id: 3, title: "Mensagem respondida", desc: "Sua sugestão foi respondida pela equipe.", time: "1d" },
  ];
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-5 pb-3 pt-5 backdrop-blur-xl bg-background/60 border-b border-border/40">
      <div className="flex items-center gap-2.5">
        <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-primary/30">
          <img src={candidatePhoto} alt="" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-[11px] leading-tight text-muted-foreground">Bem-vindo ao app de</p>
          <p className="text-sm font-bold leading-tight text-foreground">Bob Fllay</p>
        </div>
      </div>
      <div className="relative">
        <button
          aria-label="Notificações"
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-[var(--shadow-card)] transition hover:scale-105 active:scale-95"
        >
          <Bell className="h-4.5 w-4.5 text-foreground" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Notificações</p>
                <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Fechar</button>
              </div>
              <ul className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.map((n) => (
                  <li key={n.id} className="px-4 py-3 hover:bg-muted/40 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.desc}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="w-full px-4 py-2.5 text-xs font-medium text-primary hover:bg-muted/40 border-t border-border">
                Marcar todas como lidas
              </button>
            </motion.div>
          </>
        )}
      </div>
    </header>
  );
}
