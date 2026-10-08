# CV LaTeX — Daniel González Pascual

CV en LaTeX al estilo de la plantilla [NIT Warangal Resume](https://es.overleaf.com/latex/templates/nit-warangal-resume/gtsrbjvffcjn),
con el contenido del CV publicado en LinkedIn actualizado con el puesto actual en **Inforyde**.

## Cómo compilarlo en Overleaf

1. Entra en la plantilla de Overleaf y pulsa **«Open as Template»** (crea un proyecto tuyo con el estilo original).
2. Abre `main.tex` del proyecto y **sustituye todo su contenido** por el de nuestro `main.tex` (o borra los ficheros del proyecto y sube este `main.tex`).
3. Compila con **pdfLaTeX** (compilador por defecto). El CV sale en una página.

> Alternativa: New Project → Blank Project → subir este `main.tex`. El estilo es una recreación
> fiel de la plantilla (una columna, secciones en versalitas con regla, bullets compactos), sin
> necesidad del proyecto original.

## Qué contiene

- **Cabecera**: nombre, cargo, teléfono, email, Madrid, GitHub y LinkedIn.
- **Sobre mí**: resumen backend Python 3+ años.
- **Experiencia**: Inforyde (Mar 2026 – actualidad, semi-senior, Madrid) y DisOfic (Ago 2023 – Mar 2026) con logros medibles (+50 sitios, días → 2 h, −50 % incidencias).
- **Proyectos**: Portfolio OS, la API de integración WordPress↔Odoo y el blog.
- **Educación**: DAW (en curso), UMA y Cesur.
- **Habilidades** agrupadas por categorías.

## Personalización rápida

- Colores/iconos: `fontawesome5` ya está incluido; los iconos se cambian con `\faGithub`, etc.
- Si Overleaf marca acentos raros, verifica que el compilador sea **pdfLaTeX** (Menu → Compiler).
