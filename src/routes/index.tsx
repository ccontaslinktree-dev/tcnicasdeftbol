import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  PlayCircle,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import heroProduct from "@/assets/hero-product.png";
import previewAsset from "@/assets/preview.mov.asset.json";
import imgArsenal from "@/assets/arsenal-completo.jpg";
import imgDefinicion from "@/assets/bono-definicion.jpg";
import imgNutricion from "@/assets/nutricion-atleta.jpg";
import imgCasa from "@/assets/entrenamiento-casa.jpg";
import imgStackValor from "@/assets/stack-valor.jpg";
import bonus1 from "@/assets/bonus-1.jpg";
import bonus2 from "@/assets/bonus-2.jpg";
import bonus3 from "@/assets/bonus-3.jpg";
import bonusSurprise from "@/assets/bonus-surprise.png";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.webp";
import testimonial3 from "@/assets/testimonial-3.webp";
import testimonial4 from "@/assets/testimonial-4.jpg";
import feedbackJugador from "@/assets/feedback-jugador.mp4.asset.json";
import feedbackEntrenador from "@/assets/feedback-entrenador.mp4.asset.json";

const PREMIUM_CHECKOUT_URL = "https://pay.hotmart.com/P107284207G?checkoutMode=10";

function eid() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function fireEvent(name: string, value?: number) {
  if (typeof window === "undefined") return;

  const event_id = eid();
  // @ts-expect-error fbq global
  window.fbq?.(
    "track",
    name,
    value ? { value, currency: "USD" } : undefined,
    { eventID: event_id },
  );

  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supaUrl || !supaKey) return;

  const getCookie = (key: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : undefined;
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

function goCheckout() {
  fireEvent("InitiateCheckout", 6.5);

  if (typeof window === "undefined") return;

  const searchParams = new URLSearchParams(window.location.search);
  const targetUrl = new URL(PREMIUM_CHECKOUT_URL);
  const trackingParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "xcod",
  ];

  trackingParams.forEach((param) => {
    const value = searchParams.get(param);
    if (value) targetUrl.searchParams.set(param, value);
  });

  const xcod = searchParams.get("xcod");
  if (xcod) targetUrl.searchParams.set("sck", xcod);

  window.location.href = targetUrl.toString();
}

const benefits = [
  "+2.000 entrenamientos de fútbol organizados por posición y categoría",
  "Nutrición de alto rendimiento para complementar tu preparación",
  "Entrenamientos individuales para hacer en casa",
  "500 entrenamientos de definición muscular como bono especial",
  "4 bonos adicionales incluidos en el Plan Completo",
  "Acceso vitalicio y actualizaciones automáticas",
];

const faqs = [
  {
    q: "¿Cómo recibo el material?",
    a: "Después de completar la compra recibes por e-mail el acceso a la biblioteca digital y a los bonos incluidos.",
  },
  {
    q: "¿Puedo acceder desde el móvil?",
    a: "Sí. El contenido es online y puedes acceder desde móvil, tablet u ordenador.",
  },
  {
    q: "¿Los ejercicios sirven para jugadores y entrenadores?",
    a: "Sí. La biblioteca está organizada para facilitar el trabajo individual y la planificación de sesiones de entrenamiento.",
  },
  {
    q: "¿Cuánto tiempo tengo acceso?",
    a: "El Plan Completo incluye acceso vitalicio y las actualizaciones indicadas en la oferta.",
  },
  {
    q: "¿El pago es seguro?",
    a: "Sí. El pago se procesa mediante Hotmart y la plataforma ofrece diferentes medios de pago según el país.",
  },
  {
    q: "¿Tengo garantía?",
    a: "Sí. El Plan Completo cuenta con 7 días de garantía conforme a las condiciones de la compra.",
  },
];

export const Route = createFileRoute("/")({
  component: Index,
});

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <button
      onClick={goCheckout}
      className="w-full max-w-[580px] mx-auto flex items-center justify-center gap-2 bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] transition-all text-[#0a0a0a] font-black uppercase text-[clamp(15px,4vw,20px)] py-5 px-6 rounded-2xl shadow-[0_12px_32px_-8px_rgba(250,204,21,0.55)]"
    >
      {children}
      <ArrowRight className="w-5 h-5 shrink-0" />
    </button>
  );
}

function Index() {
  useEffect(() => {
    fireEvent("ViewContent");
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden pb-20">
      {/* Top strip */}
      <div className="fixed top-0 inset-x-0 z-[90] bg-[#16a34a] text-white text-center font-black uppercase tracking-wide border-b-2 border-[#15803d] py-2.5 px-2 text-[clamp(10px,3vw,14px)]">
        Condición especial de acceso · Plan Completo
      </div>
      <div className="h-11" />

      {/* HERO: desejo + oferta + CTA */}
      <section className="px-5 pt-7 pb-10 sm:pt-10 sm:pb-14 text-center bg-white">
        <div className="max-w-[1050px] mx-auto">
          <p className="text-[#16a34a] font-black uppercase tracking-[0.16em] text-xs mb-3">
            +2.000 ejercicios de fútbol
          </p>
          <h1 className="font-black uppercase leading-[1.05] tracking-tight text-[#080808] mb-5 text-[clamp(25px,5.8vw,50px)]">
            Deja de buscar ejercicios sueltos.
            <span className="block text-[#16a34a] mt-1">Entrena con un método completo.</span>
          </h1>
          <p className="text-slate-600 font-medium max-w-[760px] mx-auto mb-7 leading-relaxed text-[clamp(14px,3.6vw,18px)]">
            Una biblioteca profesional para <b className="text-[#0a0a0a]">jugadores y entrenadores</b>, con más de 2.000 entrenamientos organizados, nutrición, sesiones para casa, definición muscular y bonos.
          </p>

          <img
            src={heroProduct}
            alt="Método completo de fútbol con más de 2.000 entrenamientos"
            className="mx-auto max-w-[470px] w-full rounded-2xl shadow-2xl"
            width={1024}
            height={1536}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <div className="mt-7 mb-5 max-w-[680px] mx-auto bg-[#0a0a0a] text-white rounded-2xl p-4 sm:p-5 border border-[#facc15]/60">
            <p className="font-black uppercase text-[#facc15] text-sm mb-1">Plan Completo</p>
            <p className="font-bold text-[clamp(13px,3.4vw,16px)] leading-snug">
              +2.000 entrenamientos + nutrición + entrenamientos en casa + 500 entrenamientos de definición + 4 bonos.
            </p>
          </div>

          <CTA>Quiero el Plan Completo ahora</CTA>

          <p className="mt-4 text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-4 h-4" /> Pago seguro por Hotmart · Acceso digital
          </p>
        </div>
      </section>

      {/* PREVIEW: prova visual sem alongar */}
      <section className="px-5 py-10 sm:py-14 bg-[#0a0a0a] text-white">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[#facc15] font-black uppercase tracking-widest text-xs mb-2">Mira por dentro</p>
          <h2 className="font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-3">
            Antes de comprar, <span className="text-[#16a34a]">ve lo que vas a recibir</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-7 text-sm sm:text-base">
            Una vista previa real de la biblioteca y de la forma en que está organizado el material.
          </p>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black max-w-[520px] mx-auto border border-white/10">
            <video
              src={previewAsset.url}
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="mt-7">
            <CTA>Quiero acceder a la biblioteca</CTA>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-5 py-11 sm:py-14 bg-white">
        <div className="max-w-[1050px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Todo en un solo lugar</p>
          <h2 className="text-center font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-8">
            Lo que cambia cuando <span className="text-[#16a34a]">dejas de improvisar</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {benefits.map((item) => (
              <div key={item} className="bg-[#f8fafc] rounded-2xl p-4 sm:p-5 border border-slate-200 flex items-start gap-3">
                <div className="bg-[#16a34a] rounded-full p-1 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm sm:text-[15px] leading-snug">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CTA>Quiero entrenar con el método completo</CTA>
          </div>
        </div>
      </section>

      {/* VISUAL ARSENAL */}
      <section className="px-5 py-10 sm:py-14 bg-[#f1f5f9]">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">La biblioteca completa</p>
          <h2 className="font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-4">
            Más contenido. <span className="text-[#16a34a]">Menos tiempo perdido.</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-7 text-sm sm:text-base">
            Físico, táctico, dribles, agilidad, chutes, pases y categorías para organizar tus sesiones sin empezar de cero.
          </p>
          <img
            src={imgArsenal}
            alt="Arsenal completo de entrenamientos"
            className="w-full max-w-[820px] mx-auto rounded-3xl shadow-xl"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      {/* PROOF: video + screenshots */}
      <section className="px-5 py-11 sm:py-14 bg-[#0a0a0a] text-white">
        <div className="max-w-[1050px] mx-auto">
          <p className="text-center text-[#facc15] font-black uppercase tracking-widest text-xs mb-2">Prueba social</p>
          <h2 className="text-center font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-3">
            Mira lo que <span className="text-[#16a34a]">jugadores y entrenadores</span> comparten
          </h2>
          <p className="text-center text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Feedback en vídeo y capturas de personas que ya conocen el material.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-[760px] mx-auto mb-8">
            {[
              { src: feedbackJugador.url, label: "Jugador" },
              { src: feedbackEntrenador.url, label: "Entrenador" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                <div className="relative">
                  <video
                    src={item.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full aspect-[9/16] max-h-[440px] object-cover bg-black"
                  />
                  <span className="absolute top-3 left-3 bg-[#16a34a] text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-full">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[900px] mx-auto">
            {[testimonial1, testimonial2, testimonial3, testimonial4].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Testimonio ${i + 1}`}
                className="w-full aspect-[3/4] object-cover rounded-2xl border border-white/10"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>

          <div className="mt-8">
            <CTA>Quiero formar parte</CTA>
          </div>
        </div>
      </section>

      {/* BONUSES: compact, no 4 huge sections */}
      <section className="px-5 py-11 sm:py-14 bg-white">
        <div className="max-w-[1050px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Incluidos en el Plan Completo</p>
          <h2 className="text-center font-black uppercase text-[clamp(24px,5vw,40px)] leading-tight mb-3">
            4 <span className="text-[#16a34a]">bonos</span> para llevarte más por el mismo acceso
          </h2>
          <p className="text-center text-slate-600 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Material complementario incluido en la oferta del Plan Completo.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { n: "01", t: "Guía de Entrenamiento", img: bonus1 },
              { n: "02", t: "50 Ejercicios de Técnica Individual", img: bonus2 },
              { n: "03", t: "Circuitos de Preparación Física", img: bonus3 },
              { n: "04", t: "Bono Sorpresa Exclusivo", img: bonusSurprise },
            ].map((bonus) => (
              <div key={bonus.n} className="flex items-center gap-4 rounded-2xl bg-[#0a0a0a] text-white p-3 border border-[#facc15]/30">
                <img
                  src={bonus.img}
                  alt={bonus.t}
                  className="w-24 h-20 sm:w-28 sm:h-24 object-cover rounded-xl shrink-0"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="text-[#facc15] font-black text-[10px] uppercase tracking-widest">BONO {bonus.n}</p>
                  <h3 className="font-black text-sm sm:text-base leading-tight mt-1">{bonus.t}</h3>
                  <p className="text-xs text-slate-400 mt-1">Incluido en el Plan Completo</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <CTA>Quiero los 4 bonos incluidos</CTA>
          </div>
        </div>
      </section>

      {/* OFFER: único punto fuerte de decisión */}
      <section id="oferta" className="px-5 py-12 sm:py-16 bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white scroll-mt-14">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[#facc15] font-black uppercase tracking-widest text-xs mb-2">La oferta completa</p>
          <h2 className="font-black uppercase text-[clamp(27px,5.8vw,46px)] leading-tight mb-4">
            Todo el sistema. <span className="text-[#facc15]">Un solo acceso.</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            En lugar de comprar cada material por separado, tienes la biblioteca completa, los complementos y los bonos dentro del Plan Completo.
          </p>

          <div className="max-w-[560px] mx-auto bg-white text-[#0f172a] rounded-[30px] p-6 sm:p-8 border-4 border-[#16a34a] shadow-[0_25px_70px_-20px_rgba(22,163,74,0.45)] text-left">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 bg-[#16a34a] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Star className="w-3.5 h-3.5 fill-current text-[#facc15]" /> Plan Completo · Mejor valor
              </span>
              <h3 className="font-black uppercase text-2xl sm:text-3xl mt-4">Biblioteca Completa</h3>
              <p className="text-slate-500 text-sm font-bold mt-1">+2.000 ejercicios + complementos + 4 bonos</p>
            </div>

            <div className="space-y-3 mb-7">
              {[
                "+2.000 entrenamientos organizados",
                "Nutrición de alto rendimiento",
                "Entrenamientos individuales en casa",
                "500 entrenamientos de definición muscular",
                "4 bonos adicionales",
                "Acceso vitalicio + actualizaciones",
                "7 días de garantía",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                  <span className="font-bold text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-[#f8fafc] border border-slate-200 p-5 text-center mb-6">
              <p className="text-slate-400 font-black line-through text-lg">$29.90</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl sm:text-6xl font-black">$6.50</span>
                <span className="text-xl font-black text-[#16a34a]">USD</span>
              </div>
              <span className="inline-block mt-2 bg-[#facc15] text-[#0a0a0a] px-3 py-1 rounded-md text-xs font-black uppercase">
                Ahorras 81%
              </span>
            </div>

            <button
              onClick={goCheckout}
              className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] text-white font-black uppercase py-5 rounded-2xl shadow-[0_12px_30px_-7px_rgba(22,163,74,0.5)] transition-all flex items-center justify-center gap-2 text-lg"
            >
              Sí, quiero el Plan Completo
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Compra procesada por Hotmart
            </p>
          </div>
        </div>
      </section>

      {/* VALUE + GUARANTEE: reduzido */}
      <section className="px-5 py-11 sm:py-14 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-center font-black uppercase text-[clamp(24px,5vw,38px)] leading-tight mb-6">
            Un sistema completo por una fracción de su <span className="text-[#16a34a]">valor individual</span>
          </h2>
          <img
            src={imgStackValor}
            alt="Valor del paquete completo"
            className="w-full max-w-[620px] mx-auto rounded-3xl shadow-xl mb-7"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
          <div className="grid md:grid-cols-2 gap-4 max-w-[800px] mx-auto">
            <div className="rounded-2xl bg-[#f8fafc] border border-slate-200 p-5">
              <p className="font-black uppercase text-[#16a34a] text-xs mb-3">Lo que estás evitando</p>
              <ul className="space-y-2.5 text-sm font-semibold text-slate-700">
                <li>• Horas buscando ejercicios sueltos</li>
                <li>• Material sin organización</li>
                <li>• Comprar recursos por separado</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-[#0a0a0a] text-white p-5 border border-[#16a34a]">
              <p className="font-black uppercase text-[#facc15] text-xs mb-3">Lo que obtienes</p>
              <ul className="space-y-2.5 text-sm font-semibold">
                <li>✓ Biblioteca centralizada</li>
                <li>✓ Complementos y bonos incluidos</li>
                <li>✓ Acceso inmediato y vitalicio</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-11 sm:py-14 bg-[#f1f5f9]">
        <div className="max-w-[820px] mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-lg mb-5">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <p className="text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Compra protegida</p>
          <h2 className="font-black uppercase text-[clamp(25px,5vw,40px)] leading-tight mb-3">
            7 días de garantía
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-7">
            Tienes 7 días para conocer el material conforme a las condiciones de garantía de la compra.
          </p>
          <CTA>Quiero acceder sin complicarme</CTA>
        </div>
      </section>

      {/* FAQ: única seção de objeções */}
      <section className="px-5 py-11 sm:py-14 bg-white">
        <div className="max-w-[820px] mx-auto">
          <p className="text-center text-[#16a34a] font-black uppercase tracking-widest text-xs mb-2">Antes de entrar</p>
          <h2 className="text-center font-black uppercase text-[clamp(25px,5vw,40px)] leading-tight mb-8">
            Preguntas <span className="text-[#16a34a]">frecuentes</span>
          </h2>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="cursor-pointer list-none font-black text-sm sm:text-base pr-8 relative">
                  {faq.q}
                  <span className="absolute right-0 top-0 text-[#16a34a] text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-slate-600 text-sm leading-relaxed mt-3 pr-6">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8">
            <CTA>Quiero mi Plan Completo</CTA>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-12 sm:py-16 bg-[#0a0a0a] text-white text-center">
        <div className="max-w-[760px] mx-auto">
          <Zap className="w-10 h-10 text-[#facc15] mx-auto mb-4 fill-current" />
          <h2 className="font-black uppercase text-[clamp(27px,6vw,48px)] leading-[1.05] mb-4">
            Tu próximo entrenamiento puede empezar <span className="text-[#facc15]">hoy.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-7">
            Deja de perder tiempo buscando material. Entra, organiza tu entrenamiento y empieza a utilizar la biblioteca.
          </p>
          <CTA>Desbloquear el Plan Completo</CTA>
          <p className="mt-4 text-xs text-slate-500">Acceso digital · Pago seguro · 7 días de garantía</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 bg-[#050505] text-slate-500 text-[11px] leading-relaxed text-center">
        <div className="max-w-[850px] mx-auto space-y-2">
          <p className="font-black text-white uppercase tracking-widest">2000 Ejercicios de Fútbol</p>
          <p>Este sitio no forma parte de Facebook, Meta o Instagram, ni está patrocinado o avalado por dichas plataformas.</p>
          <p>Los resultados individuales pueden variar según dedicación, contexto y aplicación del material.</p>
          <p>© {new Date().getFullYear()} 2000 Ejercicios de Fútbol · Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Sticky CTA: aparece siempre después del primer scroll */}
      <div className="fixed bottom-0 inset-x-0 z-[80] bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4">
        <div className="max-w-[580px] mx-auto">
          <button
            onClick={goCheckout}
            className="w-full bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] transition-all text-[#0a0a0a] font-black uppercase text-[14px] sm:text-[16px] py-4 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-5 h-5" /> Plan Completo · $6.50 USD
          </button>
        </div>
      </div>

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
