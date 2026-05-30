import { CoupleTask, DateAppointment, SavedDateIdea, DayMenu, CoupleProfile } from '../types';

export const defaultProfile: CoupleProfile = {
  partner1: 'Manu',
  partner2: 'Eve',
  anniversaryDate: '2021-11-21', // Aniversario de novios real de Manu & Eve
  points1: 350,
  points2: 550,
  streakDays: 9, // Activos desde el viernes 22 de mayo 2026 (9 días de racha al 30 de mayo)
};

export const defaultTasks: CoupleTask[] = [
  {
    id: 't-1',
    name: 'Sacar la basura orgánica del jardín',
    frequency: 'Diaria',
    priority: 'Alta',
    suggestedTime: '19:00',
    responsable: 'Él',
    duration: '10 min',
    autoRepeat: true,
    completed: true,
    scorePoints: 10,
  },
  {
    id: 't-2',
    name: 'Trapear la sala y comedor',
    frequency: 'Semanal',
    priority: 'Media',
    suggestedTime: '10:00',
    responsable: 'Ambos',
    duration: '35 min',
    autoRepeat: true,
    completed: true,
    scorePoints: 25,
  },
  {
    id: 't-3',
    name: 'Limpiar la cocina (estufa y platos)',
    frequency: 'Diaria',
    priority: 'Alta',
    suggestedTime: '20:30',
    responsable: 'Ella',
    duration: '20 min',
    autoRepeat: true,
    completed: true,
    scorePoints: 15,
  },
  {
    id: 't-4',
    name: 'Cambiar sábanas matrimoniales de la cama',
    frequency: 'Semanal',
    priority: 'Baja',
    suggestedTime: '14:00',
    responsable: 'Ambos',
    duration: '15 min',
    autoRepeat: true,
    completed: true,
    scorePoints: 20,
  },
  {
    id: 't-5',
    name: 'Lavar ropa blanca',
    frequency: 'Semanal',
    priority: 'Alta',
    suggestedTime: '08:00',
    responsable: 'Él',
    duration: '45 min',
    autoRepeat: true,
    completed: true,
    scorePoints: 30,
  }
];

export const defaultAppointments: DateAppointment[] = [
  {
    id: 'a-1',
    title: 'Cena romántica italiana en el comedor con luces tenues',
    date: '2026-05-24',
    time: '20:00',
    mood: 'Romántica',
    location: 'En Casa',
    completed: false,
  },
  {
    id: 'a-3',
    title: 'Picnic Indoor en la alfombra de la sala con vinito',
    date: '2026-05-31',
    time: '19:30',
    mood: 'Nostálgica',
    location: 'En Casa',
    completed: false,
  }
];

export const defaultSavedIdeas: SavedDateIdea[] = [
  {
    id: 's-1',
    name: 'Bistro Italiano en la Sala',
    description: 'Montar una fondue de quesillo o pasta casera con servilletas de tela y un candelabro improvisado. Poner música napolitana clásica de fondo.',
    atmosphere: 'Luces atenuadas, velas encendidas, aroma a albahaca tostada.',
    playlist: 'Andrea Bocelli, Jazz lento romántico, baladas de los 60s.',
    foodIdeas: 'Espaguetis al pesto, pan tostado con mantequilla de ajo y vino tinto salvadoreño.',
    games: 'Dynamic Jenga: Jugar al jenga escribiendo preguntas íntimas o graciosas en cada pieza.',
    estimatedTime: '2.5 horas',
    budget: 'Bajo (menos de $15 USD)',
    preparationLevel: 'Medio',
    status: 'guardada',
  },
  {
    id: 's-2',
    name: 'Atardecer en Planes de Renderos',
    description: 'Ir juntos a gozar de un buen casamiento de pupusas revueltas con atol de elote caliente frente a la brisa templada e inolvidable de la cordillera.',
    atmosphere: 'Exterior fresco, manta cálida o abrigos ligeros.',
    playlist: 'Música folclórica relajante latinoamericana o marimba contemporánea.',
    foodIdeas: 'Pupusas de arroz recién hechas, chocolate caliente batido a mano.',
    games: 'Identificar cerros visibles o adivinar qué casas están decoradas en las copas de los árboles.',
    estimatedTime: '3 horas',
    budget: 'Bajo',
    preparationLevel: 'Bajo',
    status: 'para_luego',
  }
];

export const defaultMenu: DayMenu[] = [
  {
    day: 'Lunes',
    desayuno: {
      title: 'Plátano frito con frijoles molidos y crema',
      description: 'Plátano macho bien maduro frito en cubos con crema salvadoreña y frijoles recién cocidos licuados.',
      reutilizacion: 'Ninguna (Día de inicio)'
    },
    almuerzo: {
      title: 'Pollo deshilachado con entomatada jugosa',
      description: 'Pechuga deshebrada cocinada en abundante salsa casera de tomate fresco y cebolla, ideal para recalentar en la oficina.',
      reutilizacion: 'Aprovecha caldo de la cocción de pechuga para hacer sopa en la noche.'
    },
    cena: {
      title: 'Casamiento con tortillita tostada',
      description: 'Mezcla húmeda tradicional de arroz con los frijoles sobre comal caliente y queso duro picadito.',
      reutilizacion: 'Reutiliza los frijoles molidos de la mañana y arroz blanco disponible.'
    }
  },
  {
    day: 'Martes',
    desayuno: {
      title: 'Huevos picados con rábano y tomate',
      description: 'Huevos de granja revueltos sofritos con rodajitas finas de rábano y tomate fresco.',
      reutilizacion: 'Reutiliza el tomate sobrante de la salsa del lunes.'
    },
    almuerzo: {
      title: 'Bistec encebollado con arroz',
      description: 'Carne jugosa estofada en abundante cebolla tierna para conservar excelente humedad en la oficina.',
      reutilizacion: 'La carne extra se guardará para taquitos del miércoles.'
    },
    cena: {
      title: 'Emparrillado de plátano con frijol refrito',
      description: 'Canoa de plátano maduro asada al comal rellena de frijoles rojos finamente refritos.',
      reutilizacion: 'Aprovecha frijoles licuados remanentes.'
    }
  },
  {
    day: 'Miércoles',
    desayuno: {
      title: 'Tamal de elote frito con crema',
      description: 'Tamales tradicionales de elote dulce fritos con mantequillita hasta dorar, servidos con crema.',
      reutilizacion: 'Tamalitos comprados listos para recalentar.'
    },
    almuerzo: {
      title: 'Tacos caseros de carne deshebrada con chirmol',
      description: 'Tortillas calientes rellenas de la carne deshebrada del martes sazonada con cilantro fresco picadito.',
      reutilizacion: 'Reutiliza la carne guisada del bistec del martes desmechándola.'
    },
    cena: {
      title: 'Desayuno de la noche (Breakfast for dinner)',
      description: 'Huevo estrellado sobre casamiento, aguacate hass y queso duro blanco rallado.',
      reutilizacion: 'Usa porción de casamiento del lunes o arroz caliente.'
    }
  },
  {
    day: 'Jueves',
    desayuno: {
      title: 'Omelette criollo de espinaca y tomate',
      description: 'Tortilla de huevo esponjosa batida con espinaca picada fresca y finas rodajas de cebolla.',
      reutilizacion: 'Aprovecha últimos restos de cebolla blanca.'
    },
    almuerzo: {
      title: 'Cerdo guisado al jugo de naranja criolla',
      description: 'Guiso tierno de trozos de cerdo en zumo de naranja agria y achiote, fantástico para microondas.',
      reutilizacion: 'La salsa sirve para humedecer el arroz.'
    },
    cena: {
      title: 'Frijoles parados con tortilla tostada y aguacate',
      description: 'Sopa de frijoles rojos calientes de olla sazonados con cilantro de monte.',
      reutilizacion: 'Aprovecha frijoles enteros cocidos.'
    }
  },
  {
    day: 'Viernes',
    desayuno: {
      title: 'Plátano sancochado con cuajada salvadoreña',
      description: 'Plátano maduro entero cocido servido con cuajada fresca y un chorrito de crema de rancho.',
      reutilizacion: 'Plátanos maduros restantes.'
    },
    almuerzo: {
      title: 'Arroz con pollo deshebrado y chirmol de rábano',
      description: 'Arroz frito y sazonado junto a tiras de pollo cocido, una delicia clásica fría o caliente para oficina.',
      reutilizacion: 'Reutiliza las verduras sobrantes de la semana.'
    },
    cena: {
      title: 'Pupusas express caseras de queso',
      description: 'Masa de maíz rellena de quesillo y cocinadas sobre sartén de teflón. Curtido de cenaduría listo.',
      reutilizacion: 'Día libre de celebración con pupusas.'
    }
  }
];

export const motivationalQuotes = [
  "El amor se demuestra en los pequeños gestos cotidianos: una taza de café caliente, tender la cama o un abrazo inesperado.",
  "Un hogar no se construye con paredes, se cimenta con las risas mutuas, la paciencia infinita y las cenas compartidas.",
  "La felicidad de nuestra vida juntos se encuentra en repartirnos las cargas y multiplicar las alegrías.",
  "¡Hoy es un gran día para sorprender con un cumplido, dar las gracias por lavarle los platos al otro o programar una cita especial!",
  "El trabajo en equipo hace que el hogar sea un refugio acogedor y lleno de armonía.",
  "Cocinar juntos es pintar un lienzo de sabores y recuerdos con la persona que más amas."
];
