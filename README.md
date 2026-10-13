# Del aula al primer trabajo

Sitio del taller de primer empleo (2 horas) para estudiantes de 6to año que buscan pasantías o empleo para 7mo, y para quienes quieren cambiar de trabajo. Funciona como un mapa de recorrido: dos líneas (una hora cada una) y diez paradas.

Docentes: Lic. Lourdes Pedaci y Lic. Julieta Taraborrelli, 2026.

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
9. Entrevistas con personas y con IA
10. Plan de 30 días

Al final están las referencias en formato APA 7.

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

## Publicar en GitHub Pages

1. Subir el contenido de esta carpeta a un repositorio (con `index.html` en la raíz).
2. En **Settings > Pages > Build and deployment**, elegir **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
3. El sitio queda en `https://<usuario>.github.io/<repositorio>/`.

## Notas para editar

- Cada parada es un `<section class="station line-1|line-2" id="pN">`. Los minutos de cada parada aparecen en dos lugares: el encabezado de la parada y el mapa.
- Las plantillas copiables son `<pre id="tpl-...">` con un botón `data-copy="tpl-..."`.
- El avance del estudiante se guarda en `localStorage` bajo la clave `primer-empleo-v1`; el tema elegido, en `primer-empleo-tema`.
- Los datos estadísticos son de 2025 y 2026; conviene revisarlos al reutilizar el material.
