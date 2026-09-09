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
import imgArsenal from "@/assets/arsenal-completo.jpg";
import imgDefinicion from "@/assets/bono-definicion.jpg";
import imgNutricion from "@/assets/nutricion-atleta.jpg";
import imgCasa from "@/assets/entrenamiento-casa.jpg";
import imgStackValor from "@/assets/stack-valor.jpg";

const PREMIUM_CHECKOUT_URL = "https://pay.hotmart.com/P107284207G?checkoutMode=10";
const BASIC_CHECKOUT_URL = "https://pay.hotmart.com/B107438269A?checkoutMode=10";

const BUYERS = [
  "Juan Mendoza", "Carlos Rodríguez", "Sofía García", "Mateo López", "Valentina Peña", 
  "Lucas Blanco", "Martina Silva", "Thiago Díaz", "Isabella Méndez", "Joaquín Valenzuela",
  "Elena Figueroa", "Nicolás Torres", "Camila Ortiz", "Bautista Herrera", "Victoria Quintana",
  "Facundo Morales", "Julieta Romero", "Santiago Castro", "Lucía Navarro", "Diego Acosta"
];

function PurchaseNotification() {
  const [purchase, setPurchase] = useState<{name: string, product: string} | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const name = BUYERS[Math.floor(Math.random() * BUYERS.length)];
      setPurchase({ name, product: "Plan Completo" });
      setShowConfetti(true);
      
      setTimeout(() => setPurchase(null), 5000);
      setTimeout(() => setShowConfetti(false), 3000);
    };

    const timer = setInterval(() => {
      if (Math.random() > 0.7) showNotification();
    }, 15000);

    // Show one shortly after load
    const initial = setTimeout(showNotification, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(initial);
    };
  }, []);

  if (!purchase) return null;

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4 animate-bounce text-2xl">🎉</div>
          <div className="absolute top-1/3 right-1/4 animate-bounce delay-75 text-2xl">⭐</div>
          <div className="absolute bottom-1/4 left-1/3 animate-bounce delay-150 text-2xl">🔥</div>
          <div className="absolute bottom-1/3 right-1/3 animate-bounce delay-300 text-2xl">⚽</div>
        </div>
      )}
      <div className="fixed bottom-4 left-4 z-[100] animate-in fade-in slide-in-from-left-10 duration-500">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2.5 shadow-xl border border-slate-200 flex items-center gap-2.5 max-w-[220px]">
          <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-black text-[#0f172a] truncate leading-tight">{purchase.name}</p>
            <p className="text-[10px] text-[#16a34a] font-bold leading-tight">Inscrito • Plan Completo</p>
            <p className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Clock className="w-2 h-2" /> hace segundos
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

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

function goCheckout(url: string, value: number) {
  fireEvent("InitiateCheckout", value);
  
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    const utms = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "xcod"];
    const targetUrl = new URL(url);
    
    // Add SCK for Hotmart tracking if any UTM exists
    let hasUtm = false;
    utms.forEach(param => {
      const val = searchParams.get(param);
      if (val) {
        targetUrl.searchParams.set(param, val);
        hasUtm = true;
      }
    });

    // Hotmart usa "sck" como código de rastreo: usamos el xcod de Meta si existe
    const xcod = searchParams.get("xcod");
    if (xcod) {
      targetUrl.searchParams.set("sck", xcod);
    } else if (hasUtm) {
      targetUrl.searchParams.set("sck", "meta_ads");
    }

    window.location.href = targetUrl.toString();
  }
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
    a: "Acceso vitalicio + actualizaciones automáticas. Pagas una sola vez y usas el material organizado siempre que lo necesites, con actualizaciones incluidas.",
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
  
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky button after hero section
      if (window.scrollY > 600) {
        setIsFooterVisible(true);
      } else {
        setIsFooterVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openPremiumOffer = useCallback(() => {
    setShowPremiumPopout(true);
  }, []);

  const handleClosePremium = useCallback(() => {
    setShowPremiumPopout(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden">
      <PurchaseNotification />
      {/* Top banner */}
      <div className="fixed top-0 inset-x-0 z-[90] bg-[#16a34a] text-white text-center font-black uppercase tracking-wide border-b-2 border-[#15803d] py-2.5 px-2 text-[clamp(10px,3vw,15px)]">
        Descuento Exclusivo Solo Hoy
      </div>
      <div style={{ height: 44 }} />

      {/* HERO */}
      <section className="px-5 pt-6 pb-8 text-center">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="font-black uppercase leading-[1.1] tracking-tight text-[#0a0a0a] mb-5 text-[clamp(22px,5.4vw,46px)]">
            Si eres entrenador o jugador de fútbol, <span className="text-[#16a34a]">esta plataforma fue hecha para ti</span>
          </h1>
          <div className="max-w-[680px] mx-auto mb-6 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg border border-[#facc15]/40 flex items-start gap-3 text-left">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-[#facc15] mt-0.5 animate-pulse" />
            <p className="font-bold leading-snug text-[clamp(12px,3.4vw,15px)]">
              <span className="text-[#facc15] font-black uppercase">Actualizaciones semanales:</span> cada semana añadimos nuevos ejercicios. Tu biblioteca crece contigo, siempre.
            </p>
          </div>
          <p className="text-slate-600 font-medium max-w-[680px] mx-auto mb-7 leading-relaxed text-[clamp(14px,3.6vw,19px)]">
            <b className="text-[#0a0a0a]">+2.000 entrenamientos profesionales listos para aplicar</b> + <b className="text-[#0a0a0a]">nutrición de alto rendimiento</b> + <b className="text-[#0a0a0a]">entrenamientos en casa de jugadores profesionales</b> + <span className="bg-[#facc15] text-[#0a0a0a] font-black px-2 py-0.5 rounded-md">500 entrenamientos de definición muscular (bono exclusivo de hoy)</span>. En materiales y vídeos listos, organizados por categorías. Acceso inmediato.
          </p>

          <img
            src={heroProduct}
            alt="+2.000 Entrenamientos de Fútbol"
            className="mx-auto max-w-[520px] w-full rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.03] hover:-rotate-1"
            width={1024}
            height={1536}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <p className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-4 h-4" /> Pago 100% seguro · Acceso inmediato por e-mail
          </p>
        </div>
      </section>

      {/* Strategic bridge */}
      <section className="px-5 py-8 sm:py-10 bg-gradient-to-r from-[#0a0a0a] to-[#0f172a] text-white">
        <div className="max-w-[820px] mx-auto text-center">
          <p className="font-black uppercase text-[clamp(18px,4.4vw,30px)] leading-tight mb-3">
            Deja de improvisar y empieza a <span className="text-[#facc15]">entrenar como un verdadero profesional</span>
          </p>
          <p className="text-slate-300 text-[clamp(14px,3.4vw,17px)] leading-relaxed max-w-[640px] mx-auto">
            Todo en la palma de tu mano, todo en un solo lugar, organizado y listo para hacerte evolucionar. También cuenta con <b className="text-white">actualizaciones semanales</b> para que nunca te quedes atrás.
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
            🔥 Últimas <span className="text-[#dc2626]">12 plazas</span> del cupo de hoy · {viewers} personas viendo esta oferta ahora
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
                <img src={f.img} alt={f.t} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Todo lo que recibes hoy</p>
          <h2 className="text-center font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-3">
            El arsenal <span className="text-[#16a34a]">completo</span> del Plan Completo
          </h2>
          <p className="text-center text-slate-600 max-w-xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base">
            Método completo, organizado y profesional. Nada de material suelto.
          </p>

          <img
            src={imgArsenal}
            alt="Arsenal completo de entrenamientos y nutrición"
            className="w-full max-w-[820px] mx-auto rounded-3xl shadow-2xl mb-8 sm:mb-10 transition-transform duration-500 hover:scale-[1.02]"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { i: Trophy, t: "+2.000 entrenamientos de fútbol", d: "Organizados por posición y categoría, listos para aplicar hoy." },
              { i: Target, t: "Rutina alimentaria completa de atletas de alto rendimiento completa de atletas de alto rendimiento completa", d: "La alimentación real de atletas de alto rendimiento, paso a paso." },
              { i: Zap, t: "Recetas estratégicas", d: "Para optimizar energía, recuperación y rendimiento en cada sesión." },
              { i: Flame, t: "Entrenamientos individuales en casa que usan jugadores profesionales", d: "Sesiones individuales que usan jugadores profesionales, sin gimnasio." },
              { i: Star, t: "500 entrenamientos de definición", d: "Bono exclusivo de hoy para construir un físico atlético." },
              { i: Mail, t: "Acceso vitalicio + actualizaciones automáticas", d: "4 bonos adicionales y material nuevo añadido automáticamente." },
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

      {/* Dolor y deseo */}
      <section className="px-5 py-14 bg-[#0a0a0a] text-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-black uppercase text-[clamp(24px,5vw,38px)] leading-tight mb-5 text-center">
            ¿Sigues entrenando sin un plan claro mientras{" "}
            <span className="text-[#facc15]">otros mejoran más rápido</span>?
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8 text-center max-w-2xl mx-auto text-[clamp(14px,3.6vw,17px)]">
            La mayoría de jugadores y entrenadores cometen el mismo error: saltan de video en video, usan ejercicios
            sueltos y esperan resultados que nunca llegan de forma consistente.
          </p>
          <p className="font-black uppercase text-[#facc15] tracking-widest text-xs mb-4">Es hora de cambiar eso:</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-10">
            {[
              "Basta de perder horas buscando material desorganizado",
              "Basta de entrenar sin progresión clara",
              "Basta de sentir que te estancas temporada tras temporada",
              "Basta de copiar ejercicios que no llevan a ningún lado",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                <XCircle className="w-5 h-5 text-[#dc2626] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-200">{t}</span>
              </div>
            ))}
          </div>
          <p className="font-black uppercase text-[#16a34a] tracking-widest text-xs mb-4">Con este método vas a poder:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Entrenar con dirección y estructura profesional",
              "Mejorar técnica, físico y energía al mismo tiempo",
              "Aplicar sesiones listas en minutos, no en horas",
              "Tener un sistema completo que acelera tu evolución",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 bg-[#16a34a]/15 rounded-2xl p-4 border border-[#16a34a]/40">
                <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-white">{t}</span>
              </div>
            ))}
          </div>
          <button
            onClick={openPremiumOffer}
            className="mt-10 w-full max-w-[560px] mx-auto flex items-center justify-center gap-2 bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] transition-all text-[#0a0a0a] font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl"
          >
            Quiero el método completo
          </button>
        </div>
      </section>

      {/* Nutrición + Casa */}
      <section className="px-5 py-14 bg-white">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-6">
          {[
            {
              img: imgNutricion,
              tag: "Nutrición de alto rendimiento",
              t: "Come como un atleta, rinde como un profesional",
              d: "Rutina alimentaria completa de atletas de alto rendimiento completa de atletas de alto rendimiento completa y recetas estratégicas para optimizar energía, recuperación y rendimiento en cada entrenamiento y partido.",
            },
            {
              img: imgCasa,
              tag: "Entrenamientos individuales en casa que usan jugadores profesionales",
              t: "Evoluciona incluso los días que no vas a la cancha",
              d: "Sesiones individuales que usan jugadores profesionales para mantener técnica, físico y explosividad sin necesidad de gimnasio.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-3xl overflow-hidden bg-[#f8fafc] border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <img src={c.img} alt={c.t} className="w-full aspect-[3/2] object-cover" width={1200} height={800} loading="lazy" decoding="async" />
              <div className="p-6">
                <p className="text-[#16a34a] font-black uppercase tracking-widest text-[11px] mb-2">{c.tag}</p>
                <h3 className="font-black text-xl leading-tight mb-2">{c.t}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bono exclusivo definición */}
      <section className="px-5 py-14 bg-[#0a0a0a] text-white">
        <div className="max-w-[900px] mx-auto">
          <div className="rounded-3xl overflow-hidden border-2 border-[#facc15] shadow-[0_20px_60px_-20px_rgba(250,204,21,0.5)]">
            <img src={imgDefinicion} alt="500 entrenamientos para definir músculo" className="w-full aspect-[3/2] object-cover" width={1200} height={800} loading="lazy" decoding="async" />
            <div className="p-6 sm:p-8 bg-[#111]">
              <h2 className="font-black uppercase text-[clamp(20px,4.6vw,32px)] leading-tight mb-4">
                ⚠️ Bono Exclusivo de Hoy · <span className="text-[#facc15]">500 Entrenamientos para Definir Músculo</span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-[clamp(14px,3.6vw,17px)]">
                Entrenamientos específicos para mejorar la definición y el físico atlético, complementando tu trabajo en
                la cancha. Este bono <b className="text-white">solo se incluye si compras HOY</b>. Mañana desaparece.
              </p>
              <button
                onClick={openPremiumOffer}
                className="mt-7 w-full flex items-center justify-center gap-2 bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] transition-all text-[#0a0a0a] font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl"
              >
                Quiero el bono de hoy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stack de valor */}
      <section className="px-5 py-14 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-center font-black uppercase text-[clamp(24px,5vw,38px)] leading-tight mb-8">
            ¿Cuánto valdría realmente <span className="text-[#16a34a]">todo esto por separado</span>?
          </h2>
          <img
            src={imgStackValor}
            alt="Valor real del paquete completo"
            className="w-full max-w-[620px] mx-auto rounded-3xl shadow-2xl mb-8"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
          <div className="rounded-3xl border-2 border-slate-200 bg-[#f8fafc] p-5 sm:p-8">
            {[
              ["+2.000 Entrenamientos de Fútbol", 147],
              ["Rutina Alimentaria de Atletas", 67],
              ["Recetas de Metabolismo y Rendimiento", 47],
              ["Entrenamientos en Casa de Profesionales", 57],
              ["500 Entrenamientos de Definición Muscular", 67],
              ["Bonos Exclusivos", 75],
            ].map(([t, v]) => (
              <div key={t as string} className="flex items-baseline gap-2 py-2.5 border-b border-dashed border-slate-300 last:border-0">
                <span className="font-semibold text-slate-700 text-[clamp(13px,3.4vw,16px)]">{t as string}</span>
                <span className="flex-1 border-b border-dotted border-slate-300 translate-y-[-3px]" />
                <span className="font-black text-slate-500 line-through text-[clamp(13px,3.4vw,16px)]">${v as number}</span>
              </div>
            ))}
            <div className="mt-6 text-center">
              <p className="font-black uppercase text-slate-500 text-sm">Valor real total: <span className="line-through">más de $460</span></p>
              <p className="font-black uppercase text-[clamp(20px,5vw,32px)] leading-tight mt-2">
                Hoy te llevas TODO por solo <span className="text-[#16a34a]">$6,50</span>
              </p>
              <p className="text-slate-600 text-sm mt-3 max-w-md mx-auto">
                Estás pagando una fracción mínima del valor real. Esta diferencia solo existe mientras la oferta esté activa.
              </p>
              <button
                onClick={openPremiumOffer}
                className="mt-6 w-full max-w-[520px] mx-auto flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] transition-all text-white font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl"
              >
                Quiero todo por $6,50
              </button>
            </div>
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
                      decoding="async"
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
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mb-6">
              Precio promocional válido <b className="text-white">solo por hoy</b>. Mañana vuelve al valor normal, no dejes escapar esta oportunidad.
            </p>
            <div className="max-w-[620px] mx-auto grid gap-2 text-left">
              {[
                "Esta oferta puede terminar en cualquier momento",
                "Cuando se acaben las plazas del día, el precio vuelve al valor normal",
                "El bono de 500 entrenamientos de definición solo está disponible hoy",
                "No dejes pasar la oportunidad de tener el método completo por menos de lo que cuesta una comida",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5 bg-white/5 border border-[#facc15]/30 rounded-xl px-4 py-3">
                  <Flame className="w-4 h-4 text-[#facc15] shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-[13px] sm:text-sm font-semibold">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-[980px] mx-auto grid md:grid-cols-2 gap-10 md:gap-8 items-stretch">
            {/* Plan Completo - On page */}
            <div className="relative group bg-white rounded-[32px] p-6 sm:p-8 flex flex-col border-2 border-[#16a34a] shadow-[0_20px_50px_-12px_rgba(22,163,74,0.3)] transform transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#16a34a] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="w-4 h-4 text-[#facc15]" />
                RECOMENDADO · MEJOR VALOR
              </div>
              
              <div className="mb-8">
                <h3 className="text-[#0a0a0a] font-black uppercase text-2xl sm:text-3xl mb-1">Plan Completo</h3>
                <p className="text-slate-500 font-bold italic text-sm">Biblioteca Completa + Todos los Bonos</p>
                <p className="mt-3 text-[13px] font-bold text-[#0a0a0a] bg-[#facc15]/25 border border-[#facc15] rounded-xl px-3 py-2">
                  El <b>93% de los compradores</b> eligen el Plan Completo porque lleva el sistema completo.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  "+2.000 entrenamientos organizados por posición y categoría",
                  "Rutina alimentaria completa de atletas de alto rendimiento",
                  "Recetas para energía, recuperación y rendimiento",
                  "Entrenamientos individuales en casa de profesionales",
                  "500 entrenamientos de definición muscular (bono exclusivo de hoy)",
                  "4 Bonos adicionales para acelerar resultados",
                  "Acceso vitalicio + actualizaciones automáticas",
                  "Garantía total de 7 días",
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
                  <span className="text-5xl font-black text-[#0f172a]">$6.50</span>
                  <span className="text-2xl font-black text-[#16a34a]">USD</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="bg-[#facc15] text-[#0a0a0a] px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm">
                    Ahorras 81%
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
                Sí, quiero el Plan Completo ahora
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Básico - On page */}
            <div className="relative bg-white rounded-[32px] p-6 sm:p-8 flex flex-col border-2 border-slate-200 shadow-xl transform transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                Opción económica
              </div>

              <div className="mb-8">
                <h3 className="text-[#0a0a0a] font-black uppercase text-2xl sm:text-3xl mb-1">Plan Básico</h3>
                <p className="text-slate-500 font-bold italic text-sm">Biblioteca de +2.000 ejercicios organizada</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  "+2.000 entrenamientos de fútbol organizados",
                  "Organizados por posición",
                  "Organizados por categoría",
                  "Acceso inmediato",
                  "Acceso vitalicio + actualizaciones automáticas",
                  "Garantía de 7 días",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="bg-slate-700 rounded-full p-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[#0f172a] font-bold text-sm tracking-tight">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                <p className="text-slate-400 font-bold text-xl line-through leading-none">$19.90</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black text-[#0f172a]">$5</span>
                  <span className="text-2xl font-black text-slate-700">USD</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm">
                    Ahorras 75%
                  </div>
                </div>
              </div>

              <button
                onClick={() => goCheckout(BASIC_CHECKOUT_URL, 5)}
                className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-black uppercase py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
              >
                Quiero el Plan Básico
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>


      {/* Package selector */}
      <Dialog open={showPremiumPopout} onOpenChange={(open) => { if (!open) handleClosePremium(); else setShowPremiumPopout(true); }}>
        <DialogContent className="max-w-[94vw] sm:max-w-[820px] max-h-[92vh] overflow-y-auto p-0 rounded-3xl bg-white shadow-2xl">
          <div className="bg-[#0a0a0a] p-6 text-center relative"><button onClick={handleClosePremium} className="absolute right-4 top-4 text-white/80"><X className="w-6 h-6" /></button><p className="text-[#facc15] font-black uppercase text-xs">Elige tu paquete</p><h2 className="text-white font-black uppercase text-2xl sm:text-3xl mt-2">Empieza ahora</h2><p className="text-white/70 text-sm mt-2">El Plan Completo es la opción recomendada.</p></div>
          <div className="p-5 sm:p-7 grid md:grid-cols-2 gap-5">
            <div className="relative rounded-3xl border-4 border-[#16a34a] p-5 sm:p-6"><div className="absolute -top-4 left-5 bg-[#16a34a] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase">⭐ Recomendado · Mejor Valor</div><h3 className="font-black uppercase text-2xl mt-2">Plan Completo</h3><p className="text-slate-500 text-sm mb-4">+2.000 ejercicios + nutrición + casa + definición + 4 bonos.</p><div className="space-y-2 text-sm font-semibold mb-5">{['+2.000 ejercicios por posición y categoría','Nutrición de alto rendimiento','Entrenamientos individuales en casa que usan jugadores profesionales','500 entrenamientos de definición muscular (bono exclusivo de hoy)','4 bonos exclusivos','Acceso vitalicio + actualizaciones automáticas','Garantía de 7 días'].map((item)=><div key={item} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#16a34a]" />{item}</div>)}</div><div className="text-4xl font-black mb-5">$6.50 <span className="text-base text-[#16a34a]">USD</span></div><button onClick={()=>goCheckout(PREMIUM_CHECKOUT_URL,6.50)} className="w-full bg-[#16a34a] text-white font-black uppercase py-4 rounded-2xl">Comprar Plan Completo <ArrowRight className="inline w-5 h-5" /></button></div>
            <div className="rounded-3xl border-2 border-slate-300 p-5 sm:p-6"><p className="text-slate-500 font-black uppercase text-[10px] mb-2">Opción económica</p><h3 className="font-black uppercase text-2xl">2.000 Ejercicios</h3><p className="text-slate-500 text-sm mb-4">Solo la biblioteca organizada por posición y categoría.</p><div className="space-y-2 text-sm font-semibold mb-5">{['+2.000 entrenamientos de fútbol organizados por posición y categoría (listos para aplicar hoy)','Organizados por posición','Organizados por categoría','Acceso inmediato','Acceso vitalicio + actualizaciones automáticas','Garantía de 7 días'].map((item)=><div key={item} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-slate-700" />{item}</div>)}</div><div className="text-4xl font-black mb-5">$5 <span className="text-base text-slate-700">USD</span></div><button onClick={()=>goCheckout(BASIC_CHECKOUT_URL,5)} className="w-full bg-slate-900 text-white font-black uppercase py-4 rounded-2xl">Comprar Plan Básico <ArrowRight className="inline w-5 h-5" /></button></div>
          </div><p className="text-center text-[10px] text-slate-400 font-bold uppercase pb-5"><Lock className="inline w-3.5 h-3.5" /> Pago 100% seguro · Hotmart</p>
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
            Prueba todo durante 7 días. Riesgo cero.
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6 text-[clamp(15px,3.6vw,18px)]">
            Si en los primeros <b>7 días</b> sientes que este material no es lo que necesitabas, te devolvemos el{" "}
            <b>100% de tu dinero</b>. Sin preguntas. Sin letra chica.
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

      {/* Sticky Bottom CTA */}
      <div 
        className={`fixed bottom-0 inset-x-0 z-[80] bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 transition-transform duration-500 transform ${
          isFooterVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-[560px] mx-auto">
          <button
            onClick={openPremiumOffer}
            className="w-full bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] transition-all text-[#0a0a0a] font-black uppercase text-[15px] py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-current" /> Quiero el Plan Completo - $6.50 USD
          </button>
        </div>
      </div>

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
          <section className="px-5 py-12">
            <div className="max-w-[1000px] mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-black text-[clamp(24px,4vw,40px)] leading-tight text-[#0f172a]">Entrena con todo organizado y deja de improvisar</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 max-w-[850px] mx-auto">
                {['Filtra por posición y categoría en segundos','Abre el ejercicio y aplícalo directamente','Ahorras horas de planificación cada semana','Tienes progresión real y material profesional','Dejas de improvisar y empiezas a entrenar con método'].map((item) => (
                  <div key={item} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                    <span className="font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
