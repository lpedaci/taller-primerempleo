# Del aula al primer trabajo

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-663399?style=flat&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![SVG](https://img.shields.io/badge/SVG-FFB13B?style=flat&logo=svg&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-0AE448?style=flat&logo=greensock&logoColor=black)
![HyperFrames](https://img.shields.io/badge/HyperFrames-24242A?style=flat)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-538DD7?style=flat&logo=fontawesome&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat&logo=nodedotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat&logo=githubpages&logoColor=white)

Sitio web estático de una sola página que acompaña un taller de dos horas sobre inserción laboral para estudiantes de 6to año de escuela técnica que buscan una pasantía o su primer empleo, y para quienes quieren cambiar de trabajo. El contenido se organiza como un mapa de recorrido: dos líneas de una hora cada una y once paradas, cada una con una idea clave, ejemplos y una actividad.

Además del recorrido, el sitio suma un escape room de finanzas personales, **Tu primer sueldo**, que lleva lo trabajado en los apartados del recibo y de finanzas a un juego con salas, candados y pistas.

Está desarrollado con HTML, CSS y JavaScript sin frameworks ni proceso de compilación.

## Características

- **Avance del estudiante:** cada parada se marca como recorrida y el progreso se guarda en `localStorage`, junto con la lista de tareas del plan de 30 días.
- **Plantillas para copiar:** mapa personal, bitácora de prácticas, CV compatible con ATS y pitch de 60 segundos, con copia al portapapeles en un clic.
- **Tema claro y oscuro:** sigue la preferencia del sistema y permite cambiarlo a mano; los colores se definen con propiedades personalizadas de CSS.
- **Diseño adaptable:** panel lateral de navegación en escritorio y menú desplegable en pantallas chicas; las tablas se apilan en móvil.
- **Accesibilidad:** HTML semántico, enlace para saltar al contenido, estados anunciados a lectores de pantalla, foco visible y respeto por la preferencia de movimiento reducido. El escape room sigue las pautas WCAG 2.2 AA.
- **Animaciones explicativas:** tres composiciones HyperFrames (lectura de un ATS, titular de LinkedIn y método STAR) incrustadas en vivo, que heredan el tema del sitio.
- **Gamificación:** un escape room de finanzas con su propia capa visual, un personaje, niveles e insignias (ver más abajo).
- **Páginas 404 con personaje:** la gatita del taller duerme en la 404 del sitio y, si la ruta perdida está dentro del escape room, duerme arriba de Fuerte.

## Créditos

- **Contenido del taller:** Lic. Lourdes Pedaci, Lic. Julieta Taraborrelli y Lic. Bettyna González, 2026.
- **Contenido de finanzas personales:** Lic. Kevin Giampieri.
- **Desarrollo web, diseño UX/UI, gamificación y diseño instruccional:** Lic. Lourdes Pedaci.

## Recorrido

**Línea 1. Conocerte y prepararte (primera hora)**

1. El mundo laboral hoy
2. Autoconocimiento
3. Frustración y autoperdón
4. Prácticas profesionalizantes
5. Habilidades, tecnología e idiomas

**Línea 2. Mostrarte (segunda hora)**

6. CV para ATS
7. LinkedIn
8. Porfolio y proyectos propios
9. La entrevista laboral
10. Entrevistas con inteligencia artificial
11. Plan de 30 días

Fuera del recorrido hay cuatro apartados especiales: el recibo de sueldo (aportes, contribuciones y cómo leer un recibo); finanzas personales, un aporte del Lic. Kevin Giampieri con mentalidad, salida de deudas, presupuesto e inversión, y calculadoras interactivas; la charla de carreras, sobre qué estudiar después de la secundaria; y el servidor de Lourdes, con cursos gratuitos y materiales para seguir aprendiendo. Al final están las referencias en formato APA 7.

El botón «Presentar» de la barra superior abre el sitio como presentación para proyectar: cada parada se ve como en la web dentro de un lienzo 16:9 y lo que no entra sigue en la diapositiva siguiente; los apartados especiales solo se mencionan, con flechas del teclado para avanzar, un índice (tecla O), pantalla completa (tecla F) y Esc para volver a la web. También se puede abrir directo con `?presentar` en la dirección.

## Escape room «Tu primer sueldo»

Una actividad de 30 a 35 minutos, aparte de las dos horas del taller, pensada desde el diseño instruccional para practicar lo que se vio en el recibo de sueldo y en finanzas personales. La historia: es tu primer día de cobro, la puerta de la oficina se trabó y para salir hay que abrir cinco candados.

- **Cinco salas, cinco temas:** el recibo de sueldo, el presupuesto y los gastos hormiga, la tarjeta y el costo financiero total, la inflación y el ahorro, y los mensajes de estafa. Cada sala tiene objetos para inspeccionar, un candado, una explicación de lo que se resolvió, una pregunta extra y una reflexión opcional.
- **Aprender del error:** los errores más comunes tienen su propio mensaje, que explica qué se confundió en lugar de decir solo «incorrecto». No hay cuenta regresiva, ni forma de perder, ni ranking.
- **Pistas a cambio de llaves:** se empieza con tres llaves, se gana una por cada reflexión y, después de tres intentos fallidos seguidos, la próxima pista se abre gratis.
- **Tres versiones por sala:** inicial, intermedia y avanzada. Al empezar una partida, cada sala toma una versión al azar, así no se aprende un único camino. La palabra que abre la puerta final también cambia en cada partida.
- **Fuerte, el personaje:** una caja fuerte con cinco luces, una por candado abierto. Reacciona a lo que pasa en la sala, mira el cursor, se cohíbe si lo descubrís mirándote y sube de nivel con cada sala; los niveles son hábitos (claridad, orden, prudencia, previsión y seguridad).
- **Insignias de bronce, plata y oro:** una por dificultad. Se gana cada una al resolver las cinco salas en esa versión, volviendo a jugar las salas ya resueltas. Se pueden descargar como imagen.
- **Autoevaluación antes y después:** las mismas cinco frases al entrar y al salir. La pantalla final muestra la fortaleza, el próximo paso y un código de resultado para copiar en el formulario de cierre.
- **Modo simple:** con `?modo=simple` en la dirección, las mismas preguntas se responden como cuestionario, sin la capa de juego.
- **Privacidad:** el avance y las insignias se guardan solo en el navegador (`localStorage`); no se envía nada a ningún servidor.

Todos los montos, tasas, nombres y dominios del juego son ficticios. La documentación de diseño y contenido está en [`docs/escape-room-finanzas.md`](docs/escape-room-finanzas.md).

## Estructura de archivos

```
index.html                     Página única con todas las paradas
404.html                       Página de error del sitio y del escape room
assets/styles.css              Estilos (tokens en :root, tema claro y oscuro)
assets/app.js                  Avance guardado, plantillas, pestañas, tablas, animaciones
assets/presentacion.*          Modo presentación
assets/fonts/                  Outfit, Geist y Geist Mono para el sitio; Bricolage y Atkinson para las animaciones
escape/index.html              Página del escape room
escape/escape.css              Estilos propios del juego
escape/escape.js               Lógica del juego: salas, versiones, insignias y personaje
escape/data/escape-finanzas.js Textos y contenido de las salas (versión inicial)
escape/data/escape-versiones.js Versiones intermedia y avanzada, y palabras de la puerta final
escape/data/escape-economia.js Llaves, costo de las pistas y sellos
docs/                          Documentación del escape room
videos/<nombre>/               Composiciones HyperFrames: ats, linkedin, star
videos/_shared/                Base común de las composiciones (mg.css, mg-embed.js, gsap)
```

No requiere compilación. Los íconos son de Font Awesome Free y están incluidos como sprite SVG; los íconos propios del juego, Fuerte y las insignias están dibujados en SVG.

Para verlo en local con un servidor:

```bash
npx http-server . -p 4173
```

## Animaciones (HyperFrames)

Cada carpeta de `videos/` es un proyecto HyperFrames de 1200x900. El sitio las muestra en vivo dentro de un `<iframe>` (`index.html?embed=1`): se reproducen una vez al entrar en pantalla, tienen botón de pausa y respetan "reducir movimiento" (muestran el cuadro final).

Para revisar o exportar una como video (la exportación requiere FFmpeg instalado):

```bash
cd videos/ats
npx hyperframes check .
npx hyperframes preview
npx hyperframes render . -q high -o ./renders/video.mp4
```

Si cambiás `videos/_shared/mg.css` o `mg-embed.js`, copiá el archivo a cada carpeta de composición.
