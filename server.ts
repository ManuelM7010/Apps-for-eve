import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

dotenv.config();

function safeJsonParse(text: string): any {
  if (!text) return {};
  const cleaned = text.trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // If wrapping in ```json ... ``` exists, extract it
    const match = cleaned.match(/```json?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (innerError) {
        // Continue to other fallbacks
      }
    }
    // Try to find the first '{' and last '}'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1).trim());
      } catch (sliceError) {
        // Continue
      }
    }
    throw e;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ==========================================
// STATE SYNCHRONIZATION (Real-time DB with Cloud Firestore + Local Cache Fallback)
// ==========================================
const SYNC_FILE_PATH = path.join(process.cwd(), 'nido_sync_data.json');
let inMemorySyncData: any = null;

// Initialize Firebase App & Cloud Firestore Service
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseDb: any = null;

try {
  if (fs.existsSync(firebaseConfigPath)) {
    const configRaw = fs.readFileSync(firebaseConfigPath, 'utf8');
    const config = JSON.parse(configRaw);
    const firebaseApp = initializeApp(config);
    firebaseDb = getFirestore(firebaseApp, config.firestoreDatabaseId);
    console.log('[Nido - Firebase] Cloud Firestore inicializado de forma exitosa.');
  } else {
    console.warn('[Nido - Firebase] Configuración firebase-applet-config.json no encontrada.');
  }
} catch (error) {
  console.error('[Nido - Firebase] Error crítico al inicializar Firebase SDK:', error);
}

// Loads the cached synchronization state from local file system (fallback or recovery support)
function loadSyncData() {
  if (inMemorySyncData) {
    return inMemorySyncData;
  }
  try {
    if (fs.existsSync(SYNC_FILE_PATH)) {
      const content = fs.readFileSync(SYNC_FILE_PATH, 'utf-8');
      if (content.trim()) {
        inMemorySyncData = JSON.parse(content);
        return inMemorySyncData;
      }
    }
  } catch (e) {
    console.error('Error loading sync data file, falling back to memory only:', e);
  }
  return null;
}

// Saves synchronization state to local file system
function saveSyncData(data: any) {
  inMemorySyncData = data;
  try {
    fs.writeFile(SYNC_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error('Error writing sync data to disk:', err);
      }
    });
  } catch (e) {
    console.error('Error saving sync data to disk:', e);
  }
}

// Loads synchronization state from Cloud Firestore
async function loadSyncDataFromFirestore() {
  if (!firebaseDb) {
    return null;
  }
  try {
    const docRef = doc(firebaseDb, 'nido_sync', 'state');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.error('[Nido - Firebase] Falló la lectura desde Cloud Firestore:', err);
  }
  return null;
}

// Saves synchronization state into Cloud Firestore
async function saveSyncDataToFirestore(data: any) {
  if (!firebaseDb) {
    return false;
  }
  try {
    const docRef = doc(firebaseDb, 'nido_sync', 'state');
    await setDoc(docRef, data);
    return true;
  } catch (err) {
    console.error('[Nido - Firebase] Falló la escritura en Cloud Firestore:', err);
    return false;
  }
}

// Endpoint to fetch fully synchronized state (Priority: Remote Cloud Database -> Local Cache Fallback)
app.get('/api/sync', async (req, res) => {
  try {
    // 1. Prioridad 1: Cargar desde la nube para evitar pérdidas de reinicio del hosting en Render
    let data = await loadSyncDataFromFirestore();
    
    if (data) {
      // Éxito: Sincronizar nuestro caché en memoria y archivo físico local para el próximo reinicio o fuera de línea
      inMemorySyncData = data;
      try {
        fs.writeFileSync(SYNC_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
      } catch (writeErr) {
        console.error('Error actualizando copia caché local:', writeErr);
      }
    } else {
      // Prioridad 2: Fallback al archivo local (o memoria si no existe/está vacío)
      console.log('[Nido - Sync] Datos de la nube no disponibles o vacíos. Cargando caché local de respaldo...');
      data = loadSyncData();
      
      // Auto-hidratación: Si cargamos datos locales válidos pero la nube estaba vacía, la poblamos de inmediato.
      if (data && firebaseDb) {
        console.log('[Nido - Sync] Auto-hidratando Cloud Firestore con la copia de seguridad local...');
        saveSyncDataToFirestore(data).catch(err => console.error('Error en hidratación de fondo de Firestore:', err));
      }
    }
    
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error en GET /api/sync:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to save state changes (Double-Persistence and instant cloud sync)
app.post('/api/sync', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Falta el campo "data" para sincronizar.' });
    }
    
    // 1. Guardado local inmediato para resiliencia asíncrona
    saveSyncData(data);
    
    // 2. Guardado en la nube persistente
    if (firebaseDb) {
      await saveSyncDataToFirestore(data);
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error en POST /api/sync:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;

// Lazy initialization of GoogleGenAI SDK to avoid crashing if API key is initially missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('La variable de entorno GEMINI_API_KEY no está configurada. Por favor, añádela en la sección Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ==========================================
// ENDPOINT: Generar Ideas de Citas en Casa (Módulo 1)
// ==========================================
app.post('/api/gemini/citas', async (req, res) => {
  try {
    const { mood, category } = req.body;
    if (!mood) {
      return res.status(400).json({ error: 'El "mood" es requerido.' });
    }

    const ai = getAI();
    const prompt = `Actúa como un organizador de parejas y creador de experiencias íntimas y cálidas.
Genera 3 ideas de citas súper detalladas para hacer EN CASA.
Mood seleccionado: ${mood}.
Cada cita debe responder a este estado de ánimo o temática.

Regresa la respuesta en formato JSON estrictamente válido, sin envolver en bloque markdown de código (solo el JSON crudo en el texto de respuesta), o estructurado. Genera una estructura conforme al esquema de TypeScript:
{
  "citas": [
    {
      "name": "Nombre creativo e inspirador de la cita",
      "description": "Explicación detallada de de qué trata la cita y cómo estructurarla paso a paso",
      "atmosphere": "Decoración, iluminación, vestimenta y aroma sugerido para el hogar",
      "playlist": "Canciones, artistas, géneros o moods recomendados para ambientar de fondo",
      "foodIdeas": "Ideas específicas de comida, snacks, cenas prácticas, bebidas o postres ricos listos para preparar en pareja",
      "games": "Juegos, dinámicas profundas, dinámicas lúdicas, retos o preguntas rompecabezas para conectarse",
      "estimatedTime": "Tiempo total estimado (por ejemplo: '2 horas', 'Toda la noche')",
      "budget": "Presupuesto aproximado (por ejemplo: 'Muy económico', '$10 - $15 USD')",
      "preparationLevel": "Nivel de preparación requerido ('Bajo', 'Medio' o 'Alto')"
    }
  ]
}

Asegúrate de sugerir comida rica, casera o práctica al estilo latino/salvadoreño si es pertinente, evitando cosas extremadamente fitness o difíciles de conseguir.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['citas'],
          properties: {
            citas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['name', 'description', 'atmosphere', 'playlist', 'foodIdeas', 'games', 'estimatedTime', 'budget', 'preparationLevel'],
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  atmosphere: { type: Type.STRING },
                  playlist: { type: Type.STRING },
                  foodIdeas: { type: Type.STRING },
                  games: { type: Type.STRING },
                  estimatedTime: { type: Type.STRING },
                  budget: { type: Type.STRING },
                  preparationLevel: { type: Type.STRING },
                }
              }
            }
          }
        },
        temperature: 0.85,
      }
    });

    const textOutput = response.text || '{}';
    res.json(safeJsonParse(textOutput));
  } catch (error: any) {
    console.error('Error al generar citas con IA:', error);
    // Servir fallback si falla o no hay API key todavía
    res.status(500).json({
      error: error.message,
      message: 'No se pudo conectar a la IA en este momento.',
    });
  }
});

// ==========================================
// ENDPOINT: Buscar citas fuera con Google Maps Grounding
// ==========================================
app.post('/api/gemini/places', async (req, res) => {
  try {
    const { city, category, budget, dayNight, inOut } = req.body;
    const selectedCity = city || 'San Salvador';
    const selectedCategory = category || 'Cafés';

    const ai = getAI();

    const query = `Recomienda exactamente 10 lugares de la vida real o actividades locales específicos, reales y abiertos al público con dirección/ubicación en el departamento o ciudad "${selectedCity}", El Salvador, pertenecientes a la categoría o ambientación "${selectedCategory}".
Filtros actuales para personalizar las sugerencias de la cita de pareja:
- Presupuesto: ${budget || 'Cualquiera'}
- Momento del día: ${dayNight || 'Cualquiera'}
- Ambiente: ${inOut || 'Cualquiera'}

Asegúrate de investigar bien en internet y Google Maps sobre "${selectedCity}" en El Salvador. Si es un departamento (como La Libertad, Santa Ana, Chalatenango), busca en sus ciudades y atracciones turísticas principales (por ejemplo, El Tunco o Suchitoto o Ruta de las Flores).
Para cada una de las 10 recomendaciones, proporciona:
1. El nombre del lugar real.
2. Breve reseña súper cozy de por qué es fantástico para parejas.
3. Qué tomar/comer/hacer ahí (ej: pupusas de camarón, atole de elote, picnic, café artesanal).
4. El precio estimado (ej: económico, moderado, premium) y ambiente (interior/exterior).

Devuelve una estructura de datos en formato JSON que represente estas opciones, como:
{
  "places": [
    {
      "name": "Nombre real del establecimiento",
      "review": "Reseña corta y romántica",
      "recommendation": "Plato destacado, bebida típica salvadoreña o actividad principal a hacer juntos",
      "details": {
        "budget": "Económico, Moderado o Premium",
        "schedule": "Día, Noche o Todo el día",
        "ambiance": "Interior o Exterior",
        "city": "Ciudad del municipio"
      }
    }
  ]
}`;

    let response;
    let groundingChunks: any[] = [];

    try {
      // Intento 1: Con Google Search Grounding para obtener información real y actualizada de internet
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ['places'],
            properties: {
              places: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ['name', 'review', 'recommendation', 'details'],
                  properties: {
                    name: { type: Type.STRING },
                    review: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    details: {
                      type: Type.OBJECT,
                      required: ['budget', 'schedule', 'ambiance', 'city'],
                      properties: {
                        budget: { type: Type.STRING },
                        schedule: { type: Type.STRING },
                        ambiance: { type: Type.STRING },
                        city: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          },
          temperature: 0.7,
        },
      });
      groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    } catch (searchError) {
      console.warn("Google Search Grounding falló en busca de lugares, reintentando con generación estándar:", searchError);
      
      // Intento 2: Sin herramientas de búsqueda (Generación directa altamente confiable)
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: query,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ['places'],
            properties: {
              places: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ['name', 'review', 'recommendation', 'details'],
                  properties: {
                    name: { type: Type.STRING },
                    review: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    details: {
                      type: Type.OBJECT,
                      required: ['budget', 'schedule', 'ambiance', 'city'],
                      properties: {
                        budget: { type: Type.STRING },
                        schedule: { type: Type.STRING },
                        ambiance: { type: Type.STRING },
                        city: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          },
          temperature: 0.7,
        },
      });
    }

    // Parseo seguro del texto usando nuestro helper
    const textOutput = response.text || '{}';
    const parsedData = safeJsonParse(textOutput);

    res.json({
      data: parsedData,
      groundingChunks: groundingChunks,
    });
  } catch (error: any) {
    console.error('Error al buscar lugares de El Salvador con IA:', error);
    res.status(500).json({
      error: error.message,
      message: 'No se pudo buscar sugerencias reales de mapas en este momento.',
    });
  }
});

// ==========================================
// ENDPOINT: Generar Plan de Comida Quincenal / Semanal con IA
// ==========================================
app.post('/api/gemini/menu', async (req, res) => {
  try {
    const { ingredients, requestType } = req.body;
    const sampleIngredients = ingredients || 'frijoles, huevos, plátanos, crema, tomate, carne de res, cebolla, arroz, tortillas';

    const ai = getAI();

    const prompt = `Actúa como un chef salvadoreño del hogar con gran capacidad de optimización culinaria.
El usuario tiene estos ingredientes disponibles o en mente de su lista de compras: "${sampleIngredients}".
Genera un plan de alimentación balanceado de 5 días (desayuno, almuerzo, cena) en formato JSON.

REGLAS DE ALIMENTACIÓN INTELECTUAL:
1. Reutiliza los ingredientes inteligentemente para reducir desperdicio (ej. si el almuerzo de un día lleva carne, usa las sobras o caldos para aromatizar la cena o el almuerzo siguiente).
2. Proporciona cocina real, casera, práctica, latina y típica de El Salvador (como pupusas de queso/revoltura caseras, casamiento, plátanos fritos, entomatadas, carne deshilachada, sopa de frijoles con masa, arroz con pollo real, etc.).
3. NO incluyas ensaladas aburridas o recetas extremadamente fitness de avena con chía, granola carísima o té verde. Debe ser comida rica, reconfortante y realizable para el día a día.
4. Diseña platos prácticos ideales para llevar a la oficina en recipientes (Fáciles de recalentar sin que queden secos, ej: guisados con salsa, estofados, casamiento bien húmedo).

Formato de respuesta JSON estrictamente estructurado bajo este esquema:
{
  "menu": [
    {
      "day": "Día 1",
      "desayuno": {
        "title": "Nombre de plato salvadoreño reconfortante",
        "description": "Detalle rápido del platillo",
        "reutilizacion": "Qué ingrediente se aprovechó aquí (ej: frijoles del día anterior)"
      },
      "almuerzo": {
        "title": "Nombre de plato apto para oficina",
        "description": "Detalle rápido (ej: guisado con salsa para que caliente bien)",
        "reutilizacion": "Qué se reutiliza o cómo ahorra tiempo"
      },
      "cena": {
        "title": "Nombre del plato de cena",
        "description": "Cena práctica y ligera pero sabrosa",
        "reutilizacion": "Ingrediente optimizado"
      }
    }
  ],
  "supermarketList": ["Lista de 5-6 cosas adicionales ultra baratas para complementar"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['menu', 'supermarketList'],
          properties: {
            menu: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['day', 'desayuno', 'almuerzo', 'cena'],
                properties: {
                  day: { type: Type.STRING },
                  desayuno: {
                    type: Type.OBJECT,
                    required: ['title', 'description', 'reutilizacion'],
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      reutilizacion: { type: Type.STRING }
                    }
                  },
                  almuerzo: {
                    type: Type.OBJECT,
                    required: ['title', 'description', 'reutilizacion'],
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      reutilizacion: { type: Type.STRING }
                    }
                  },
                  cena: {
                    type: Type.OBJECT,
                    required: ['title', 'description', 'reutilizacion'],
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      reutilizacion: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            supermarketList: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        },
        temperature: 0.8,
      }
    });

    const textOutput = response.text || '{}';
    res.json(safeJsonParse(textOutput));
  } catch (error: any) {
    console.error('Error al generar menús alimenticios:', error);
    res.status(500).json({
      error: error.message,
      message: 'No se pudo generar tu menú inteligente en este momento.',
    });
  }
});

// ==========================================
// ENDPOINT: Generar Almuerzos de Oficina para Manu (Prep Meal IA)
// ==========================================
app.post('/api/gemini/office-menu', async (req, res) => {
  try {
    const { ingredients } = req.body;
    const sampleIngredients = ingredients || 'frijoles, huevos, plátanos, crema, tomate, carne de res, cebolla, arroz, tortillas';

    const ai = getAI();

    const prompt = `Actúa como un chef salvadoreño experto en Prep Meal y Meal Prep para oficinas.
El usuario Manu necesita planificar sus almuerzos para llevar a la oficina en fiambrera o tupper hermético, optimizando el uso de estos ingredientes que tiene disponibles: "${sampleIngredients}".
Recuerda: Eve trabaja en casa (home office) y Manu va a la oficina algunos días, por lo que este menú es EXCLUSIVO para 1 comida al día (el almuerzo en fiambrera caliente).

Genera un menú semanal de lunes a viernes (5 almuerzos individuales) que se recaliente súper bien en microondas de oficina (que no quede seco, que huela bien para no molestar a los compañeros, y que no se derrame).
Usa sabores caseros típicos de El Salvador.

Formato de respuesta JSON estrictamente estructurado bajo este esquema:
{
  "officeMenu": [
    {
      "day": "Lunes",
      "mealTitle": "Nombre del almuerzo para tupper (ej: Estofado de res entomatado con arroz salvadoreño)",
      "description": "Breve explicación de la preparación y por qué es ideal para llevar",
      "prepTip": "Tip de empaque/transporte (ej: colocar el arroz al fondo y la salsa encima para evitar que se ablande)",
      "reheatTime": "Tiempo recomendado en microondas de oficina (ej: 1:30 minutos a potencia media)"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['officeMenu'],
          properties: {
            officeMenu: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['day', 'mealTitle', 'description', 'prepTip', 'reheatTime'],
                properties: {
                  day: { type: Type.STRING },
                  mealTitle: { type: Type.STRING },
                  description: { type: Type.STRING },
                  prepTip: { type: Type.STRING },
                  reheatTime: { type: Type.STRING }
                }
              }
            }
          }
        },
        temperature: 0.8,
      }
    });

    const textOutput = response.text || '{}';
    res.json(safeJsonParse(textOutput));
  } catch (error: any) {
    console.error('Error al generar almuerzos de oficina:', error);
    res.status(500).json({
      error: error.message,
      message: 'No se pudo generar tu menú de oficina con IA.',
    });
  }
});

// ==========================================
// ENDPOINT: Comida Instantánea y Recetas Exprés
// ==========================================
app.post('/api/gemini/instantanea', async (req, res) => {
  try {
    const { ingredients, mealType, timeLimit } = req.body;
    if (!ingredients || ingredients.trim() === '') {
      return res.status(400).json({ error: 'Debes proporcionar al menos un ingrediente para que la cocina de Nido cree magia.' });
    }

    const ai = getAI();
    const query = `Genera un listado de 3 recetas deliciosas, creativas y rápidas de preparar que se enfoquen principalmente en usar los siguientes ingredientes: "${ingredients}".
Tipo de receta ideal: "${mealType || 'Al gusto'}" (ej. Desayuno, Almuerzo, Cena, Snack).
Tiempo máximo estimado: "${timeLimit || '20 min'}".

Reglas del chef:
1. Prioriza la gastronomía salvadoreña en lo posible o platos reconfortantes y caseros ideales para Manu y Eve (EvÜ), adaptados a su cocina.
2. Está permitido incluir cosas de despensa común como agua, sal, pimienta, ajo, aceite común, mantequilla o salsa de tomate/inglesa. La parte principal del plato debe enfocarse en los ingredientes dados.
3. El tono de los consejos debe ser cálido, hogareño, romántico (cozy "Nido").

Responde ÚNICAMENTE con un JSON que siga estrictamente este esquema:
{
  "recipes": [
    {
      "title": "Nombre del plato delicioso",
      "prepTime": "Tiempo total (ej. 15 mins)",
      "difficulty": "Nivel (Fácil, Medio, Express)",
      "ingredientsUsed": ["lista de ingredientes usados"],
      "extraIngredients": ["lista de extras estándar requeridos"],
      "steps": [
        "Paso 1...",
        "Paso 2...",
        "Paso 3..."
      ],
      "chefSecret": "El toque romántico o tip de Nidi para cocinarlo juntos con amor en pareja."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: query,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['recipes'],
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['title', 'prepTime', 'difficulty', 'ingredientsUsed', 'extraIngredients', 'steps', 'chefSecret'],
                properties: {
                  title: { type: Type.STRING },
                  prepTime: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                  extraIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  chefSecret: { type: Type.STRING }
                }
              }
            }
          }
        },
        temperature: 0.7,
      }
    });

    const textOutput = response.text || '{}';
    res.json(safeJsonParse(textOutput));
  } catch (error: any) {
    console.error('Error al generar recetas instantáneas:', error);
    res.status(500).json({
      error: error.message,
      message: 'No se pudieron idear las recetas express en este momento.',
    });
  }
});

// ==========================================
// ENDPOINT: Chatbot Cozy para Pareja, Alimentación y Tareas
// ==========================================
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'El mensaje está vacío.' });
    }

    const ai = getAI();

    // Get current date/time context for El Salvador
    const now = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/El_Salvador'
    };
    const formattedDate = now.toLocaleDateString('es-SV', dateOptions);

    // Reconstruct the chat with system instruction
    const systemInstruction = `Eres "Nidi", un asistente IA de pareja súper cálido, sabio y cozy. Estás integrado en la aplicación de la encantadora pareja "Manu" y "Eve", cuyo acrónimo de unión de sus nombres es "EvÜ".

INFORMACIÓN DE HOY EN TIEMPO REAL:
- La fecha de hoy es: ${formattedDate}.
- Ten esto en cuenta para responder preguntas sobre qué día es hoy, fechas, etc.

Tu propósito principal incluye:
1. Sugerir ideas creativas de citas basadas en diferentes estados de ánimo (Romántica, Love, Relajante, Aventura, Económica, etc.) con enfoque salvadoreño (como atarcederes mágicos en los Planes de Renderos, mirador en El Boquerón, caminatas en Paseo El Carmen, pupuseadas en Olocuilta, o picnics rústicos en la sala). El mood llamado "Love" está pensado para momentos profundos e íntimos y unifica pasiones tiernas, siendo de tono cálido, íntimo y romántico sin caer en descripciones explícitas o de lenguaje demasiado crudo.
2. Ayudar a generar menús semanales o quincenales (quincenal es de 14-15 días) utilizando ingredientes que tengan disponibles, priorizando comida casera y reconfortante (como frijoles con plátano, pollo deshilachado para fiambreras, casamiento, huevos fritos criollos).
3. Ayudar a organizar las tareas domésticas repartiéndoselas equitativamente y sin discusiones.
4. Responder a preguntas generales sobre el funcionamiento de la aplicación (la app tiene: un Dashboard con cuenta regresiva para el aniversario y medidor de racha/puntos, sección de Citas IA para planear salidas y guardar favoritas, Tablero del Hogar para registrar chores y ganar puntos de pareja, Sección de Alimentación con plan de menús interactivo y un Recetario completo de 100 recetas locales salvadoreñas, y sección de Perfil).

Tu tono debe ser extremadamente empático, amigable, súper cálido (cozy vibe, Notion-style), libre de terminologías técnicas y alentador.
Sé directo pero lleno de cariño. Refiérete a ellos por sus nombres Manu y Eve, o felicítalos por su unión "EvÜ".`;

    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    // Optional: send previous history sequentially to rebuild state if present
    if (history && history.length > 0) {
      // Rebuild the context by sending message in the session.
      // For simplicity, we can also inject the history into a single customized prompt to save request roundtips
    }

    let promptMessage = message;
    if (history && history.length > 0) {
      const historyContext = history.slice(-6).map((h: any) => `${h.role === 'user' ? 'Pareja' : 'Nidi'}: ${h.text}`).join('\n');
      promptMessage = `Historial Reciente de la Conversación:\n${historyContext}\n\nNueva pregunta de la Pareja:\n${message}`;
    }

    const response = await chat.sendMessage({
      message: promptMessage,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error en el Chatbot Inteligente:', error);
    res.status(500).json({
      error: error.message,
      text: '¡Hola! Parece que el canal de IA está descansando ahora mismo, pero estoy listo para darte ideas demostrativas con amor de todas formas. 🌸',
    });
  }
});

// Serve frontend assets in production and launch Vite client dev middleware in development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Nido - Server] Corriendo en http://localhost:${PORT}`);
});

export default app;
