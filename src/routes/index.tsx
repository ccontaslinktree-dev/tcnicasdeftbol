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
  Trophy,
  X,
} from "lucide-react";
import hero from "@/assets/hero-product.png";
import arsenal from "@/assets/arsenal-completo.jpg";
import nutrition from "@/assets/nutricion-atleta.jpg";
import preview from "@/assets/preview.mov.asset.json";
import tecnica from "@/assets/feature-dribles.jpg";
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
};
type Plan = keyof typeof CHECKOUT;

const bonuses = [
  ["01", "Guía de Entrenamiento", bonus1],
  ["02", "50 Ejercicios de Técnica Individual", bonus2],
  ["03", "Circuitos de Preparación Física", bonus3],
  ["04", "Bono Sorpresa Exclusivo", bonus4],
] as const;

const faqs = [
  [
    "¿Cómo recibo el material?",
    "Después de la compra, Hotmart envía por e-mail las instrucciones de acceso al contenido de tu plan.",
  ],
  [
    "¿Puedo acceder desde el móvil?",
    "Sí. La biblioteca puede consultarse desde móvil, tablet u ordenador.",
  ],
  [
    "¿Es para jugadores o entrenadores?",
    "Para ambos: sirve para entrenamiento individual y para planificar sesiones completas.",
  ],
  [
    "¿El acceso caduca?",
    "El Plan Completo incluye acceso vitalicio y actualizaciones, sin mensualidad.",
  ],
  ["¿La compra es segura?", "Sí. El pago se realiza en el entorno seguro de Hotmart."],
  [
    "¿Y si no es para mí?",
    "El Plan Completo tiene 7 días de garantía conforme a las condiciones de Hotmart.",
  ],
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

function track(name: string, value?: number, custom = false) {
  if (typeof window === "undefined") return;
  const event_id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  // @ts-expect-error Meta Pixel global
  window.fbq?.(custom ? "trackCustom" : "track", name, value ? { value, currency: "USD" } : undefined, {
    eventID: event_id,
  });
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;
  const cookie = (cookieName: string) =>
    document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`))?.[2];
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
      { title: "+2.000 Entrenamientos de Fútbol por US$ 5,00" },
      {
        name: "description",
        content:
          "Plan Completo con más de 2.000 entrenamientos, 500 rutinas, 4 bonos, acceso vitalicio y actualizaciones por US$ 5,00.",
      },
      { property: "og:title", content: "+2.000 Entrenamientos de Fútbol por US$ 5,00" },
      {
        property: "og:description",
        content:
          "Toda la biblioteca de entrenamiento organizada y lista para aplicar por solo US$ 5,00.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Heading({
  tag,
  children,
  dark = false,
}: {
  tag: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-5 max-w-2xl text-center">
      <p
        className={`mb-2 text-[10px] font-black uppercase tracking-[.2em] ${dark ? "text-yellow-400" : "text-green-600"}`}
      >
        {tag}
      </p>
      <h2
        className={`text-[27px] font-black uppercase leading-[1.08] sm:text-[40px] ${dark ? "text-white" : "text-zinc-950"}`}
      >
        {children}
      </h2>
    </div>
  );
}

function CTA({ children = "Quiero dejar de improvisar ahora" }: { children?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" })}
      className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-4 text-[14px] font-black uppercase text-zinc-950 shadow-[0_12px_30px_-10px_rgba(250,204,21,.7)] active:scale-[.98]"
    >
      {children}
      <ArrowRight className="h-5 w-5 shrink-0" />
    </button>
  );
}

function PlanCard({ choose }: { choose: (plan: Plan) => void }) {
  const items = [
    "+2.000 entrenamientos por posición y categoría",
    "Nutrición de alto rendimiento",
    "Entrenamientos individuales en casa",
    "500 entrenamientos de definición muscular",
    "4 bonos adicionales",
    "Acceso vitalicio y actualizaciones",
    "Garantía de 7 días",
  ];

  return (
    <article className="relative rounded-3xl border-4 border-green-500 bg-white p-5 text-slate-900 shadow-[0_26px_70px_-22px_rgba(34,197,94,.7)] sm:p-8">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black">
        Sistema completo · Todo incluido
      </div>
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white"><Crown /></div>
        <p className="text-[11px] font-black uppercase tracking-widest text-green-600">Plan Completo</p>
        <h3 className="mt-1 text-[25px] font-black uppercase">Deja de improvisar. Entrena con método.</h3>
      </div>
      <div className="my-5 space-y-2.5">
        {items.map((item) => (
          <div key={item} className="flex gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <span className="text-[13px] font-bold">{item}</span>
          </div>
        ))}
      </div>
      <div className="mb-5 bg-[#07130b] p-4 text-center text-white">
        <p className="text-xs text-slate-400 line-through">Valor de referencia: US$ 29,90</p>
        <p className="mt-1 text-[11px] font-black uppercase">Hoy por solo</p>
        <div className="flex items-end justify-center gap-1">
          <span className="text-xs font-bold">US$</span><span className="text-5xl font-black leading-none">5,00</span>
        </div>
        <p className="mt-2 text-[10px] font-black uppercase text-yellow-400">Pago único · Sin mensualidades</p>
      </div>
      <button
        type="button"
        onClick={() => choose("premium")}
        className="min-h-[60px] w-full rounded-2xl bg-green-600 px-4 py-4 text-[14px] font-black uppercase text-white shadow-lg active:scale-[.98]"
      >
        Acceder al sistema completo por US$ 5,00
      </button>
    </article>
  );
}

function Index() {
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    track("ViewContent");
  }, []);
  useEffect(() => {
    document.body.style.overflow = plan ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [plan]);

  const choose = (selected: Plan) => {
    track("InitiateCheckout", 5);
    setPlan(selected);
  };

  const recordCheckoutClick = () => {
    if (!plan) return;
    try {
      // Separate outbound intent from opening the plan modal. Never delay the native link.
      track("HotmartCheckoutClick", 5, true);
    } catch {
      // Analytics failure must not prevent navigation to Hotmart.
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-24 text-slate-900 antialiased">
      <div className="fixed inset-x-0 top-0 z-[90] border-b border-yellow-400/40 bg-[#07130b] px-3 py-2 text-center text-[10px] font-black uppercase text-white sm:text-xs">
        🔥 Precio especial activo · Plan Completo por US$ 5,00
      </div>
      <div className="h-9" />

      <section className="bg-white px-4 py-10 sm:py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div className="text-center lg:text-left">
            <p className="text-xs font-black uppercase tracking-widest text-green-700">
              Para jugadores y entrenadores
            </p>
            <h1 className="mt-4 text-[34px] font-black uppercase leading-[1.06] text-zinc-950 sm:text-5xl">
              Deja de improvisar.
              <span className="mt-2 block text-green-600">
                Accede al método organizado con +2.000 entrenamientos listos para aplicar por posición y categoría.
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              +2.000 entrenamientos de fútbol + nutrición de alto rendimiento + entrenamientos en casa
              + 500 de definición muscular. Todo organizado. Acceso inmediato. Un solo pago.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Es fácil perder horas buscando ejercicios sueltos y terminar repitiendo siempre lo
              mismo. Aquí tienes <strong>material organizado, variado y listo para usar</strong>:
              técnica, táctica, físico, finalización, 1x1, trabajo por posición y por categoría.
            </p>
            <div className="mt-6">
              <CTA>Quiero dejar de improvisar ahora</CTA>
            </div>
            <p className="mt-3 text-center text-xs text-slate-500 lg:text-left">
              +2.000 entrenamientos organizados para jugadores y entrenadores · Acceso vitalicio
            </p>
          </div>
          <img
            src={hero}
            alt="Biblioteca digital del Plan Completo de fútbol"
            className="mx-auto w-full max-w-[380px] rounded-3xl shadow-xl"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="¿Te pasa antes de entrenar?">
            ¿Te identificas con alguna<span className="text-green-600"> de estas situaciones?</span>
          </Heading>
          <ul className="mx-auto mb-7 max-w-2xl space-y-3 text-base leading-relaxed text-slate-700">
            {[
              "Llegas al entrenamiento sin un plan claro y terminas improvisando.",
              "Repites siempre los mismos ejercicios porque no sabes qué más hacer.",
              "Pierdes tiempo buscando material suelto en YouTube o Instagram.",
              "Sientes que tus jugadores, o tú, no evolucionan como deberían.",
              "No tienes material organizado por posición y categoría.",
            ].map((pain) => (
              <li key={pain} className="flex items-start gap-3">
                <X className="mt-1 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
                <span>{pain}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-black text-slate-700">SIN el método</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                {["Improvisas cada sesión.", "Pierdes tiempo buscando ejercicios.", "Repites siempre lo mismo.", "Te cuesta definir qué trabajar en la siguiente sesión."].map((item) => (
                  <li key={item} className="flex gap-2"><X className="h-5 w-5 shrink-0" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <h3 className="text-lg font-black text-green-900">CON el método</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                {["Preparas tu sesión sin empezar de cero.", "Encuentras material por posición y categoría.", "Tienes variedad para renovar tus entrenamientos.", "Eliges un objetivo y entrenas con dirección clara."].map((item) => (
                  <li key={item} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </article>
          </div>
          <p className="mx-auto mt-7 max-w-2xl text-center text-base font-semibold leading-relaxed">
            El problema no es tu esfuerzo. Es la falta de un sistema claro y organizado.
            Hoy puedes dar el primer paso: tener el material a mano y elegir qué vas a trabajar.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <Heading tag="Tu biblioteca de fútbol">
            Todo lo que quieres trabajar.
            <span className="text-green-600"> Organizado para encontrarlo.</span>
          </Heading>
          <p className="mx-auto mb-6 max-w-2xl text-center text-base leading-relaxed text-slate-600">
            Técnica individual: control, pase, regate y recepción. Finalización y definición. 1x1 y duelos.
            Agilidad, velocidad y coordinación. Trabajo táctico y posicional. Preparación física específica.
            Ejercicios por posición: portero, defensa, mediocampo y delantero. Material por categoría
            para encontrar lo que necesitas y adaptar el trabajo a tu sesión.
          </p>
          <img
            src={arsenal}
            alt="Arsenal de entrenamientos y categorías del método"
            className="w-full rounded-3xl shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      <section className="bg-[#07130b] px-4 py-10 text-white sm:py-14">
        <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2">
          <div>
            <Heading tag="Mira por dentro" dark>
              Antes de decidir,<span className="text-green-400"> conoce el material.</span>
            </Heading>
            <p className="text-center text-base leading-relaxed text-slate-300">
              Dale play y recorre una vista previa real de la biblioteca. Mira cómo está presentado
              el contenido e imagina qué trabajarías en tu siguiente entrenamiento.
            </p>
            <p className="mt-4 text-center text-sm leading-relaxed text-slate-300">
              No tienes que decidir solo por una lista: aquí puedes ver el producto al que vas a
              acceder.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-black">
            <video
              src={preview.url}
              controls
              playsInline
              preload="metadata"
              className="aspect-[3/4] w-full object-contain"
            />
          </div>
        </div>
      </section>


      <section className="bg-green-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="De la biblioteca al campo">
            Tu próximo entrenamiento empieza con <span className="text-green-600">tres decisiones.</span>
          </Heading>
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "Elige tu posición o categoría", "Entra en la biblioteca y busca el contenido que corresponde a tu trabajo individual o a tu equipo."],
              ["02", "Define qué quieres trabajar", "Encuentra ejercicios para el objetivo de la sesión y selecciona los que encajan con tu nivel y espacio."],
              ["03", "Prepara tu sesión", "Consulta el material y llega al entrenamiento con una idea clara de lo que vas a practicar."],
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-2xl border border-green-100 bg-white p-5">
                <span className="text-sm font-black text-green-700">{number}</span>
                <h3 className="mt-2 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-slate-700">
            No necesitas revisar toda la biblioteca para empezar. Necesitas encontrar lo que te sirve
            hoy y tener nuevas opciones para mañana.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <CTA>Quiero dejar de improvisar ahora</CTA>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Lo que recibes en el Completo">
            Un sistema completo<span className="text-green-600"> dentro y fuera del campo.</span>
          </Heading>
          <p className="mx-auto mb-7 max-w-2xl text-center text-base leading-relaxed text-slate-600">
            Prepara tus sesiones de fútbol y da continuidad al trabajo con nutrición, entrenamientos
            en casa y definición muscular. Cada entrega cumple una función en tu preparación.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              [
                "01",
                "+2.000 entrenamientos de fútbol",
                "Organizados y listos para aplicar. Ideal para jugadores y entrenadores: encuentra qué trabajar por posición y categoría sin perderte entre ejercicios sueltos.",
                tecnica,
              ],
              [
                "02",
                "Nutrición de alto rendimiento",
                "Orientación para apoyar tu energía y recuperación. Dale a la alimentación un lugar en tu preparación, junto con el trabajo en el campo.",
                nutrition,
              ],
              [
                "03",
                "Entrenamientos individuales en casa",
                "Sigue trabajando para mejorar fuera del campo. Entrenamientos individuales en casa para dar continuidad a tu práctica cuando no tienes sesión de equipo.",
                casa,
              ],
              [
                "04",
                "500 entrenamientos de definición",
                "Complemento físico para trabajar fuerza y presencia en el campo. 500 entrenamientos de definición muscular para ampliar tu preparación.",
                definicion,
              ],
            ].map(([number, title, description, img]) => (
              <article
                key={number}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={img}
                  alt={title}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-green-700">
                    Módulo {number}
                  </p>
                  <h3 className="mt-2 text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-7 rounded-2xl bg-green-50 p-5 text-center">
            <p className="font-black text-green-900">Tu biblioteca te acompaña en el tiempo</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Acceso vitalicio, actualizaciones y consulta desde móvil, tablet u ordenador. Vuelve
              al contenido para preparar una nueva sesión, repasar una categoría o probar otro
              ejercicio.
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-xl">
            <CTA>Empezar a entrenar con método</CTA>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="entrena-con-intencion"
        className="border-y border-green-100 bg-green-50 px-5 py-11 sm:py-16"
      >
        <div className="mx-auto max-w-[720px]">
          <p className="mb-3 text-center text-xs font-black uppercase tracking-widest text-green-700">
            Un acceso. Distintas formas de aprovecharlo.
          </p>
          <h2
            id="entrena-con-intencion"
            className="text-center text-[28px] font-black uppercase leading-[1.12] text-zinc-950 sm:text-[40px]"
          >
            Si juegas, encuentra qué trabajar.{" "}
            <span className="text-green-700">Si entrenas a un equipo, llega con la sesión preparada.</span>
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            <h3 className="text-xl font-black text-green-900">Para tu entrenamiento individual</h3>
            <p>
              Quieres practicar con una intención: trabajar ese pase, control o remate que necesita
              más atención. Consulta los ejercicios por posición y categoría, elige tu objetivo
              y prepara tu práctica. Las rutinas en casa te dan opciones para continuar entre sesiones.
            </p>
            <h3 className="pt-2 text-xl font-black text-green-900">Para preparar el entrenamiento de tu equipo</h3>
            <p>
              Llegar con la sesión preparada te permite dedicar tu atención a los jugadores.
              Usa la biblioteca para encontrar ideas, variar el trabajo y seleccionar ejercicios
              adecuados para la categoría, el espacio y el objetivo de tu equipo.
            </p>
            <p>
              La diferencia está en <strong className="text-zinc-950">tener recursos a mano cuando los necesitas</strong>:
              menos búsquedas dispersas y más claridad para decidir qué hacer en el campo.
              No necesitas usarlo todo hoy. Con acceso vitalicio y actualizaciones, puedes volver
              a la biblioteca para preparar la siguiente sesión.
            </p>
            <p className="border-t border-green-200 pt-5 text-lg font-bold leading-relaxed text-green-950">
              No es solo una carpeta de ejercicios. Es un sistema organizado para dejar de improvisar
              y empezar a entrenar con dirección real.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-4 py-10 text-white sm:py-14">
        <div className="mx-auto max-w-4xl">
          <Heading tag="Experiencias compartidas" dark>
            Escucha a quienes<span className="text-green-400"> ya conocen el material.</span>
          </Heading>
          <p className="mx-auto mb-6 max-w-xl text-center text-sm leading-relaxed text-slate-300">
            Mira los comentarios de jugadores y entrenadores antes de elegir tu acceso.
          </p>
          <div className="mx-auto grid max-w-[620px] grid-cols-2 gap-3">
            {[
              [feedbackJugador.url, "Jugador"],
              [feedbackEntrenador.url, "Entrenador"],
            ].map(([src, label]) => (
              <figure key={label} className="overflow-hidden rounded-2xl border border-white/10">
                <figcaption className="bg-white/5 px-3 py-2 text-xs font-bold">{label}</figcaption>
                <video
                  src={src}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-[9/16] w-full object-contain"
                />
              </figure>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 items-start gap-3 sm:grid-cols-4">
            {[testimonial1, testimonial2, testimonial3, testimonial4].map((src, index) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ampliar testimonio ${index + 1}`}
              >
                <img
                  src={src}
                  alt={`Testimonio ${index + 1}`}
                  className="h-auto w-full rounded-xl"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-xl text-center">
            <h3 className="text-xl font-black">
              Ya viste el material. Ahora elige cómo quieres preparar tu próxima sesión.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              El Plan Completo reúne fútbol, nutrición, entrenamiento en casa, definición muscular
              y 4 bonos, con acceso vitalicio y actualizaciones.
            </p>
            <div className="mt-5"><CTA>Acceder al sistema completo por US$ 5,00</CTA></div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Incluidos sin coste adicional">
            Tu acceso viene acompañado<span className="text-green-600"> de 4 bonos.</span>
          </Heading>
          <p className="mx-auto mb-6 max-w-2xl text-center text-base leading-relaxed text-slate-600">
            Además de los módulos principales, recibes estos materiales extra para ampliar tus ideas
            de entrenamiento. Están incluidos en el Plan Completo.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {bonuses.map(([number, title, img]) => (
              <article
                key={number}
                className="flex items-center gap-4 rounded-2xl border border-green-900 bg-[#07130b] p-4 text-white"
              >
                <img
                  src={img}
                  alt={title}
                  className="h-auto w-24 shrink-0 rounded-xl sm:w-32"
                  loading="lazy"
                />
                <div>
                  <p className="text-xs font-black uppercase text-yellow-400">
                    Bono {number} · Incluido
                  </p>
                  <h3 className="mt-2 text-base font-black">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <Heading tag="La promoción del Plan Completo">
            Toda esta entrega.<span className="text-green-600"> Ahora por solo 5 dólares.</span>
          </Heading>
          <div className="rounded-3xl border-2 border-green-500 bg-[#07130b] p-6 text-center text-white sm:p-9">
            <p className="text-sm text-slate-300">Valor de referencia del paquete</p>
            <p className="mt-2 text-3xl text-slate-400">
              <s>US$ 29,90</s>
            </p>
            <p className="mt-5 text-sm font-black uppercase text-green-300">
              Precio promocional actual
            </p>
            <p className="mt-2 text-6xl font-black text-white sm:text-7xl">US$ 5,00</p>
            <p className="mt-4 inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black">
              US$ 24,90 menos · Aproximadamente 83% de diferencia
            </p>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              Por US$ 5,00 te llevas más de 2.500 entrenamientos entre fútbol y definición muscular,
              además de nutrición, trabajo en casa y 4 bonos.{" "}
              <strong className="text-white">
                Tu sistema completo, en un solo pago y sin mensualidades.
              </strong>
            </p>
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-lg font-black text-yellow-400">Menos de US$ 0,01 por ejercicio</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Dividiendo US$ 5,00 entre solo los 2.000 ejercicios de fútbol. Los demás materiales
                también están incluidos.
              </p>
            </div>
            <p className="mt-5 text-sm font-bold">
              Sin mensualidades · Acceso vitalicio · 7 días de garantía
            </p>
          </div>
        </div>
      </section>

      <section id="oferta" className="scroll-mt-10 bg-slate-100 px-4 py-11 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Heading tag="Tu acceso completo">
            Todo lo que necesitas para preparar tus sesiones.<span className="text-green-600"> Un solo acceso por US$ 5,00.</span>
          </Heading>
          <p className="mx-auto -mt-2 mb-8 max-w-xl text-center text-sm leading-relaxed text-slate-600">
            Accede a los entrenamientos de fútbol, nutrición, trabajo en casa, definición muscular
            y 4 bonos. Todo el paquete, con acceso vitalicio y actualizaciones. Un solo pago
            para dejar de buscar material suelto y empezar a preparar sesiones con método.
          </p>
          <div className="mx-auto max-w-xl">
            <PlanCard choose={choose} />
          </div>
        </div>
      </section>

      <section className="bg-green-50 px-4 py-8 text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-green-600" />
        <h2 className="mt-2 text-3xl font-black uppercase">7 días para conocerlo sin riesgo</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
          Accede al Plan Completo por US$ 5,00 y revisa toda la biblioteca. Tu compra cuenta con 7
          días de garantía, conforme a las condiciones de Hotmart.
        </p>
        <div className="mx-auto mt-5 max-w-xl">
          <CTA>Acceder al sistema completo por US$ 5,00</CTA>
        </div>
      </section>

      <section className="px-4 py-9">
        <div className="mx-auto max-w-3xl">
          <Heading tag="Preguntas frecuentes">
            Todo claro antes <span className="text-green-600">de acceder</span>
          </Heading>
          <div className="divide-y border-y">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-4">
                <summary className="cursor-pointer list-none pr-6 text-sm font-black">
                  {question}
                  <span className="float-right text-green-600">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#07130b] px-4 py-10 text-center text-white">
        <p className="text-xs font-black uppercase tracking-widest text-green-400">
          Más de 2.500 materiales + 4 bonos
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black uppercase">
          Deja de improvisar.{" "}
          <span className="text-yellow-400">Empieza a entrenar con dirección.</span>
        </h2>
        <div className="mx-auto mt-5 max-w-xl">
          <CTA>Quiero dejar de improvisar ahora</CTA>
        </div>
      </section>
      <footer className="bg-black px-4 py-7 text-center text-[9px] text-slate-500">
        <p className="font-black text-white">+2.000 ENTRENAMIENTOS DE FÚTBOL</p>
        <p className="mt-2">
          Este sitio no forma parte de Facebook, Meta o Instagram. Los resultados pueden variar.
        </p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-[80] border-t bg-white/95 p-2.5 backdrop-blur">
        <button
          type="button"
          onClick={() => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" })}
          className="mx-auto flex min-h-[54px] w-full max-w-xl items-center justify-center gap-2 rounded-xl bg-yellow-400 text-[13px] font-black uppercase"
        >
          <PlayCircle className="h-5 w-5" /> Completo · Todo por US$ 5,00
        </button>
      </div>

      {plan && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/85 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-plan-title"
        >
          <button className="absolute inset-0" onClick={() => setPlan(null)} aria-label="Cerrar" />
          <div className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-[540px] sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#07130b] px-5 py-4 text-white">
              <div>
                <p className="text-[9px] font-black uppercase text-yellow-400">
                  Confirma tu elección
                </p>
                <p className="font-black">Plan Completo</p>
              </div>
              <button onClick={() => setPlan(null)} aria-label="Cerrar">
                <X />
              </button>
            </div>
            <div className="p-5 text-center sm:p-7">
              <h2 id="checkout-plan-title" className="text-2xl font-black">
                Tu elección: Plan Completo
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Toda la entrega presentada en esta página. Acceso vitalicio y actualizaciones en un solo pago.
              </p>
              <p className="mt-4 text-4xl font-black text-green-700">
                US$ 5,00
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                +2.000 entrenamientos de fútbol · Nutrición · Trabajo en casa ·
                500 entrenamientos de definición · 4 bonos
              </p>
              <a
                href={checkoutUrl(CHECKOUT[plan])}
                target="_blank"
                rel="noopener noreferrer"
                onClick={recordCheckoutClick}
                onAuxClick={(event) => {
                  if (event.button === 1) recordCheckoutClick();
                }}
                className="mt-5 flex min-h-[62px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-[15px] font-black text-white"
              >
                Continuar al pago seguro — US$ 5,00
                <ArrowRight className="h-5 w-5 shrink-0" />
              </a>
              <p className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-500">
                <Lock className="h-3 w-3 shrink-0" /> El pago se abrirá en Hotmart, en una nueva pestaña.
              </p>
              <p className="mt-2 text-xs text-slate-500">7 días de garantía conforme a las condiciones de Hotmart.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
