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
} from "lucide-react";
import candidateAsset from "@/assets/candidate.png.asset.json";
const candidatePhoto = candidateAsset.url;
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bob Fllay — App oficial" },
      {
        name: "description",
        content:
          "App oficial do deputado Bob Fllay: agenda, propostas, apoio e contato direto.",
      },
    ],
  }),
  component: AppShell,
});

function AppShell() {
  const [tab, setTab] = useState<"home" | "agenda" | "propostas" | "apoie" | "perfil">("home");
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[oklch(0.985_0.005_330)]">
      <Toaster position="top-center" />
      {/* ambient pink wash */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,oklch(0.92_0.08_350)_0%,transparent_70%)]" />
      <div className="mx-auto max-w-md">
        <TopBar />
        <main key={tab} className="px-5 pb-32 pt-2 animate-[fade-in_220ms_ease-out]">
          {tab === "home" && <HomeScreen onNavigate={setTab} />}
          {tab === "agenda" && <SimpleScreen title="Agenda" subtitle="Próximos encontros e eventos" />}
          {tab === "propostas" && <SimpleScreen title="Propostas" subtitle="Tudo que vamos defender" />}
          {tab === "apoie" && <SimpleScreen title="Apoie" subtitle="Some-se à campanha" />}
          {tab === "perfil" && <SimpleScreen title="Perfil" subtitle="Sua conta e preferências" />}
        </main>
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function TopBar() {
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
      <button
        aria-label="Notificações"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-[var(--shadow-card)] active:scale-95 transition"
      >
        <Bell className="h-4.5 w-4.5 text-foreground" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
      </button>
    </header>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (t: any) => void }) {
  return (
    <div className="space-y-6">
      <HeaderCard />
      <PrimaryAction />
      <QuickTiles onNavigate={onNavigate} />
      <StatsRow />
      <SectionHeader title="Próximo evento" actionLabel="Agenda" onAction={() => onNavigate("agenda")} />
      <EventCard />
      <SectionHeader title="Proposta em destaque" actionLabel="Ver todas" onAction={() => onNavigate("propostas")} />
      <ProposalCard />
      <SupportInline />
    </div>
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

function SupportInline() {
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Mensagem enviada! Em breve nossa equipe entra em contato.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };
  return (
    <section id="apoio" className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="px-5 py-4 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">Sou seu apoiador</span>
        </div>
        <h2 className="mt-0.5 text-lg font-bold">Deixe sua mensagem</h2>
        <p className="text-xs opacity-95">Sua voz chega direto para o Bob.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2.5 p-4">
        <Field name="nome" placeholder="Seu nome" required />
        <Field name="telefone" placeholder="Telefone (WhatsApp)" type="tel" required />
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
    </section>
  );
}

function Field({ name, placeholder, type = "text", required }: { name: string; placeholder: string; type?: string; required?: boolean }) {
  return (
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
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
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
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
