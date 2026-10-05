# Football Exercise Library

Quiero que crees una landing page de venta usando exactamente la misma

estructura, diseño, layout, colores, tipografía y flujo de esta página

de referencia:

https://entrenamientosfutbol.lovable.app/

Mantén igual:

El orden y tipo de todas las secciones

El diseño visual (verde/blanco, botones, cards, iconos, espaciados)

La sección de video preview con el contador de espectadores en vivo

El carrusel de imágenes del producto

El formato de 4 bonos con precio tachado + "GRATIS"

La sección de comparación "sin el producto" vs "con el producto"

El sello de garantía de 7 días

El acordeón de FAQ (mismo número de preguntas, mismo estilo)

El selector de país en el checkout (México, Colombia, Argentina,

Chile, Perú, Brasil, Uruguay, Bolivia, Paraguay, España)

El footer con disclaimer de no afiliación a Meta/Facebook

El badge de urgencia y el contador de plazas limitadas

CAMBIAR SOLO ESTO:

Nombre del producto: "2000 Ejercicios de Fútbol"

Cantidad: +2.000 ejercicios (en vez de +500 entrenamientos)

Precio: un solo paquete, de $24,90 por $3,90 USD hoy (84% descuento,

ahorras $21) — eliminar el segundo paquete/plan, dejar solo uno

llamado "Paquete Completo"

Entrega: acceso digital inmediato por e-mail. NO usar la palabra

"PDF" en ningún texto de la página — usar "biblioteca digital",

"método completo", "material organizado", "acceso instantáneo"

Imagen principal del hero: usar la imagen que voy a subir

(jugadores entrenando al atardecer)

Sección "quién soy": texto de marca genérico tipo "Equipo 2000

Ejercicios de Fútbol" enfocado en la metodología, sin credenciales

específicas inventadas

Testimonios: usar las 4 imágenes que voy a subir (foto + estrellas

cita + rol, ya listas en una sola imagen cada una) en vez del

formato de testimonio separado en foto/nombre/texto

TODOS los botones de CTA ("Quiero Empezar a Entrenar Ahora",

"Quiero mi Kit Completo Hoy", "Desbloquear los Videos", etc.) deben

apuntar a este link de checkout:

https://pay.hotmart.com/D106764059R?checkoutMode=10

No cambies nada más del layout, la estructura de componentes ni el

estilo — solo el contenido según los puntos de arriba. so para voce entender melhor quero que voce modele essa pagina: Kit +500 Fútbol Pro — +500 Entrenamientos en Vídeo para esse meu formato mudando apenas algumas coisas que lhe passei nas informações quero pixel e api rastreando corretamente pixel: <!-- Meta Pixel Code -->

<script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '889185807027175'); fbq('track', 'PageView'); </script>

<noscript><img height="1" width="1" style="display:none"

src="https://www.facebook.com/tr?id=889185807027175&ev=PageView&noscript=1"

/></noscript>

<!-- End Meta Pixel Code --> API: EAAW6k2ZATCJgBR355E9EpzSIZCmoDa0sOeYQp7RZAFVfiR7y8nw4pc8EI1N3vE58poYht75E07WKmyhVpmvLHF14W24oXKw7knvdg2xUSZCEClpyQqZAFntO3YpNNZB1h3SaNgcKL1zF62Fuex7AFZBprOwJ4XQf3QjVdOp2fpxcjW00DmtKj4UFOCjmCxdMjsvwQZDZD Quero que ative o cloud para não vazar dados da api, quero que utilize todas as mesmas funcionalidades da pagina de exemplo que lhe enviei para voce ver coloca isso tambem: a[href*="lovable.dev"],

iframe[src*="lovable.dev"],

div[style*="Edit with Lovable"],

.lovable-badge {

display: none !important;

opacity: 0 !important;

visibility: hidden !important;

pointer-events: none !important;

position: absolute !important;

z-index: -9999 !important;

}

Aplique esse código no arquivo Index.css do projeto. ai as imagens que lhe enviei é para voce colocar nos feedbacks lhe enviei a imagem do produto e enviei 4 imagens de garotos para colocar nos feedbacks estrategicos copie tudo da outra pagina mudando somente o preço e oferta que a modelagem é para a minha, na parte do bonus quero que voce crie uma imagem pra cada não deixe avulso ai coloca sao 4 bonus 3 sao estatisticas, treinos e motodo de controle de bola o quarto é um bonus surpresa enviei até a imagem para voce colocar la ja, enviei tambem um video que fica na ala de espoiler dos treinamentos que irao receber, vamos la quero tudo direitinho sem erros ou bugs enviei tambem a imagem de alguns garotos para voce colocar na imagens dos feedbacks

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tcnicasdeftbol.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9688cdb4-d0ab-4c73-bd12-0c417c465517).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
