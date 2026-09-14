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
  basic: "https://pay.hotmart.com/B107438269A?checkoutMode=2",
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

function track(name: string, value?: number) {
  if (typeof window === "undefined") return;
  const event_id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  // @ts-expect-error Meta Pixel global
  window.fbq?.("track", name, value ? { value, currency: "USD" } : undefined, {
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

function CTA({ children = "Quiero el sistema completo ahora" }: { children?: ReactNode }) {
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

function PlanCard({ plan, choose }: { plan: Plan; choose: (plan: Plan) => void }) {
  const full = plan === "premium";
  const items = full
    ? [
        "+2.000 entrenamientos organizados",
        "500 rutinas de definición",
        "Nutrición y entrenamiento en casa",
        "4 bonos adicionales",
        "Acceso vitalicio y actualizaciones",
        "Garantía de 7 días",
      ]
    : [
        "Biblioteca básica de fútbol",
        "Material digital para entrenar",
        "Acceso desde cualquier dispositivo",
      ];

  return (
    <article
      className={`relative rounded-3xl bg-white text-slate-900 ${full ? "order-first border-4 border-green-500 p-5 shadow-[0_26px_70px_-22px_rgba(34,197,94,.7)] sm:p-8" : "border border-slate-300 p-5 md:order-last"}`}
    >
      {full && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black">
          Más de 2.500 materiales + 4 bonos
        </div>
      )}
      <div className="text-center">
        <div
          className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full ${full ? "bg-green-600 text-white" : "bg-slate-200"}`}
        >
          {full ? <Crown /> : <Target />}
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest text-green-600">
          Plan {full ? "Completo" : "Básico"}
        </p>
        <h3 className="mt-1 text-[25px] font-black uppercase">
          {full ? "La biblioteca completa" : "Solo lo esencial"}
        </h3>
      </div>
      <div className="my-5 space-y-2.5">
        {items.map((item) => (
          <div key={item} className="flex gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <span className="text-[13px] font-bold">{item}</span>
          </div>
        ))}
      </div>
      <div className={`mb-5 p-4 text-center ${full ? "bg-[#07130b] text-white" : "bg-slate-100"}`}>
        {full && (
          <p className="text-xs text-slate-400 line-through">Valor de referencia: US$ 29,90</p>
        )}
        <p className="mt-1 text-[11px] font-black uppercase">Hoy por solo</p>
        <div className="flex items-end justify-center gap-1">
          <span className="text-xs font-bold">US$</span>
          <span className="text-5xl font-black leading-none">{full ? "5,00" : "4,50"}</span>
        </div>
        {full && (
          <p className="mt-2 text-[10px] font-black uppercase text-yellow-400">
            Pago único · Sin mensualidades
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => choose(plan)}
        className={`min-h-[60px] w-full rounded-2xl px-4 py-4 text-[14px] font-black uppercase text-white active:scale-[.98] ${full ? "bg-green-600 shadow-lg" : "bg-slate-800"}`}
      >
        {full ? "Acceder a todo por US$ 5,00" : "Elegir Básico por US$ 4,50"}
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
    track("InitiateCheckout", selected === "premium" ? 5 : 4.5);
    setPlan(selected);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-24 text-slate-900 antialiased">
      <div className="fixed inset-x-0 top-0 z-[90] border-b border-yellow-400/40 bg-[#07130b] px-3 py-2 text-center text-[10px] font-black uppercase text-white sm:text-xs">
        Plan Completo · Solo US$ 5,00 · Acceso vitalicio
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
                Llega a cada entrenamiento con un sistema completo listo para aplicar.
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              +2.000 entrenamientos organizados por posición y categoría + nutrición de alto
              rendimiento + entrenamientos en casa + 500 de definición muscular. Todo en un solo
              lugar. Acceso inmediato.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Es fácil perder horas buscando ejercicios sueltos y terminar repitiendo siempre lo
              mismo. Aquí tienes <strong>material organizado, variado y listo para usar</strong>:
              técnica, táctica, físico, finalización, 1x1, trabajo por posición y por categoría.
            </p>
            <div className="mt-6">
              <CTA>Quiero el sistema completo ahora</CTA>
            </div>
            <p className="mt-3 text-center text-xs text-slate-500 lg:text-left">
              Pago único · Acceso vitalicio · Garantía de 7 días
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
            ¿Sigues armando entrenamientos<span className="text-green-600"> a última hora?</span>
          </Heading>
          <p className="mx-auto mb-7 max-w-2xl text-center text-base leading-relaxed text-slate-600">
            Si todavía saltas de video en video, repites los mismos ejercicios y sientes que tus
            sesiones no tienen una dirección clara, el problema no es tu esfuerzo. Es la falta de un
            sistema organizado. Con este acceso dejas de improvisar y empiezas a trabajar con
            material organizado por posición y categoría, listo para aplicar.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [
                "Repites los mismos ejercicios",
                "Quieres trabajar algo distinto, pero terminas usando los mismos ejercicios por falta de opciones a mano.",
                "Elige con un objetivo claro",
                "Encuentra técnica, físico y táctica organizados para preparar sesiones con variedad y dirección.",
              ],
              [
                "Pierdes tiempo buscando",
                "Saltas entre vídeos y carpetas sin encontrar aquel ejercicio que habías guardado.",
                "Deja de empezar de cero",
                "Accede a contenido organizado por posición y categoría desde el móvil, tablet u ordenador.",
              ],
              [
                "Entrenar solo se hace difícil",
                "Fuera del entrenamiento de equipo, te faltan ideas para seguir practicando.",
                "Dale continuidad a tu trabajo",
                "Usa las rutinas individuales y complementa tu trabajo con preparación física y nutrición.",
              ],
            ].map(([pain, detail, solution, benefit]) => (
              <article
                key={pain}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="p-5">
                  <h3 className="text-lg font-black">{pain}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{detail}</p>
                </div>
                <div className="border-t border-green-100 bg-green-50 p-5">
                  <h4 className="flex items-start gap-2 font-black text-green-900">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    {solution}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{benefit}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-2xl text-center text-base font-semibold leading-relaxed">
            Deja de llegar al campo con la pregunta «¿qué hacemos hoy?». Abre tu biblioteca, elige
            el objetivo y prepara una sesión con intención.
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
            Técnica individual; finalización y definición; 1x1 y duelos; agilidad y velocidad;
            trabajo táctico y posicional; preparación física; ejercicios por posición y material por
            categoría, desde categorías menores hasta adulto. Encuentra qué trabajar y adapta la
            sesión a tu nivel y al espacio disponible.
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
                "Biblioteca completa, organizada y lista para aplicar. Ideal para jugadores y entrenadores: elige tu posición, categoría y objetivo para preparar la sesión sin empezar de cero.",
                tecnica,
              ],
              [
                "02",
                "Nutrición de alto rendimiento",
                "Material para orientar tu alimentación hacia una mejor energía, recuperación y rendimiento. Dale a la nutrición un lugar en tu preparación.",
                nutrition,
              ],
              [
                "03",
                "Entrenamientos individuales en casa",
                "Sigue trabajando para mejorar incluso los días que no tienes sesión de equipo. Encuentra entrenamientos individuales para dar continuidad a tu práctica en casa.",
                casa,
              ],
              [
                "04",
                "500 entrenamientos de definición",
                "Complemento físico para trabajar fuerza y acondicionamiento, y preparar tu presencia en el campo. 500 entrenamientos de definición muscular para ampliar tus opciones.",
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
            <CTA>Empezar a entrenar con dirección</CTA>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="entrena-con-intencion"
        className="border-y border-green-100 bg-green-50 px-5 py-11 sm:py-16"
      >
        <div className="mx-auto max-w-[720px]">
          <p className="mb-3 text-center text-xs font-black uppercase tracking-widest text-green-700">
            Lo que este acceso puede cambiar en tu rutina
          </p>
          <h2
            id="entrena-con-intencion"
            className="text-center text-[28px] font-black uppercase leading-[1.12] text-zinc-950 sm:text-[40px]"
          >
            Que tus ganas de mejorar{" "}
            <span className="text-green-700">se conviertan en un entrenamiento con intención.</span>
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Hay algo frustrante en terminar una sesión y sentir que podrías haberla aprovechado
              mejor. Como jugador, quieres trabajar ese control, ese pase o ese remate que todavía
              te cuesta. Como entrenador, quieres llegar al campo con una sesión preparada, sin
              resolverlo todo a última hora.
              <strong className="text-zinc-950">
                {" "}
                Tener ganas ayuda. Tener a mano qué trabajar te permite dar el siguiente paso.
              </strong>
            </p>
            <p>
              Por eso, el valor de los{" "}
              <strong className="text-zinc-950">más de 2.000 entrenamientos</strong> está también en
              poder elegir: buscar por posición y categoría, encontrar un ejercicio para tu objetivo
              y variar el trabajo cuando la rutina se queda corta. Menos tiempo recorriendo vídeos
              sueltos; más tiempo para practicar, observar y ajustar tu sesión.
            </p>
            <h3 className="pt-2 text-xl font-black leading-snug text-green-900 sm:text-2xl">
              Tu preparación continúa cuando sales del campo.
            </h3>
            <p>
              Si entrenas por tu cuenta, las{" "}
              <strong className="text-zinc-950">rutinas individuales en casa</strong> te dan ideas
              para mantener la práctica entre sesiones. Si quieres ampliar tu trabajo físico, los{" "}
              <strong className="text-zinc-950">500 entrenamientos de definición muscular</strong>{" "}
              suman opciones de fuerza y acondicionamiento. Y el material de{" "}
              <strong className="text-zinc-950">nutrición de alto rendimiento</strong> te ayuda a
              comprender cómo la alimentación participa en tu energía y recuperación.
            </p>
            <p>
              Los <strong className="text-zinc-950">4 bonos adicionales</strong> amplían tus
              recursos con más material de entrenamiento, técnica individual y preparación física,
              además del bono sorpresa. Puedes consultar lo que necesitas ahora y volver al resto
              cuando cambie tu objetivo.
            </p>
            <h3 className="pt-2 text-xl font-black leading-snug text-green-900 sm:text-2xl">
              Una compra que puedes seguir aprovechando.
            </h3>
            <p>
              Con <strong className="text-zinc-950">acceso vitalicio y actualizaciones</strong>, la
              biblioteca sigue disponible para futuras sesiones. Ábrela desde el móvil antes de
              practicar, revísala en la tablet o prepara el entrenamiento desde el ordenador. No
              necesitas consumir todo de una vez: empieza por lo que más te sirva y avanza a tu
              ritmo.
            </p>
            <p>
              El Plan Completo reúne todo por{" "}
              <strong className="text-zinc-950">US$ 5,00 en un solo pago, sin mensualidades</strong>
              . Por apenas <strong className="text-zinc-950">US$ 0,50 más que el Básico</strong>,
              tienes los complementos, los bonos y los beneficios del Completo. Además, cuentas con{" "}
              <strong className="text-zinc-950">7 días de garantía</strong> para conocer el material
              conforme a las condiciones de Hotmart.
            </p>
            <p className="border-t border-green-200 pt-5 text-lg font-bold leading-relaxed text-green-950 sm:text-xl">
              No es solo una carpeta de ejercicios. Es un sistema completo para dejar de entrenar
              sin dirección y empezar a mejorar con método, tanto dentro como fuera del campo.
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
          <Heading tag="Elige tu acceso">
            El Completo entrega mucho más <span className="text-green-600">por solo US$ 5,00</span>
          </Heading>
          <p className="mx-auto -mt-2 mb-8 max-w-xl text-center text-sm leading-relaxed text-slate-600">
            Por apenas US$ 0,50 más que el Básico, llevas más de 2.000 entrenamientos, 500 rutinas
            extras, todos los complementos, 4 bonos, actualizaciones y acceso vitalicio.
          </p>
          <div className="mx-auto grid max-w-4xl items-start gap-7 md:grid-cols-2">
            <PlanCard plan="premium" choose={choose} />
            <PlanCard plan="basic" choose={choose} />
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
          <CTA>Acceder a todo por US$ 5,00</CTA>
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
          <CTA>Quiero el sistema completo ahora</CTA>
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
        >
          <button className="absolute inset-0" onClick={() => setPlan(null)} aria-label="Cerrar" />
          <div className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-[540px] sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#07130b] px-5 py-4 text-white">
              <div>
                <p className="text-[9px] font-black uppercase text-yellow-400">
                  Confirma tu elección
                </p>
                <p className="font-black">Plan {plan === "premium" ? "Completo" : "Básico"}</p>
              </div>
              <button onClick={() => setPlan(null)} aria-label="Cerrar">
                <X />
              </button>
            </div>
            <div className="p-5 text-center sm:p-7">
              {plan === "premium" ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-2 text-[10px] font-black uppercase">
                    <Star className="h-3 w-3 fill-current" /> Toda la entrega
                  </span>
                  <h2 className="mt-4 text-[27px] font-black uppercase">
                    Más de 2.500 materiales + 4 bonos
                  </h2>
                  <img
                    src={hero}
                    alt="Plan Completo"
                    className="mx-auto mt-4 max-h-[210px] rounded-2xl"
                  />
                  <div className="mt-4 bg-[#07130b] p-4 text-white">
                    <p className="text-xs line-through text-slate-400">
                      Valor de referencia: US$ 29,90
                    </p>
                    <p className="text-5xl font-black text-yellow-400">US$ 5,00</p>
                    <p className="text-[10px] font-black uppercase">
                      Pago único · Acceso vitalicio
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-[27px] font-black uppercase">Plan Básico</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Incluye solo la biblioteca esencial y deja fuera los complementos del Completo.
                  </p>
                  <p className="mt-4 text-5xl font-black">US$ 4,50</p>
                  <button
                    onClick={() => choose("premium")}
                    className="mt-4 text-sm font-black text-green-600 underline"
                  >
                    Llevar toda la entrega por solo US$ 0,50 más
                  </button>
                </>
              )}
              <div className="mt-5 space-y-2 bg-slate-50 p-4 text-left">
                {(plan === "premium"
                  ? [
                      "+2.000 entrenamientos organizados",
                      "+500 rutinas de definición",
                      "Nutrición y entrenamientos en casa",
                      "4 bonos, actualizaciones y acceso vitalicio",
                    ]
                  : ["Biblioteca básica", "Material digital", "Acceso multidispositivo"]
                ).map((item) => (
                  <p key={item} className="flex gap-2 text-sm font-bold">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    {item}
                  </p>
                ))}
              </div>
              <a
                href={checkoutUrl(CHECKOUT[plan])}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-[62px] items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-[15px] font-black uppercase text-white"
              >
                {plan === "premium" ? "Acceder a todo por US$ 5,00" : "Comprar Básico por US$ 4,50"}
                <ArrowRight />
              </a>
              <p className="mt-3 flex justify-center gap-1 text-[10px] text-slate-500">
                <Lock className="h-3 w-3" /> Hotmart abrirá en una nueva pestaña
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
