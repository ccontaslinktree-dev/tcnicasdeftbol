import { useState } from "react";
import {
  Check,
  Users,
  Target,
  ShieldCheck,
  CalendarDays,
  Smartphone,
  Play,
  Pause,
  BookOpen,
  Dumbbell,
  CircleCheck,
  LockKeyhole,
  ChevronDown,
} from "lucide-react";
import featFisico from "@/assets/feature-fisico.jpg";
import featTactico from "@/assets/feature-tactico.jpg";
import featDribles from "@/assets/feature-dribles.jpg";
import featAgilidad from "@/assets/feature-agilidad.jpg";
import featChutes from "@/assets/feature-chutes.jpg";
import featPasses from "@/assets/feature-passes.jpg";
import bonus1 from "@/assets/bonus-1.jpg";
import bonus2 from "@/assets/bonus-2.jpg";
import bonus3 from "@/assets/bonus-3.jpg";
import bonus4 from "@/assets/bonus-surprise.png";
import previewAsset from "@/assets/preview.mov.asset.json";

import { plans, formatUSD, type PlanId } from "@/lib/offer";

type Mode = "entrenador" | "jugador";
const modes = {
  entrenador: {
    label: "Modo Entrenador",
    eyebrow: "PARA TU EQUIPO",
    title: "Tu próxima sesión merece algo mejor que «hoy vemos qué hacemos».",
    description:
      "Elige el objetivo, encuentra los ejercicios y estructura el entrenamiento. Usa la guía de planificación para conectar una sesión con la siguiente.",
    image: featTactico,
    items: [
      "Material por categoría y posición",
      "Trabajo técnico, táctico y físico",
      "Guía de entrenamiento y planificación semanal",
      "Recursos para adaptar al espacio y al grupo",
    ],
    closing: "Menos tiempo buscando. Más claridad para dirigir.",
  },
  jugador: {
    label: "Modo Jugador",
    eyebrow: "PARA TU TRABAJO INDIVIDUAL",
    title: "Guardar ejercicios no cuenta como entrenar. Empieza a darles un orden.",
    description:
      "Encuentra trabajo de control, regate y preparación física. Aprovecha los ejercicios de técnica individual para complementar los entrenamientos de tu equipo.",
    image: featDribles,
    items: [
      "Control, conducción y regates",
      "Técnica individual y trabajo con ambas piernas",
      "Circuitos de fuerza, resistencia y agilidad",
      "Material para elegir según tu nivel y espacio",
    ],
    closing: "Un objetivo claro cada vez que tocas el balón.",
  },
};
const weeks = {
  entrenador: [
    ["Define el punto de partida", "Control y pase", "Posesión y apoyos", "Juego aplicado"],
    ["Conecta las tareas", "Conducción y 1 contra 1", "Pase y desmarque", "Transiciones"],
    [
      "Acerca el entrenamiento al juego",
      "Finalización",
      "Organización defensiva",
      "Situaciones de partido",
    ],
    [
      "Revisa y adapta",
      "Repetir una tarea de referencia",
      "Reforzar lo que falta",
      "Evaluar y planificar el siguiente bloque",
    ],
  ],
  jugador: [
    [
      "Construye tu punto de partida",
      "Control de balón",
      "Conducción con ambas piernas",
      "Repetir y registrar sensaciones",
    ],
    [
      "Trabaja con intención",
      "Cambios de dirección",
      "Regates entre referencias",
      "Control orientado",
    ],
    [
      "Combina lo que practicas",
      "Control y salida",
      "Conducción y cambio de ritmo",
      "Técnica con precisión",
    ],
    [
      "Observa tu progreso",
      "Repetir una tarea de referencia",
      "Trabajar tu lado menos hábil",
      "Revisar y elegir el próximo objetivo",
    ],
  ],
};
const categories = [
  { image: featDribles, title: "Control y regates", detail: "Trabajo individual" },
  { image: featPasses, title: "Pases y posesión", detail: "Juego colectivo" },
  { image: featFisico, title: "Preparación física", detail: "Fuerza y resistencia" },
  { image: featTactico, title: "Táctica y estrategia", detail: "Organización de equipo" },
  { image: featAgilidad, title: "Agilidad y velocidad", detail: "Coordinación y movimiento" },
  { image: featChutes, title: "Remates y definición", detail: "Técnica de golpeo" },
];
const bonuses = [
  {
    image: bonus1,
    title: "Guía de Entrenamiento",
    description: "Planificación semanal y progresión para organizar tu trabajo.",
  },
  {
    image: bonus2,
    title: "50 ejercicios de técnica individual",
    description: "Más recursos para practicar control, conducción y dominio del balón.",
  },
  {
    image: bonus3,
    title: "Circuitos de preparación física",
    description: "Material complementario de fuerza, resistencia y explosividad.",
  },
  {
    image: bonus4,
    title: "Bono sorpresa",
    description: "El cuarto material extra incluido con tu acceso.",
  },
];
const faqs = [
  [
    "¿Es para entrenadores o para jugadores?",
    "Para ambos. La biblioteca y los bonos permiten preparar sesiones de equipo o seleccionar trabajo individual. Elige el material apropiado para tu categoría, nivel y objetivo.",
  ],
  [
    "¿Recibo un plan personalizado?",
    "No. En el Completo recibes la biblioteca organizada y los materiales complementarios. El esquema de cuatro semanas de esta página es un ejemplo de organización adaptable, no una prescripción individual. El Básico contiene solo la biblioteca; los bonos pertenecen al Completo.",
  ],
  [
    "¿Puedo entrenar en casa?",
    "Puedes seleccionar tareas que se adapten al espacio y al material disponible. Velocidad, remates y determinados circuitos requieren un campo o un espacio abierto adecuado.",
  ],
  [
    "¿Incluye una dieta personalizada?",
    "No. La propuesta de alimentación deportiva está en preparación y no forma parte de la compra actual. No se ofrecen dietas personalizadas ni se garantiza una fecha de lanzamiento.",
  ],
  [
    "¿Cómo recibo el acceso?",
    "Después de la compra, recibirás las instrucciones por e-mail para entrar a la biblioteca desde tu móvil, tablet u ordenador.",
  ],
  [
    "¿Es un pago mensual?",
    "No. El Completo cuesta US$ 10 e incluye biblioteca y 4 bonos. El Básico cuesta US$ 6,50 e incluye solo la biblioteca. Ambos son de pago único. Los medios de pago y el importe final en moneda local se muestran en Hotmart.",
  ],
  [
    "¿Y si no es para mí?",
    "Tienes 7 días de garantía para conocer el material y solicitar el reembolso a través de los canales de la compra si no es lo que buscabas.",
  ],
];
export function FootballOffer({
  onPurchase,
}: {
  onPurchase: (source: string, plan: PlanId) => boolean;
}) {
  const [unavailable, setUnavailable] = useState<PlanId | null>(null);
  const [mode, setMode] = useState<Mode>("entrenador");
  const [week, setWeek] = useState(0);
  const [paused, setPaused] = useState(false);
  const data = modes[mode];
  const cta = (
    source: string,
    label = "Quiero el Completo por US$ 10",
    plan: PlanId = "completo",
  ) => (
    <button
      className="fp-cta"
      type="button"
      onClick={() => {
        if (!onPurchase(source, plan)) setUnavailable(plan);
      }}
    >
      {label}
    </button>
  );
  return (
    <main className="fp-page">
      <div className="fp-top">
        <span>PLAN COMPLETO + 4 BONOS</span>
        <strong>Completo US$ 10 · Pago único</strong>
      </div>
      <header className="fp-header fp-wrap">
        <a href="#inicio" className="fp-brand">
          <span className="fp-brand-mark">
            <Target size={23} />
          </span>
          FÚTBOL <b>CON PLAN</b>
        </a>
        <a href="#oferta" className="fp-header-link">
          Ver oferta
        </a>
      </header>
      <section className="fp-hero fp-wrap" id="inicio">
        <div className="fp-hero-copy">
          <p className="fp-kicker">PARA ENTRENADORES Y JUGADORES</p>
          <h1>
            Deja de improvisar.
            <br />
            <span>Ten claro qué entrenar.</span>
          </h1>
          <p className="fp-lead">
            Tu equipo. Tu progreso individual. Una biblioteca con{" "}
            <strong>más de 2.000 ejercicios organizados</strong> para convertir las ideas sueltas en
            trabajo con dirección.
          </p>
          <div className="fp-hero-tags">
            <span>
              <Users size={17} /> Sesiones de equipo
            </span>
            <span>
              <Target size={17} /> Trabajo individual
            </span>
          </div>
          {cta("hero")}
          <p className="fp-trust">
            <ShieldCheck size={16} />7 días de garantía <span>·</span> Acceso digital
          </p>
        </div>
        <div className="fp-hero-visual">
          <img
            src={featTactico}
            width="800"
            height="1000"
            alt="Ejercicio táctico de fútbol en el campo"
            fetchPriority="high"
          />
          <div className="fp-hero-caption">
            <span className="fp-mini-label">TU PRÓXIMO ENTRENAMIENTO</span>
            <strong>
              Un objetivo.
              <br />
              Un plan.
              <br />
              Balón al campo.
            </strong>
            <div>
              <span>+2.000 ejercicios</span>
              <span>4 bonos incluidos</span>
            </div>
          </div>
        </div>
      </section>
      <div className="fp-proofline fp-wrap">
        <span>
          <BookOpen />
          Organizado por categoría
        </span>
        <span>
          <Smartphone />
          Desde tu celular
        </span>
        <span>
          <CalendarDays />
          Planifica tu semana
        </span>
      </div>
      <section className="fp-section fp-wrap" id="modos">
        <div className="fp-heading">
          <p className="fp-kicker">ELIGE TU PUNTO DE PARTIDA</p>
          <h2>
            Diriges un equipo.
            <br />O trabajas en tu propio juego.
          </h2>
          <p>El material tiene sentido cuando sabes para qué lo vas a usar.</p>
        </div>
        <div className="fp-tabs" role="tablist" aria-label="Tipo de entrenamiento">
          {(["entrenador", "jugador"] as Mode[]).map((m) => (
            <button
              type="button"
              role="tab"
              aria-selected={mode === m}
              id={`tab-${m}`}
              aria-controls="mode-panel"
              tabIndex={mode === m ? 0 : -1}
              key={m}
              onClick={() => {
                setMode(m);
                setWeek(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                  e.preventDefault();
                  const next = m === "entrenador" ? "jugador" : "entrenador";
                  setMode(next);
                  setWeek(0);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
            >
              {m === "entrenador" ? <Users /> : <Target />}
              {modes[m].label}
            </button>
          ))}
        </div>
        <div
          className="fp-mode-panel"
          role="tabpanel"
          id="mode-panel"
          aria-labelledby={`tab-${mode}`}
        >
          <img
            src={data.image}
            alt={
              mode === "entrenador"
                ? "Organización de una sesión de equipo"
                : "Trabajo de conducción de balón entre conos"
            }
            width="800"
            height="1000"
            loading="lazy"
          />
          <div className="fp-mode-copy">
            <p className="fp-kicker">{data.eyebrow}</p>
            <h3>{data.title}</h3>
            <p>{data.description}</p>
            <ul>
              {data.items.map((item) => (
                <li key={item}>
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
            <strong className="fp-mode-closing">{data.closing}</strong>
          </div>
        </div>
        <div className="fp-space-note">
          <strong>En casa cuando el ejercicio lo permite. En campo cuando lo necesita.</strong>
          <p>
            El espacio, la edad y el nivel importan. Ajusta el trabajo a tu situación; para menores,
            con acompañamiento de un entrenador o adulto responsable.
          </p>
        </div>
      </section>
      <section className="fp-dark fp-section" id="plan">
        <div className="fp-wrap">
          <div className="fp-heading">
            <p className="fp-kicker">ASÍ PUEDES DARLE ORDEN</p>
            <h2>
              Piensa en las próximas
              <br />
              <span>4 semanas de trabajo.</span>
            </h2>
            <p>
              Explora este ejemplo de organización. Los objetivos se adaptan al perfil que elijas.
            </p>
          </div>
          <div className="fp-plan-controls">
            <label htmlFor="plan-profile">Tu perfil</label>
            <select
              id="plan-profile"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as Mode);
                setWeek(0);
              }}
            >
              <option value="entrenador">Entrenador</option>
              <option value="jugador">Jugador</option>
            </select>
          </div>
          <div className="fp-week-tabs" role="group" aria-label="Semana del ejemplo">
            {[0, 1, 2, 3].map((w) => (
              <button key={w} type="button" aria-pressed={week === w} onClick={() => setWeek(w)}>
                Semana {w + 1}
              </button>
            ))}
          </div>
          <div className="fp-week" aria-live="polite">
            <p className="fp-kicker">
              {data.label} · SEMANA {week + 1}
            </p>
            <h3>{weeks[mode][week][0]}</h3>
            <div className="fp-session-grid">
              {weeks[mode][week].slice(1).map((task, i) => (
                <div key={task}>
                  <span>SESIÓN {i + 1}</span>
                  <strong>{task}</strong>
                  <p>Selecciona tareas de la biblioteca y adapta espacio, dificultad y duración.</p>
                </div>
              ))}
            </div>
          </div>
          <p className="fp-plan-note">
            Ejemplo orientativo, no plan individualizado. La compra incluye la biblioteca y sus 4
            bonos; adapta las tareas de la biblioteca con ayuda de la guía de planificación del
            Completo.
          </p>
          <a
            className="fp-print-link"
            href="/planifica-tu-futbol.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir plantilla de planificación imprimible
          </a>
        </div>
      </section>
      <section className="fp-section fp-library" id="biblioteca">
        <div className="fp-wrap fp-heading">
          <p className="fp-kicker">LA BIBLIOTECA DETRÁS DEL PLAN</p>
          <h2>
            No te faltan ganas.
            <br />
            Te falta encontrar el ejercicio adecuado.
          </h2>
          <p>Explora los contenidos por el objetivo que necesitas trabajar.</p>
          <button
            className="fp-pause"
            onClick={() => setPaused(!paused)}
            type="button"
            aria-pressed={paused}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}{" "}
            {paused ? "Reanudar imágenes" : "Pausar imágenes"}
          </button>
        </div>
        <div className="fp-marquee">
          <div
            className="fp-marquee-track"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {[0, 1].map((group) => (
              <div
                className="fp-marquee-group"
                key={group}
                aria-hidden={group === 1 ? true : undefined}
              >
                {categories.map((c) => (
                  <figure key={c.title}>
                    <img src={c.image} alt={c.title} width="800" height="1000" loading="lazy" />
                    <figcaption>
                      <span>{c.detail}</span>
                      <strong>{c.title}</strong>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="fp-section fp-soft" id="por-dentro">
        <div className="fp-wrap fp-preview-grid">
          <div>
            <p className="fp-kicker">MIRA EL MATERIAL POR DENTRO</p>
            <h2>
              Que no te lo cuenten.
              <br />
              Míralo antes de elegir.
            </h2>
            <p className="fp-lead">
              Esta es la vista previa de la biblioteca. Conoce el material que vas a consultar y
              cómo está presentado.
            </p>
            <p className="fp-small">
              Vista previa de la biblioteca actual. Selecciona los recursos según categoría, nivel y
              objetivo.
            </p>
          </div>
          <video
            src={previewAsset.url}
            controls
            playsInline
            preload="none"
            poster={featDribles}
            aria-label="Vista previa real de la biblioteca de ejercicios"
          />
        </div>
      </section>
      <section className="fp-section fp-wrap" id="bonos">
        <div className="fp-heading">
          <p className="fp-kicker">INCLUIDOS EN EL PLAN COMPLETO</p>
          <h2>
            La biblioteca es el comienzo.
            <br />
            Estos 4 bonos la acompañan.
          </h2>
        </div>
        <div className="fp-bonus-grid">
          {bonuses.map((b, i) => (
            <article key={b.title}>
              <img
                src={b.image}
                alt={`Portada de ${b.title}`}
                width="800"
                height="600"
                loading="lazy"
              />
              <div>
                <span className="fp-bonus-tag">BONO {i + 1} · INCLUIDO</span>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            </article>
          ))}
        </div>
        <aside className="fp-coming">
          <Dumbbell />
          <div>
            <span className="fp-mini-label">PROPUESTA DE AMPLIACIÓN · EN PREPARACIÓN</span>
            <h3>Alimentación y recuperación para el jugador</h3>
            <p>
              Área prevista para contenidos educativos de organización alimentaria y recuperación.
              No está incluida en la compra actual, no ofrece dietas personalizadas y todavía no
              tiene fecha de publicación.
            </p>
          </div>
        </aside>
      </section>
      <section className="fp-section fp-offer-section" id="oferta">
        <div className="fp-wrap fp-offer-grid">
          <div>
            <p className="fp-kicker">DEJA DE ACUMULAR IDEAS SUELTAS</p>
            <h2>
              Empieza a preparar
              <br />
              lo que vas a entrenar.
            </h2>
            <p className="fp-lead">
              Para dirigir mejor tu sesión de equipo o elegir tu próximo trabajo individual. Un
              acceso a la biblioteca y sus materiales complementarios.
            </p>
            <div className="fp-guarantee">
              <ShieldCheck />
              <div>
                <strong>7 días para conocer el material.</strong>
                <p>Si no es para ti, solicita el reembolso dentro del plazo de garantía.</p>
              </div>
            </div>
          </div>
          <div className="fp-offer-card">
            <span className="fp-bonus-tag">FÚTBOL CON PLAN · ACCESO COMPLETO</span>
            <h3>Biblioteca + 4 bonos</h3>
            <p>Entrenamiento de equipo e individual</p>
            <div className="fp-price">
              <span>US$</span>10
            </div>
            <p className="fp-payment">Pago único · Sin mensualidad</p>
            <ul>
              {[
                "Más de 2.000 ejercicios organizados",
                "Material por posición y categoría",
                "Guía de planificación semanal",
                "50 ejercicios de técnica individual",
                "Circuitos de preparación física y bono sorpresa",
                "Acceso vitalicio y actualizaciones incluidas",
              ].map((item) => (
                <li key={item}>
                  <CircleCheck />
                  {item}
                </li>
              ))}
            </ul>
            {cta("oferta", "Sí, quiero el Completo por US$ 10")}
            <p className="fp-trust">
              <LockKeyhole size={15} /> Compra a través de Hotmart
            </p>
            <p className="fp-small">
              El checkout muestra los medios de pago, la moneda local y el importe final aplicable a
              tu compra.
            </p>
          </div>
        </div>
      </section>
      <section className="fp-basic-section fp-wrap" id="basico">
        <div className="fp-basic-card">
          <div>
            <span className="fp-bonus-tag">¿SOLO QUIERES LOS EJERCICIOS?</span>
            <h3>Plan Básico</h3>
            <p>
              Más de 2.000 ejercicios organizados por posición y categoría. Solo la biblioteca, sin
              los 4 bonos del Completo.
            </p>
          </div>
          <div className="fp-basic-buy">
            <div className="fp-basic-price">US$ 6,50</div>
            <p>Pago único</p>
            {cta("basico", "Elegir la biblioteca básica", "basico")}
          </div>
        </div>
      </section>
      <section className="fp-section fp-wrap fp-faq" id="preguntas">
        <div className="fp-heading">
          <p className="fp-kicker">ANTES DE EMPEZAR</p>
          <h2>Resolvamos tus dudas.</h2>
        </div>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <ChevronDown size={19} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <section className="fp-final fp-wrap">
        <p className="fp-kicker">EL PRÓXIMO ENTRENAMIENTO NO SE PREPARA SOLO</p>
        <h2>
          Menos «¿qué hago hoy?».
          <br />
          <span>Más fútbol con un plan.</span>
        </h2>
        {cta("final")}
        <p className="fp-trust">Pago único · Biblioteca + 4 bonos · Garantía de 7 días</p>
      </section>
      <footer className="fp-footer">
        <div className="fp-wrap">
          <strong>FÚTBOL CON PLAN</strong>
          <p>
            Material educativo. Los resultados dependen de la práctica, el nivel y la adaptación de
            cada entrenamiento. No sustituye una evaluación individual ni una preparación
            supervisada cuando sea necesaria.
          </p>
          <p>Este sitio no está patrocinado ni avalado por Meta, Instagram o TikTok.</p>
          <p>© {new Date().getFullYear()} Fútbol con Plan.</p>
        </div>
      </footer>
      {unavailable && (
        <div className="fp-modal-backdrop" onClick={() => setUnavailable(null)}>
          <div
            className="fp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <LockKeyhole size={28} />
            <h2 id="purchase-dialog-title">Compra temporalmente no disponible</h2>
            <p>
              {plans[unavailable].name} · {formatUSD(plans[unavailable].price)}. Vuelve pronto para
              completar tu compra.
            </p>
            <button
              type="button"
              className="fp-cta"
              autoFocus
              onClick={() => setUnavailable(null)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setUnavailable(null);
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
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
