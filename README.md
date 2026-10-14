# Del aula al primer trabajo

Sitio web estático de una sola página que acompaña un taller de dos horas sobre inserción laboral para estudiantes de 6to año de escuela técnica que buscan una pasantía o su primer empleo, y para quienes quieren cambiar de trabajo. El contenido se organiza como un mapa de recorrido: dos líneas de una hora cada una y once paradas, cada una con una idea clave, ejemplos y una actividad.

Está desarrollado con HTML, CSS y JavaScript sin frameworks ni proceso de compilación.

## Características

- **Avance del estudiante:** cada parada se marca como recorrida y el progreso se guarda en `localStorage`, junto con la lista de tareas del plan de 30 días.
- **Plantillas para copiar:** mapa personal, bitácora de prácticas, CV compatible con ATS y pitch de 60 segundos, con copia al portapapeles en un clic.
- **Tema claro y oscuro:** sigue la preferencia del sistema y permite cambiarlo a mano; los colores se definen con propiedades personalizadas de CSS.
- **Diseño adaptable:** panel lateral de navegación en escritorio y menú desplegable en pantallas chicas; las tablas se apilan en móvil.
- **Accesibilidad:** HTML semántico, enlace para saltar al contenido, estados anunciados a lectores de pantalla, foco visible y respeto por la preferencia de movimiento reducido.
- **Animaciones explicativas:** tres composiciones HyperFrames (lectura de un ATS, titular de LinkedIn y método STAR) incrustadas en vivo, que heredan el tema del sitio.

Contenido: Lic. Lourdes Pedaci y Lic. Julieta Taraborrelli, 2026.

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

Además hay un apartado especial sobre el recibo de sueldo (aportes, contribuciones y cómo leer un recibo), fuera del recorrido, y al final las referencias en formato APA 7.

## Estructura de archivos

```
index.html             Página única con todas las paradas
assets/styles.css      Estilos (tokens en :root, tema claro y oscuro)
assets/app.js          Avance guardado, plantillas, pestañas, tablas, animaciones
assets/fonts/          Outfit, Geist y Geist Mono para el sitio; Bricolage y Atkinson para las animaciones
videos/<nombre>/       Composiciones HyperFrames: ats, linkedin, star
videos/_shared/        Base común de las composiciones (mg.css, mg-embed.js, gsap)
```

No requiere compilación. Los íconos son de Font Awesome Free y están incluidos en `index.html` como sprite SVG.

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
