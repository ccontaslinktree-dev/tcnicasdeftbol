import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowUp,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  KeyRound,
  Loader2,
  Mail,
  MessageCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Ticket,
  Undo2,
  Unlock,
  UserRound,
} from "lucide-react";
import {
  ARTICLES,
  CATEGORIES,
  STATUS_LABEL,
  TICKET_TOPICS,
  searchArticles,
  type HelpArticle,
} from "@/lib/support/knowledge";
import {
  clearChatHistory,
  createTicket,
  listMyTickets,
  loadChatHistory,
  lookupTicket,
} from "@/lib/support/support.functions";

export const Route = createFileRoute("/soporte")({
  head: () => ({
    meta: [
      { title: "Centro de Ayuda | 2000 Ejercicios de Fútbol" },
      {
        name: "description",
        content:
          "Resuelve dudas sobre acceso, correo de entrega, pagos y reembolsos de 2000 Ejercicios de Fútbol, o habla con el equipo.",
      },
      { property: "og:title", content: "Centro de Ayuda | 2000 Ejercicios de Fútbol" },
      {
        property: "og:description",
        content: "Preguntas frecuentes, asistente con IA y tickets de soporte en español.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: SupportPage,
});

type TicketRow = { reference: string; topic: string; status: string; created_at: string };

const CAT_ICONS: Record<string, typeof Unlock> = {
  acceso: Unlock,
  email: Mail,
  login: KeyRound,
  material: BookOpen,
  dispositivos: Smartphone,
  pagos: CreditCard,
  reembolsos: Undo2,
  contacto: UserRound,
};

const QUICK_ACTIONS = [
  "No recibí el correo de acceso",
  "Pagué y no tengo acceso",
  "Olvidé mi contraseña",
  "Quiero pedir un reembolso",
];

function useClientToken() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    let t = localStorage.getItem("soporte_token");
    if (!t) {
      t = crypto.randomUUID();
      localStorage.setItem("soporte_token", t);
    }
    setToken(t);
  }, []);
  return token;
}

function SupportPage() {
  const token = useClientToken();
  const [tab, setTab] = useState<"ayuda" | "chat" | "equipo">("ayuda");
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const askAssistant = (q: string) => {
    setPendingQuestion(q);
    setTab("chat");
    document.getElementById("panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="support-theme support-pitch min-h-screen">
      <a
        href="#panel"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2" aria-label="Volver a la página principal">
          <BallMark />
          <span className="font-display text-lg font-bold uppercase leading-none">
            2000 Ejercicios <span className="text-primary">de Fútbol</span>
          </span>
        </a>
        <span className="hidden items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden /> Centro de ayuda
        </span>
      </header>

      <section className="mx-auto max-w-5xl px-4 pb-6 pt-4 sm:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Soporte al cliente</p>
        <h1 className="font-display mt-2 text-4xl font-extrabold uppercase leading-[0.95] sm:text-6xl">
          ¿En qué te ayudamos hoy?
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Busca una respuesta, pregúntale al asistente o abre un ticket con el equipo. Todo en un solo lugar.
        </p>
      </section>

      <nav
        id="panel"
        aria-label="Secciones de soporte"
        className="sticky top-0 z-20 border-y border-border bg-background/85 backdrop-blur"
      >
        <div className="mx-auto flex max-w-5xl gap-1 px-2 py-2 sm:px-4" role="tablist">
          {(
            [
              ["ayuda", "Preguntas", BookOpen],
              ["chat", "Asistente", MessageCircle],
              ["equipo", "Hablar con el equipo", Ticket],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                tab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {tab === "ayuda" && <HelpCenter onAsk={askAssistant} onTeam={() => setTab("equipo")} />}
        {tab === "chat" &&
          (token ? (
            <ChatPanel
              token={token}
              initialQuestion={pendingQuestion}
              onConsumed={() => setPendingQuestion(null)}
              onTeam={() => setTab("equipo")}
            />
          ) : (
            <Loading />
          ))}
        {tab === "equipo" && (token ? <TeamPanel token={token} /> : <Loading />)}
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs text-muted-foreground">
        Las compras y accesos se gestionan a través de Hotmart. Nunca te pediremos tu contraseña ni datos de tarjeta.
      </footer>
    </div>
  );
}

function BallMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
      <circle cx="16" cy="16" r="14" className="fill-primary" />
      <path
        d="M16 9l5 3.6-1.9 5.9h-6.2L11 12.6zM16 2v7M21 12.6l7-2.3M19.1 18.5l4.3 6M12.9 18.5l-4.3 6M11 12.6l-7-2.3"
        className="stroke-primary-foreground"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground" role="status">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden /> Cargando…
    </div>
  );
}

/* ---------------- Help center ---------------- */

function HelpCenter({ onAsk, onTeam }: { onAsk: (q: string) => void; onTeam: () => void }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    if (query.trim()) return searchArticles(query, 10);
    return cat ? ARTICLES.filter((a) => a.category === cat) : ARTICLES;
  }, [query, cat]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <label htmlFor="faq-search" className="sr-only">Buscar en preguntas frecuentes</label>
        <input
          id="faq-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej.: no me llegó el correo"
          className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {!query && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICONS[c.id] ?? BookOpen;
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCat(active ? null : c.id)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-semibold transition ${
                  active ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span className="leading-tight">{c.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="font-semibold">No encontramos un artículo para “{query}”.</p>
            <p className="mt-1 text-sm text-muted-foreground">Pregúntale al asistente o abre un ticket.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button onClick={() => onAsk(query)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Preguntar al asistente
              </button>
              <button onClick={onTeam} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">
                Hablar con el equipo
              </button>
            </div>
          </div>
        ) : (
          list.map((a) => (
            <ArticleItem key={a.id} article={a} open={open === a.id} onToggle={() => setOpen(open === a.id ? null : a.id)} onAsk={onAsk} />
          ))
        )}
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  open,
  onToggle,
  onAsk,
}: {
  article: HelpArticle;
  open: boolean;
  onToggle: () => void;
  onAsk: (q: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-4 text-left font-semibold"
      >
        {article.title}
        <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
          <p>{article.body}</p>
          <button
            onClick={() => onAsk(article.title)}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> ¿Sigues con dudas? Pregunta al asistente
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Chat ---------------- */

function ChatPanel({
  token,
  initialQuestion,
  onConsumed,
  onTeam,
}: {
  token: string;
  initialQuestion: string | null;
  onConsumed: () => void;
  onTeam: () => void;
}) {
  const loadFn = useServerFn(loadChatHistory);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadFn({ data: { token } })
      .then((r) => setInitial(r.messages as UIMessage[]))
      .catch(() => {
        setLoadError(true);
        setInitial([]);
      });
  }, [token, loadFn]);

  if (!initial) return <Loading />;
  return (
    <ChatWindow
      token={token}
      initial={initial}
      loadError={loadError}
      initialQuestion={initialQuestion}
      onConsumed={onConsumed}
      onTeam={onTeam}
    />
  );
}

function ChatWindow({
  token,
  initial,
  loadError,
  initialQuestion,
  onConsumed,
  onTeam,
}: {
  token: string;
  initial: UIMessage[];
  loadError: boolean;
  initialQuestion: string | null;
  onConsumed: () => void;
  onTeam: () => void;
}) {
  const clearFn = useServerFn(clearChatHistory);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/support-chat", body: { token } }),
    [token],
  );
  const { messages, sendMessage, status, error, setMessages, stop } = useChat({
    id: `soporte-${token}`,
    messages: initial,
    transport,
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (initialQuestion) {
      sendMessage({ text: initialQuestion });
      onConsumed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    if (status === "ready") textareaRef.current?.focus();
  }, [messages, status]);

  const lastUserText = [...messages].reverse().find((m) => m.role === "user");
  const suggestions = lastUserText
    ? searchArticles(lastUserText.parts.map((p) => (p.type === "text" ? p.text : "")).join(" "), 2)
    : [];

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  const errorText = (() => {
    if (!error) return null;
    try {
      return JSON.parse(error.message).error as string;
    } catch {
      return error.message || "No pude responder ahora.";
    }
  })();

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
            <BallMark />
          </div>
          <div>
            <p className="font-display text-lg font-bold uppercase leading-none">Capitán</p>
            <p className="text-xs text-muted-foreground">Asistente con IA · puede equivocarse</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={async () => {
              stop();
              setMessages([]);
              await clearFn({ data: { token } }).catch(() => {});
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Nueva
          </button>
        )}
      </div>

      <div className="min-h-[340px] space-y-4 p-4 sm:max-h-[60vh] sm:overflow-y-auto" aria-live="polite">
        {loadError && (
          <p className="text-xs text-muted-foreground">No pudimos recuperar tu conversación anterior.</p>
        )}
        {messages.length === 0 && (
          <div className="py-6 text-center">
            <p className="font-semibold">Hola, soy Capitán. ¿Qué necesitas resolver?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No tengo acceso a tu cuenta ni a tus pagos, pero te guío paso a paso.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage({ text: q })}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            {m.role === "user" ? (
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
              </div>
            ) : (
              <div className="prose prose-sm prose-invert max-w-[92%] text-sm leading-relaxed text-foreground [&_a]:text-primary [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5">
                {m.parts.map((p, i) => (p.type === "text" ? <ReactMarkdown key={i}>{p.text}</ReactMarkdown> : null))}
              </div>
            )}
          </div>
        ))}
        {status === "submitted" && (
          <div className="flex items-center gap-1.5 text-muted-foreground" role="status" aria-label="El asistente está escribiendo">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
          </div>
        )}
        {errorText && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm" role="alert">
            {errorText}{" "}
            <button onClick={onTeam} className="font-semibold text-primary underline">
              Hablar con el equipo
            </button>
          </div>
        )}
        {status === "ready" && suggestions.length > 0 && (
          <div className="rounded-xl border border-border bg-secondary/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Artículos relacionados</p>
            <ul className="mt-2 space-y-1">
              {suggestions.map((a) => (
                <li key={a.id}>
                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-primary">{a.title}</summary>
                    <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                  </details>
                </li>
              ))}
            </ul>
            <button onClick={onTeam} className="mt-3 text-xs font-semibold text-foreground underline">
              ¿No se resolvió? Abre un ticket
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex items-end gap-2 border-t border-border p-3">
        <label htmlFor="chat-input" className="sr-only">Escribe tu mensaje</label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          autoFocus
          rows={1}
          maxLength={1500}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Escribe tu pregunta…"
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={!input.trim() || busy}
          aria-label="Enviar"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <ArrowUp className="h-5 w-5" aria-hidden />}
        </button>
      </form>
    </div>
  );
}

/* ---------------- Tickets ---------------- */

function TeamPanel({ token }: { token: string }) {
  const createFn = useServerFn(createTicket);
  const listFn = useServerFn(listMyTickets);
  const lookupFn = useServerFn(lookupTicket);
  const [form, setForm] = useState({ name: "", email: "", topic: TICKET_TOPICS[0] as string, description: "" });
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<TicketRow | null>(null);
  const [tickets, setTickets] = useState<TicketRow[] | null>(null);
  const [lookup, setLookup] = useState({ reference: "", email: "" });
  const [lookupResult, setLookupResult] = useState<TicketRow | null | "none">(null);
  const [lookingUp, setLookingUp] = useState(false);

  const refresh = () => listFn({ data: { token } }).then(setTickets).catch(() => setTickets([]));
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (form.name.trim().length < 2) return setFormError("Escribe tu nombre.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setFormError("Escribe un email válido.");
    if (form.description.trim().length < 10) return setFormError("Cuéntanos un poco más (mínimo 10 caracteres).");
    setSending(true);
    try {
      const row = await createFn({ data: { token, ...form, topic: form.topic as (typeof TICKET_TOPICS)[number] } });
      setCreated(row);
      setForm({ name: form.name, email: form.email, topic: TICKET_TOPICS[0], description: "" });
      refresh();
    } catch (err) {
      setFormError(err instanceof Error && err.message.length < 200 ? err.message : "No se pudo crear el ticket.");
    } finally {
      setSending(false);
    }
  };

  const field =
    "w-full rounded-xl border border-input bg-background px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6" aria-labelledby="ticket-title">
        {created ? (
          <div className="py-6 text-center" role="status">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden />
            <h2 className="font-display mt-3 text-2xl font-bold uppercase">Ticket creado</h2>
            <p className="mt-2 text-sm text-muted-foreground">Guarda tu número de referencia:</p>
            <p className="font-display mt-2 text-3xl font-extrabold tracking-wider text-primary">{created.reference}</p>
            <p className="mt-2 text-sm">
              Estado: <strong>{STATUS_LABEL[created.status] ?? created.status}</strong>
            </p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              El equipo revisará tu caso y te escribirá al email que indicaste.
            </p>
            <button onClick={() => setCreated(null)} className="mt-5 rounded-lg border border-border px-4 py-2 text-sm font-semibold">
              Crear otro ticket
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <h2 id="ticket-title" className="font-display text-2xl font-bold uppercase">Hablar con el equipo</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Usa el mismo email de tu compra para que podamos ubicar tu caso.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="t-name" className="mb-1 block text-sm font-medium">Nombre</label>
                <input id="t-name" autoComplete="name" maxLength={80} className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="t-email" className="mb-1 block text-sm font-medium">Email de la compra</label>
                <input id="t-email" type="email" autoComplete="email" maxLength={160} className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label htmlFor="t-topic" className="mb-1 block text-sm font-medium">Tema</label>
              <select id="t-topic" className={field} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                {TICKET_TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="t-desc" className="mb-1 block text-sm font-medium">¿Qué pasó?</label>
              <textarea
                id="t-desc"
                rows={5}
                maxLength={2000}
                className={field}
                placeholder="Describe el problema, el método de pago y el dispositivo que usas."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <p className="mt-1 text-xs text-muted-foreground">No incluyas contraseñas ni datos de tarjeta.</p>
            </div>
            {formError && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm" role="alert">{formError}</p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Ticket className="h-5 w-5" aria-hidden />}
              Enviar ticket
            </button>
          </form>
        )}
      </section>

      <aside className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5" aria-labelledby="my-tickets">
          <h2 id="my-tickets" className="font-display text-xl font-bold uppercase">Mis tickets</h2>
          <p className="text-xs text-muted-foreground">Creados desde este dispositivo.</p>
          <div className="mt-3 space-y-2">
            {tickets === null ? (
              <Loading />
            ) : tickets.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Todavía no tienes tickets.
              </p>
            ) : (
              tickets.map((t) => <TicketCard key={t.reference} t={t} />)
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5" aria-labelledby="lookup">
          <h2 id="lookup" className="font-display text-xl font-bold uppercase">Consultar un ticket</h2>
          <form
            className="mt-3 space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setLookingUp(true);
              try {
                const r = await lookupFn({ data: lookup });
                setLookupResult(r ?? "none");
              } catch {
                setLookupResult("none");
              } finally {
                setLookingUp(false);
              }
            }}
          >
            <label htmlFor="l-ref" className="sr-only">Referencia</label>
            <input id="l-ref" placeholder="SOP-XXXXXX" className={field} value={lookup.reference} onChange={(e) => setLookup({ ...lookup, reference: e.target.value })} />
            <label htmlFor="l-email" className="sr-only">Email</label>
            <input id="l-email" type="email" placeholder="Email del ticket" className={field} value={lookup.email} onChange={(e) => setLookup({ ...lookup, email: e.target.value })} />
            <button disabled={lookingUp} className="h-11 w-full rounded-xl border border-primary font-semibold text-primary disabled:opacity-60">
              {lookingUp ? "Buscando…" : "Consultar"}
            </button>
          </form>
          {lookupResult === "none" && (
            <p className="mt-3 text-sm text-muted-foreground" role="status">No encontramos un ticket con esos datos.</p>
          )}
          {lookupResult && lookupResult !== "none" && <div className="mt-3"><TicketCard t={lookupResult} /></div>}
        </section>
      </aside>
    </div>
  );
}

function TicketCard({ t }: { t: TicketRow }) {
  const done = t.status === "resuelto" || t.status === "cerrado";
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 p-3">
      <div className="min-w-0">
        <p className="font-mono text-sm font-semibold">{t.reference}</p>
        <p className="truncate text-xs text-muted-foreground">
          {t.topic} · {new Date(t.created_at).toLocaleDateString("es")}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
          done ? "bg-secondary text-muted-foreground" : "bg-accent text-accent-foreground"
        }`}
      >
        {STATUS_LABEL[t.status] ?? t.status}
      </span>
    </div>
  );
}
