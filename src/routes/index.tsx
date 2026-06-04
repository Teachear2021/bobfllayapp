import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }


  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[oklch(0.985_0.005_330)]">
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
    </div>
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
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-[var(--shadow-card)] active:scale-95 transition"
        >
          <Bell className="h-4.5 w-4.5 text-foreground" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-xl animate-[fade-in_150ms_ease-out] overflow-hidden">
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
            </div>
          </>
        )}
      </div>
    </header>
  );
}


function HomeScreen({ onNavigate, user, openAuth }: { onNavigate: (t: any) => void, user: any, openAuth: () => void }) {
  return (
    <div className="space-y-6">
      <HeaderCard />
      <StoriesRow />
      <UrnaCard />
      <CountdownBanner />
      
      <QuickTiles onNavigate={onNavigate} />
      <StatsRow />
      <BairroProof />
      <SectionHeader title="Próximo evento" actionLabel="Agenda" onAction={() => onNavigate("agenda")} />
      <EventCard />
      <SectionHeader title="Entregas do mandato" actionLabel="Ver todas" onAction={() => onNavigate("propostas")} />
      <DeliveriesCard />
      <SectionHeader title="Proposta em destaque" actionLabel="Ver todas" onAction={() => onNavigate("propostas")} />
      <ProposalCard />
      <MultiplierCard user={user} openAuth={openAuth} />
      <EndorsementsCard />
      <SupportInline user={user} />
      
      <footer className="mt-12 pb-8 text-center">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">
          © 2026 FCIA · Todos os direitos reservados
        </p>
      </footer>
    </div>

  );
}


function StoriesRow() {
  const items = [
    { label: "Hoje", color: "from-pink-500 to-rose-400" },
    { label: "Comício", color: "from-fuchsia-500 to-pink-500" },
    { label: "Bairros", color: "from-rose-400 to-orange-300" },
    { label: "Live", color: "from-pink-600 to-purple-500" },
    { label: "Bastidor", color: "from-pink-400 to-pink-200" },
  ];
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-3">
        {items.map((s) => (
          <button key={s.label} className="flex flex-col items-center gap-1 active:scale-95 transition">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${s.color} p-[2px]`}>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
                <img src={candidatePhoto} alt="" className="h-[58px] w-[58px] rounded-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] font-semibold text-foreground">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function UrnaCard() {
  const number = "13567";
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(number);
    setCopied(true);
    toast.success("Número copiado!");
    setTimeout(() => setCopied(false), 1600);
  };
  const share = () => {
    const text = `Meu voto é Bob Fllay — ${number}. Deputado Federal. Trabalho sério e presença real.`;
    if (navigator.share) navigator.share({ title: "Bob Fllay 13567", text }).catch(() => {});
    else {
      navigator.clipboard?.writeText(text);
      toast.success("Mensagem copiada para o WhatsApp!");
    }
  };
  return (
    <Reveal>
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="relative p-5 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest opacity-90">
            <Vote className="h-3 w-3" /> Seu voto na urna
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-[11px] opacity-90">Deputado Federal</p>
              <div className="mt-1 flex gap-1.5">
                {number.split("").map((d, i) => (
                  <span
                    key={i}
                    className="flex h-12 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur text-2xl font-extrabold tabular-nums ring-1 ring-white/30"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-[12px] opacity-95">Bob Fllay · PSD</p>
        </div>
        <div className="flex border-t border-border">
          <button onClick={copy} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-foreground transition active:scale-95">
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-primary" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
          <div className="w-px bg-border" />
          <button onClick={share} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-foreground transition active:scale-95">
            <Share2 className="h-4 w-4 text-primary" /> Compartilhar
          </button>
        </div>
      </section>
    </Reveal>
  );
}

function CountdownBanner() {
  const target = new Date("2026-10-04T08:00:00-03:00").getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const Box = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-base font-extrabold tabular-nums text-foreground">{String(v).padStart(2, "0")}</span>
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{l}</span>
    </div>
  );
  return (
    <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Faltam para a eleição</p>
        <p className="text-[11px] text-muted-foreground">Seu voto é 4 dígitos — 13567</p>
      </div>
      <div className="flex gap-2.5">
        <Box v={d} l="dias" />
        <Box v={h} l="hrs" />
        <Box v={m} l="min" />
        <Box v={s} l="seg" />
      </div>
    </div>
  );
}

function BairroProof() {
  return (
    <Reveal>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-foreground">+342 apoiadores no seu bairro</p>
          <p className="text-[11px] text-muted-foreground">Bairro União · atualizado hoje</p>
        </div>
        <button className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary">Ver mapa</button>
      </div>
    </Reveal>
  );
}

function DeliveriesCard() {
  const items = [
    { n: "R$ 42M", l: "em emendas" },
    { n: "87", l: "obras entregues" },
    { n: "23", l: "projetos aprovados" },
    { n: "112", l: "cidades atendidas" },
  ];
  return (
    <Reveal>
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Trophy className="h-4 w-4 text-primary" />
          <p className="text-[12px] font-bold text-foreground">O que já entreguei como Deputado Estadual</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-border">
          {items.map((i) => (
            <div key={i.l} className="p-4">
              <p className="text-lg font-extrabold tracking-tight text-foreground">{i.n}</p>
              <p className="text-[11px] text-muted-foreground">{i.l}</p>
            </div>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

function MultiplierCard({ user, openAuth }: { user: any, openAuth: () => void }) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const goal = 10;
  
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Fetch real referral count
      supabase
        .from("referrals")
        .select("id", { count: "exact" })
        .eq("referrer_id", user.id)
        .then(({ count: referralCount }) => {
          if (referralCount !== null) setCount(referralCount);
          setLoading(false);
        });
    } else {
      setCount(0);
    }
  }, [user]);

  const pct = Math.min(100, (count / goal) * 100);
  // Using user ID as a simple referral code, or could be a random string from profile
  const referralCode = user?.id?.slice(0, 8).toUpperCase() || "LOGAR";
  const link = `bobfllay.app/r/${referralCode}`;
  
  const share = () => {
    if (!user) {
      openAuth();
      return;
    }
    const text = `Vamos juntos eleger Bob Fllay 13567 para Deputado Federal! Confirme seu voto: https://${link}`;
    if (navigator.share) navigator.share({ title: "Bob Fllay 13567", text }).catch(() => {});
    else {
      navigator.clipboard?.writeText(text);
      toast.success("Link copiado!");
    }
  };

  return (
    <Reveal>
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            <Users className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Vire multiplicador</p>
            <h3 className="text-[15px] font-bold leading-snug text-foreground">Convide 10 amigos a votar</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Seu link pessoal de indicação</p>
          </div>
        </div>
        <div className="px-4">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-foreground">{loading ? "Carregando..." : `${count} de ${goal} confirmados`}</span>
            <span className="text-primary">{Math.round(pct)}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-border bg-secondary/40 px-4 py-2.5">
          <code className="flex-1 truncate text-[11px] text-muted-foreground">{user ? link : "Entre para gerar seu link"}</code>
          <button onClick={share} className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground active:scale-95">
            <Share2 className="h-3.5 w-3.5" /> {user ? "Compartilhar" : "Entrar"}
          </button>
        </div>
      </section>
    </Reveal>
  );
}


function EndorsementsCard() {
  const list = [
    { n: "Sindicato dos Professores", i: GraduationCap },
    { n: "Frente Saúde Já", i: Stethoscope },
    { n: "Prefeito de Vila Nova", i: Building2 },
    { n: "Coletivo Juventude+", i: Award },
  ];
  return (
    <Reveal>
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <p className="text-[12px] font-bold text-foreground">Quem caminha com a gente</p>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {list.map(({ n, i: Icon }) => (
            <div key={n} className="flex items-center gap-2 rounded-xl bg-secondary/50 p-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[11px] font-semibold leading-tight text-foreground">{n}</span>
            </div>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

function HeaderCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-card)]"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "var(--gradient-primary)",
          transform: `translateY(${y * -0.15}px) scale(1.1)`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
      <div className="relative flex items-center gap-4 p-5">
        <div className="relative">
          <img
            src={candidatePhoto}
            alt="Bob Fllay"
            className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/40 shadow-lg"
            style={{ transform: `translateY(${y * 0.05}px)` }}
          />
        </div>
        <div className="min-w-0 flex-1 text-primary-foreground">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-3 w-3" /> App oficial do candidato
          </div>
          <h1 className="mt-1.5 text-xl font-bold leading-tight">Bob Fllay</h1>
          <p className="text-[12px] opacity-90 leading-snug">
            Deputado Estadual · Candidato a Federal
          </p>
        </div>
      </div>
      <p className="relative px-5 pb-5 text-[13px] leading-relaxed text-primary-foreground/95">
        “Trabalho sério, presença real e compromisso com quem mais precisa.”
      </p>
    </section>
  );
}

function PrimaryAction() {
  return (
    <a
      href="#apoio"
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition active:scale-[0.98]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-primary-foreground shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-primary)" }}>
        <MessageCircle className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-foreground">Deixe sua mensagem</p>
        <p className="text-xs text-muted-foreground">Fale direto com a equipe do Bob</p>
      </div>
      <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function QuickTiles({ onNavigate }: { onNavigate: (t: any) => void }) {
  const tiles = [
    { icon: Calendar, label: "Agenda", tab: "agenda" as const },
    { icon: FileText, label: "Propostas", tab: "propostas" as const },
    { icon: Heart, label: "Apoie", tab: "apoie" as const },
    { icon: Users, label: "Voluntários", tab: "apoie" as const },
  ];
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {tiles.map(({ icon: Icon, label, tab }) => (
        <button
          key={label}
          onClick={() => onNavigate(tab)}
          className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] transition active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent transition group-hover:bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-[10.5px] font-semibold text-foreground">{label}</span>
        </button>
      ))}
    </div>
  );
}

function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <Stat target={148} label="Eventos" />
      <Stat target={32} label="Cidades" suffix="" />
      <Stat target={12400} label="Apoiadores" compact />
    </div>
  );
}

function Stat({ target, label, suffix = "", compact = false }: { target: number; label: string; suffix?: string; compact?: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  const display = compact && val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toLocaleString("pt-BR");
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-[var(--shadow-card)]">
      <p className="text-lg font-extrabold tracking-tight text-foreground">
        {display}{suffix}
      </p>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="flex items-center justify-between px-1 pt-2">
      <h2 className="text-[13px] font-bold tracking-tight text-foreground">{title}</h2>
      <button onClick={onAction} className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary">
        {actionLabel} <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function EventCard() {
  return (
    <Reveal>
      <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99] transition">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            <span className="text-[10px] font-semibold uppercase opacity-90">Hoje</span>
            <span className="text-xl font-extrabold leading-none">18:30</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Aberto ao público
            </span>
            <h3 className="mt-1.5 text-[15px] font-bold leading-snug text-foreground">
              Reunião com lideranças locais
            </h3>
            <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Hoje, 18h30 – 20h00
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Centro Comunitário · Bairro União
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProposalCard() {
  return (
    <Reveal>
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Saúde</p>
            <h3 className="text-[15px] font-bold leading-snug text-foreground">
              Saúde com mais acesso e estrutura
            </h3>
          </div>
        </div>
        <p className="px-4 pb-4 text-[13px] leading-relaxed text-muted-foreground">
          Ampliar UBSs, reduzir filas e levar atendimento de qualidade para quem mais precisa nos bairros.
        </p>
        <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-4 py-2.5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 text-primary" /> +6 propostas relacionadas
          </div>
          <button className="text-xs font-semibold text-primary">Ler mais</button>
        </div>
      </article>
    </Reveal>
  );
}

function SupportInline({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Mensagem enviada! Em breve nossa equipe entra em contato.");
      (e.target as HTMLFormElement).reset();
      setOpen(false);
    }, 600);
  };
  return (
    <section id="apoio" className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left text-primary-foreground transition active:scale-[0.99]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">Sou seu apoiador</span>
          </div>
          <h2 className="mt-0.5 text-lg font-bold leading-tight">Deixe sua mensagem</h2>
          <p className="text-xs opacity-95">Toque para {open ? "fechar" : "abrir"} o formulário</p>
        </div>
        <ChevronRight className={`h-5 w-5 transition ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <form onSubmit={handleSubmit} className="space-y-2.5 p-4 animate-[fade-in_200ms_ease-out]">
          <Field name="nome" placeholder="Seu nome completo" required defaultValue={user?.user_metadata?.full_name || ""} />
          <Field name="telefone" placeholder="Telefone (WhatsApp)" type="tel" required defaultValue={user?.phone || ""} />
          <textarea
            name="mensagem"
            rows={3}
            required
            placeholder="Escreva sua mensagem..."
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition active:scale-[0.98] disabled:opacity-70"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Send className="h-4 w-4" />
            {submitting ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>

      )}
    </section>
  );
}

function Field({ name, placeholder, type = "text", required, defaultValue }: { name: string; placeholder: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />

  );
}

function ProfileScreen({ user, openAuth }: { user: any, openAuth: () => void }) {
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Perfil</h1>
          <p className="text-sm text-muted-foreground">Sua conta e preferências</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <User className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Você ainda não entrou</h3>
          <p className="mt-1 text-sm text-muted-foreground">Entre com seu telefone para acompanhar suas indicações e receber novidades.</p>
          <button
            onClick={openAuth}
            className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Entrar no App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground">Olá, {profile?.full_name || "Apoiador"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground active:scale-95 transition"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Apoiador Confirmado</p>
            <p className="text-lg font-bold text-foreground">{profile?.full_name || "Completar cadastro..."}</p>
            <p className="text-sm text-muted-foreground">{profile?.phone}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <button className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-left active:scale-[0.99] transition">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-semibold">Minha agenda</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        <button className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-left active:scale-[0.99] transition">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <MessageCircle className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-semibold">Mensagens</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

function SimpleScreen({ title, subtitle }: { title: string; subtitle: string }) {

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
        Em breve nesta tela.
      </div>
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    setShown(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    const fallback = setTimeout(() => setShown(true), 400);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="transition-all duration-500 ease-out"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
      }}
    >
      {children}
    </div>
  );
}

function BottomNav({ tab, setTab }: { tab: string; setTab: (t: any) => void }) {
  const items = [
    { key: "home", icon: Home, label: "Início" },
    { key: "agenda", icon: Calendar, label: "Agenda" },
    { key: "propostas", icon: FileText, label: "Propostas" },
    { key: "apoie", icon: Heart, label: "Apoie" },
    { key: "perfil", icon: User, label: "Perfil" },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="flex items-center justify-around rounded-3xl border border-border/60 bg-card/85 px-2 py-2 shadow-[0_10px_30px_-12px_oklch(0.5_0.1_340_/_0.25)] backdrop-blur-xl">
          {items.map(({ key, icon: Icon, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 transition active:scale-95"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    active ? "text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"
                  }`}
                  style={active ? { background: "var(--gradient-primary)" } : undefined}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] ${active ? "font-bold text-primary" : "font-medium text-muted-foreground"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden">
      <div className="relative h-full w-full max-w-md mx-auto">
        <img 
          src={splashImg} 
          alt="Bob Fllay 13567" 
          className="h-full w-full object-cover animate-in fade-in zoom-in duration-1000 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-[shimmer_2s_infinite]" style={{ width: '40%' }}>
          <div className="h-full w-full bg-primary animate-[loading-progress_2.5s_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  );
}

