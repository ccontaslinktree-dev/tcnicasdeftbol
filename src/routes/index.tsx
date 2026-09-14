import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Crown,
  Lock,
  PlayCircle,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  X,
} from "lucide-react";
import hero from "@/assets/hero-product.png";
import arsenal from "@/assets/arsenal-completo.jpg";
import stack from "@/assets/stack-valor.jpg";
import preview from "@/assets/preview.mov.asset.json";
import tecnica from "@/assets/feature-dribles.jpg";
import fisico from "@/assets/feature-fisico.jpg";
import casa from "@/assets/entrenamiento-casa.jpg";
import definicion from "@/assets/bono-definicion.jpg";
import bonus1 from "@/assets/bonus-1.jpg";
import bonus2 from "@/assets/bonus-2.jpg";
import bonus3 from "@/assets/bonus-3.jpg";
import bonus4 from "@/assets/bonus-surprise.png";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.webp";
import testimonial3 from "@/assets/testimonial-3.webp";
import testimonial4 from "@/assets/testimonial-4.jpg";
import feedbackJugador from "@/assets/feedback-jugador.mp4.asset.json";
import feedbackEntrenador from "@/assets/feedback-entrenador.mp4.asset.json";

const CHECKOUT = {
  premium: "https://pay.hotmart.com/P107284207G?checkoutMode=2",
  basic: "https://pay.hotmart.com/B107438269A?checkoutMode=2",
};
type Plan = keyof typeof CHECKOUT;

const inventory = [
  ["Biblioteca principal", "+2.000 entrenamientos organizados y listos para aplicar", arsenal],
  ["Técnica completa", "Dribles, pases, control de balón, dominio y remates", tecnica],
  ["Preparación física", "Agilidad, velocidad, coordinación, resistencia y potencia", fisico],
  ["Trabajo táctico", "Ejercicios, estrategias y organización para distintas situaciones", stack],
  ["Entrenamiento individual", "Rutinas para seguir evolucionando en casa y sin equipo", casa],
  ["Definición muscular", "500 rutinas adicionales para fuerza y acondicionamiento", definicion],
] as const;

const included = [
  "+2.000 entrenamientos de fútbol",
  "Ejercicios físicos y de preparación",
  "Entrenamientos tácticos y estrategias",
  "Dribles y dominio del balón",
  "Agilidad, velocidad y coordinación",
  "Pases, recepción y control",
  "Remates y finalización",
  "Contenido por posición y categoría",
  "Entrenamientos individuales en casa",
  "Nutrición para rendimiento y recuperación",
  "500 rutinas de definición muscular",
  "4 bonos adicionales",
  "Acceso vitalicio desde cualquier dispositivo",
  "Nuevos ejercicios y estrategias en las actualizaciones",
];

const bonuses = [
  ["01", "Guía de Entrenamiento", bonus1],
  ["02", "50 Ejercicios de Técnica Individual", bonus2],
  ["03", "Circuitos de Preparación Física", bonus3],
  ["04", "Bono Sorpresa Exclusivo", bonus4],
] as const;

const faqs = [
  ["¿Cómo recibo el material?", "Después de la compra, Hotmart envía por e-mail las instrucciones de acceso al contenido de tu plan."],
  ["¿Puedo acceder desde el móvil?", "Sí. La biblioteca puede consultarse desde móvil, tablet u ordenador."],
  ["¿Es para jugadores o entrenadores?", "Para ambos: sirve para entrenamiento individual y para planificar sesiones completas."],
  ["¿El acceso caduca?", "El Plan Completo incluye acceso vitalicio y actualizaciones, sin mensualidad."],
  ["¿La compra es segura?", "Sí. El pago se realiza en el entorno seguro de Hotmart."],
  ["¿Y si no es para mí?", "El Plan Completo tiene 7 días de garantía conforme a las condiciones de Hotmart."],
];

function checkoutUrl(base: string) {
  if (typeof window === "undefined") return base;
  const url = new URL(base);
  const incoming = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "xcod"].forEach((key) => {
    const value = incoming.get(key);
    if (value) url.searchParams.set(key, value);
  });
  const xcod = incoming.get("xcod");
  if (xcod) url.searchParams.set("sck", xcod);
  else if (incoming.get("utm_source")) url.searchParams.set("sck", "meta_ads");
  return url.toString();
}

function track(name: string, value?: number) {
  if (typeof window === "undefined") return;
  const event_id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  // @ts-expect-error Meta Pixel global
  window.fbq?.("track", name, value ? { value, currency: "USD" } : undefined, { eventID: event_id });
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;
  const cookie = (cookieName: string) => document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`))?.[2];
  fetch(`${url}/functions/v1/meta-capi`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      event_name: name,
      event_id,
      event_source_url: location.href,
      user_agent: navigator.userAgent,
      fbp: cookie("_fbp"),
      fbc: cookie("_fbc"),
      value,
      currency: "USD",
    }),
    keepalive: true,
  }).catch(() => {});
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "+2.000 Entrenamientos de Fútbol por US$ 6,50" },
      { name: "description", content: "Plan Completo con más de 2.000 entrenamientos, 500 rutinas, 4 bonos, acceso vitalicio y actualizaciones por US$ 6,50." },
      { property: "og:title", content: "+2.000 Entrenamientos de Fútbol por US$ 6,50" },
      { property: "og:description", content: "Toda la biblioteca de entrenamiento organizada y lista para aplicar por solo US$ 6,50." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Heading({ tag, children, dark = false }: { tag: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className="mx-auto mb-5 max-w-2xl text-center">
      <p className={`mb-2 text-[10px] font-black uppercase tracking-[.2em] ${dark ? "text-yellow-400" : "text-green-600"}`}>{tag}</p>
      <h2 className={`text-[27px] font-black uppercase leading-[1.08] sm:text-[40px] ${dark ? "text-white" : "text-zinc-950"}`}>{children}</h2>
    </div>
  );
}

function CTA({ children = "Quiero el Plan Completo por US$ 6,50" }: { children?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" })}
      className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-4 text-[14px] font-black uppercase text-zinc-950 shadow-[0_12px_30px_-10px_rgba(250,204,21,.7)] active:scale-[.98]"
    >
      {children}<ArrowRight className="h-5 w-5 shrink-0" />
    </button>
  );
}

function PlanCard({ plan, choose }: { plan: Plan; choose: (plan: Plan) => void }) {
  const full = plan === "premium";
  const items = full
    ? ["+2.000 entrenamientos organizados", "500 rutinas de definición", "Nutrición y entrenamiento en casa", "4 bonos adicionales", "Acceso vitalicio y actualizaciones", "Garantía de 7 días"]
    : ["Biblioteca básica de fútbol", "Material digital para entrenar", "Acceso desde cualquier dispositivo"];

  return (
    <article className={`relative bg-white text-slate-900 ${full ? "order-first border-4 border-green-500 p-5 shadow-[0_26px_70px_-22px_rgba(34,197,94,.7)] sm:p-8" : "border border-slate-300 p-5 md:order-last"}`}>
      {full && <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black">Más de 2.500 materiales + 4 bonos</div>}
      <div className="text-center">
        <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full ${full ? "bg-green-600 text-white" : "bg-slate-200"}`}>{full ? <Crown /> : <Target />}</div>
        <p className="text-[11px] font-black uppercase tracking-widest text-green-600">Plan {full ? "Completo" : "Básico"}</p>
        <h3 className="mt-1 text-[25px] font-black uppercase">{full ? "La biblioteca completa" : "Solo lo esencial"}</h3>
      </div>
      <div className="my-5 space-y-2.5">
        {items.map((item) => <div key={item} className="flex gap-2.5"><CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" /><span className="text-[13px] font-bold">{item}</span></div>)}
      </div>
      <div className={`mb-5 p-4 text-center ${full ? "bg-[#07130b] text-white" : "bg-slate-100"}`}>
        {full && <p className="text-xs text-slate-400 line-through">Valor de referencia: US$ 29,90</p>}
        <p className="mt-1 text-[11px] font-black uppercase">Hoy por solo</p>
        <div className="flex items-end justify-center gap-1"><span className="text-xs font-bold">US$</span><span className="text-5xl font-black leading-none">{full ? "6,50" : "5,00"}</span></div>
        {full && <p className="mt-2 text-[10px] font-black uppercase text-yellow-400">Pago único · Sin mensualidades</p>}
      </div>
      <button type="button" onClick={() => choose(plan)} className={`min-h-[60px] w-full rounded-2xl px-4 py-4 text-[14px] font-black uppercase text-white active:scale-[.98] ${full ? "bg-green-600 shadow-lg" : "bg-slate-800"}`}>
        {full ? "Llevar todo por US$ 6,50" : "Elegir Básico por US$ 5,00"}
      </button>
    </article>
  );
}

function Index() {
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => { track("ViewContent"); }, []);
  useEffect(() => {
    document.body.style.overflow = plan ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [plan]);

  const choose = (selected: Plan) => {
    track("InitiateCheckout", selected === "premium" ? 6.5 : 5);
    setPlan(selected);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-24 text-slate-900 antialiased">
      <div className="fixed inset-x-0 top-0 z-[90] border-b border-yellow-400/40 bg-[#07130b] px-3 py-2 text-center text-[10px] font-black uppercase text-white sm:text-xs">Plan Completo · Solo US$ 6,50 · Acceso vitalicio</div>
      <div className="h-9" />

      <section className="relative overflow-hidden bg-[#07130b] px-4 py-8 text-white sm:py-12">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_80%_25%,#22c55e_0,transparent_38%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-7 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-500/50 bg-green-600/15 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-green-300"><Trophy className="h-4 w-4" /> Para jugadores y entrenadores</span>
            <h1 className="mt-4 text-[34px] font-black uppercase leading-[.98] sm:text-[54px]">Todo el fútbol que necesitas. <span className="text-yellow-400">Organizado en un solo lugar.</span></h1>
            <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-relaxed text-slate-200 sm:text-xl lg:mx-0">Más de <strong className="text-white">2.000 entrenamientos listos para aplicar</strong>, 500 rutinas extras, nutrición, trabajo en casa y 4 bonos. Sin búsquedas interminables. Sin mensualidades.</p>
            <div className="mx-auto mt-5 grid max-w-xl grid-cols-3 gap-2 lg:mx-0">
              {[["+2.000", "entrenamientos"], ["+500", "rutinas extras"], ["US$ 6,50", "pago único"]].map(([value, label]) => <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"><b className="block text-base text-yellow-400 sm:text-lg">{value}</b><span className="text-[8px] font-bold uppercase sm:text-[9px]">{label}</span></div>)}
            </div>
          </div>
          <div className="relative mx-auto max-w-[420px]">
            <div className="absolute inset-6 bg-green-500/30 blur-3xl" />
            <img src={hero} alt="Plan Completo con más de 2.000 entrenamientos de fútbol" className="relative w-full rounded-3xl shadow-2xl" fetchPriority="high" />
            <div className="absolute -bottom-3 inset-x-3 rounded-2xl border border-yellow-400/50 bg-black/90 p-3 text-center"><p className="text-[10px] font-black uppercase text-yellow-400">Todo incluido</p><p className="text-lg font-black">Solo US$ 6,50</p></div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-7">
        <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-3">
          {[["No improvisas", "Elige el objetivo y encuentra el entrenamiento."], ["No pierdes tiempo", "Todo está reunido y organizado para usar."], ["No pagas cada mes", "US$ 6,50 una sola vez y acceso vitalicio."]].map(([title, text]) => <article key={title} className="border bg-white p-4 text-center"><CheckCircle2 className="mx-auto h-6 w-6 text-green-600" /><h2 className="mt-2 font-black uppercase">{title}</h2><p className="mt-1 text-xs leading-relaxed text-slate-600">{text}</p></article>)}
        </div>
      </section>

      <section className="bg-[#07130b] px-4 py-9 text-white sm:py-12">
        <div className="mx-auto grid max-w-5xl items-center gap-6 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <Heading tag="Mira la entrega por dentro" dark>Esto es lo que tendrás <span className="text-green-400">en tus manos</span></Heading>
            <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-slate-300">Una biblioteca práctica para abrir, elegir y entrenar. El Plan Completo entrega todo por apenas <strong className="text-yellow-400">US$ 6,50.</strong></p>
          </div>
          <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"><video src={preview.url} controls playsInline preload="metadata" className="aspect-[3/4] w-full object-cover" /></div>
        </div>
      </section>

      <section className="bg-white px-4 py-9 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Heading tag="Inventario del Plan Completo">Mucho más que ejercicios. <span className="text-green-600">Una entrega de gran volumen.</span></Heading>
          <p className="mx-auto mb-6 max-w-2xl text-center text-sm leading-relaxed text-slate-600">Técnica, físico, táctica, trabajo individual y preparación reunidos para que siempre tengas qué entrenar. Todo esto entra en el único pago de <strong className="text-zinc-950">US$ 6,50.</strong></p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inventory.map(([title, text, image]) => <article key={title} className="grid grid-cols-[105px_1fr] overflow-hidden border bg-slate-50 sm:block"><img src={image} alt={title} className="h-full min-h-[112px] w-full object-cover sm:aspect-video sm:h-auto" loading="lazy" /><div className="p-3.5"><h3 className="flex gap-2 text-sm font-black uppercase"><CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />{title}</h3><p className="mt-1.5 text-xs leading-relaxed text-slate-600">{text}</p></div></article>)}
          </div>

          <div className="mt-7 grid gap-5 bg-[#07130b] p-5 text-white sm:p-7 md:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Lista completa de acceso</p>
              <h3 className="mt-2 text-2xl font-black uppercase">Abre tu biblioteca y encuentra todo esto</h3>
              <div className="mt-5 grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
                {included.map((item) => <p key={item} className="flex gap-2 text-xs font-semibold leading-relaxed"><Check className="h-4 w-4 shrink-0 text-green-400" />{item}</p>)}
              </div>
            </div>
            <div className="flex flex-col justify-center border-t border-white/10 pt-5 text-center md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <p className="text-xs font-bold uppercase text-slate-300">Más de 2.500 materiales principales</p>
              <p className="mt-2 text-5xl font-black text-yellow-400">US$ 6,50</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">Menos de un centavo por entrenamiento, sin contar todos los complementos y bonos.</p>
              <div className="mt-4"><CTA /></div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-green-600">Y todavía llevas 4 bonos incluidos</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {bonuses.map(([number, title, image]) => <article key={number} className="flex items-center gap-3 border bg-slate-50 p-3 lg:block"><img src={image} alt={title} className="h-20 w-24 shrink-0 rounded-xl object-cover lg:aspect-video lg:h-auto lg:w-full" loading="lazy" /><div className="lg:pt-3"><span className="text-[9px] font-black uppercase text-green-600">Bono {number} · Incluido</span><h3 className="mt-1 text-xs font-black">{title}</h3></div></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-4 py-9 text-white sm:py-12">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Prueba social" dark>Jugadores y entrenadores <span className="text-green-400">muestran su experiencia</span></Heading>
          <div className="mx-auto grid max-w-[620px] grid-cols-2 gap-3">
            {[[feedbackJugador.url, "Jugador"], [feedbackEntrenador.url, "Entrenador"]].map(([src, label]) => <div key={label} className="relative overflow-hidden rounded-2xl border border-white/10"><video src={src} controls playsInline preload="metadata" className="aspect-[9/16] w-full object-cover" /><span className="absolute left-2 top-2 rounded-full bg-green-600 px-2 py-1 text-[9px] font-black uppercase">{label}</span></div>)}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">{[testimonial1, testimonial2, testimonial3, testimonial4].map((src, index) => <img key={src} src={src} alt={`Testimonio ${index + 1}`} className="aspect-[3/4] w-full rounded-lg object-cover" loading="lazy" />)}</div>
          <p className="mx-auto mt-5 max-w-xl text-center text-sm font-bold">Tú también puedes tener este arsenal completo hoy por solo <span className="text-yellow-400">US$ 6,50.</span></p>
        </div>
      </section>

      <section id="oferta" className="scroll-mt-10 bg-slate-100 px-4 py-11 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Elige tu acceso">El Completo entrega mucho más <span className="text-green-600">por solo US$ 6,50</span></Heading>
          <p className="mx-auto -mt-2 mb-8 max-w-xl text-center text-sm leading-relaxed text-slate-600">Por apenas US$ 1,50 más que el Básico, llevas más de 2.000 entrenamientos, 500 rutinas extras, todos los complementos, 4 bonos, actualizaciones y acceso vitalicio.</p>
          <div className="mx-auto grid max-w-4xl items-start gap-7 md:grid-cols-2"><PlanCard plan="premium" choose={choose} /><PlanCard plan="basic" choose={choose} /></div>
        </div>
      </section>

      <section className="bg-green-50 px-4 py-8 text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-green-600" />
        <h2 className="mt-2 text-3xl font-black uppercase">7 días para conocerlo sin riesgo</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">Accede al Plan Completo por US$ 6,50 y revisa toda la biblioteca. Tu compra cuenta con 7 días de garantía, conforme a las condiciones de Hotmart.</p>
        <div className="mx-auto mt-5 max-w-xl"><CTA>Acceder a todo por US$ 6,50</CTA></div>
      </section>

      <section className="px-4 py-9">
        <div className="mx-auto max-w-3xl">
          <Heading tag="Preguntas frecuentes">Todo claro antes <span className="text-green-600">de acceder</span></Heading>
          <div className="divide-y border-y">{faqs.map(([question, answer]) => <details key={question} className="group py-4"><summary className="cursor-pointer list-none pr-6 text-sm font-black">{question}<span className="float-right text-green-600">+</span></summary><p className="mt-2 text-sm leading-relaxed text-slate-600">{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="bg-[#07130b] px-4 py-10 text-center text-white"><p className="text-xs font-black uppercase tracking-widest text-green-400">Más de 2.500 materiales + 4 bonos</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black uppercase">Todo organizado. Acceso vitalicio. <span className="text-yellow-400">Solo US$ 6,50.</span></h2><div className="mx-auto mt-5 max-w-xl"><CTA>Quiero el Plan Completo por US$ 6,50</CTA></div></section>
      <footer className="bg-black px-4 py-7 text-center text-[9px] text-slate-500"><p className="font-black text-white">+2.000 ENTRENAMIENTOS DE FÚTBOL</p><p className="mt-2">Este sitio no forma parte de Facebook, Meta o Instagram. Los resultados pueden variar.</p></footer>

      <div className="fixed inset-x-0 bottom-0 z-[80] border-t bg-white/95 p-2.5 backdrop-blur"><button type="button" onClick={() => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" })} className="mx-auto flex min-h-[54px] w-full max-w-xl items-center justify-center gap-2 rounded-xl bg-yellow-400 text-[13px] font-black uppercase"><PlayCircle className="h-5 w-5" /> Completo · Todo por US$ 6,50</button></div>

      {plan && <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/85 sm:items-center sm:p-4" role="dialog" aria-modal="true">
        <button className="absolute inset-0" onClick={() => setPlan(null)} aria-label="Cerrar" />
        <div className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-[540px] sm:rounded-3xl">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-[#07130b] px-5 py-4 text-white"><div><p className="text-[9px] font-black uppercase text-yellow-400">Confirma tu elección</p><p className="font-black">Plan {plan === "premium" ? "Completo" : "Básico"}</p></div><button onClick={() => setPlan(null)} aria-label="Cerrar"><X /></button></div>
          <div className="p-5 text-center sm:p-7">
            {plan === "premium" ? <><span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-2 text-[10px] font-black uppercase"><Star className="h-3 w-3 fill-current" /> Toda la entrega</span><h2 className="mt-4 text-[27px] font-black uppercase">Más de 2.500 materiales + 4 bonos</h2><img src={hero} alt="Plan Completo" className="mx-auto mt-4 max-h-[210px] rounded-2xl" /><div className="mt-4 bg-[#07130b] p-4 text-white"><p className="text-xs line-through text-slate-400">Valor de referencia: US$ 29,90</p><p className="text-5xl font-black text-yellow-400">US$ 6,50</p><p className="text-[10px] font-black uppercase">Pago único · Acceso vitalicio</p></div></> : <><h2 className="text-[27px] font-black uppercase">Plan Básico</h2><p className="mt-2 text-sm text-slate-600">Incluye solo la biblioteca esencial y deja fuera los complementos del Completo.</p><p className="mt-4 text-5xl font-black">US$ 5,00</p><button onClick={() => setPlan("premium")} className="mt-4 text-sm font-black text-green-600 underline">Llevar toda la entrega por solo US$ 1,50 más</button></>}
            <div className="mt-5 space-y-2 bg-slate-50 p-4 text-left">{(plan === "premium" ? ["+2.000 entrenamientos organizados", "+500 rutinas de definición", "Nutrición y entrenamientos en casa", "4 bonos, actualizaciones y acceso vitalicio"] : ["Biblioteca básica", "Material digital", "Acceso multidispositivo"]).map((item) => <p key={item} className="flex gap-2 text-sm font-bold"><Check className="h-5 w-5 shrink-0 text-green-600" />{item}</p>)}</div>
            <a href={checkoutUrl(CHECKOUT[plan])} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-[62px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-[15px] font-black uppercase text-white">{plan === "premium" ? "Comprar todo por US$ 6,50" : "Comprar Básico por US$ 5,00"}<ArrowRight /></a>
            <p className="mt-3 flex justify-center gap-1 text-[10px] text-slate-500"><Lock className="h-3 w-3" /> Hotmart abrirá en una nueva pestaña</p>
          </div>
        </div>
      </div>}
    </main>
  );
}