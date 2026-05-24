# Guía de Despliegue de Nido - EvÜ 🌸

Esta guía te ayudará a alojar la aplicación de manera permanente y profesional, solucionando el retraso de carga inicial que ocurre cuando la aplicación entra en "reposo" debido a la inactividad.

---

## 💤 ¿Por qué pasa "sin cargar" o tarda al volver después de un tiempo?

Tanto en Google Cloud Run (donde corre esta vista previa) como en otros servidores con capas gratuitas restrictivas (como el plan gratuito de Render), el sistema utiliza una técnica llamada **"Escalado a Cero"**. 

Si nadie entra a la aplicación por 5 o 10 minutos, el contenedor se apaga automáticamente para ahorrar recursos. Al regresar después de un tiempo:
1. El servidor tiene que encenderse de cero (proceso llamado *Cold Start* o arranque en frío).
2. Esto causa una demora de entre 10 y 30 segundos donde el sitio parece estar caído o "sin cargar" mientras arranca el motor de Node.js.

### 💡 Solución definitiva:
Para tener carga instantánea las 24 horas del día, los 7 días de la semana, debes desplegar tu aplicación en una plataforma de alto rendimiento. Aquí tienes las mejores alternativas detalladas con enlaces directos para registrarte.

---

## 🚀 Plataformas Recomendadas para Alojar Nido

A continuación, te presentamos las mejores plataformas con sus respectivos enlaces para que elijas la que mejor se adapte a ti:

### 1. Vercel (Recomendado - Gratuito y de Alta Velocidad)
Vercel es el hogar nativo para aplicaciones front-end y funciones serverless. Ya hemos configurado un archivo `vercel.json` en la raíz de tu proyecto para que sea compatible en un solo clic.

- **Ventajas:** Es 100% gratuito para proyectos personales, tiene velocidad de carga global instantánea, y las funciones serverless de la API arrancan en milisegundos (casi sin retraso perceptible).
- **Enlace de Registro:** [https://vercel.com](https://vercel.com)
- **Pasos para desplegar:**
  1. Exporta el código de tu aplicación a un repositorio de GitHub (puedes hacerlo desde el menú de configuración de esta interfaz de AI Studio).
  2. Inicia sesión en Vercel con tu cuenta de GitHub.
  3. Haz clic en **Add New** > **Project** e importa tu repositorio.
  4. En la sección **Environment Variables (Variables de Entorno)**, añade la clave:
     - Nombre: `GEMINI_API_KEY`
     - Valor: *Tu API Key secreta de Gemini.*
  5. Haz clic en **Deploy**. ¡Vercel se encargará de todo lo demás!

### 2. Railway (Excelente para mantener un servidor 24/7 sin reposo)
Railway es una plataforma en la nube extremadamente intuitiva que ejecuta tu contenedor de Node.js de forma ininterrumpida.

- **Ventajas:** No tiene reposo obligatorio si adquieres su capa de bajo consumo (aproximadamente $5 USD al mes, o usando su saldo gratuito de bienvenida). Tu aplicación estará activa al instante las 24 horas del día sin ningún arranque en frío.
- **Enlace de Registro:** [https://railway.app](https://railway.app)
- **Pasos para desplegar:**
  1. Sube tu código a GitHub.
  2. Conecta tu cuenta de Railway con GitHub.
  3. Haz clic en **New Project** > **Deploy from GitHub repo** y selecciona el proyecto.
  4. En la pestaña **Variables**, aporta la variable `GEMINI_API_KEY`.
  5. En segundos estará corriendo de forma permanente en un dominio personalizado gratis de `.up.railway.app`.

### 3. Render (Sencillo de configurar con opción gratuita)
Render te permite alojar servicios web de forma muy simple desde tu repositorio de GitHub.

- **Ventajas:** Con una interfaz limpia, te permite desplegar servidores de Node.js/Express de forma gratuita. (Nota: Su plan gratuito también duerme la app después de inactividad, pero puedes cambiarlo a su plan "Hobby" de $7/mes para mantenerlo encendido indefinidamente).
- **Enlace de Registro:** [https://render.com](https://render.com)
- **Pasos para desplegar:**
  1. Crea un nuevo servicio seleccionando **Web Service**.
  2. Conecta tu cuenta de Github e importa el repositorio de tu proyecto.
  3. En la configuración del servicio:
     - Build Command: `npm run build`
     - Start Command: `npm start`
  4. Agrega la variable de entorno `GEMINI_API_KEY` en la configuración de la app.
  5. Haz clic en **Create Web Service**.

### 4. Fly.io (Despliegue robusto de contenedores)
Fly.io corre tus aplicaciones directamente en servidores físicos repartidos por todo el mundo con un rendimiento de nivel corporativo.

- **Ventajas:** El tráfico es extremadamente rápido, es altamente configurable y puedes configurar un ping constante o balancear cargas de modo que la app esté despierta.
- **Enlace de Registro:** [https://fly.io](https://fly.io)

---

## 🛠️ ¿Cómo obtener tu API Key para Gemini?
Nidi funciona usando la inteligencia artificial de Google. Para que responda tus mensajes, es obligatorio que configures tu llave API en cualquiera de estos servicios:

1. Ve a [Google AI Studio (API Keys)](https://aistudio.google.com).
2. Haz clic en **Create API Key**.
3. Copia el token largo generado.
4. Pégalo en el panel de variables de la plataforma que hayas elegido (como Vercel, Railway, etc.) con el nombre exacto de **`GEMINI_API_KEY`**.
