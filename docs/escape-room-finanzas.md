# Escape room "Tu primer sueldo" | Brief ajustado

Versión revisada del documento de instrucciones original. Integra las decisiones de diseño acordadas y la revisión de contenido contra los apartados "El recibo de sueldo" y "Finanzas personales" (aporte del Lic. Kevin Giampieri). Los cambios respecto del original están marcados con **[Cambio]**.

---

## 0. Cómo trabajar

1. Seguí el stack del sitio: HTML, CSS y JavaScript sin frameworks, sin compilación y sin dependencias nuevas.
2. Diseño y desarrollo se hacen desde Claude Code, con el design system del sitio (`assets/styles.css`, tokens en `:root`, tema claro y oscuro). No agregar estilos ajenos al sistema: nada de gradientes, emojis ni glows.
3. **[Cambio]** Los datos editables van en archivos `.js` que asignan un objeto global (`window.ESC_DATA` y `window.ESC_ECONOMIA`), no en `.json` con `fetch`. Así funcionan también si se abre el archivo con doble clic (`file://`), algo común en aulas con mala conexión.
4. Español rioplatense (voseo). Sin rayas largas en ningún texto. En títulos se usa "|" como separador, nunca "·".

---

## 1. Ubicación en el sitio [Cambio]

- **Página propia:** `escape/index.html`, con `../assets/styles.css` más una hoja propia (`escape/escape.css`) y un script propio (`escape/escape.js`). No se suma como parada 12 porque rompería las dos líneas de una hora del recorrido.
- **Entradas livianas desde el sitio:** tienen que encontrarse fácil pero sin recargar la página principal.
  - **Rail:** un ítem al final de los subapartados de finanzas, con el distintivo de juego.
  - **Finanzas personales:** una franja compacta (una sola fila, no una tarjeta grande) después del índice del apartado.
  - **Recibo de sueldo:** un link al final del apartado ("Probá lo que aprendiste en la Sala 1").
  - **Presentación:** una diapositiva con QR a `/escape/`.
- **Criterio de aceptación ajustado:** el escape room aparece en el rail y dentro de los apartados especiales de recibo y finanzas, no en el mapa de paradas.

---

## 2. Identidad visual

- **Capa de juego con identidad propia y reutilizable:** todo lo que es gamificación (llaves, candados, fragmentos, sellos, el distintivo de entrada) lleva su propio color, su propia iconografía y su propio tratamiento, definidos como tokens `--juego-*`. Sirve para próximos juegos en otros apartados.
- **Escenas con el color del tema:** los objetos de la Sala 1 (recibo y nota de RRHH) van en menta (`--t4`, color del apartado del recibo). Las salas 2 a 5 y la puerta final van en verde billete (`--t7`, color de finanzas personales).
- **La sala:** bloque carbón (`--deep`) como fondo de la escena, con los objetos como papeles (`--surface`) encima.
- **Objetos hechos en HTML, no imágenes:** recibo como tabla, resumen de tarjeta, folletos, celular con burbujas de mensajes. Se leen con lector de pantalla y escalan.
- **Números y fragmentos en Geist Mono.**
- **Movimiento:** solo al abrir un candado y al mover un fragmento a la bandeja, con `transform` y `opacity`. Nada de animaciones en loop. Todo se apaga con `prefers-reduced-motion`.
- **Progreso:** las 5 salas como una línea corta con el patrón de puntos del mapa (`.dot`).

### Desktop y mobile

- **Desktop:** escena ancha a la izquierda y panel del candado fijo a la derecha (sticky), con pistas y fragmentos debajo.
- **Mobile (360 px):** una columna: escena, candado, pistas. Los objetos se abren en un `<dialog>` a pantalla completa (`100dvh`). Llaves y fragmentos van en una barra fija abajo. `inputmode="numeric"` y separador de miles al escribir, como en las calculadoras de finanzas.
- **Debrief:** reemplaza el área del candado (no es un modal). El botón para pasar a la sala siguiente aparece debajo del debrief.

---

## 3. Objetivo, narrativa y estructura

Sin cambios respecto del original: autoevaluación inicial, 5 salas en orden (escena con 2 o 3 objetos, candado, debrief obligatorio, reflexión opcional y fragmento), puerta final, autoevaluación final y pantalla "Saliste". Una sala resuelta se puede volver a visitar.

Duración: 30 a 35 minutos de juego y 10 de puesta en común. Es una actividad aparte de las dos horas del taller.

---

## 4. Reglas de diseño que no se negocian

Sin cambios: sin cuenta regresiva (cronómetro ascendente opcional, oculto por defecto), intentos ilimitados, pista gratis tras 3 intentos fallidos, errores esperados con mensaje propio, debrief obligatorio, sin ranking, sin datos reales, sin marcas comerciales, sin tasas ni inflación actuales y respuestas normalizadas (sin espacios, puntos de miles ni signo $, sin distinguir mayúsculas ni tildes).

---

## 5. Economía de pistas

Sin cambios, salvo que el archivo es `escape/data/escape-economia.js`. Llaves máximas posibles: 3 + 5 = 8, frente a 10 pistas disponibles.

---

## 6. Contenido de las salas

Sueldo ficticio: bruto $1.000.000. Palabra final: METAS.

### Sala 1 | Recepción: el recibo

- **Objetos:** el recibo de sueldo y una nota de RRHH ("Los descuentos del trabajador suman 17 %").
- **[Cambio] Recibo simplificado y coherente con el del sitio:** todo el bruto es remunerativo (sin sumas no remunerativas ni aporte sindical, para que el 17 % cierre). Conceptos: jubilación 11 %, Ley 19.032 (INSSJyP, PAMI) 3 %, obra social 3 %. El neto está tapado por una mancha de café. Respeta el orden de secciones del Decreto N.º 407/2026: datos, contribuciones del empleador, remuneración bruta y deducciones, remuneración neta.
- **Candado:** 830000. Errores esperados y pistas sin cambios.
- **[Cambio] Debrief:** "El bruto es lo que ganás. El neto es lo que cobrás después de tus aportes: jubilación, PAMI y obra social. Según el convenio puede haber además un aporte sindical. Aparte de tu sueldo, la empresa paga contribuciones que no se te descuentan." Link a "Cómo se lee un recibo" del sitio.

### Sala 2 | Oficina: el presupuesto

- **[Cambio] Gastos sin ambigüedad para clasificar:** "Alquiler compartido", "Carga de la SUBE", "Plan básico de celular" (necesidades); "Salida del sábado", "Zapatillas de marca para estrenar" y "Café de paso todos los días" (gustos). "Celular" y "zapatillas nuevas", sin más, admiten las dos respuestas.
- **Candado:** 66000. Errores y pistas sin cambios.
- **[Cambio] Debrief alineado con el sitio:** el sitio presenta la regla **50 / 20 / 30** (esenciales, ahorro e inversión, deseos) y la variante 70 / 20 / 10. Usar ese orden y ese vocabulario, como referencia y no como obligación. Agregar el dato del juego: $66.000 de café son casi el 8 % de un neto de $830.000. Link a la calculadora de gastos hormiga del sitio.

### Sala 3 | Caja: la tarjeta

- **Objetos:** sin cambios.
- **[Cambio] Candado de palabra sin largo fijo:** acepta **CFT** y **CFTEA** como correctas. El sitio usa CFTEA en finanzas personales.
- **Errores esperados:** TNA e IVA sin cambios; sumar **TEA**: "La TEA es la tasa de interés efectiva, pero no suma comisiones ni seguros."
- **[Cambio] Pista 1:** "Buscalo al lado de la tasa en los dos folletos: es el dato que suma todos los costos." (Se saca "letra chica": la normativa del BCRA exige que el CFT se informe en forma destacada, no escondido. Verificar la redacción final con la docente.)
- **[Cambio] Contenido nuevo en el debrief (el sitio no lo trata):** si pagás solo el mínimo, el resto queda financiado y genera intereses, más IVA sobre esos intereses, que aparecen en el próximo resumen. La cuota más baja no siempre es la más barata: hay que comparar el CFT. Conectar con "Salir de deudas" del sitio (pagar primero las deudas de interés alto).

### Sala 4 | Bóveda: la inflación

- **Objetos:** sin cambios.
- **[Cambio] Hilo narrativo:** "Son las zapatillas que anotaste en el presupuesto."
- **Candado:** 10000. Errores y pistas sin cambios.
- **[Cambio] Pregunta extra alineada con el sitio:** para el fondo de emergencia, lo más importante es la **liquidez** (disponible en 24 horas) y el bajo riesgo. El sitio nombra "cuenta remunerada o fondo money market" como ejemplos genéricos. Si se usa "plazo fijo" como opción incorrecta, el mensaje explica que el plazo fijo tradicional inmoviliza la plata al menos 30 días.
- **Debrief:** la plata quieta pierde poder de compra; ahorrar no es lo mismo que invertir; fondo de emergencia de 3 a 6 meses de gastos básicos. Link al control de inflación del sitio.

### Sala 5 | Salida: los mensajes

- Sin cambios en la mecánica.
- **[Cambio] Contenido nuevo (el sitio solo trae el dato de que el 25 % de los jóvenes sufrió una estafa):** señales de estafa en el debrief: urgencia, pedido de claves o códigos de verificación (ninguna entidad los pide), links con direcciones raras o acortadas, premios que no pediste y alguien que se hace pasar por una empresa o un conocido. Antes de transferir a un alias nuevo, verificar el nombre del titular que muestra la app. Si te pasa, avisá enseguida a tu banco o billetera y hacé la denuncia.

### Puerta final

Sin cambios.

---

## 7. Autoevaluación, datos y modo simple

Sin cambios: mismas 5 afirmaciones con escala de 1 a 4, eventos en `localStorage` con prefijo `esc_`, código de resultado `ESC-[modo]-[pre]-[post]-[pistas]-[salas]` con botón de copia y `?modo=simple` como cuestionario lineal sin capa de juego.

---

## 8. Accesibilidad

Sin cambios (WCAG 2.2 AA). Además, el distintivo y los colores de la capa de juego cumplen contraste 4,5:1 en texto y 3:1 en íconos, en los dos temas.

---

## 9. Fuentes

- Ley N.º 19.032 (1971), Ley N.º 23.660 (1989) y Ley N.º 24.241 (1993), como en el original.
- **[Cambio]** Decreto N.º 407/2026, formato del recibo de sueldo (ya citado en el sitio).
- **[Cambio] Pendiente de validar:** normativa del BCRA sobre la publicidad del CFT y los intereses por pago mínimo (Sala 3), y las señales de estafa (Sala 5). Son contenidos nuevos que no están en el aporte de Giampieri.
