import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Inbox,
  HandHeart,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Search,
  Bell,
  Star,
  Tag,
  Reply,
  Eye,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Filter,
  Plus,
  Edit3,
  MoreVertical,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Vote,
  Trophy,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Administrativo — Bob Fllay" },
      { name: "description", content: "Centro de operações da campanha." },
    ],
  }),
  component: AdminApp,
});

type Screen =
  | "dashboard"
  | "leads"
  | "mensagens"
  | "voluntarios"
  | "agenda"
  | "propostas"
  | "conteudo"
  | "analytics";

type LeadStatus = "novo" | "qualificado" | "apoiador" | "voluntario" | "lideranca";

const statusMeta: Record<LeadStatus, { label: string; tone: string }> = {
  novo: { label: "Novo", tone: "bg-primary/10 text-primary" },
  qualificado: { label: "Qualificado", tone: "bg-blue-500/10 text-blue-600" },
  apoiador: { label: "Apoiador", tone: "bg-emerald-500/10 text-emerald-600" },
  voluntario: { label: "Voluntário", tone: "bg-violet-500/10 text-violet-600" },
  lideranca: { label: "Liderança", tone: "bg-amber-500/10 text-amber-600" },
};

const LEADS = [
  { id: 1, name: "Mariana Souza", status: "novo" as LeadStatus, bairro: "Centro", source: "App", preview: "Quero ajudar na campanha do bairro.", date: "há 12min", important: true },
  { id: 2, name: "Carlos Mendes", status: "apoiador" as LeadStatus, bairro: "Jardim das Flores", source: "Instagram", preview: "Já compartilhei as propostas.", date: "há 1h", important: false },
  { id: 3, name: "Juliana Reis", status: "voluntario" as LeadStatus, bairro: "Vila Nova", source: "Evento", preview: "Disponível nos finais de semana.", date: "há 2h", important: true },
  { id: 4, name: "Pedro Lima", status: "qualificado" as LeadStatus, bairro: "São José", source: "App", preview: "Tenho contatos de lideranças.", date: "há 3h", important: false },
  { id: 5, name: "Ana Beatriz", status: "lideranca" as LeadStatus, bairro: "Centro", source: "WhatsApp", preview: "Posso mobilizar 40 pessoas.", date: "há 5h", important: true },
  { id: 6, name: "Roberto Alves", status: "novo" as LeadStatus, bairro: "Vila Nova", source: "App", preview: "Preciso falar sobre saúde no bairro.", date: "há 6h", important: false },
];

const MESSAGES = [
  { id: 1, name: "Mariana Souza", text: "Quero ajudar na campanha do bairro Centro.", time: "12min", unread: true, urgent: true },
  { id: 2, name: "Ana Beatriz", text: "Posso mobilizar 40 pessoas para o evento de sábado.", time: "1h", unread: true, urgent: true },
  { id: 3, name: "Juliana Reis", text: "Confirmando presença na reunião de hoje.", time: "2h", unread: true, urgent: false },
  { id: 4, name: "Carlos Mendes", text: "Compartilhei o vídeo nas redes.", time: "4h", unread: false, urgent: false },
  { id: 5, name: "Pedro Lima", text: "Enviei a lista de contatos por email.", time: "1d", unread: false, urgent: false },
];

const VOLUNTEERS = [
  { id: 1, name: "Juliana Reis", region: "Vila Nova", availability: "Finais de semana", active: true },
  { id: 2, name: "Ricardo Tavares", region: "Centro", availability: "Noites", active: true },
  { id: 3, name: "Patrícia Gomes", region: "São José", availability: "Integral", active: true },
  { id: 4, name: "Lucas Andrade", region: "Jardim das Flores", availability: "Manhãs", active: false },
];

const EVENTS = [
  { id: 1, title: "Reunião com lideranças locais", date: "Hoje", time: "18h30", location: "Centro Comunitário, Centro" },
  { id: 2, title: "Caminhada pelo bairro Vila Nova", date: "Amanhã", time: "09h00", location: "Praça da Matriz" },
  { id: 3, title: "Encontro com voluntários", date: "Sáb 07/06", time: "15h00", location: "Sede de campanha" },
];

const PROPOSALS = [
  { id: 1, title: "Saúde com mais acesso e estrutura", active: true },
  { id: 2, title: "Educação e oportunidades para jovens", active: true },
  { id: 3, title: "Segurança comunitária integrada", active: true },
  { id: 4, title: "Mobilidade urbana inteligente", active: false },
];

const ACTIVITY = [
  { id: 1, who: "Juliana Reis", what: "marcou como voluntária", time: "agora" },
  { id: 2, who: "Equipe", what: "respondeu mensagem de Ana Beatriz", time: "8min" },
  { id: 3, who: "Sistema", what: "novo lead em Centro", time: "12min" },
  { id: 4, who: "Carlos", what: "atualizou proposta de Saúde", time: "1h" },
  { id: 5, who: "Equipe", what: "agendou evento Sábado 15h", time: "2h" },
];

function useCounter(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setShow(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .5s ease, transform .5s ease",
      }}
    >
      {children}
    </div>
  );
}

function Chip({ label, value, tone = "primary" }: { label: string; value: number; tone?: "primary" | "amber" | "emerald" | "blue" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    blue: "bg-blue-500/10 text-blue-600",
  };
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-card border px-2.5 py-1 shadow-sm shrink-0">
      <span className={cn("h-1.5 w-1.5 rounded-full", tones[tone].replace("text-", "bg-").replace("/10", ""))} />
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <span className={cn("text-[11px] font-semibold rounded-full px-1.5 py-0.5", tones[tone])}>{value}</span>
    </div>
  );
}

function StatCard({ label, value, delta, icon: Icon }: { label: string; value: number; delta: string; icon: any }) {
  const n = useCounter(value);
  return (
    <div className="rounded-2xl bg-card border p-4 shadow-[var(--shadow-card)] active:scale-[0.99] transition">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-medium text-emerald-600 inline-flex items-center gap-0.5">
          <TrendingUp className="h-3 w-3" />
          {delta}
        </span>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums">{n.toLocaleString("pt-BR")}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="space-y-5">
      {/* Status chips */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip label="Leads novos" value={24} tone="primary" />
        <Chip label="Mensagens pendentes" value={9} tone="amber" />
        <Chip label="Voluntários ativos" value={183} tone="emerald" />
        <Chip label="Eventos agendados" value={6} tone="blue" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <Reveal><StatCard label="Total de leads" value={1248} delta="+12%" icon={Users} /></Reveal>
        <Reveal delay={60}><StatCard label="Mensagens hoje" value={87} delta="+8%" icon={Inbox} /></Reveal>
        <Reveal delay={120}><StatCard label="Voluntários" value={183} delta="+5%" icon={HandHeart} /></Reveal>
        <Reveal delay={180}><StatCard label="Apoiadores" value={12400} delta="+18%" icon={Star} /></Reveal>
      </div>

      {/* Activity */}
      <Reveal>
        <div className="rounded-2xl bg-card border p-4 shadow-[var(--shadow-card)]">
          <SectionHeader title="Atividade recente" />
          <ul className="space-y-3">
            {ACTIVITY.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 text-primary grid place-items-center text-[11px] font-semibold">
                  {a.who[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.what}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Quick jumps */}
      <Reveal>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate("leads")} className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.72_0.19_350)] text-primary-foreground p-4 text-left shadow-[var(--shadow-soft)] active:scale-[0.98] transition">
            <Users className="h-5 w-5 mb-6 opacity-90" />
            <div className="font-semibold">Gerenciar leads</div>
            <div className="text-xs opacity-90 mt-0.5">24 novos para revisar</div>
          </button>
          <button onClick={() => onNavigate("mensagens")} className="rounded-2xl bg-card border p-4 text-left shadow-[var(--shadow-card)] active:scale-[0.98] transition">
            <Inbox className="h-5 w-5 mb-6 text-primary" />
            <div className="font-semibold">Caixa de mensagens</div>
            <div className="text-xs text-muted-foreground mt-0.5">9 não lidas</div>
          </button>
        </div>
      </Reveal>
    </div>
  );
}

function LeadsScreen() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [bairro, setBairro] = useState<string>("all");

  const bairros = useMemo(() => ["all", ...Array.from(new Set(LEADS.map((l) => l.bairro)))], []);
  const filtered = LEADS.filter(
    (l) =>
      (status === "all" || l.status === status) &&
      (bairro === "all" || l.bairro === bairro) &&
      (query === "" || l.name.toLowerCase().includes(query.toLowerCase()) || l.preview.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card border p-3 shadow-[var(--shadow-card)] space-y-2">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou mensagem"
            className="w-full h-10 rounded-xl bg-muted/60 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(["all", "novo", "qualificado", "apoiador", "voluntario", "lideranca"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition",
                status === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground",
              )}
            >
              {s === "all" ? "Todos" : statusMeta[s as LeadStatus].label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {bairros.map((b) => (
            <button
              key={b}
              onClick={() => setBairro(b)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition inline-flex items-center gap-1",
                bairro === b ? "bg-foreground text-background border-foreground" : "bg-background border-border text-muted-foreground",
              )}
            >
              <MapPin className="h-3 w-3" />
              {b === "all" ? "Todos os bairros" : b}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((l) => (
          <Reveal key={l.id}>
            <div className={cn("rounded-2xl bg-card border p-3.5 shadow-[var(--shadow-card)] active:scale-[0.995] transition", l.important && "ring-1 ring-primary/30")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-semibold shrink-0">
                    {l.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{l.name}</p>
                      {l.important && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{l.preview}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={cn("text-[10px] font-medium rounded-full px-2 py-0.5", statusMeta[l.status].tone)}>
                        {statusMeta[l.status].label}
                      </span>
                      <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" />
                        {l.bairro}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{l.source}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">{l.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 mt-3 pt-3 border-t">
                <button onClick={() => toast.success(`Abrindo ${l.name}`)} className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-muted/60 py-1.5 text-xs font-medium active:scale-95 transition">
                  <Eye className="h-3.5 w-3.5" /> Ver
                </button>
                <button onClick={() => toast.success("Tag adicionada")} className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-muted/60 py-1.5 text-xs font-medium active:scale-95 transition">
                  <Tag className="h-3.5 w-3.5" /> Tag
                </button>
                <button onClick={() => toast.success("Resposta enviada")} className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary text-primary-foreground py-1.5 text-xs font-medium active:scale-95 transition">
                  <Reply className="h-3.5 w-3.5" /> Responder
                </button>
              </div>
            </div>
          </Reveal>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhum lead encontrado.</div>
        )}
      </div>
    </div>
  );
}

function MessagesScreen() {
  const [items, setItems] = useState(MESSAGES);
  const unread = items.filter((m) => m.unread).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-card border p-3 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-sm font-semibold">Caixa de entrada</p>
          <p className="text-xs text-muted-foreground">{unread} não lidas</p>
        </div>
        <button onClick={() => { setItems(items.map((i) => ({ ...i, unread: false }))); toast.success("Tudo marcado como lido"); }} className="text-xs font-medium text-primary px-3 py-1.5 rounded-full bg-primary/10 active:scale-95 transition">
          Marcar todas
        </button>
      </div>

      <div className="space-y-2">
        {items.map((m) => (
          <Reveal key={m.id}>
            <button
              onClick={() => { setItems(items.map((i) => (i.id === m.id ? { ...i, unread: false } : i))); toast.success(`Abrindo conversa com ${m.name}`); }}
              className={cn("w-full text-left rounded-2xl bg-card border p-3.5 shadow-[var(--shadow-card)] active:scale-[0.995] transition", m.urgent && "ring-1 ring-amber-500/30")}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-semibold">
                    {m.name[0]}
                  </div>
                  {m.unread && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm truncate", m.unread ? "font-semibold" : "font-medium text-muted-foreground")}>{m.name}</p>
                    {m.urgent && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 bg-amber-500/10 rounded-full px-1.5 py-0.5">
                        <AlertCircle className="h-2.5 w-2.5" /> Urgente
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className={cn("text-xs truncate mt-0.5", m.unread ? "text-foreground" : "text-muted-foreground")}>{m.text}</p>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function VolunteersScreen() {
  const [items, setItems] = useState(VOLUNTEERS);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-card border p-3 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-sm font-semibold">Voluntários</p>
          <p className="text-xs text-muted-foreground">{items.filter((v) => v.active).length} ativos de {items.length}</p>
        </div>
        <button onClick={() => toast.success("Novo voluntário")} className="inline-flex items-center gap-1 text-xs font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-full active:scale-95 transition">
          <Plus className="h-3.5 w-3.5" /> Adicionar
        </button>
      </div>

      {items.map((v) => (
        <Reveal key={v.id}>
          <div className="rounded-2xl bg-card border p-3.5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">
                {v.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{v.name}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{v.region}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{v.availability}</span>
                </div>
              </div>
              <button
                onClick={() => { setItems(items.map((x) => (x.id === v.id ? { ...x, active: !x.active } : x))); toast.success(v.active ? "Pausado" : "Ativado"); }}
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition active:scale-95",
                  v.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground",
                )}
              >
                {v.active ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                {v.active ? "Ativo" : "Inativo"}
              </button>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function AgendaScreen() {
  const [items, setItems] = useState(EVENTS.map((e) => ({ ...e })));
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState({ title: "", date: "", time: "", location: "" });

  const startNew = () => { setDraft({ title: "", date: "", time: "", location: "" }); setEditing("new"); };
  const startEdit = (e: typeof items[number]) => { setDraft({ title: e.title, date: e.date, time: e.time, location: e.location }); setEditing(e.id); };
  const save = () => {
    if (!draft.title.trim()) return toast.error("Título obrigatório");
    if (editing === "new") {
      setItems([{ id: Date.now(), ...draft }, ...items]);
      toast.success("Evento adicionado");
    } else if (typeof editing === "number") {
      setItems(items.map((x) => (x.id === editing ? { ...x, ...draft } : x)));
      toast.success("Evento atualizado");
    }
    setEditing(null);
  };
  const remove = (id: number) => { setItems(items.filter((x) => x.id !== id)); toast.success("Removido"); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-card border p-3 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-sm font-semibold">Agenda</p>
          <p className="text-xs text-muted-foreground">{items.length} eventos · sincroniza com a home</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center gap-1 text-xs font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-full active:scale-95 transition">
          <Plus className="h-3.5 w-3.5" /> Novo
        </button>
      </div>

      {editing !== null && (
        <EditorCard title={editing === "new" ? "Novo evento" : "Editar evento"} onCancel={() => setEditing(null)} onSave={save}>
          <Input label="Título" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} placeholder="Reunião com lideranças locais" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Data" value={draft.date} onChange={(v) => setDraft({ ...draft, date: v })} placeholder="Hoje · Sáb 07/06" />
            <Input label="Hora" value={draft.time} onChange={(v) => setDraft({ ...draft, time: v })} placeholder="18h30" />
          </div>
          <Input label="Local" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} placeholder="Centro Comunitário, Centro" />
        </EditorCard>
      )}

      {items.map((e) => (
        <Reveal key={e.id}>
          <div className="rounded-2xl bg-card border p-3.5 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 text-primary px-2.5 py-2 text-center shrink-0">
                <div className="text-[10px] font-medium uppercase">{e.date.split(" ")[0]}</div>
                <div className="text-sm font-bold leading-tight">{e.time}</div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">{e.title}</p>
                <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {e.location}
                </p>
              </div>
              <button onClick={() => startEdit(e)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted active:scale-95 transition">
                <Edit3 className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={() => remove(e.id)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 active:scale-95 transition">
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ProposalsScreen() {
  const [items, setItems] = useState(PROPOSALS.map((p) => ({ ...p, area: "Saúde", desc: "" })));
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState({ title: "", area: "", desc: "", active: true });

  const startNew = () => { setDraft({ title: "", area: "", desc: "", active: true }); setEditing("new"); };
  const startEdit = (p: typeof items[number]) => { setDraft({ title: p.title, area: p.area, desc: p.desc, active: p.active }); setEditing(p.id); };
  const save = () => {
    if (!draft.title.trim()) return toast.error("Título obrigatório");
    if (editing === "new") setItems([{ id: Date.now(), ...draft }, ...items]);
    else if (typeof editing === "number") setItems(items.map((x) => (x.id === editing ? { ...x, ...draft } : x)));
    toast.success("Salvo");
    setEditing(null);
  };
  const remove = (id: number) => { setItems(items.filter((x) => x.id !== id)); toast.success("Removida"); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-card border p-3 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-sm font-semibold">Propostas</p>
          <p className="text-xs text-muted-foreground">{items.filter((p) => p.active).length} ativas</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center gap-1 text-xs font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-full active:scale-95 transition">
          <Plus className="h-3.5 w-3.5" /> Nova
        </button>
      </div>

      {editing !== null && (
        <EditorCard title={editing === "new" ? "Nova proposta" : "Editar proposta"} onCancel={() => setEditing(null)} onSave={save}>
          <Input label="Título" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} placeholder="Saúde com mais acesso e estrutura" />
          <Input label="Área" value={draft.area} onChange={(v) => setDraft({ ...draft, area: v })} placeholder="Saúde · Educação · Segurança" />
          <Textarea label="Descrição" value={draft.desc} onChange={(v) => setDraft({ ...draft, desc: v })} placeholder="Detalhe a proposta..." />
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
            Visível no app
          </label>
        </EditorCard>
      )}

      {items.map((p) => (
        <Reveal key={p.id}>
          <div className="rounded-2xl bg-card border p-3.5 shadow-[var(--shadow-card)] flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.title}</p>
              <p className="text-[10px] text-muted-foreground">{p.area}</p>
            </div>
            <button
              onClick={() => { setItems(items.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x))); }}
              className={cn("relative h-6 w-11 rounded-full transition shrink-0", p.active ? "bg-primary" : "bg-muted")}
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", p.active ? "left-[22px]" : "left-0.5")} />
            </button>
            <button onClick={() => startEdit(p)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted active:scale-95 transition shrink-0">
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={() => remove(p.id)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 active:scale-95 transition shrink-0">
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

// ===== Reusable form primitives =====
function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full h-10 rounded-xl bg-background border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
    </label>
  );
}
function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="mt-1 w-full rounded-xl bg-background border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
    </label>
  );
}
function EditorCard({ title, children, onCancel, onSave }: { title: string; children: React.ReactNode; onCancel: () => void; onSave: () => void }) {
  return (
    <div className="rounded-2xl bg-card border border-primary/30 p-4 shadow-[var(--shadow-card)] space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <button onClick={onCancel} className="h-7 w-7 grid place-items-center rounded-lg hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2.5">{children}</div>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 h-9 rounded-xl border text-xs font-medium">Cancelar</button>
        <button onClick={onSave} className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center justify-center gap-1">
          <Save className="h-3.5 w-3.5" /> Salvar
        </button>
      </div>
    </div>
  );
}

// ===== Content screen: edits everything that appears on the home =====
function Accordion({ icon: Icon, title, subtitle, defaultOpen = false, children }: { icon: any; title: string; subtitle?: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl bg-card border shadow-[var(--shadow-card)] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-3.5 text-left active:scale-[0.995] transition">
        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>}
        </div>
        <MoreVertical className={cn("h-4 w-4 text-muted-foreground transition", open && "rotate-90")} />
      </button>
      {open && <div className="border-t bg-muted/20 p-3.5 space-y-3">{children}</div>}
    </div>
  );
}

function ContentScreen() {
  const [id, setId] = useState({ nome: "Bob Fllay", cargo: "Deputado Estadual · Candidato a Federal", partido: "PSD", urna: "13567", frase: "Trabalho sério, presença real e compromisso com quem mais precisa." });
  const [deliveries, setDeliveries] = useState([
    { id: 1, n: "R$ 42M", l: "em emendas" },
    { id: 2, n: "87", l: "obras entregues" },
    { id: 3, n: "23", l: "projetos aprovados" },
    { id: 4, n: "112", l: "cidades atendidas" },
  ]);
  const [endorsements, setEndorsements] = useState([
    { id: 1, n: "Sindicato dos Professores" },
    { id: 2, n: "Frente Saúde Já" },
    { id: 3, n: "Prefeito de Vila Nova" },
    { id: 4, n: "Coletivo Juventude+" },
  ]);
  const [stories, setStories] = useState([
    { id: 1, label: "Hoje" }, { id: 2, label: "Comício" }, { id: 3, label: "Bairros" }, { id: 4, label: "Live" }, { id: 5, label: "Bastidor" },
  ]);
  const [bairros, setBairros] = useState([
    { id: 1, nome: "Centro", apoiadores: 412 },
    { id: 2, nome: "Vila Nova", apoiadores: 342 },
    { id: 3, nome: "Jardim das Flores", apoiadores: 188 },
    { id: 4, nome: "São José", apoiadores: 95 },
  ]);
  const multipliers = [
    { id: 1, name: "Maria L.", votos: 12 },
    { id: 2, name: "João P.", votos: 9 },
    { id: 3, name: "Ana B.", votos: 7 },
    { id: 4, name: "Carlos M.", votos: 5 },
  ];

  return (
    <div className="space-y-3">
      <Accordion icon={ShieldCheck} title="Identidade da candidatura" subtitle={`${id.nome} · ${id.partido} · ${id.urna}`} defaultOpen>
        <Input label="Nome" value={id.nome} onChange={(v) => setId({ ...id, nome: v })} />
        <Input label="Cargo" value={id.cargo} onChange={(v) => setId({ ...id, cargo: v })} />
        <div className="grid grid-cols-2 gap-2">
          <Input label="Partido" value={id.partido} onChange={(v) => setId({ ...id, partido: v })} />
          <Input label="Número de urna" value={id.urna} onChange={(v) => setId({ ...id, urna: v.replace(/\D/g, "").slice(0, 5) })} />
        </div>
        <Textarea label="Frase de campanha" value={id.frase} onChange={(v) => setId({ ...id, frase: v })} />
        <button className="h-10 w-full rounded-xl border inline-flex items-center justify-center gap-2 text-xs font-medium">
          <ImageIcon className="h-4 w-4" /> Trocar foto de perfil
        </button>
        <button onClick={() => toast.success("Identidade salva")} className="h-10 w-full rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center justify-center gap-1">
          <Save className="h-3.5 w-3.5" /> Salvar
        </button>
      </Accordion>

      <Accordion icon={Trophy} title="Entregas do mandato" subtitle={`${deliveries.length} cards no app`}>
        {deliveries.map((d, i) => (
          <div key={d.id} className="rounded-xl bg-card border p-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Input label="Número" value={d.n} onChange={(v) => setDeliveries(deliveries.map((x, j) => j === i ? { ...x, n: v } : x))} />
              </div>
              <div className="col-span-2">
                <Input label="Descrição" value={d.l} onChange={(v) => setDeliveries(deliveries.map((x, j) => j === i ? { ...x, l: v } : x))} />
              </div>
            </div>
            <button onClick={() => setDeliveries(deliveries.filter((x) => x.id !== d.id))} className="text-[11px] text-destructive inline-flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Remover
            </button>
          </div>
        ))}
        <button onClick={() => setDeliveries([...deliveries, { id: Date.now(), n: "", l: "" }])} className="h-10 w-full rounded-xl border-2 border-dashed text-xs font-medium inline-flex items-center justify-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Adicionar entrega
        </button>
      </Accordion>

      <Accordion icon={Star} title="Apoios institucionais" subtitle={`${endorsements.length} apoios`}>
        {endorsements.map((e, i) => (
          <div key={e.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <Input label={`Apoio ${i + 1}`} value={e.n} onChange={(v) => setEndorsements(endorsements.map((x, j) => j === i ? { ...x, n: v } : x))} />
            </div>
            <button onClick={() => setEndorsements(endorsements.filter((x) => x.id !== e.id))} className="h-10 w-10 grid place-items-center rounded-xl hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        ))}
        <button onClick={() => setEndorsements([...endorsements, { id: Date.now(), n: "" }])} className="h-10 w-full rounded-xl border-2 border-dashed text-xs font-medium inline-flex items-center justify-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Adicionar apoio
        </button>
      </Accordion>

      <Accordion icon={ImageIcon} title="Stories do topo" subtitle={`${stories.length} destaques`}>
        {stories.map((s, i) => (
          <div key={s.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <Input label={`Story ${i + 1}`} value={s.label} onChange={(v) => setStories(stories.map((x, j) => j === i ? { ...x, label: v } : x))} placeholder="Hoje · Live · Bastidor" />
            </div>
            <button className="h-10 w-10 grid place-items-center rounded-xl border" title="Trocar imagem">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={() => setStories(stories.filter((x) => x.id !== s.id))} className="h-10 w-10 grid place-items-center rounded-xl hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        ))}
        <button onClick={() => setStories([...stories, { id: Date.now(), label: "" }])} className="h-10 w-full rounded-xl border-2 border-dashed text-xs font-medium inline-flex items-center justify-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Adicionar story
        </button>
      </Accordion>

      <Accordion icon={MapPin} title="Apoiadores por bairro" subtitle={`${bairros.length} bairros mapeados`}>
        {bairros.map((b, i) => (
          <div key={b.id} className="grid grid-cols-[1fr_100px_auto] gap-2 items-end">
            <Input label="Bairro" value={b.nome} onChange={(v) => setBairros(bairros.map((x, j) => j === i ? { ...x, nome: v } : x))} />
            <Input label="Apoiadores" type="number" value={String(b.apoiadores)} onChange={(v) => setBairros(bairros.map((x, j) => j === i ? { ...x, apoiadores: Number(v) || 0 } : x))} />
            <button onClick={() => setBairros(bairros.filter((x) => x.id !== b.id))} className="h-10 w-10 grid place-items-center rounded-xl hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        ))}
        <button onClick={() => setBairros([...bairros, { id: Date.now(), nome: "", apoiadores: 0 }])} className="h-10 w-full rounded-xl border-2 border-dashed text-xs font-medium inline-flex items-center justify-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Adicionar bairro
        </button>
      </Accordion>

      <Accordion icon={Share2} title="Multiplicadores (ranking)" subtitle="Apoiadores que mais indicaram votos">
        <div className="space-y-2">
          {multipliers.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl bg-card border p-2.5">
              <div className={cn("h-7 w-7 rounded-full grid place-items-center text-xs font-bold", i === 0 ? "bg-amber-500/15 text-amber-600" : "bg-muted text-muted-foreground")}>
                {i + 1}
              </div>
              <p className="text-sm font-medium flex-1">{m.name}</p>
              <span className="text-xs font-semibold text-primary">{m.votos} votos</span>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion icon={Vote} title="Contagem regressiva" subtitle="Data da eleição">
        <Input label="Data da eleição (ISO)" value="2026-10-04T08:00:00-03:00" onChange={() => {}} />
        <p className="text-[11px] text-muted-foreground">Atualizado em tempo real na home.</p>
      </Accordion>
    </div>
  );
}

function GenericScreen({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-card border p-8 shadow-[var(--shadow-card)] text-center">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

function GenericScreen({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-card border p-8 shadow-[var(--shadow-card)] text-center">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

const NAV: { id: Screen; label: string; icon: any }[] = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "mensagens", label: "Inbox", icon: Inbox },
  { id: "voluntarios", label: "Voluntários", icon: HandHeart },
  { id: "agenda", label: "Agenda", icon: Calendar },
];

const TITLES: Record<Screen, string> = {
  dashboard: "Painel Administrativo",
  leads: "Leads",
  mensagens: "Mensagens",
  voluntarios: "Voluntários",
  agenda: "Agenda",
  propostas: "Propostas",
  conteudo: "Conteúdo",
  analytics: "Analytics",
};

function AdminApp() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.99_0.01_340)] to-background relative">
      <Toaster position="top-center" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-60"
        style={{ background: "radial-gradient(60% 60% at 50% 0%, oklch(0.92 0.08 350 / 0.5), transparent 70%)" }}
      />

      <div className="relative max-w-md mx-auto px-4 pt-4 pb-32">
        {/* Header */}
        <header className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-background/70 backdrop-blur-xl border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">Admin</p>
              <h1 className="text-base font-bold tracking-tight">{TITLES[screen]}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-9 w-9 grid place-items-center rounded-full bg-card border shadow-sm active:scale-95 transition">
                <Filter className="h-4 w-4" />
              </button>
              <button className="relative h-9 w-9 grid place-items-center rounded-full bg-card border shadow-sm active:scale-95 transition">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mt-5">
          {screen === "dashboard" && <Dashboard onNavigate={setScreen} />}
          {screen === "leads" && <LeadsScreen />}
          {screen === "mensagens" && <MessagesScreen />}
          {screen === "voluntarios" && <VolunteersScreen />}
          {screen === "agenda" && <AgendaScreen />}
          {screen === "propostas" && <ProposalsScreen />}
          {screen === "conteudo" && <GenericScreen icon={Settings} title="Conteúdo do app" desc="Edite textos, fotos e banners." />}
          {screen === "analytics" && <GenericScreen icon={BarChart3} title="Analytics" desc="Métricas de campanha em breve." />}
        </main>
      </div>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 inset-x-0 z-30 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-md mx-auto px-4 pb-3">
          <div className="rounded-2xl bg-card/90 backdrop-blur-xl border shadow-[0_10px_30px_-12px_oklch(0.5_0.1_340/0.25)] p-1.5 flex items-center justify-between">
            {NAV.map((n) => {
              const active = screen === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setScreen(n.id)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition active:scale-95",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                >
                  <n.icon className={cn("h-[18px] w-[18px]", active && "stroke-[2.5]")} />
                  <span className="text-[10px] font-medium">{n.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {(["propostas", "conteudo", "analytics"] as Screen[]).map((s) => (
              <button
                key={s}
                onClick={() => setScreen(s)}
                className={cn(
                  "text-[10px] font-medium px-2.5 py-1 rounded-full border transition",
                  screen === s ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border",
                )}
              >
                {TITLES[s]}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
