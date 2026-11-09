# MINEFRAME — Portafolio y panel privado

Sitio web monocromático para mostrar proyectos de edición audiovisual de Minecraft y administrar imágenes y videos desde un panel privado.

## Requisitos

- Node.js 20.9 o superior
- npm
- Un proyecto Supabase para iniciar sesión, almacenar proyectos y guardar archivos multimedia

## Preparación local

1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta:

    npm install

3. Copia .env.example como .env.local.
4. En .env.local completa la URL de Supabase y la clave pública anon/publishable.
5. El correo de contacto del sitio está configurado como mineframe.contact@gmail.com.
6. En Supabase abre SQL Editor y ejecuta supabase/schema.sql. Si la base ya existía, vuelve a ejecutar el archivo: las columnas de comparación se agregan de forma compatible.
7. En Authentication activa Email y, si lo deseas, Google OAuth. Configura las URLs de redirección para localhost.
8. Crea tu usuario de administrador en Supabase Authentication > Users. Copia su UUID y marca el perfil con:

    update public.profiles set is_admin = true where id = 'PEGA-AQUI-TU-UUID';

9. Inicia el sitio:

    npm run dev

10. Abre http://localhost:3000.

## Rutas

- Inicio: /
- Portafolio: /portafolio
- Servicios: /servicios
- Contacto: /contacto
- Acceso de administrador: /admin/login
- Panel: /admin
- Biblioteca multimedia: /admin/media

## Qué incluye

- Portafolio público adaptable a escritorio y móvil.
- Panel privado con acceso por correo y Google, sujeto a la configuración de Supabase.
- Crear, editar, publicar y eliminar proyectos.
- Subir miniaturas, imágenes comparativas y videos al bucket portfolio-media.
- Biblioteca que muestra archivos, reproduce videos, copia URLs públicas y permite eliminarlos.
- El panel administra el portafolio del sitio y no publica directamente en redes sociales.
- Reproductor de enlaces de YouTube y videos MP4/WEBM directos.
- Comparador interactivo para imágenes antes y después.
- Menú móvil, barra de progreso de lectura, animaciones de entrada y efectos al pasar el cursor.
- Las animaciones se mantienen activas en escritorio y móvil; los efectos que siguen el puntero se limitan a computadoras con mouse.
- El archivo de logo original se conserva en public/brand/mineframe-logo.jpg; el símbolo transparente optimizado para la página está en public/brand/mineframe-symbol.png.


## Conectar el panel y publicar proyectos

El panel guarda proyectos y archivos en Supabase para mostrarlos en el portafolio del sitio.

1. Crea un proyecto en Supabase y abre **Project Settings > API**.
2. Copia la URL del proyecto y la clave pública anon/publishable. Duplica .env.example como .env.local y completa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.
3. En **SQL Editor**, ejecuta supabase/schema.sql. Este archivo prepara las tablas, el bucket de archivos y los permisos.
4. En **Authentication > Users**, crea tu usuario con correo y contraseña. Copia su UUID y ejecuta este SQL, reemplazando el texto de ejemplo:

       update public.profiles set is_admin = true where id = 'PEGA-AQUI-TU-UUID';

5. En la carpeta del proyecto ejecuta npm install y luego npm run dev. Abre http://localhost:3000/admin/login e inicia sesión con ese correo.
6. En el panel elige **Nuevo proyecto**, completa los datos, sube los medios y marca **Publicado** para que aparezcan en el sitio.
7. Para producción, añade las mismas variables públicas en el servicio donde alojes la página y configura la URL del dominio. Si activas Google, permite ese dominio en las URL de retorno de Supabase.

Se aceptan JPG, PNG, WEBP, MP4 y WEBM, hasta 500 MB por archivo. La administración publica el contenido en el portafolio del sitio; no sube automáticamente publicaciones a cuentas de YouTube, TikTok o Instagram. La clave service_role nunca debe ponerse en variables públicas ni en el navegador.
## Contacto

El formulario prepara un mensaje para mineframe.contact@gmail.com en la aplicación de correo del visitante. En el servicio de alojamiento, configura NEXT_PUBLIC_CONTACT_EMAIL con esa dirección y vuelve a publicar el sitio.

## Almacenamiento y seguridad

La guía SQL crea el bucket público para que los medios publicados se vean en el portafolio y limita las escrituras y eliminaciones a perfiles administradores. Usa únicamente la clave anon/publishable en las variables públicas; nunca agregues service_role o claves secretas al navegador.

Los videos grandes pueden tardar en cargarse. La configuración actual permite archivos de hasta 500 MB. Si publicarás mucho video, considera una plataforma de streaming y coloca su enlace en el proyecto.

## Antes de publicar

- Añade las credenciales de producción en Supabase y configura las URL de retorno de Google.
- Configura NEXT_PUBLIC_SITE_URL con el dominio definitivo.
- Añade tu correo, redes sociales y proyectos reales.
- Comprueba que solo tu cuenta tenga permisos de administración.
- No compartas .env.local ni incluyas claves privadas en el repositorio.
## Mapa de animaciones

- React Bits: título con letras que entran en secuencia y revelados al desplazarse.
- Aceternity UI: luz spotlight que sigue el puntero sobre las tarjetas del portafolio.
- Skiper UI: imágenes y proyectos que aparecen con ritmo al entrar en pantalla.
- Magic UI: cinta continua que se pausa al pasar el puntero.
- Animate UI: menú móvil con transición y controles con movimiento breve.
- UI Layouts: pasos del servicio con entrada escalonada y comparador antes/después.
- Kokonut UI: campo de puntos suave y botones magnéticos en escritorio.

Los efectos se implementan con CSS y APIs del navegador. Las animaciones de contenido se mantienen activas en escritorio y móvil; los efectos que siguen un puntero solo funcionan en computadoras con mouse.



## Publicar el sitio en Netlify

1. Crea un repositorio **privado** en GitHub y sube los archivos de esta carpeta. No subas `.env.local`; el `.gitignore` ya lo excluye.
2. En Netlify elige **Add new project > Import an existing project**, conecta GitHub y selecciona el repositorio. Netlify detecta Next.js; deja que configure la compilación automáticamente.
3. Añade estas variables del sitio en **Project configuration > Environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto de Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave pública anon/publishable.
   - `NEXT_PUBLIC_SITE_URL`: URL pública de Netlify, por ejemplo `https://mineframe.netlify.app`.
   - `NEXT_PUBLIC_CONTACT_EMAIL`: `mineframe.contact@gmail.com`.
4. Publica el sitio. La dirección gratuita termina en `.netlify.app`; después puedes cambiar el nombre o conectar un dominio propio.
5. En Supabase, configura la **Site URL** con la dirección de Netlify. Si utilizas el botón de Google o enlaces de confirmación, añade también la ruta de retorno del sitio en **Redirect URLs**.
6. En **Authentication > Users**, crea la cuenta administradora. Copia su UUID y ejecuta el SQL indicado arriba para marcar únicamente ese perfil como administrador.
7. Desactiva la opción de permitir nuevos registros públicos en los ajustes de Auth. Inicia sesión en `https://TU-SITIO.netlify.app/admin/login` con la cuenta que creaste.

Netlify importa el código desde GitHub, no desde un ZIP arrastrado: primero extrae el ZIP y sube los archivos del proyecto a GitHub. No compartas la clave `service_role` ni la contraseña del administrador.
