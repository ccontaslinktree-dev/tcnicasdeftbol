import { createFileRoute } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  Trophy,
  Target,
  Users,
  Mail,
  Lock,
  ArrowDown,
  Flame,
  Star,
} from "lucide-react";
import heroProduct from "@/assets/hero-product.png";
import bonus1 from "@/assets/bonus-1.jpg";
import bonus2 from "@/assets/bonus-2.jpg";
import bonus3 from "@/assets/bonus-3.jpg";
import bonusSurprise from "@/assets/bonus-surprise.png";
import methodList from "@/assets/method-list.jpg";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.webp";
import testimonial3 from "@/assets/testimonial-3.webp";
import testimonial4 from "@/assets/testimonial-4.jpg";
import previewAsset from "@/assets/preview.mov.asset.json";
import featFisico from "@/assets/feature-fisico.jpg";
import featTactico from "@/assets/feature-tactico.jpg";
import featDribles from "@/assets/feature-dribles.jpg";
import featAgilidad from "@/assets/feature-agilidad.jpg";
import featChutes from "@/assets/feature-chutes.jpg";
import featPasses from "@/assets/feature-passes.jpg";

const CHECKOUT_URL = "https://pay.hotmart.com/G107438250J?checkoutMode=10";

export const Route = createFileRoute("/")({
  component: Index,
});

function eid() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function fireEvent(name: string, value?: number) {
  if (typeof window === "undefined") return;
  const event_id = eid();
  // @ts-expect-error fbq global
  window.fbq?.("track", name, value ? { value, currency: "USD" } : undefined, {
    eventID: event_id,
  });
  // CAPI relay via edge function (dedup by event_id)
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supaUrl || !supaKey) return;
  const getCookie = (k: string) => {
    const m = document.cookie.match(new RegExp("(^| )" + k + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : undefined;
  };
  fetch(`${supaUrl}/functions/v1/meta-capi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supaKey,
      Authorization: `Bearer ${supaKey}`,
    },
    body: JSON.stringify({
      event_name: name,
      event_id,
      event_source_url: window.location.href,
      user_agent: navigator.userAgent,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      value,
      currency: "USD",
    }),
    keepalive: true,
  }).catch(() => {});
}

function goCheckout(source: string) {
  fireEvent("InitiateCheckout", 6.5);
  try {
    sessionStorage.setItem("cta_source", source);
  } catch {
    // Continue to checkout even when browser storage is unavailable.
  }
  const checkoutUrl = new URL(CHECKOUT_URL);
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (!checkoutUrl.searchParams.has(key)) {
      checkoutUrl.searchParams.append(key, value);
    }
  });
  window.location.href = checkoutUrl.toString();
}

type ReadingStage =
  | "plan"
  | "biblioteca"
  | "incluye"
  | "metodo"
  | "como-funciona"
  | "testimonios"
  | "bonos"
  | "equipo"
  | "comparacion"
  | "garantia"
  | "preguntas"
  | "oferta";

function NextSectionLink({
  to,
  children,
  dark = false,
}: {
  to: ReadingStage;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <a
      href={`#${to}`}
      className={`mt-8 w-full max-w-[560px] mx-auto flex items-center justify-center gap-3 rounded-2xl px-5 py-4 sm:py-5 text-center font-bold text-base sm:text-lg leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d] ${
        dark
          ? "bg-[#facc15] hover:bg-[#eab308] text-[#0a0a0a]"
          : "bg-[#15803d] hover:bg-[#166534] text-white"
      }`}
    >
      <span>{children}</span>
      <ArrowDown className="w-5 h-5 shrink-0" aria-hidden="true" />
    </a>
  );
}

const testimonials = [testimonial1, testimonial2, testimonial3, testimonial4];

const faqs = [
  {
    q: "¿Cómo recibo el material después de la compra?",
    a: "Al finalizar la compra recibes inmediatamente por e-mail el acceso a toda la biblioteca digital con los +2.000 ejercicios y los 4 bonos. Sin esperas, sin envíos.",
  },
  {
    q: "¿En qué dispositivos puedo acceder?",
    a: "Puedes acceder desde móvil, tablet u ordenador, 100% online, en cualquier momento y desde donde quieras.",
  },
  {
    q: "¿Necesito conocimientos previos de fútbol?",
    a: "No. El método completo está organizado por posición, edad y nivel, desde principiantes hasta jugadores avanzados y entrenadores profesionales.",
  },
  {
    q: "¿Cuánto tiempo tengo acceso al contenido?",
    a: "Acceso vitalicio. Pagas una sola vez y usas el material organizado siempre que lo necesites, con actualizaciones incluidas.",
  },
  {
    q: "¿Y si no me gusta o no es para mí?",
    a: "Tienes 7 días completos de garantía incondicional. Si sientes que no es para ti, nos escribes un email y te devolvemos hasta el último céntimo.",
  },
  {
    q: "¿Los ejercicios sirven para entrenadores y jugadores?",
    a: "Sí. Cada ejercicio incluye la variante para entrenamiento colectivo y también para trabajo individual, con progresión clara.",
  },
  {
    q: "¿El pago es seguro?",
    a: "Sí. El pago se procesa por Hotmart con cifrado bancario. Aceptamos tarjeta, transferencia y otros medios locales según tu país.",
  },
];

function Index() {
  useEffect(() => {
    fireEvent("ViewContent");
  }, []);

  return (
    <main className="football-reading-page min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden">
      {/* Introduction: understand the promise and watch before any CTA. */}
      <section aria-labelledby="intro-title" className="px-5 pt-8 sm:pt-12 pb-8 text-center">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[#15803d] text-xs sm:text-sm font-black uppercase tracking-widest mb-4">
            Para entrenadores y jugadores de fútbol
          </p>
          <h1
            id="intro-title"
            className="font-black leading-[1.12] tracking-tight text-[#0a0a0a] mb-5 text-[clamp(30px,6vw,54px)]"
          >
            Deja de improvisar tus entrenamientos.{" "}
            <span className="text-[#15803d]">Llega al campo con un plan.</span>
          </h1>
          <p className="text-slate-600 max-w-[660px] mx-auto mb-7 leading-relaxed text-base sm:text-lg">
            Conoce una biblioteca digital con{" "}
            <b className="text-[#0a0a0a]">+2.000 ejercicios organizados por posición y categoría</b>
            . Mira el material por dentro y descubre cómo utilizarlo para preparar tu próxima
            sesión.
          </p>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black max-w-[520px] mx-auto">
            <video
              src={previewAsset.url}
              aria-label="Vista previa de la biblioteca de ejercicios de fútbol"
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Una vista previa del material. Después, conoce qué incluye y cómo se utiliza.
          </p>
          <NextSectionLink to="plan">
            Descubrir cómo me ayuda a preparar mis entrenamientos
          </NextSectionLink>
        </div>
      </section>

      {/* Recognize the problem before presenting the deliverables. */}
      <section
        id="plan"
        tabIndex={-1}
        aria-labelledby="plan-title"
        className="px-5 py-12 sm:py-14 bg-white"
      >
        <div className="max-w-[1000px] mx-auto">
          <p className="text-center text-[#15803d] font-black uppercase tracking-widest text-xs mb-2">
            Empieza por darle sentido a cada sesión
          </p>
          <h2
            id="plan-title"
            className="text-center font-black text-[clamp(26px,5vw,40px)] leading-tight mb-4"
          >
            ¿Buscas ejercicios a última hora y terminas repitiendo lo mismo?
          </h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Si cada entrenamiento empieza con «¿qué hacemos hoy?», necesitas un punto de partida. La
            biblioteca te permite elegir material por posición y categoría para preparar una sesión
            con un objetivo claro.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Users,
                title: "Si eres entrenador",
                text: "Deja de reunir vídeos sueltos antes de cada práctica. Consulta los ejercicios organizados y elige qué trabajar con tu equipo.",
              },
              {
                icon: Target,
                title: "Si eres jugador",
                text: "Dale una intención a tu entrenamiento. Encuentra material para tu posición y prepara el trabajo técnico que quieres llevar al campo.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6">
                <Icon className="w-7 h-7 text-[#15803d] mb-3" aria-hidden="true" />
                <h3 className="font-black text-xl mb-2">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <NextSectionLink to="biblioteca">
            Explorar los entrenamientos de la biblioteca
          </NextSectionLink>
        </div>
      </section>

      {/* Explore the training categories. */}
      <section
        id="biblioteca"
        tabIndex={-1}
        aria-labelledby="biblioteca-title"
        className="py-12 sm:py-14 bg-[#0a0a0a] text-white overflow-hidden"
      >
        <div className="max-w-[1100px] mx-auto px-5 text-center mb-6 sm:mb-8">
          <p className="text-[#facc15] font-black uppercase tracking-widest text-xs mb-2">
            Lo que vas a recibir
          </p>
          <h2
            id="biblioteca-title"
            className="font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-3"
          >
            +2.000 entrenamientos <span className="text-[#facc15]">organizados</span> para aplicar
            hoy
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Trabajo físico, táctica, regates, agilidad, remates y pases: explora las áreas que
            puedes trabajar en tus sesiones.
          </p>
        </div>

        <div className="relative w-full">
          <div className="flex gap-4 animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {[
              { img: featFisico, t: "Entrenamientos Físicos" },
              { img: featTactico, t: "Tácticas y Estrategias" },
              { img: featDribles, t: "Conducción y Regates" },
              { img: featAgilidad, t: "Agilidad y Velocidad" },
              { img: featChutes, t: "Remates y Definición" },
              { img: featPasses, t: "Pases y Juego Colectivo" },
              { img: featFisico, t: "Entrenamientos Físicos" },
              { img: featTactico, t: "Tácticas y Estrategias" },
              { img: featDribles, t: "Conducción y Regates" },
              { img: featAgilidad, t: "Agilidad y Velocidad" },
              { img: featChutes, t: "Remates y Definición" },
              { img: featPasses, t: "Pases y Juego Colectivo" },
            ].map((f, i) => (
              <div
                key={i}
                className="relative shrink-0 w-[200px] sm:w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#facc15]/30 transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <img src={f.img} alt={f.t} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 sm:p-4">
                  <p className="font-black text-white text-xs sm:text-base uppercase tracking-wide">
                    {f.t}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-5 mt-8 sm:mt-10 text-center">
          <NextSectionLink to="incluye" dark>
            Ver todo lo que voy a recibir
          </NextSectionLink>
        </div>
      </section>

      {/* Includes */}
      <section
        id="incluye"
        tabIndex={-1}
        aria-labelledby="incluye-title"
        className="px-5 py-12 sm:py-14"
      >
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            Lo que Incluye tu Kit
          </p>
          <h2
            id="incluye-title"
            className="text-center font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-3"
          >
            Una biblioteca digital <span className="text-[#16a34a]">lista para consultar</span>
          </h2>
          <p className="text-center text-slate-600 max-w-xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base">
            Recibes acceso online a los ejercicios organizados y a los materiales complementarios.
            Consulta el contenido desde tu móvil, tablet u ordenador.
          </p>

          <img
            src={heroProduct}
            alt="Presentación de la biblioteca digital con más de 2.000 entrenamientos de fútbol"
            className="mx-auto mb-8 max-w-[360px] w-full rounded-2xl shadow-lg"
            width={1024}
            height={1536}
            loading="lazy"
          />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                i: Trophy,
                t: "+2.000 entrenamientos organizados",
                d: "Biblioteca completa lista para acceder desde cualquier dispositivo.",
              },
              {
                i: Target,
                t: "Organizados por posición y categorías",
                d: "Portero, defensa, mediocampo y delantero, desde Sub-8 hasta Adulto.",
              },
              {
                i: Zap,
                t: "Técnica individual y colectiva",
                d: "Control, regate, pase y jugadas de conjunto.",
              },
              {
                i: Flame,
                t: "Preparación física",
                d: "Ejercicios de velocidad, fuerza y resistencia para complementar el trabajo técnico.",
              },
              {
                i: Star,
                t: "4 Bonos exclusivos incluidos",
                d: "Materiales extra para acelerar tu evolución.",
              },
              {
                i: Mail,
                t: "Acceso instantáneo por e-mail",
                d: "Al finalizar la compra recibes al instante toda la biblioteca.",
              },
            ].map(({ i: Icon, t, d }) => (
              <div
                key={t}
                className="group bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] hover:border-[#16a34a]/40 transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#16a34a]/10 text-[#16a34a] flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 group-hover:bg-[#16a34a] group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[13px] sm:text-[15px] leading-snug mb-1">{t}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <NextSectionLink to="metodo">Ver el material por dentro</NextSectionLink>
        </div>
      </section>

      {/* Product carousel - method visual */}
      <section
        id="metodo"
        tabIndex={-1}
        aria-labelledby="metodo-title"
        className="px-5 py-10 sm:py-12 bg-white"
      >
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            +2.000 Entrenamientos Profesionales
          </p>
          <h2
            id="metodo-title"
            className="text-center font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-6 sm:mb-8"
          >
            El <span className="text-[#16a34a]">método completo</span> en un solo lugar
          </h2>
          <Carousel className="max-w-2xl mx-auto">
            <CarouselContent>
              {[methodList, bonus1, bonus2, bonus3].map((src, i) => (
                <CarouselItem key={i}>
                  <div className="overflow-hidden rounded-2xl bg-white">
                    <img
                      src={src}
                      alt={
                        [
                          "Organización de los ejercicios de fútbol",
                          "Guía de entrenamiento",
                          "Ejercicios de técnica individual",
                          "Circuitos de preparación física",
                        ][i]
                      }
                      className="w-full object-contain sm:object-cover transition-transform duration-500 hover:scale-[1.06] active:scale-95"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:-left-12" aria-label="Ver material anterior" />
            <CarouselNext className="right-2 sm:-right-12" aria-label="Ver material siguiente" />
          </Carousel>
          <NextSectionLink to="como-funciona">
            Entender cómo se utiliza en cada sesión
          </NextSectionLink>
        </div>
      </section>

      {/* How it works */}
      <section
        id="como-funciona"
        tabIndex={-1}
        aria-labelledby="como-funciona-title"
        className="px-5 py-14 bg-white"
      >
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            Paso a paso
          </p>
          <h2
            id="como-funciona-title"
            className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-10"
          >
            Cómo funciona en <span className="text-[#16a34a]">3 pasos</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: 1,
                t: "Accede desde donde quieras",
                d: "Móvil, tablet u ordenador, 100% online y con acceso inmediato tras la compra.",
              },
              {
                n: 2,
                t: "Elige por posición y categoría",
                d: "Filtra el ejercicio ideal según edad, posición y objetivo del día.",
              },
              {
                n: 3,
                t: "Abre el material y entrena",
                d: "Material completo organizado, listo para aplicar directamente en el campo.",
              },
            ].map((s) => (
              <div key={s.n} className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-[#16a34a] text-white font-black text-xl flex items-center justify-center mb-4">
                  {s.n}
                </div>
                <h3 className="font-black text-lg mb-1">{s.t}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <NextSectionLink to="testimonios">
            Leer las experiencias de otros jugadores y entrenadores
          </NextSectionLink>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonios"
        tabIndex={-1}
        aria-labelledby="testimonios-title"
        className="px-5 py-14"
      >
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            Resultados reales
          </p>
          <h2
            id="testimonios-title"
            className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-3"
          >
            Mira <span className="text-[#16a34a]">quiénes ya están entrenando</span> con nosotros
          </h2>
          <p className="text-center text-slate-600 max-w-xl mx-auto mb-10">
            Capturas reales de jugadores, entrenadores y padres que transformaron su juego.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((src, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <img
                  src={src}
                  alt={`Testimonio ${i + 1}`}
                  className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <NextSectionLink to="bonos">Conocer los 4 bonos incluidos</NextSectionLink>
        </div>
      </section>

      {/* 4 Bonus */}
      <section
        id="bonos"
        tabIndex={-1}
        aria-labelledby="bonos-title"
        className="px-5 py-14 bg-white"
      >
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            🎁 Regalos Exclusivos
          </p>
          <h2
            id="bonos-title"
            className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-3"
          >
            4 <span className="text-[#16a34a]">materiales extra</span> para complementar tus
            entrenamientos
          </h2>
          <p className="text-center text-slate-600 max-w-xl mx-auto mb-10">
            Materiales complementarios diseñados para acelerar tus resultados dentro y fuera del
            campo.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                n: "01",
                t: "Guía de Entrenamiento",
                d: "Manual completo con planificación semanal y progresión paso a paso.",
                img: bonus1,
              },
              {
                n: "02",
                t: "50 Ejercicios de Técnica Individual",
                d: "Ejercicios prácticos para dominar el balón y mejorar tu técnica base.",
                img: bonus2,
              },
              {
                n: "03",
                t: "Circuitos de Preparación Física",
                d: "Circuitos completos para ganar resistencia, fuerza y explosividad.",
                img: bonus3,
              },
              {
                n: "04",
                t: "Bono Sorpresa Exclusivo",
                d: "🎁 Un regalo secreto que solo descubrirás al entrar.",
                img: bonusSurprise,
              },
            ].map((b) => (
              <div
                key={b.n}
                className="group rounded-2xl bg-[#0a0a0a] text-white overflow-hidden border border-[#facc15]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#facc15] active:scale-[0.98]"
              >
                <div className="overflow-hidden">
                  <img
                    src={b.img}
                    alt={b.t}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="text-xs font-black uppercase tracking-widest text-[#facc15] mb-1">
                    BONO {b.n}
                  </div>
                  <h3 className="font-black text-lg mb-1">{b.t}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{b.d}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-[#facc15] text-[#0a0a0a] font-black px-3 py-1.5 rounded-md text-sm shadow-lg uppercase tracking-wide">
                      Incluido en tu compra
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="font-bold text-lg text-[#15803d]">
              Los 4 bonos están incluidos junto con la biblioteca.
            </p>
          </div>
          <NextSectionLink to="equipo">Conocer el enfoque de la biblioteca</NextSectionLink>
        </div>
      </section>

      {/* Who we are */}
      <section id="equipo" tabIndex={-1} aria-labelledby="equipo-title" className="px-5 py-14">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            Quiénes somos
          </p>
          <h2
            id="equipo-title"
            className="font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-4"
          >
            Equipo <span className="text-[#16a34a]">2000 Ejercicios de Fútbol</span>, Metodología
            que forma jugadores de verdad
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-4">
            Somos un equipo apasionado por el fútbol formativo. Reunimos en un solo lugar una
            biblioteca digital con <b>+2.000 ejercicios</b> organizados por posición, edad y
            objetivo, con la misma progresión y los mismos vídeos que se aplican en canteras y
            academias profesionales.
          </p>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Sin relleno, sin teoría vacía. Solo material organizado que funciona en el campo, listo
            para aplicar.
          </p>
          <div className="flex justify-center gap-8">
            <div>
              <p className="text-3xl font-black text-[#16a34a]">+2.000</p>
              <p className="text-xs uppercase text-slate-500 font-bold">Entrenamientos</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#16a34a]">100%</p>
              <p className="text-xs uppercase text-slate-500 font-bold">Organizado</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#16a34a]">24/7</p>
              <p className="text-xs uppercase text-slate-500 font-bold">Acceso inmediato</p>
            </div>
          </div>
          <NextSectionLink to="comparacion">
            Ver qué cambia al preparar mis sesiones
          </NextSectionLink>
        </div>
      </section>

      {/* Comparison */}
      <section
        id="comparacion"
        tabIndex={-1}
        aria-labelledby="comparacion-title"
        className="px-5 py-14"
      >
        <div className="max-w-[1100px] mx-auto">
          <h2
            id="comparacion-title"
            className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-10"
          >
            La <span className="text-[#16a34a]">diferencia</span> en el campo
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border-2 border-red-200">
              <p className="font-black uppercase text-red-600 mb-4">Sin el Kit</p>
              <ul className="space-y-3">
                {[
                  "Vídeos sueltos en YouTube, sin orden ni criterio profesional",
                  "Ejercicios genéricos que no encajan con tu posición ni edad",
                  "Sin progresión clara: entrenas mucho y avanzas poco",
                  "Horas planificando cada sesión, con dudas y sin resultados",
                  "Estancamiento y frustración temporada tras temporada",
                ].map((t) => (
                  <li key={t} className="flex gap-2 text-sm text-slate-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0a0a0a] text-white rounded-2xl p-6 border-2 border-[#16a34a]">
              <p className="font-black uppercase text-[#facc15] mb-4">Con el Kit</p>
              <ul className="space-y-3">
                {[
                  "Método completo por posición y categoría, todo organizado",
                  "Entrenamientos profesionales listos para aplicar hoy mismo",
                  "Progresión clara: ves resultados semana a semana",
                  "Ahorras horas: la biblioteca organizada hace el trabajo por ti",
                  "Confianza y evolución real dentro y fuera del campo",
                ].map((t) => (
                  <li key={t} className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <NextSectionLink to="garantia">Conocer la garantía de 7 días</NextSectionLink>
        </div>
      </section>

      {/* Guarantee */}
      <section
        id="garantia"
        tabIndex={-1}
        aria-labelledby="garantia-title"
        className="px-5 py-14 bg-white"
      >
        <div className="max-w-[900px] mx-auto text-center">
          <div className="w-64 h-64 sm:w-72 sm:h-72 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#facc15] to-[#f59e0b] flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(250,204,21,0.55)] hover:scale-105 transition-transform duration-500">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white flex flex-col items-center justify-center border-[6px] border-[#facc15]">
              <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 text-[#16a34a]" />
              <p className="font-black text-4xl sm:text-5xl leading-none mt-2">7 DÍAS</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
                Garantía Total
              </p>
            </div>
          </div>
          <p className="text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            Compra protegida
          </p>
          <h2
            id="garantia-title"
            className="font-black uppercase text-[clamp(28px,5.5vw,44px)] leading-tight mb-4"
          >
            Prueba el Kit sin Ningún Riesgo
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6 text-[clamp(15px,3.6vw,18px)]">
            Tienes <b>7 días completos</b> para explorar los +2.000 ejercicios, los 4 bonos y todo
            el método. Si sientes que no es para ti, por cualquier motivo, nos escribes un email y
            te devolvemos <b>hasta el último céntimo</b>.
          </p>
          <NextSectionLink to="preguntas">Resolver mis dudas antes de decidir</NextSectionLink>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="preguntas"
        tabIndex={-1}
        aria-labelledby="preguntas-title"
        className="px-5 py-14 bg-white"
      >
        <div className="max-w-[820px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            FAQ
          </p>
          <h2
            id="preguntas-title"
            className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-10"
          >
            Preguntas <span className="text-[#16a34a]">frecuentes</span>
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-200">
                <AccordionTrigger className="text-left font-bold text-base py-4 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <NextSectionLink to="oferta">Ver el precio y la oferta completa</NextSectionLink>
        </div>
      </section>

      {/* Offer / pricing */}
      <section
        id="oferta"
        tabIndex={-1}
        aria-labelledby="oferta-title"
        className="px-5 py-14 bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] text-white"
      >
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-[#facc15] font-black uppercase tracking-widest text-xs mb-2">
            🔥 Precio Especial Solo Hoy
          </p>
          <h2
            id="oferta-title"
            className="font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-3"
          >
            Todo lo que has visto, <span className="text-[#facc15]">en un solo paquete</span>
          </h2>
          <p className="text-slate-300 mb-6">
            Precio promocional válido <b className="text-white">solo por hoy</b>. Mañana vuelve al
            valor normal, no dejes escapar esta oportunidad.
          </p>

          <div className="bg-white text-[#0f172a] rounded-3xl p-6 sm:p-8 text-left shadow-2xl border-4 border-[#facc15]">
            <div className="bg-[#dc2626] text-white text-xs font-black uppercase tracking-widest inline-block px-3 py-1 rounded-full mb-3">
              🔥 ¡78% DE DESCUENTO!
            </div>
            <h3 className="font-black text-2xl mb-1">Paquete Premium</h3>
            <p className="text-sm text-slate-500">+2.000 entrenamientos + 4 bonos exclusivos</p>

            <label className="block text-xs font-bold uppercase text-slate-500 mt-4 mb-1">
              🌎 Elige tu país
            </label>
            <select className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 font-semibold bg-white">
              <option>🇲🇽 México</option>
              <option>🇨🇴 Colombia</option>
              <option>🇦🇷 Argentina</option>
              <option>🇨🇱 Chile</option>
              <option>🇵🇪 Perú</option>
              <option>🇧🇷 Brasil</option>
              <option>🇺🇾 Uruguay</option>
              <option>🇧🇴 Bolivia</option>
              <option>🇵🇾 Paraguay</option>
              <option>🇪🇸 España</option>
            </select>

            <div className="my-5">
              <p className="text-slate-500">
                De <span className="line-through font-bold">$29,90</span> solo por hoy
              </p>
              <p className="font-black text-5xl text-[#16a34a] mt-1">
                $6,50 <span className="text-2xl">USD</span>
              </p>
              <p className="text-sm font-bold text-[#dc2626] mt-1">
                78% DESCUENTO · Ahorras $23,40
              </p>
              <p className="text-xs text-slate-500 mt-2">✅ Pago único · Acceso vitalicio</p>
            </div>

            <ul className="space-y-2 text-sm">
              {[
                "+2.000 entrenamientos organizados",
                "Todas las posiciones",
                "Todas las categorías",
                "Entrenamientos técnicos, tácticos y preparación física",
                "Acceso vitalicio e inmediato por e-mail",
                "Actualizaciones semanales GRATIS",
                "Garantía incondicional de 7 días",
              ].map((li) => (
                <li key={li} className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <p className="text-xs font-black uppercase text-slate-500 mb-2">
                🎁 Bonos exclusivos incluidos
              </p>
              {[
                ["01", "Guía de Entrenamiento", 47],
                ["02", "50 Ejercicios de Técnica Individual", 39],
                ["03", "Pack de Circuitos de Preparación Física", 49],
                ["04", "Bono Sorpresa Exclusivo", 45],
              ].map(([n, t, p]) => (
                <div
                  key={n as string}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0 gap-2"
                >
                  <span className="min-w-0">
                    <b>BONO {n}</b> · {t}
                  </span>
                  <span className="shrink-0 flex items-center gap-2">
                    <span className="line-through text-slate-400 text-xs">${p}</span>
                    <span className="bg-[#facc15] text-[#0a0a0a] font-black px-2 py-0.5 rounded-md text-xs">
                      INCLUIDO
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goCheckout("offer")}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#15803d] hover:bg-[#166534] transition-colors text-white font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl shadow-[0_10px_30px_-6px_rgba(22,163,74,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d]"
            >
              Quiero el Paquete Premium
            </button>
            <p className="mt-3 text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Pago 100% seguro vía tarjeta o transferencia
            </p>
            <p className="mt-2 text-xs text-slate-500 text-center">
              ✅ Acceso inmediato después de la compra! ¿Finalizaste el pedido? Revisa tu e-mail y
              accede ahora mismo.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-10 bg-[#0a0a0a] text-slate-400 text-xs leading-relaxed">
        <div className="max-w-[900px] mx-auto text-center space-y-3">
          <p className="font-black text-white uppercase tracking-widest">
            2000 Ejercicios de Fútbol
          </p>
          <p>
            Este sitio no forma parte del sitio web de Facebook o Facebook Inc. Además, este sitio
            NO está patrocinado por Facebook de ninguna manera. FACEBOOK™ es una marca registrada de
            FACEBOOK, Inc.
          </p>
          <p>
            Este sitio no forma parte del sitio web de Meta Platforms, Inc. o Instagram. Además, no
            está patrocinado ni avalado por Meta™ ni Instagram™ de ninguna manera.
          </p>
          <p>
            Los resultados mencionados son ejemplos y no garantizan ganancias o resultados
            idénticos. Cada persona tiene un compromiso, dedicación y esfuerzo individual.
          </p>
          <p className="pt-2">
            © {new Date().getFullYear()} 2000 Ejercicios de Fútbol · Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Meta Pixel noscript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=889185807027175&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </main>
  );
}
