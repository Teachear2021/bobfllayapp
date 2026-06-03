import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import candidatePhoto from "@/assets/candidate.jpg";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bob Fllay — App oficial do candidato" },
      {
        name: "description",
        content:
          "Canal oficial do deputado estadual Bob Fllay: agenda, propostas, apoio e contato direto.",
      },
      { property: "og:title", content: "Bob Fllay — App oficial do candidato" },
      {
        property: "og:description",
        content: "Trabalho sério, presença real e compromisso com quem mais precisa.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Toaster position="top-center" />
      <main className="mx-auto max-w-md px-5 pt-6">
        <Hero />
        <TrustBlock />
        <QuickAccess />
        <Featured />
        <SupportForm />
      </main>
      <BottomNav />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-x-0 -top-6 -z-10 h-64 rounded-b-[3rem] bg-gradient-to-b from-accent to-transparent" />
      <div className="flex flex-col items-center text-center pt-2">
        <div className="relative">
          <div
            className="absolute inset-0 -m-1 rounded-full"
            style={{ background: "var(--gradient-primary)" }}
          />
          <img
            src={candidatePhoto}
            alt="Bob Fllay, candidato"
            width={128}
            height={128}
            className="relative h-32 w-32 rounded-full object-cover ring-4 ring-background"
          />
          <span className="absolute -bottom-1 right-0 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground shadow-md">
            <ShieldCheck className="h-3 w-3" />
            Oficial
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground">
          Bob Fllay
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Deputado Estadual · Candidato a Deputado Federal
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/80 max-w-sm">
          “Trabalho sério, presença real e compromisso com quem mais precisa.”
        </p>
        <div className="mt-6 flex w-full flex-col gap-3">
          <a
            href="#apoio"
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition active:scale-[0.98]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <MessageCircle className="h-5 w-5" />
            Deixe sua mensagem
          </a>
          <a
            href="#agenda"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-4 text-base font-semibold text-foreground transition hover:bg-secondary active:scale-[0.98]"
          >
            <Calendar className="h-5 w-5" />
            Ver agenda
          </a>
        </div>
      </div>
    </section>
  );
}

function TrustBlock() {
  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-accent p-2.5">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            App oficial do candidato
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Este é o canal oficial para acompanhar a agenda, conhecer as propostas,
            apoiar a campanha e falar diretamente com a equipe.
          </p>
        </div>
      </div>
    </section>
  );
}

function QuickAccess() {
  const cards = [
    {
      icon: Calendar,
      title: "Agenda",
      subtitle: "Encontros e eventos públicos",
      href: "#agenda",
    },
    {
      icon: FileText,
      title: "Propostas",
      subtitle: "O que vamos defender",
      href: "#propostas",
    },
    {
      icon: Heart,
      title: "Apoie",
      subtitle: "Some-se à campanha",
      href: "#apoio",
    },
  ];
  return (
    <section className="mt-8">
      <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Acesso rápido
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {cards.map(({ icon: Icon, title, subtitle, href }) => (
          <a
            key={title}
            href={href}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] transition active:scale-[0.97]"
          >
            <div className="rounded-xl bg-accent p-2 transition group-hover:bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                {subtitle}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Featured() {
  return (
    <section className="mt-10 space-y-6">
      <div id="agenda">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Próximo evento
          </h2>
          <a href="#agenda" className="text-xs font-semibold text-primary">
            Ver tudo
          </a>
        </div>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Hoje
            </span>
            <span className="text-xs text-muted-foreground">Aberto ao público</span>
          </div>
          <h3 className="mt-3 text-lg font-bold leading-snug text-foreground">
            Reunião com lideranças locais
          </h3>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Hoje, às 18h30
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Centro Comunitário · Bairro União
            </div>
          </div>
        </article>
      </div>

      <div id="propostas">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Propostas em destaque
          </h2>
          <a href="#propostas" className="text-xs font-semibold text-primary">
            Ver tudo
          </a>
        </div>
        <div className="space-y-3">
          <ProposalCard
            icon={Stethoscope}
            title="Saúde com mais acesso e estrutura"
            description="Ampliar UBSs, reduzir filas e levar atendimento de qualidade para quem mais precisa."
          />
          <ProposalCard
            icon={GraduationCap}
            title="Educação e oportunidades para jovens"
            description="Escolas em tempo integral, cursos técnicos e primeiro emprego com dignidade."
          />
        </div>
      </div>
    </section>
  );
}

function ProposalCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Heart;
  title: string;
  description: string;
}) {
  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="text-base font-semibold leading-snug text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
}

function SupportForm() {
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
    <section
      id="apoio"
      className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]"
    >
      <div
        className="px-5 py-5 text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
            Junte-se a nós
          </span>
        </div>
        <h2 className="mt-1 text-2xl font-bold">Sou seu apoiador</h2>
        <p className="mt-1 text-sm opacity-95">
          Conte com quem está ao seu lado. Mande um recado para o Bob.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 p-5">
        <Field label="Nome" name="nome" placeholder="Como podemos te chamar?" required />
        <Field label="Telefone" name="telefone" placeholder="(00) 00000-0000" type="tel" required />
        <Field label="Bairro" name="bairro" placeholder="Onde você mora?" required />
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground">
            Mensagem
          </label>
          <textarea
            name="mensagem"
            rows={3}
            required
            placeholder="Escreva sua mensagem ou sugestão..."
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition active:scale-[0.98] disabled:opacity-70"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Send className="h-5 w-5" />
          {submitting ? "Enviando..." : "Enviar mensagem"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Sua mensagem chega direto para a equipe.
        </p>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function BottomNav() {
  const items = [
    { icon: Home, label: "Início", href: "#", active: true },
    { icon: Calendar, label: "Agenda", href: "#agenda" },
    { icon: FileText, label: "Propostas", href: "#propostas" },
    { icon: Heart, label: "Apoie", href: "#apoio" },
    { icon: MessageCircle, label: "Contato", href: "#apoio" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map(({ icon: Icon, label, href, active }) => (
          <a
            key={label}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition ${
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
            <span className={`text-[10px] ${active ? "font-semibold" : "font-medium"}`}>
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
