// Client-safe knowledge base for the /soporte help center and the AI system prompt.
export type HelpArticle = {
  id: string;
  category: string;
  title: string;
  keywords: string[];
  body: string;
};

export const CATEGORIES = [
  { id: "acceso", label: "Acceso tras la compra" },
  { id: "email", label: "Correo de entrega" },
  { id: "login", label: "Inicio de sesión" },
  { id: "material", label: "Material y entrenamientos" },
  { id: "dispositivos", label: "Dispositivos" },
  { id: "pagos", label: "Pagos" },
  { id: "reembolsos", label: "Reembolsos y garantía" },
  { id: "contacto", label: "Contacto" },
] as const;

export const ARTICLES: HelpArticle[] = [
  {
    id: "acceso-inmediato",
    category: "acceso",
    title: "¿Cómo accedo al material después de comprar?",
    keywords: ["acceso", "comprar", "compré", "entrar", "donde", "biblioteca"],
    body:
      "La compra se procesa a través de Hotmart. Cuando el pago se aprueba, Hotmart envía un correo al email que usaste en el checkout con el enlace de acceso a la biblioteca. Desde ese enlace entras al área de miembros de Hotmart, donde está todo el material organizado por categoría.",
  },
  {
    id: "acceso-pago-pendiente",
    category: "acceso",
    title: "Pagué pero todavía no tengo acceso",
    keywords: ["pendiente", "no llega", "no tengo acceso", "boleto", "pix", "efectivo", "aprobado"],
    body:
      "Los pagos con tarjeta suelen aprobarse en minutos. Los pagos en efectivo o transferencia pueden tardar más en confirmarse, según el método y el país. El acceso se libera solo cuando el pago figura como aprobado. Revisa el estado de tu compra en el correo de Hotmart o en tu cuenta de Hotmart.",
  },
  {
    id: "email-no-llega",
    category: "email",
    title: "No recibí el correo de acceso",
    keywords: ["correo", "email", "mail", "spam", "promociones", "no recibí"],
    body:
      "Busca en las carpetas de Spam, Promociones y Notificaciones un mensaje de Hotmart. Busca también la palabra \"Hotmart\" en tu bandeja. Si escribiste mal tu email en el checkout, el correo pudo llegar a otra dirección; en ese caso abre un ticket con el email correcto y el que usaste al pagar.",
  },
  {
    id: "login-contrasena",
    category: "login",
    title: "No puedo iniciar sesión u olvidé mi contraseña",
    keywords: ["login", "contraseña", "clave", "password", "iniciar sesión", "olvidé"],
    body:
      "Entra en la página de inicio de sesión de Hotmart y usa la opción \"¿Olvidaste tu contraseña?\" con el mismo email de la compra. Recibirás un enlace para crear una nueva contraseña. Si aparece que el email no existe, probablemente se usó otro email al comprar.",
  },
  {
    id: "material-contenido",
    category: "material",
    title: "¿Qué incluye la biblioteca?",
    keywords: ["incluye", "contenido", "ejercicios", "categorías", "táctico", "físico", "videos", "material"],
    body:
      "La biblioteca reúne más de 2.000 ejercicios organizados por categoría: físico, táctico, dribles, agilidad, estrategias, pases, chutes y más. El material se actualiza y se agregan nuevos ejercicios con el tiempo, sin costo adicional.",
  },
  {
    id: "material-no-carga",
    category: "material",
    title: "Un video o archivo no carga",
    keywords: ["no carga", "no abre", "error", "pantalla negra", "lento", "video"],
    body:
      "Actualiza la página, prueba otro navegador (Chrome o Safari actualizados) y revisa tu conexión. Desactiva bloqueadores de anuncios o VPN. Si sigue fallando, abre un ticket indicando qué material, desde qué dispositivo y qué mensaje aparece.",
  },
  {
    id: "dispositivos",
    category: "dispositivos",
    title: "¿En qué dispositivos puedo usar el material?",
    keywords: ["celular", "móvil", "tablet", "computadora", "pc", "iphone", "android", "app"],
    body:
      "Puedes acceder desde el navegador del celular, tablet o computadora. Hotmart también ofrece su aplicación para Android e iOS, donde inicias sesión con el mismo email de la compra.",
  },
  {
    id: "pagos-metodos",
    category: "pagos",
    title: "Métodos de pago y cobros",
    keywords: ["pago", "tarjeta", "cobro", "moneda", "dólares", "factura", "doble cobro"],
    body:
      "Los métodos disponibles los muestra el checkout de Hotmart según tu país. El cobro puede aparecer en tu resumen con el nombre de Hotmart y convertido a tu moneda local. Si ves un cobro que no reconoces o duplicado, abre un ticket: no podemos ver datos de tu tarjeta desde aquí.",
  },
  {
    id: "reembolso-garantia",
    category: "reembolsos",
    title: "Garantía de 7 días y reembolsos",
    keywords: ["reembolso", "devolución", "garantía", "cancelar", "7 días", "dinero"],
    body:
      "La compra tiene una garantía de 7 días. Dentro de ese plazo puedes solicitar el reembolso directamente desde tu cuenta de Hotmart (sección de compras) o abriendo un ticket aquí con el email de la compra. El tiempo en que el dinero vuelve depende del método de pago y de tu banco.",
  },
  {
    id: "contacto",
    category: "contacto",
    title: "¿Cómo hablo con una persona del equipo?",
    keywords: ["humano", "persona", "contacto", "ayuda", "ticket", "soporte"],
    body:
      "Usa el formulario \"Hablar con el equipo\" en esta página. Se crea un ticket con un número de referencia que puedes consultar aquí mismo. El equipo responde al email que indiques.",
  },
];

export function searchArticles(query: string, limit = 3): HelpArticle[] {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!q.trim()) return [];
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return ARTICLES.map((a) => {
    const hay = norm(`${a.title} ${a.body}`);
    let score = 0;
    for (const k of a.keywords) if (q.includes(norm(k))) score += 3;
    for (const w of words) if (hay.includes(w)) score += 1;
    return { a, score };
  })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

export const TICKET_TOPICS = [
  "Acceso",
  "Correo de entrega",
  "Inicio de sesión",
  "Material",
  "Pagos",
  "Reembolso",
  "Otro",
] as const;

export const STATUS_LABEL: Record<string, string> = {
  abierto: "Abierto",
  en_revision: "En revisión",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
};
