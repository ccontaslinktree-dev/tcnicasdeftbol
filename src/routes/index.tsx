import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  Trophy,
  Target,
  Users,
  Clock,
  Mail,
  Lock,
  PlayCircle,
  Eye,
  Sparkles,
  Flame,
  Star,
  ArrowRight,
  TrendingUp,
  X,
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

const PREMIUM_CHECKOUT_URL = "https://pay.kiwify.com/DdeFcSY";
const BASIC_CHECKOUT_URL = "https://pay.kiwify.com/eQoQd0Y";

export const Route = createFileRoute("/")({
  component: Index,
});

function useCountdown(minutes: number) {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return { mm, ss };
}

function useLiveViewers(base = 1247) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + Math.floor(Math.random() * 5 - 2)), 3000);
    return () => clearInterval(t);
  }, []);
  return n;
}

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
    headers: { "Content-Type": "application/json", apikey: supaKey, Authorization: `Bearer ${supaKey}` },
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

function goCheckout(url: string) {
  fireEvent("InitiateCheckout", url === PREMIUM_CHECKOUT_URL ? 7.90 : 5.50);
  window.location.href = url;
}

// scrollToOffer removed in favor of pop-out

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

  const { mm, ss } = useCountdown(29);
  const viewers = useLiveViewers();
  const [showPremiumPopout, setShowPremiumPopout] = useState(false);
  const [showBasicPopout, setShowBasicPopout] = useState(false);

  const openPremiumOffer = useCallback(() => {
    setShowPremiumPopout(true);
  }, []);

  const openBasicOffer = useCallback(() => {
    setShowBasicPopout(true);
  }, []);

  const handleClosePremium = useCallback(() => {
    setShowPremiumPopout(false);
    setTimeout(() => {
      setShowBasicPopout(true);
    }, 300);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden">
      {/* Top banner */}
      <div className="fixed top-0 inset-x-0 z-[90] bg-[#16a34a] text-white text-center font-black uppercase tracking-wide border-b-2 border-[#15803d] py-2.5 px-2 text-[clamp(10px,3vw,15px)]">
        Descuento Exclusivo Solo Hoy
      </div>
      <div style={{ height: 44 }} />

      {/* HERO */}
      <section className="px-5 pt-6 pb-8 text-center">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="font-black uppercase leading-[1.12] tracking-tight text-[#0a0a0a] mb-6 text-[clamp(22px,5.2vw,48px)]">
            Domina el Fútbol con{" "}
            <span className="bg-[#facc15] text-[#0a0a0a] px-2 py-0.5 rounded-md">
              +2.000 Entrenamientos Profesionales
            </span>{" "}
            organizados para Jugadores y Entrenadores, listos para aplicar
          </h1>
          <div className="max-w-[680px] mx-auto mb-6 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg border border-[#facc15]/40 flex items-start gap-3 text-left">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-[#facc15] mt-0.5 animate-pulse" />
            <p className="font-bold leading-snug text-[clamp(12px,3.4vw,15px)]">
              <span className="text-[#facc15] font-black uppercase">Actualizaciones automáticas:</span> añadimos nuevos ejercicios constantemente, además de las estrategias clásicas que grandes clubes usan para lograr resultados de élite. Tu biblioteca crece contigo, siempre.
            </p>
          </div>
          <p className="text-slate-600 font-medium max-w-[640px] mx-auto mb-7 leading-relaxed text-[clamp(14px,3.6vw,19px)]">
            Accede a la <span className="bg-[#facc15] text-[#0a0a0a] font-black px-2 py-0.5 rounded-md">biblioteca completa</span> organizada por{" "}
            <b className="text-[#0a0a0a]">posición y categoría</b>, método profesional, acceso inmediato{" "}
            <span className="bg-[#facc15] text-[#0a0a0a] font-black px-2 py-0.5 rounded-md">+ 4 Bonos exclusivos</span>
          </p>

          <img
            src={heroProduct}
            alt="+2.000 Entrenamientos de Fútbol"
            className="mx-auto max-w-[520px] w-full rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.03] hover:-rotate-1"
            width={1024}
            height={1536}
            loading="eager"
          />
          <p className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-4 h-4" /> Pago 100% seguro · Acceso inmediato por e-mail
          </p>
        </div>
      </section>

      {/* Video preview - moved to 2nd section for stronger conversion */}
      <section className="px-5 pb-4 pt-2">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Vista previa exclusiva</p>
          <h2 className="font-black uppercase text-[clamp(22px,5vw,38px)] leading-tight mb-3">
            Mira por dentro la <span className="text-[#16a34a]">biblioteca</span> que vas a recibir
          </h2>
          <p className="text-slate-600 mb-5 text-sm sm:text-base">Un adelanto real del material organizado y listo para aplicar 👇</p>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black max-w-[520px] mx-auto">
            <video
              src={previewAsset.url}
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-[3/4] object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              EN VIVO · <Eye className="w-3.5 h-3.5" /> {viewers} viendo
            </div>
          </div>
        </div>
      </section>

      {/* Urgency badge */}
      <div className="px-5">
        <div className="max-w-[720px] mx-auto bg-white border-2 border-[#facc15] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="animate-pulse w-2.5 h-2.5 rounded-full bg-red-500" />
          <p className="text-sm sm:text-base font-bold text-[#0a0a0a]">
            🔥 Últimas <span className="text-[#dc2626]">37 plazas</span> del cupo de hoy · {viewers} personas viendo esta oferta ahora
          </p>
        </div>
      </div>

      {/* What you get - scrolling marquee (moved up as 3rd section) */}
      <section className="py-12 sm:py-14 bg-[#0a0a0a] text-white overflow-hidden mt-10">
        <div className="max-w-[1100px] mx-auto px-5 text-center mb-6 sm:mb-8">
          <p className="text-[#facc15] font-black uppercase tracking-widest text-xs mb-2">Lo que vas a recibir</p>
          <h2 className="font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-3">
            +2.000 entrenamientos <span className="text-[#facc15]">organizados</span> para aplicar hoy
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Físicos, tácticos, dribles, agilidad, chutes, pases y mucho más.
          </p>
        </div>

        <div className="relative w-full">
          <div className="flex gap-4 animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {[
              { img: featFisico, t: "Entrenamientos Físicos" },
              { img: featTactico, t: "Tácticas y Estrategias" },
              { img: featDribles, t: "Dribles y Regates" },
              { img: featAgilidad, t: "Agilidad y Velocidad" },
              { img: featChutes, t: "Chutes y Definición" },
              { img: featPasses, t: "Pases y Juego Colectivo" },
              { img: featFisico, t: "Entrenamientos Físicos" },
              { img: featTactico, t: "Tácticas y Estrategias" },
              { img: featDribles, t: "Dribles y Regates" },
              { img: featAgilidad, t: "Agilidad y Velocidad" },
              { img: featChutes, t: "Chutes y Definición" },
              { img: featPasses, t: "Pases y Juego Colectivo" },
            ].map((f, i) => (
              <div
                key={i}
                className="relative shrink-0 w-[200px] sm:w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#facc15]/30 transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <img src={f.img} alt={f.t} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 sm:p-4">
                  <p className="font-black text-white text-xs sm:text-base uppercase tracking-wide">{f.t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-5 mt-8 sm:mt-10 text-center">
          <button
            onClick={openPremiumOffer}
            className="w-full max-w-[560px] mx-auto flex items-center justify-center gap-2 bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] transition-all text-[#0a0a0a] font-black uppercase text-[clamp(15px,4vw,20px)] py-4 sm:py-5 px-6 rounded-2xl shadow-[0_10px_30px_-6px_rgba(250,204,21,0.55)]"
          >
            Quiero acceso ahora
          </button>
        </div>
      </section>

      {/* Includes */}
      <section className="px-5 py-12 sm:py-14">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Lo que Incluye tu Kit</p>
          <h2 className="text-center font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-3">
            Todo para <span className="text-[#16a34a]">jugar mejor</span>
          </h2>
          <p className="text-center text-slate-600 max-w-xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base">
            Método completo, organizado y profesional.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { i: Trophy, t: "+2.000 entrenamientos organizados", d: "Biblioteca completa lista para acceder desde cualquier dispositivo." },
              { i: Target, t: "Organizados por posición y categorías", d: "Portero, defensa, mediocampo y delantero, desde Sub-8 hasta Adulto." },
              { i: Zap, t: "Técnica individual y colectiva", d: "Control, regate, pase y jugadas de conjunto." },
              { i: Flame, t: "Preparación física y prevención", d: "Velocidad, fuerza, resistencia y menos lesiones." },
              { i: Star, t: "4 Bonos exclusivos incluidos", d: "Materiales extra para acelerar tu evolución." },
              { i: Mail, t: "Acceso instantáneo por e-mail", d: "Al finalizar la compra recibes al instante toda la biblioteca." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="group bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] hover:border-[#16a34a]/40 transition-all duration-300">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#16a34a]/10 text-[#16a34a] flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 group-hover:bg-[#16a34a] group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[13px] sm:text-[15px] leading-snug mb-1">{t}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product carousel - method visual */}
      <section className="px-5 py-10 sm:py-12 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            +2.000 Entrenamientos Profesionales
          </p>
          <h2 className="text-center font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-6 sm:mb-8">
            El <span className="text-[#16a34a]">método completo</span> en un solo lugar
          </h2>
          <Carousel className="max-w-2xl mx-auto">
            <CarouselContent>
              {[methodList, bonus1, bonus2, bonus3].map((src, i) => (
                <CarouselItem key={i}>
                  <div className="overflow-hidden rounded-2xl bg-white">
                    <img
                      src={src}
                      alt={`Vista ${i + 1}`}
                      className="w-full object-contain sm:object-cover transition-transform duration-500 hover:scale-[1.06] active:scale-95"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* CTA after value stack */}
      <section className="px-5 py-10">
        <div className="max-w-[900px] mx-auto text-center">
          <button
            onClick={openPremiumOffer}
            className="mt-8 w-full max-w-[560px] mx-auto flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] transition-colors text-white font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl shadow-[0_10px_30px_-6px_rgba(22,163,74,0.55)]"
          >
            <PlayCircle className="w-6 h-6" /> Desbloquear la Biblioteca Completa
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-14 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Paso a paso</p>
          <h2 className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-10">
            Cómo funciona en <span className="text-[#16a34a]">3 pasos</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: 1, t: "Accede desde donde quieras", d: "Móvil, tablet u ordenador, 100% online y con acceso inmediato tras la compra." },
              { n: 2, t: "Elige por posición y categoría", d: "Filtra el ejercicio ideal según edad, posición y objetivo del día." },
              { n: 3, t: "Abre el material y entrena", d: "Material completo organizado, listo para aplicar directamente en el campo." },
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
          <button
            onClick={openPremiumOffer}
            className="mt-10 w-full max-w-[560px] mx-auto flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] transition-colors text-white font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl shadow-[0_10px_30px_-6px_rgba(22,163,74,0.55)]"
          >
            Quiero acceder ahora
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-14">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Resultados reales</p>
          <h2 className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-3">
            Mira <span className="text-[#16a34a]">quiénes ya están entrenando</span> con nosotros
          </h2>
          <p className="text-center text-slate-600 max-w-xl mx-auto mb-10">
            Capturas reales de jugadores, entrenadores y padres que transformaron su juego.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <img
                  src={src}
                  alt={`Testimonio ${i + 1}`}
                  className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <button
            onClick={openPremiumOffer}
            className="mt-10 w-full max-w-[560px] mx-auto flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] transition-colors text-white font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl shadow-[0_10px_30px_-6px_rgba(22,163,74,0.55)]"
          >
            Quiero Empezar Ahora Mismo
          </button>
        </div>
      </section>

      {/* 4 Bonus */}
      <section className="px-5 py-14 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">
            🎁 Regalos Exclusivos
          </p>
          <h2 className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-3">
            4 <span className="text-[#16a34a]">Bonos</span> por tu compra hoy
          </h2>
          <p className="text-center text-slate-600 max-w-xl mx-auto mb-10">
            Materiales complementarios diseñados para acelerar tus resultados dentro y fuera del campo.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { n: "01", t: "Guía de Entrenamiento", d: "Manual completo con planificación semanal y progresión paso a paso.", price1: 47, price2: 19, img: bonus1 },
              { n: "02", t: "50 Ejercicios de Técnica Individual", d: "Ejercicios prácticos para dominar el balón y mejorar tu técnica base.", price1: 39, price2: 17, img: bonus2 },
              { n: "03", t: "Circuitos de Preparación Física", d: "Circuitos completos para ganar resistencia, fuerza y explosividad.", price1: 49, price2: 21, img: bonus3 },
              { n: "04", t: "Bono Sorpresa Exclusivo", d: "🎁 Un regalo secreto que solo descubrirás al entrar.", price1: 45, price2: 18, img: bonusSurprise },
            ].map((b) => (
              <div key={b.n} className="group rounded-2xl bg-[#0a0a0a] text-white overflow-hidden border border-[#facc15]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#facc15] active:scale-[0.98]">
                <div className="overflow-hidden">
                  <img src={b.img} alt={b.t} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-black uppercase tracking-widest text-[#facc15] mb-1">
                    BONO {b.n}
                  </div>
                  <h3 className="font-black text-lg mb-1">{b.t}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{b.d}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="line-through text-slate-400 font-bold text-lg">${b.price1}</span>
                    <span className="line-through text-slate-400 font-bold text-lg">${b.price2}</span>
                    <span className="bg-[#facc15] text-[#0a0a0a] font-black px-3 py-1.5 rounded-md text-sm shadow-lg uppercase tracking-wide">
                      Incluido en tu compra
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-600">Valor real de los bonos <span className="line-through font-bold">$180</span> <span className="line-through font-bold">$75</span></p>
            <p className="font-black text-2xl mt-1">
              hoy <span className="text-[#16a34a]">incluidos en tu pedido</span>
            </p>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="px-5 py-14">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Quiénes somos</p>
          <h2 className="font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-4">
            Equipo{" "}
            <span className="text-[#16a34a]">2000 Ejercicios de Fútbol</span>, Metodología que forma jugadores de verdad
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-4">
            Somos un equipo apasionado por el fútbol formativo. Reunimos en un solo lugar una biblioteca digital con{" "}
            <b>+2.000 ejercicios</b> organizados por posición, edad y objetivo, con la misma progresión y los mismos
            vídeos que se aplican en canteras y academias profesionales.
          </p>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Sin relleno, sin teoría vacía. Solo material organizado que funciona en el campo, listo para aplicar.
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
        </div>
      </section>

      {/* Offer / pricing */}
      <section id="oferta" className="px-5 py-16 sm:py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] text-white scroll-mt-16">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[#facc15] font-black uppercase tracking-widest text-xs mb-2">🔥 Precio Especial Solo Hoy</p>
            <h2 className="font-black uppercase text-[clamp(26px,5vw,44px)] leading-tight mb-4">
              Elige tu paquete y <span className="text-[#facc15]">empieza ahora</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
              Precio promocional válido <b className="text-white">solo por hoy</b>. Mañana vuelve al valor normal, no dejes escapar esta oportunidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-[960px] mx-auto">
            {/* Plan Premium - On page */}
            <div className="relative group bg-white rounded-[32px] p-6 sm:p-8 flex flex-col border-2 border-[#16a34a] shadow-[0_20px_50px_-12px_rgba(22,163,74,0.3)] transform transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#16a34a] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="w-4 h-4 text-[#facc15]" />
                RECOMENDADO · MEJOR VALOR
              </div>
              
              <div className="mb-8">
                <h3 className="text-[#0a0a0a] font-black uppercase text-2xl sm:text-3xl mb-1">Plan Premium</h3>
                <p className="text-slate-500 font-bold italic text-sm">Biblioteca Completa + Todos los Bonos</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  "+2.000 Ejercicios Profesionales",
                  "4 Bonos Sorpresa Incluidos",
                  "Acceso Vitalicio e Inmediato",
                  "Actualizaciones Automáticas",
                  "Garantía de 7 Días",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="bg-[#16a34a] rounded-full p-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[#0f172a] font-bold text-sm tracking-tight">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                <p className="text-slate-400 font-bold text-xl line-through leading-none">$29.90</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black text-[#0f172a]">$7.90</span>
                  <span className="text-2xl font-black text-[#16a34a]">USD</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="bg-[#facc15] text-[#0a0a0a] px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm">
                    Ahorras 73%
                  </div>
                  <div className="flex items-center gap-1 text-[#dc2626] font-black text-xs uppercase tracking-tight animate-pulse">
                    <Clock className="w-4 h-4" /> Oferta por tiempo limitado
                  </div>
                </div>
              </div>

              <button
                onClick={openPremiumOffer}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] text-white font-black uppercase py-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(22,163,74,0.4)] transition-all flex items-center justify-center gap-3 text-lg"
              >
                Quiero el Plan Premium
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Fútbol 360 - On page */}
            <div className="relative group bg-slate-900 rounded-[32px] p-6 sm:p-8 flex flex-col border-2 border-slate-800 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
              <div className="mb-8">
                <h3 className="text-white font-black uppercase text-2xl sm:text-3xl mb-1">Fútbol 360</h3>
                <p className="text-slate-400 font-bold italic text-sm">Acceso Esencial al Método</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-8">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Target className="w-5 h-5" />
                  <p className="font-black uppercase text-xs tracking-wider">¿Qué incluye?</p>
                </div>
                <p className="text-slate-300 text-sm font-bold leading-relaxed">
                  Entrenamiento completo para niños, mujeres y preparación física; mejora en todas las áreas.
                </p>
              </div>

              <div className="space-y-3 mb-10 flex-grow">
                {[
                  "Ejercicios Seleccionados",
                  "Preparación Física Base",
                  "Ideal para Niños y Mujeres",
                  "Acceso Inmediato",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-white/50" />
                    </div>
                    <span className="text-slate-300 font-bold text-sm tracking-tight">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 font-bold text-lg line-through leading-none">$19.90</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-4xl font-black text-white">$5.50</span>
                    <span className="text-xl font-black text-slate-400">USD</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/10 text-white/80 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider mb-2">
                    Económico
                  </div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-tight">72% OFF</p>
                </div>
              </div>

              <button
                onClick={openBasicOffer}
                className="w-full bg-white hover:bg-slate-100 active:scale-[0.98] text-[#0a0a0a] font-black uppercase py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
              >
                Quiero el Plan Básico
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>


      {/* Pop-out Premium */}
      <Dialog open={showPremiumPopout} onOpenChange={setShowPremiumPopout}>
        <DialogContent className="max-w-[92vw] sm:max-w-[450px] max-h-[90vh] overflow-y-auto p-0 border-none rounded-3xl bg-white shadow-2xl">
          <div className="bg-[#16a34a] p-4 text-center relative">
            <button 
              onClick={handleClosePremium}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white/20 backdrop-blur rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#facc15]" />
              <span className="text-white text-xs font-black uppercase tracking-wider">Oportunidad Única</span>
            </div>
            <h2 className="text-white font-black uppercase text-2xl leading-tight">Plan Premium</h2>
            <p className="text-white/90 text-sm font-medium italic mt-1">+2.000 Ejercicios + Todos los Bonos</p>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 text-red-600 mb-6 bg-red-50 p-3 rounded-2xl border border-red-100 animate-pulse">
              <Clock className="w-5 h-5" />
              <p className="text-sm font-black uppercase tracking-tight">¡Vence en {mm}:{ss}!</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {[
                "+2.000 Ejercicios Profesionales",
                "4 Bonos Sorpresa Incluidos",
                "Acceso Vitalicio e Inmediato",
                "Actualizaciones Automáticas",
                "Garantía de 7 Días",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="bg-[#16a34a] rounded-full p-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[#0f172a] font-bold text-sm tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
              <p className="text-slate-400 font-bold text-lg line-through leading-none">$29.90</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-[#0f172a]">$7.90</span>
                <span className="text-xl font-black text-[#16a34a]">USD</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="bg-[#facc15] text-[#0a0a0a] px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                  Mejor Oferta
                </div>
                <p className="text-[#dc2626] font-black text-xs uppercase tracking-tight">Ahorras 73%</p>
              </div>
            </div>

            <button
              onClick={() => goCheckout(PREMIUM_CHECKOUT_URL)}
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-3 group text-lg"
            >
              Quiero el Plan Premium
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Pago 100% Seguro · Acceso Instantáneo
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pop-out Basic */}
      <Dialog open={showBasicPopout} onOpenChange={setShowBasicPopout}>
        <DialogContent className="max-w-[92vw] sm:max-w-[450px] max-h-[90vh] overflow-y-auto p-0 border-none rounded-3xl bg-white shadow-2xl">
          <div className="bg-slate-900 p-4 text-center relative">
            <button 
              onClick={() => setShowBasicPopout(false)}
              className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white/10 backdrop-blur rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#facc15]" />
              <span className="text-white text-xs font-black uppercase tracking-wider">Acceso Esencial</span>
            </div>
            <h2 className="text-white font-black uppercase text-2xl leading-tight">Plan Fútbol 360</h2>
            <p className="text-white/70 text-sm font-medium italic mt-1">Lo básico para empezar a ganar</p>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <TrendingUp className="w-5 h-5" />
                <p className="font-black uppercase text-xs tracking-wider">¿Qué es Fútbol 360?</p>
              </div>
              <p className="text-[#0f172a] text-sm font-bold leading-relaxed">
                Entrenamiento completo para niños, mujeres y preparación física, todo en un mismo lugar; mejora en todas las áreas del fútbol.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                "Ejercicios Seleccionados",
                "Preparación Física Base",
                "Ideal para Niños y Mujeres",
                "Acceso Inmediato",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="bg-slate-200 rounded-full p-1">
                    <CheckCircle2 className="w-3 h-3 text-slate-600" />
                  </div>
                  <span className="text-slate-600 font-bold text-sm tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-bold text-sm line-through leading-none">$19.90</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-black text-[#0f172a]">$5.50</span>
                  <span className="text-lg font-black text-slate-500">USD</span>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-slate-200 text-slate-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-1">
                  Económico
                </div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-tight">Ahorras 72%</p>
              </div>
            </div>

            <button
              onClick={() => goCheckout(BASIC_CHECKOUT_URL)}
              className="w-full bg-slate-900 hover:bg-black text-white font-black uppercase py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group text-lg"
            >
              Quiero el Plan Básico
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
              ✅ Acceso 100% Digital e Inmediato
            </p>
          </div>
        </DialogContent>
      </Dialog>
        </div>
      </section>

      {/* Guarantee */}
      <section className="px-5 py-14 bg-white">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="w-64 h-64 sm:w-72 sm:h-72 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#facc15] to-[#f59e0b] flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(250,204,21,0.55)] hover:scale-105 transition-transform duration-500">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white flex flex-col items-center justify-center border-[6px] border-[#facc15]">
              <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 text-[#16a34a]" />
              <p className="font-black text-4xl sm:text-5xl leading-none mt-2">7 DÍAS</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">Garantía Total</p>
            </div>
          </div>
          <p className="text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Compra protegida</p>
          <h2 className="font-black uppercase text-[clamp(28px,5.5vw,44px)] leading-tight mb-4">
            Prueba el Kit sin Ningún Riesgo
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6 text-[clamp(15px,3.6vw,18px)]">
            Tienes <b>7 días completos</b> para explorar los +2.000 ejercicios, los 4 bonos y todo el método. Si sientes que no es para ti, por cualquier motivo, nos escribes un email y te devolvemos <b>hasta el último céntimo</b>.
          </p>
          <button
            onClick={openPremiumOffer}
            className="w-full max-w-[560px] mx-auto flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] transition-colors text-white font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl shadow-[0_10px_30px_-6px_rgba(22,163,74,0.55)]"
          >
            Empezar sin Riesgo
          </button>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-5 py-14">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-10">
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
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-14 bg-white">
        <div className="max-w-[820px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">FAQ</p>
          <h2 className="text-center font-black uppercase text-[clamp(26px,5vw,40px)] leading-tight mb-10">
            Preguntas <span className="text-[#16a34a]">frecuentes</span>
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-200">
                <AccordionTrigger className="text-left font-bold text-base py-4 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-4">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <button
            onClick={openPremiumOffer}
            className="mt-10 w-full max-w-[560px] mx-auto flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] transition-colors text-white font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl shadow-[0_10px_30px_-6px_rgba(22,163,74,0.55)]"
          >
            Quiero mi Kit Completo Hoy
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-10 bg-[#0a0a0a] text-slate-400 text-xs leading-relaxed">
        <div className="max-w-[900px] mx-auto text-center space-y-3">
          <p className="font-black text-white uppercase tracking-widest">2000 Ejercicios de Fútbol</p>
          <p>
            Este sitio no forma parte del sitio web de Facebook o Facebook Inc. Además, este sitio NO está patrocinado
            por Facebook de ninguna manera. FACEBOOK™ es una marca registrada de FACEBOOK, Inc.
          </p>
          <p>
            Este sitio no forma parte del sitio web de Meta Platforms, Inc. o Instagram. Además, no está patrocinado ni
            avalado por Meta™ ni Instagram™ de ninguna manera.
          </p>
          <p>
            Los resultados mencionados son ejemplos y no garantizan ganancias o resultados idénticos. Cada persona tiene
            un compromiso, dedicación y esfuerzo individual.
          </p>
          <p className="pt-2">© {new Date().getFullYear()} 2000 Ejercicios de Fútbol · Todos los derechos reservados.</p>
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
    </div>
  );
}
