
## Contexto del proyecto
Joyería física en Alcalá de Henares. Web estática HTML/CSS/JS.
Stack: HTML · CSS · JavaScript vanilla · Vercel · GitHub.
Sin frameworks, sin Tailwind, sin npm. Todo en style.css puro.

## Estilo visual: Heritage Minimalista
Skills activos: `minimalist-ui` · `high-end-visual-design` · `design-taste-frontend`
- Tipografía: Playfair Display (solo titulares) · Montserrat (todo lo demás)
- Paleta: --crema #F5F0E8 · --negro #1F1E1C · --dorado #C8A462 · --gris #555555
- Cero sombras densas · cero bordes redondeados excesivos · cero degradados innecesarios
- Animaciones: solo fade-in suave · nunca rebotes ni efectos llamativos
- Espacio negativo generoso · cuadrícula rígida · bloques a sangre

## Reglas técnicas innegociables
- Mobile-first estricto. 80% del tráfico es móvil, público 40-65 años
- Touch targets mínimo 48x48px en todos los elementos interactivos
- Texto mínimo 16px en móvil
- El schema JSON-LD en el <head> del index.html es INTOCABLE
- Los meta tags, canonical, OG y Twitter son INTOCABLES
- Las rutas de imágenes no se modifican sin confirmación explícita
- Cero style= inline en HTML (excepción: banner de cookies)
- :root se declara una sola vez en style.css
- Cero código de campañas pasadas (xmas, bf-, blackfriday, theme-xmas)

## Arquitectura de 3 nichos
Mismo diseño global, CTA adaptado según gama.
Nunca mostrar rangos de precio en portada ni en los silos.

| Gama | Marcas | CTA |
|------|--------|-----|
| Tendencias | Luxenter | "Ver colección" |
| Colecciones | Vidal & Vidal · Sobrani · Fidda | "Ver colección" |
| Alta Joyería | Oro · Plata · Diamantes · Alianzas · Taller | "Reservar cita" |

El precio solo aparece en páginas de catálogo de producto individual.
En Alta Joyería, nunca mostrar precio si la pieza es a medida.

## Estructura de la web (aprobada)
index.html → Header · Hero · 3 Silos · Piezas Únicas · Nosotros · Opiniones · FAQ+Contacto · Footer
Silos: #tendencias (Luxenter) · #colecciones (Vidal & Vidal) · #alta-joyeria (Taller)

## Flujo de trabajo
- Leer siempre index.html y style.css antes de modificar nada
- Hacer commit de seguridad antes de cada cambio importante
- No publicar a producción (rama main) sin aprobación explícita
- Rama de trabajo activa: eurodiamant
```