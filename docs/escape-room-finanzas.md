# Escape room "Tu primer sueldo" | Documentación

Documento de diseño y contenido del escape room de finanzas personales del taller "Del aula al primer trabajo". Describe cómo está armado el juego hoy y dónde se edita cada cosa.

El repositorio es público, así que este documento no incluye las respuestas de los candados ni la palabra de la puerta final. Están en los archivos de datos (sección 10).

- **Contenido de finanzas:** Lic. Kevin Giampieri.
- **Desarrollo web, diseño UX/UI, gamificación y diseño instruccional:** Lic. Lourdes Pedaci.

---

## 1. Cómo trabajar

1. Mismo stack que el sitio: HTML, CSS y JavaScript sin frameworks, sin compilación y sin dependencias nuevas.
2. Mismo design system: `assets/styles.css`, con tokens en `:root` y tema claro y oscuro. La capa de juego suma sus propios tokens (`--juego-*`) y su hoja `escape/escape.css`.
3. Los datos editables van en archivos `.js` que asignan un objeto global (`window.ESC_DATA`, `window.ESC_VERSIONES` y `window.ESC_ECONOMIA`), no en `.json` con `fetch`. Así el juego funciona también si se abre el archivo con doble clic (`file://`), algo común en aulas con mala conexión.
4. Español rioplatense (voseo). Sin rayas largas. En títulos se usa "|" como separador, nunca "·".
5. Todos los montos, tasas, nombres, empresas y dominios son ficticios. Sin marcas comerciales reales.

---

## 2. Ubicación en el sitio

- **Página propia:** `escape/index.html`. No es una parada del mapa, para no romper las dos líneas de una hora del recorrido.
- **Entradas desde el sitio:**
  - **Rail:** un ítem "Escape room" al final de los subapartados de finanzas.
  - **Recibo de sueldo:** una franja al final del apartado que invita a la Sala 1.
  - **Finanzas personales:** un banner al cierre del apartado, después de la actividad, con Fuerte animado.
- **Volver al taller:** solo desde el panel principal del juego (flecha de la barra superior, en pestaña nueva). Dentro de las salas, la barra lleva al panel.
- **Documentación de diseño:** `diseno/index.html` muestra el mapa del sitio, el design system del taller y del juego, a Fuerte, las insignias y la revisión de accesibilidad. Se llega desde un banner al principio de Referencias, en el sitio. Fuerte y las insignias de esa página son copias del código del juego: si cambian, hay que volver a generarlas.
- **Página de error:** si una dirección dentro de `escape/` no existe, la `404.html` del sitio muestra su versión del juego: la gatita del taller duerme arriba de Fuerte, con el pie de página del escape room.

---

## 3. Identidad visual

- **Capa de juego reutilizable:** llaves, candados, letras del código, sellos e insignias llevan sus propios colores e íconos (tokens `--juego-*`), para poder sumar juegos en otros apartados.
- **Fuerte, el personaje:** una caja fuerte de metal anodizado naranja, con acabado de chapa pulida, visor oscuro, ojos y cejas, una perilla de combinación y cinco luces, una por candado abierto. El metal se resuelve sin texturas: un degradé con bandas de luz y sombra, un reflejo diagonal nítido, un punto de brillo arriba a la izquierda y un bisel que se ilumina arriba y se oscurece abajo, para que se lea el volumen de la chapa. Al principio tenía líneas finas de cepillado, pero en pantalla se leían como tela o como rayas de escaneo y no como metal, así que se reemplazaron. El mismo acabado se usa en todas sus versiones: la grande, la mini que firma los mensajes, la del banner del sitio y la de la página de error.
  - **Expresiones:** normal, feliz, preocupado y pensando, según lo que pasa en la sala.
  - **Mirada:** cuando está tranquilo, a veces sigue el cursor, a veces mira de frente o de costado. Si el cursor se le posa encima, mira para otro lado, cohibido.
  - **Niveles:** sube uno por sala resuelta. Son hábitos, no categorías de tarjeta: inicio, claridad, orden, prudencia, previsión y seguridad.
  - **Versión mini:** una cara simple firma sus mensajes, y en el banner del sitio se anima solo.
- **Panel principal:** un hero en bento, con el texto en una tarjeta clara y Fuerte en un afiche carbón que muestra el avance. Debajo, las salas, cada una con un tono del taller, el código de la puerta y las insignias.
- **Objetos hechos en HTML, no imágenes:** recibo como tabla, lista de gastos, resumen de tarjeta, folletos, sobre, etiqueta de precio y celular con mensajes. Se leen con lector de pantalla y escalan.
- **Números y letras del código en Geist Mono.**
- **Movimiento:** todo con `transform` y `opacity`, y todo se apaga con `prefers-reduced-motion`.

### Escritorio y celular

- **Barra superior:** en el panel, la flecha para volver al taller. Dentro del juego, el botón "Panel", la sala en la que estás, la versión de la sala (en el centro, desde 1024 px) y los íconos de las insignias.
- **Barra de progreso:** nivel de Fuerte, los cinco pasos de las salas y el equipo (llaves, tiempo y letras). En el celular, el equipo va en una barra fija abajo, que se esconde al llegar al pie de página y resume las letras con un conteo.
- **Sala:** una columna, con los objetos arriba y el panel del candado abajo. Los objetos se abren en un `<dialog>`.
- **Salas del panel:** cinco en fila desde 900 px; en tablet, tres arriba y dos abajo; en el celular, dos columnas. El código de la puerta va al costado de las salas desde 1600 px y, por debajo, ocupa todo el ancho.
- **Debrief:** reemplaza el área del candado (no es un modal). El botón para seguir aparece debajo.

---

## 4. Narrativa y estructura

Es tu primer día de cobro. Fuiste a la empresa a firmar el recibo y la puerta de la oficina se trabó. Para salir hay que abrir cinco candados, uno por sala; cada candado da letras del código de la puerta final.

Recorrido: autoevaluación inicial, cinco salas en orden, puerta final, autoevaluación final y pantalla "¡Saliste!". Cada sala tiene escena con objetos, candado, debrief, pregunta extra y reflexión opcional. Una sala resuelta se puede volver a visitar y volver a jugar en otra versión.

Duración: 30 a 35 minutos de juego y 10 de puesta en común. Es una actividad aparte de las dos horas del taller.

---

## 5. Reglas de diseño

- Sin cuenta regresiva (cronómetro ascendente opcional, oculto por defecto), sin forma de perder y sin ranking.
- Intentos ilimitados.
- Errores esperados con mensaje propio, que explican qué se confundió.
- Debrief obligatorio después de cada candado.
- Respuestas normalizadas: sin espacios, puntos de miles ni signo $, sin distinguir mayúsculas ni tildes.
- Los campos numéricos aceptan solo números y ponen el separador de miles al escribir.

---

## 6. Economía de pistas

En `escape/data/escape-economia.js`: llaves iniciales, costo de cada pista, pista gratis después de una cantidad de intentos fallidos seguidos y los sellos de la pantalla final según las pistas usadas. Cada reflexión escrita suma una llave (una vez por sala).

---

## 7. Contenido de las salas

Cada sala tiene tres versiones (ver sección 8). Acá se describe qué trabaja cada una, sin las respuestas.

### Sala 1 | Recepción: el recibo

- **Objetos:** un recibo de sueldo con el neto tapado por una mancha de café y una nota de Recursos Humanos. El recibo respeta el orden de secciones del Decreto N.º 407/2026: datos, contribuciones del empleador, remuneración bruta y deducciones, remuneración neta.
- **Candado:** calcular el sueldo neto.
  - **Inicial:** todo el bruto es remunerativo y la nota da el total de los descuentos.
  - **Intermedia:** el bruto suma horas extras y hay que sumar los tres aportes (jubilación, Ley 19.032 y obra social).
  - **Avanzada:** el recibo tiene una suma no remunerativa, que se cobra sin descuentos.
- **Errores esperados:** confundir bruto con neto, restar solo un aporte, restar las contribuciones de la empresa, olvidar las horas extras o descontar la suma no remunerativa.
- **Debrief:** bruto y neto, aportes del trabajador frente a contribuciones de la empresa y, en la avanzada, que lo no remunerativo no suma para la jubilación. Enlace a "Cómo se lee un recibo".

### Sala 2 | Oficina: el presupuesto

- **Desafío previo:** clasificar los gastos de la lista en necesidades y gustos. El aviso dice si no se marcó ninguno o cuáles faltan, y señala los que hay que revisar.
- **Candado:** calcular cuánto se va por mes en gastos hormiga.
  - **Inicial:** un gasto diario en días hábiles.
  - **Intermedia:** dos gastos diarios en días hábiles.
  - **Avanzada:** dos gastos con distinta frecuencia (días hábiles y sábados).
- **Errores esperados:** contar un solo día o una semana, contar días corridos, olvidar uno de los gastos o multiplicar todo por la misma frecuencia.
- **Debrief:** gastos hormiga en relación con el sueldo neto y la regla 50 / 20 / 30 como referencia, no como obligación. Enlace a la calculadora de gastos hormiga.

### Sala 3 | Caja: la tarjeta

- **Objetos:** el resumen de la tarjeta y dos folletos del mismo celular en 12 cuotas, uno con la cuota más baja pero con comisión y seguro.
- **Candado:**
  - **Inicial:** identificar la sigla que suma todos los costos de financiarse.
  - **Intermedia:** calcular el total de la oferta que conviene.
  - **Avanzada:** con otros folletos, calcular cuánto más cuesta la oferta de cuota baja.
- **Errores esperados:** elegir la TNA o la TEA, comparar solo las cuotas, olvidar la comisión o el seguro, confundir con el precio de contado.
- **Pregunta extra:** qué pasa si se paga solo el mínimo; en la avanzada, qué incluye el CFT que no incluye la TNA.
- **Debrief:** pagar el mínimo genera intereses (más IVA) y la cuota más baja no siempre es la más barata: hay que comparar el CFT o CFTEA. Enlace a "Salir de deudas".

### Sala 4 | Bóveda: la inflación

- **Objetos:** el sobre con la plata ahorrada para las zapatillas de la Sala 2 y la etiqueta de precio actualizada.
- **Candado:** calcular cuánto falta ahora para comprarlas.
  - **Inicial:** un aumento de precio.
  - **Intermedia:** dos aumentos que se acumulan.
  - **Avanzada:** la plata estuvo en una cuenta remunerada que rindió menos que la inflación.
- **Errores esperados:** responder con el precio nuevo, sumar los porcentajes en vez de acumularlos, olvidar el rendimiento o restarlo.
- **Pregunta extra:** qué es lo más importante en un fondo de emergencia (la liquidez); en la avanzada, qué pasa con el poder de compra si el rendimiento es menor que la inflación.
- **Debrief:** la plata quieta pierde poder de compra, ahorrar no es lo mismo que invertir y el fondo de emergencia cubre de 3 a 6 meses de gastos básicos. Enlace al control de inflación.

### Sala 5 | Salida: los mensajes

- **Objeto:** el celular con cuatro mensajes; tres son estafas y uno es real.
- **Candado:** marcar las estafas.
  - **Inicial:** link acortado que apura, pedido de un código de verificación y premio que no pediste.
  - **Intermedia:** tasa de envío urgente, pedido de instalar una app de "asistencia" y cambio de alias para cobrar.
  - **Avanzada:** organismo con un dominio falso, trabajo que cobra para contratarte y transferencia "por error" con comprobante.
- **Errores esperados:** marcar el mensaje real (el aviso explica por qué es confiable) o dejar una estafa sin marcar (el aviso nombra la señal que se pasó).
- **Debrief:** señales de estafa (urgencia, pedido de claves o códigos, links raros, premios no pedidos, alguien que se hace pasar por otro), revisar el titular antes de transferir a un alias nuevo y avisar al banco o billetera y hacer la denuncia. Enlace a "Ejecución y seguridad".

### Puerta final

- **Palabra al azar por partida:** sale de un banco de palabras sobre el tema, cada una con su pregunta. Las de 5 letras dan una letra por sala y las de 10, dos letras por sala.
- Las letras se muestran desordenadas, en un orden distinto en cada partida.
- Si se usan todas las letras en otro orden, el aviso lo dice: "Usaste todas las letras, pero esa palabra no responde la pregunta."

---

## 8. Versiones de las salas e insignias

Para que no se aprenda un único camino, cada sala tiene tres versiones con distinta dificultad: inicial, intermedia y avanzada. La inicial está en `escape/data/escape-finanzas.js`; la intermedia y la avanzada, en `escape/data/escape-versiones.js`, y solo reemplazan los campos que cambian (escena, objetos, desafío previo, candado, pistas, pregunta extra y debrief).

- **Sorteo:** al empezar una partida, cada sala toma una versión al azar, priorizando las que la persona todavía no resolvió. La versión y la palabra final quedan guardadas en la partida.
- **Dónde se ve la versión:** en escritorio, en el centro de la barra superior, con su medalla. En tablet y celular, debajo del título de la sala.
- **Jugar otra versión:** en una sala resuelta, este botón cambia de versión y vuelve a abrir el candado. Las letras del código y el avance no se pierden.
- **Insignias:** tres medallas con un candado grabado, una por dificultad: bronce (inicial), plata (intermedia) y oro (avanzada). Se gana cada una al resolver las cinco salas en esa versión, así que hay que volver a jugar las salas. Sin ganar, la medalla se ve tenue.
  - **Panel:** debajo de las salas, una sección muestra las tres insignias con el avance por sala y el botón "Descargar mis insignias", que genera una imagen PNG con las tres.
  - **Barra superior:** dentro de las salas, muestra los íconos de las tres insignias.
  - **Guardado:** en `localStorage` con la clave `esc_insignias`, aparte del avance. "Volver a jugar", al final, las conserva; "Empezar de cero" las borra.

---

## 9. Autoevaluación, datos y modo simple

- **Autoevaluación:** las mismas cinco frases al entrar y al salir, con escala de 1 a 4. La pantalla final muestra la fortaleza (la frase que más subió o la más alta) y el próximo paso (la más baja), sin repetir la misma frase en las dos; si quedaron parejas, invita a repasar la sala que más costó.
- **Código de resultado:** `ESC-[modo]-[pre]-[post]-[pistas]-[salas]`, con botón de copia, para pegar en el formulario de cierre.
- **Datos:** eventos en `localStorage` con prefijo `esc_` (inicio, intentos, pistas, objetos abiertos, fin de sala con su versión, repaso, reflexión, descarga de insignias y fin). No se envía nada a ningún servidor.
- **Modo simple:** `?modo=simple` en la dirección convierte el juego en un cuestionario lineal, con las mismas preguntas y sin la capa de juego.

---

## 10. Archivos

```
escape/index.html               Página del juego: barra superior, diálogos y pie
escape/escape.css               Estilos de la capa de juego
escape/escape.js                Lógica: salas, versiones, puerta, insignias, Fuerte y descarga
escape/data/escape-finanzas.js  Textos, autoevaluación, personaje y salas en versión inicial
escape/data/escape-versiones.js Dificultades, palabras de la puerta y versiones intermedia y avanzada
escape/data/escape-economia.js  Llaves, pistas y sellos
404.html                        Página de error del sitio, con la versión del escape room
```

---

## 11. Accesibilidad

- Pautas WCAG 2.2 AA. Contraste de 4,5:1 en texto y 3:1 en íconos, en los dos temas.
- Foco visible, navegación completa con teclado y foco al título al cambiar de pantalla.
- Avisos de aciertos, errores, pistas e insignias en una región `aria-live`.
- Fuerte, las insignias y los objetos decorativos llevan `aria-hidden`; la información que transmiten también está en texto.
- El progreso no depende solo del color: las luces se cuentan y las insignias dicen su estado.
- Todo el movimiento se apaga con `prefers-reduced-motion`.
- **Última revisión:** sitio, escape room y las dos páginas de error, en tema claro y oscuro y a 1700, 1366, 1024, 768 y 375 px. Sin errores de contraste, nombres accesibles, objetivos táctiles, estructura de títulos, ids o anclas, y sin desplazamiento lateral. Se corrigió el contraste del crédito del pie del sitio.

---

## 12. Fuentes

- Ley N.º 19.032 (1971), Ley N.º 23.660 (1989) y Ley N.º 24.241 (1993).
- Decreto N.º 407/2026, formato del recibo de sueldo (citado en el sitio).
- **Pendiente de validar con la docente:** la normativa del BCRA sobre la publicidad del CFT y los intereses por pago mínimo (Sala 3), y las señales de estafa (Sala 5). Son contenidos que no están en el aporte de Giampieri.
