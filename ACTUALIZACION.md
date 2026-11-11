# MINEFRAME — Actualización (rama feature/mineframe-update)

## Qué se arregló
- **Publicación:** `/`, `/portafolio` y `/proyecto/[slug]` se prerenderizaban en el build, por eso los proyectos nuevos no aparecían. Ahora son dinámicas (`force-dynamic`) y siguen filtrando `published = true`. RLS no se tocó (ya era correcta).
- **Panel admin:** estadísticas reales con contadores animados, buscador, filtro por estado, skeletons, toasts, modal de confirmación, publicar/despublicar en un clic, transiciones.
- **Editor:** guardar borrador / publicar por separado, slug editable y sin duplicados, etiquetas, enlace externo, vista previa, validación, conserva lo escrito si hay error.
- **Eliminar:** borra la fila y luego solo los archivos del Storage que ningún otro proyecto usa (nunca `library/`). Al reemplazar imágenes al editar, limpia las antiguas sin uso.
- **Público:** transición entre páginas, brillo en títulos, `prefers-reduced-motion` respetado en toda la web.
- `getSupabase()` ahora reutiliza un único cliente.

## Migración SQL (pendiente, NO aplicada)
`supabase/migrations/001_tags_external_url.sql`
- Añade columnas `tags text[]` (default `{}`) y `external_url text` a `projects`.
- Crea un índice parcial para la consulta pública.
- No borra ni modifica datos, ni toca RLS. Es opcional: sin ella todo funciona salvo guardar etiquetas/enlace externo.

## Conectar Supabase
Variables (Netlify > Site configuration > Environment variables, y `.env.local` en local):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
Nunca pongas la `service_role` key aquí. Si aún no lo hiciste, ejecuta `supabase/schema.sql` y marca tu usuario como admin (instrucciones al final de ese archivo).

## Publicar en Netlify
1. Sube la rama: `git push origin feature/mineframe-update` (o aplica el parche: `git apply mineframe-update.patch`).
2. Netlify creará un Deploy Preview de la rama. Revísalo ahí.
3. Prueba: crear borrador (no aparece en /portafolio), publicar (aparece), despublicar (desaparece), editar, eliminar.
4. Si todo está bien, abre un Pull Request a `main` y haz merge.
5. Aplica la migración 001 en Supabase > SQL Editor cuando quieras usar etiquetas/enlace externo.
