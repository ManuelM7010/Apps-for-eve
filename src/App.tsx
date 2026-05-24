import React, { useState, useEffect } from 'react';
import {
  Heart,
  Home,
  Utensils,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Flame,
  Search,
  BookOpen,
  ShoppingBag,
  Send,
  Sliders,
  Award,
  ChevronRight,
  Sun,
  Smile,
  LogOut,
  User,
  RefreshCw,
  TrendingUp,
  Lightbulb,
  FileText
} from 'lucide-react';
import { CoupleTask, DateAppointment, SavedDateIdea, DayMenu, CoupleProfile, OfficialMenu } from './types';
import { defaultProfile, defaultTasks, defaultAppointments, defaultSavedIdeas, defaultMenu, motivationalQuotes } from './data/defaults';
import { allOneHundredRecipes, Recipe } from './data/recipes';
import ChatbotOverlay from './components/ChatbotOverlay';

export default function App() {
  // Navigation Tabs: 'dashboard' | 'citas' | 'hogar' | 'alimentacion' | 'perfil' | 'instantanea'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'citas' | 'hogar' | 'alimentacion' | 'perfil' | 'instantanea'>('dashboard');

  // App Global State (Persisted in localStorage with default templates)
  const [profile, setProfile] = useState<CoupleProfile>(() => {
    const saved = localStorage.getItem('nido_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const p1 = String(parsed.partner1 || '');
        const p2 = String(parsed.partner2 || '');
        let dirty = false;
        if (p1.toLowerCase().includes('manuel') || p1 === 'Manü') {
          parsed.partner1 = 'Manu';
          dirty = true;
        }
        if (p2.toLowerCase().includes('gabriela') || p2.includes('(EvÜ)') || p2 === 'EvÜ') {
          parsed.partner2 = 'Eve';
          dirty = true;
        }
        if (p1.toLowerCase().includes('manuel') || p2.toLowerCase().includes('gabriela')) {
          parsed.streakDays = 0;
          parsed.points1 = 0;
          parsed.points2 = 0;
          parsed.startedAdventure = true;
        }
        if (dirty) {
          localStorage.setItem('nido_profile', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  const [tasks, setTasks] = useState<CoupleTask[]>(() => {
    const saved = localStorage.getItem('nido_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [appointments, setAppointments] = useState<DateAppointment[]>(() => {
    const saved = localStorage.getItem('nido_appointments');
    return saved ? JSON.parse(saved) : defaultAppointments;
  });

  const [savedIdeas, setSavedIdeas] = useState<SavedDateIdea[]>(() => {
    const saved = localStorage.getItem('nido_saved_ideas');
    return saved ? JSON.parse(saved) : defaultSavedIdeas;
  });

  const [weeklyMenu, setWeeklyMenu] = useState<DayMenu[]>(() => {
    const saved = localStorage.getItem('nido_weekly_menu');
    return saved ? JSON.parse(saved) : defaultMenu;
  });

  const [officeMenu, setOfficeMenu] = useState<any[]>(() => {
    const saved = localStorage.getItem('nido_office_menu');
    return saved ? JSON.parse(saved) : [];
  });
  const [loadingOfficeMenu, setLoadingOfficeMenu] = useState(false);

  // Official Fortnite Menus Board State
  const [officialMenus, setOfficialMenus] = useState<OfficialMenu[]>(() => {
    const saved = localStorage.getItem('nido_official_menus');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Default dates for the official quincena selector
  const [menuStartDate, setMenuStartDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [menuEndDate, setMenuEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 14 days default
    return d.toISOString().split('T')[0];
  });

  const [officialMenuTitle, setOfficialMenuTitle] = useState<string>('');

  // Persistent Theme Mode state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nido_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Persistent Custom Color theme preset state
  const [colorTheme, setColorTheme] = useState<string>(() => {
    return localStorage.getItem('nido_color_theme') || 'amber';
  });

  // Save changes automatically to local storage
  useEffect(() => {
    localStorage.setItem('nido_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('nido_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nido_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('nido_saved_ideas', JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  useEffect(() => {
    localStorage.setItem('nido_weekly_menu', JSON.stringify(weeklyMenu));
  }, [weeklyMenu]);

  useEffect(() => {
    localStorage.setItem('nido_office_menu', JSON.stringify(officeMenu));
  }, [officeMenu]);

  useEffect(() => {
    localStorage.setItem('nido_official_menus', JSON.stringify(officialMenus));
  }, [officialMenus]);

  // LocalStorage persist for theme & colorTheme
  useEffect(() => {
    localStorage.setItem('nido_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nido_color_theme', colorTheme);
  }, [colorTheme]);

  const colorPresets: Record<string, Record<string, string>> = {
    amber: {
      name: 'Otoño Cálido',
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
      '300': '#fcd34d',
      '400': '#fbbf24',
      '500': '#d97706',
      '700': '#b45309',
      '800': '#92400e',
      '950': '#451a03',
    },
    rose: {
      name: 'Lavanda Dulce',
      '50': '#fdf2f8',
      '100': '#fbcfe8',
      '200': '#f9a8d4',
      '300': '#f472b6',
      '400': '#ec4899',
      '500': '#db2777',
      '700': '#be185d',
      '800': '#9c1546',
      '950': '#500724',
    },
    emerald: {
      name: 'Bosque de Pino',
      '50': '#f0fdf4',
      '100': '#dcfce7',
      '200': '#bbf7d0',
      '300': '#86efac',
      '400': '#4ade80',
      '500': '#16a34a',
      '700': '#15803d',
      '800': '#115e2e',
      '950': '#052e16',
    },
    wine: {
      name: 'Vino Clásico',
      '50': '#fff1f2',
      '100': '#ffe4e6',
      '200': '#fecdd3',
      '300': '#fda4af',
      '400': '#fb7185',
      '500': '#e11d48',
      '700': '#be123c',
      '800': '#881031',
      '950': '#4c0519',
    },
    indigo: {
      name: 'Noche Cósmica',
      '50': '#eef2ff',
      '100': '#e0e7ff',
      '200': '#c7d2fe',
      '300': '#a5b4fc',
      '400': '#818cf8',
      '500': '#4f46e5',
      '700': '#4338ca',
      '800': '#2d2a73',
      '950': '#1e1b4b',
    }
  };

  const currentPreset = colorPresets[colorTheme] || colorPresets.amber;
  const dynamicStyles = `
    :root {
      --color-amber-50: ${currentPreset['50']};
      --color-amber-100: ${currentPreset['100']};
      --color-amber-200: ${currentPreset['200']};
      --color-amber-300: ${currentPreset['300']};
      --color-amber-400: ${currentPreset['400']};
      --color-amber-500: ${currentPreset['500']};
      --color-amber-700: ${currentPreset['700']};
      --color-amber-800: ${currentPreset['800']};
      --color-amber-900: ${currentPreset['800']};
      --color-amber-950: ${currentPreset['950']};
    }
  `;

  // App States for interactive creation
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedChoreDay, setSelectedChoreDay] = useState<string>(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[new Date().getDay()];
  });
  const [newTask, setNewTask] = useState<Partial<CoupleTask>>({
    name: '',
    frequency: 'Diaria',
    priority: 'Alta',
    suggestedTime: '12:00',
    dayOfWeek: 'Lunes',
    responsable: 'Ambos',
    duration: '20 min',
    autoRepeat: true,
  });

  // Schedule Appointments Modal State
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<DateAppointment>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    mood: 'Romántica',
    location: 'San Salvador',
    notes: '',
  });

  // Module 1 (Citas) Mood Generator state
  const [selectedMood, setSelectedMood] = useState<string>('Romántica');
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [aiCitasResult, setAiCitasResult] = useState<any[]>([]);

  // Outside Places locator state
  const [selectedCity, setSelectedCity] = useState<string>('Tonacatepeque, San Salvador');
  const [customCity, setCustomCity] = useState<string>('');
  const [selectedPlacesCategory, setSelectedPlacesCategory] = useState<string>('Restaurantes');
  const [placesBudget, setPlacesBudget] = useState<string>('Moderado');
  const [placesAmbiance, setPlacesAmbiance] = useState<string>('Interior');
  const [placesSchedule, setPlacesSchedule] = useState<string>('Noche');
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [aiPlacesResult, setAiPlacesResult] = useState<any[]>([]);
  const [placesGrounding, setPlacesGrounding] = useState<any[]>([]);

  // Recetario pagination/filtering state
  const [selectedRecetarioCategory, setSelectedRecetarioCategory] = useState<string>('Todos');
  const [recipeSearch, setRecipeSearch] = useState('');
  const [viewedRecipe, setViewedRecipe] = useState<Recipe | null>(null);

  // IA Menús intelligent generator state
  const [disponiblesText, setDisponiblesText] = useState('plátanos, frijoles, huevos, carne de res, tortillas, cebolla, jalapeño');
  const [loadingWeeklyMenu, setLoadingWeeklyMenu] = useState(false);
  const [supermarketList, setSupermarketList] = useState<string[]>(['Quesillo salvadoreño', 'Crema de hacienda', 'Cebollas moradas', 'Cilantro fresco']);

  // Comida Instantánea / Express state
  const [instantIngredients, setInstantIngredients] = useState('frijoles rojos, plátanos maduros, huevos, mantequilla, aguacate');
  const [instantMealType, setInstantMealType] = useState('Al gusto');
  const [instantTimeLimit, setInstantTimeLimit] = useState('20 min');
  const [instantRecipes, setInstantRecipes] = useState<any[]>(() => {
    const saved = localStorage.getItem('nido_instant_recipes');
    return saved ? JSON.parse(saved) : [];
  });
  const [instantLoading, setInstantLoading] = useState(false);
  const [instantError, setInstantError] = useState<string | null>(null);

  const generateInstantRecipes = async () => {
    if (!instantIngredients.trim()) {
      setInstantError('Ingresa al menos un ingrediente para comenzar.');
      return;
    }
    setInstantLoading(true);
    setInstantError(null);
    try {
      const response = await fetch('/api/gemini/instantanea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: instantIngredients,
          mealType: instantMealType,
          timeLimit: instantTimeLimit,
        }),
      });
      if (!response.ok) {
        throw new Error('Nidi está formulando ideas... reintenta en breve.');
      }
      const data = await response.json();
      if (data.recipes && Array.isArray(data.recipes)) {
        setInstantRecipes(data.recipes);
        localStorage.setItem('nido_instant_recipes', JSON.stringify(data.recipes));
        triggerActivityStreak();
      } else {
        throw new Error('No se recibió la lista de recetas esperada.');
      }
    } catch (err: any) {
      console.error(err);
      setInstantError(err.message || 'Error al conectar con la cocina inteligente de Nidi.');
    } finally {
      setInstantLoading(false);
    }
  };

  // Random quotes & alerts state
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [reminders, setReminders] = useState<string[]>(() => [
    `Recuerden: ${profile?.partner2 || 'Eve'} tiene asignada la tarea "Limpiar la cocina" el día de hoy.`,
    '¡Mañana es su próxima cita planeada! Prepárense con ropa casual.',
    'Su racha está a salvo. Completaron el 82% de las tareas semanales.'
  ]);

  useEffect(() => {
    // Pick different quote on cycle
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format current date in Spanish
  const getFormattedToday = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formatted = today.toLocaleDateString('es-ES', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Helper to calculate custom anniversary type based on years of relationship
  const getAnniversaryType = (anniversaryDateStr: string) => {
    try {
      const today = new Date();
      const [year, month, day] = anniversaryDateStr.split('-').map(Number);
      let anniversaryYear = today.getFullYear();
      let annDateThisYear = new Date(anniversaryYear, month - 1, day);
      if (annDateThisYear.getTime() < today.getTime()) {
        anniversaryYear += 1;
      }
      const years = anniversaryYear - year;
      return `${years}º Aniversario de Novios 💖`;
    } catch {
      return 'Aniversario de Novios';
    }
  };

  // Helper to get selected city's estimated live temperature and condition
  const getDynamicWeather = () => {
    const city = selectedCity === 'Otro' ? (customCity || 'Tonacatepeque, San Salvador') : selectedCity;
    const now = new Date();
    const hour = now.getHours();
    
    // Base temperature based on microclimates in El Salvador
    let baseTemp = 28; // Default for San Salvador
    let condition = 'Soleado';
    
    const cityLower = city.toLowerCase();
    
    if (cityLower.includes('pital') || cityLower.includes('chalatenango') || cityLower.includes('ignacio')) {
      baseTemp = 16;
      condition = 'Fresco';
    } else if (cityLower.includes('tonacatepeque')) {
      baseTemp = 26;
      condition = 'Agradable';
    } else if (cityLower.includes('boquerón') || cityLower.includes('boqueron') || cityLower.includes('paneca') || cityLower.includes('ataco') || cityLower.includes('ahuachapán') || cityLower.includes('ahuachapan') || cityLower.includes('renderos') || cityLower.includes('suchitoto') || cityLower.includes('perquín') || cityLower.includes('morazán') || cityLower.includes('morazan')) {
      baseTemp = 20;
      condition = 'Templado';
    } else if (cityLower.includes('playa') || cityLower.includes('tunco') || cityLower.includes('zonte') || cityLower.includes('sunzal') || cityLower.includes('libertad') || cityLower.includes('unión') || cityLower.includes('union') || cityLower.includes('costa del sol') || cityLower.includes('jiquilisco') || cityLower.includes('paz') || cityLower.includes('cuco') || cityLower.includes('san miguel')) {
      baseTemp = 32;
      condition = 'Cálido';
    } else if (cityLower.includes('tecla') || cityLower.includes('antiguo') || cityLower.includes('santa ana')) {
      baseTemp = 24;
      condition = 'Agradable';
    }
    
    // Adjust based on hour of the day (cool in midnight/morning, warm in afternoon)
    let hourOffset = 0;
    if (hour >= 23 || hour < 5) {
      hourOffset = -6; // Colder at night
    } else if (hour >= 5 && hour < 8) {
      hourOffset = -4; // Cool morning
    } else if (hour >= 8 && hour < 11) {
      hourOffset = -1;
    } else if (hour >= 11 && hour < 15) {
      hourOffset = 3; // Peak heat of midday
    } else if (hour >= 15 && hour < 18) {
      hourOffset = 1;
    } else {
      hourOffset = -2; // Sunset/evening cooling
    }
    
    // Add minor minute-based decimal variance to look live and realistic
    const minuteVariance = (now.getMinutes() % 10) / 10;
    const finalTemp = (baseTemp + hourOffset + minuteVariance).toFixed(1);
    
    // Weather icon/emoji
    let icon = '☀️';
    if (hour >= 18 || hour < 5) {
      icon = '🌙';
    } else if (hourOffset > 1) {
      icon = '☀️';
    } else {
      icon = '⛅';
    }
    
    return {
      city,
      temp: `${finalTemp}°C`,
      condition,
      icon
    };
  };

  // Helper to calculate exact days for dynamically rendering visual calendar month
  const getCalendarDays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0: Sunday, 1: Monday...
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const monthLabelRaw = today.toLocaleDateString('es-SV', { month: 'long', year: 'numeric' });
    const monthLabel = monthLabelRaw.charAt(0).toUpperCase() + monthLabelRaw.slice(1);

    return {
      startDayOfWeek,
      daysInMonth,
      monthLabel
    };
  };

  // Helper to calculate exact dates of the current week (Monday to Sunday)
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0: Sunday, 1: Monday, etc.
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const dates = [];
    const daysNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + distanceToMonday + i);
      
      const dayLabelRaw = d.toLocaleDateString('es-SV', { day: 'numeric', month: 'short' });
      dates.push({
        num: d.getDate(),
        name: daysNames[i],
        label: dayLabelRaw,
        fullDateStr: d.toISOString().split('T')[0],
        isToday: d.toDateString() === today.toDateString()
      });
    }
    return dates;
  };

  // Anniversary Countdown calculator
  const getDaysUntilAnniversary = () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Correctly clear hours for midnight-based subtraction
      const annStr = profile.anniversaryDate;
      const [year, month, day] = annStr.split('-').map(Number);
      let annDateThisYear = new Date(today.getFullYear(), month - 1, day);
      annDateThisYear.setHours(0, 0, 0, 0);
      
      if (annDateThisYear.getTime() < today.getTime()) {
        annDateThisYear.setFullYear(today.getFullYear() + 1);
      }
      
      const diffTime = annDateThisYear.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 14; // Fallback
    }
  };

  // Helper to format local date as YYYY-MM-DD
  const getLocalTodayString = (): string => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to calculate difference in calendar days
  const getDaysDifference = (dateStr1: string, dateStr2: string): number => {
    const d1 = new Date(dateStr1 + 'T00:00:00');
    const d2 = new Date(dateStr2 + 'T00:00:00');
    const timeDiff = d2.getTime() - d1.getTime();
    return Math.round(timeDiff / (1000 * 60 * 60 * 24));
  };

  const getNextStreakData = (prevProf: CoupleProfile, today: string) => {
    const lastDate = prevProf.lastActivityDate;
    let nextStreak = prevProf.streakDays;
    let nextLastDate = today;

    if (!lastDate) {
      nextStreak = 1;
      nextLastDate = today;
    } else {
      const diff = getDaysDifference(lastDate, today);
      if (diff === 1) {
        nextStreak = prevProf.streakDays + 1;
        nextLastDate = today;
      } else if (diff > 1) {
        nextStreak = 1;
        nextLastDate = today;
      } else {
        // Same day or past date, no increase or update to lastActivityDate
        nextLastDate = lastDate;
      }
    }
    return { streakDays: nextStreak, lastActivityDate: nextLastDate };
  };

  const triggerActivityStreak = () => {
    const today = getLocalTodayString();
    setProfile(prev => {
      const { streakDays, lastActivityDate } = getNextStreakData(prev, today);
      return {
        ...prev,
        streakDays,
        lastActivityDate
      };
    });
  };

  // Gamification & streak helper formulas
  const totalCompletedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((totalCompletedTasks / tasks.length) * 100) : 0;

  const claimPointsTask = (taskId: string, spouse: 'partner1' | 'partner2' | 'both') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (!t.completed) {
          // Add points based on assignment
          const pointsEarned = t.scorePoints;
          const today = getLocalTodayString();
          setProfile(prevProf => {
            const { streakDays, lastActivityDate } = getNextStreakData(prevProf, today);
            return {
              ...prevProf,
              points1: spouse === 'partner1' ? prevProf.points1 + pointsEarned : prevProf.points1,
              points2: spouse === 'partner2' ? prevProf.points2 + pointsEarned : prevProf.points2,
              streakDays,
              lastActivityDate
            };
          });
          return { ...t, completed: true, completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        } else {
          // Revert points
          const pointsEarned = t.scorePoints;
          setProfile(prevProf => ({
            ...prevProf,
            points1: spouse === 'partner1' ? Math.max(0, prevProf.points1 - pointsEarned) : prevProf.points1,
            points2: spouse === 'partner2' ? Math.max(0, prevProf.points2 - pointsEarned) : prevProf.points2,
          }));
          return { ...t, completed: false };
        }
      }
      return t;
    }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name) return;
    const task: CoupleTask = {
      id: 'task-' + Date.now(),
      name: newTask.name,
      frequency: newTask.frequency as any,
      priority: newTask.priority as any,
      suggestedTime: newTask.suggestedTime || '12:00',
      dayOfWeek: newTask.dayOfWeek || 'Lunes',
      responsable: newTask.responsable as any,
      duration: newTask.duration || '20 min',
      autoRepeat: !!newTask.autoRepeat,
      completed: false,
      scorePoints: newTask.priority === 'Alta' ? 30 : newTask.priority === 'Media' ? 20 : 10,
    };
    setTasks(prev => [task, ...prev]);
    setNewTask({
      name: '',
      frequency: 'Diaria',
      priority: 'Alta',
      suggestedTime: '12:00',
      dayOfWeek: 'Lunes',
      responsable: 'Ambos',
      duration: '20 min',
      autoRepeat: true,
    });
    setShowAddTaskModal(false);
    // Add reminder
    setReminders(prev => [`Nueva tarea creada: "${task.name}" para ${task.responsable}.`, ...prev]);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.title) return;
    const apt: DateAppointment = {
      id: 'apt-' + Date.now(),
      title: newAppointment.title,
      date: newAppointment.date || '2026-05-24',
      time: newAppointment.time || '20:00',
      mood: newAppointment.mood || 'Romántica',
      location: newAppointment.location || 'San Salvador',
      notes: newAppointment.notes || '',
      completed: false,
    };
    setAppointments(prev => [apt, ...prev]);
    setNewAppointment({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      mood: 'Romántica',
      location: 'San Salvador',
      notes: '',
    });
    setShowAddAppointmentModal(false);
  };

  // AI Citas Generator trigger
  const generateAiCitas = async (mood: string) => {
    setLoadingCitas(true);
    try {
      const response = await fetch('/api/gemini/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      });
      if (!response.ok) throw new Error('API server unreachable');
      const data = await response.json();
      if (data.citas && Array.isArray(data.citas)) {
        setAiCitasResult(data.citas);
        triggerActivityStreak();
      }
    } catch (err) {
      console.error(err);
      // Beautiful Cozy fallback content matching user request immediately
      const cozyMocks: Record<string, any[]> = {
        'Romántica': [
          {
            name: "Cena Toscana en casa bajo vuestras estrellas",
            description: "Preparen juntos una pasta casera deliciosa, perfumada con albahaca y ajo tierno campesino, mientras transforman la mesa con luces de hadas amarillas.",
            atmosphere: "Velas de cera natural aromáticas, luces bajas y sábanas de lino.",
            playlist: "Clásicos acústicos brasileños de Caetano Veloso y jazz instrumental italiano.",
            foodIdeas: "Espaguetis pomodoro artesanales con queso cuajada gratinado y copas de vino tinto.",
            games: "Diálogos en susurros: saquen turnos para terminar frases de agradecimiento de su relación.",
            estimatedTime: "2-3 horas",
            budget: "Económico ($12 USD)",
            preparationLevel: "Bajo"
          }
        ],
        'Love': [
          {
            name: "Spa de cariño en casa y masajes aromáticos",
            description: "Preparen un oasis acogedor en su habitación y regálense tiernos masajes relajantes para reconectar profundamente, eliminando el cansancio de la semana.",
            atmosphere: "Velas aromáticas con luz tenue y ámbar, toallas tibias especiales y esencias relajantes para el ambiente.",
            playlist: "Instrumentales acústicos románticos, R&B cálido, y chill-out relajante.",
            foodIdeas: "Fresas cubiertas de chocolate casero y copas de sidra o jugo espumoso frío.",
            games: "Susurros del alma: tómense de las manos y dígase tres cosas sencillas que aman de los detalles diarios del otro.",
            estimatedTime: "1.5 horas",
            budget: "Muy económico (Aceites aromáticos y velas)",
            preparationLevel: "Medio"
          }
        ]
      };
      // Fallback
      setAiCitasResult(cozyMocks[mood] || [
        {
          name: `Noche de preguntas profundas y chocolate caliente (${mood})`,
          description: "Siéntense cómodos en la alfombra rodeados de cojines mullidos. Tiren cartas para descubrir misterios no revelados el uno del otro.",
          atmosphere: "Luz de chimenea virtual en el televisor o pantalla de computador.",
          playlist: "Acústicos de bossa nova y folk suave.",
          foodIdeas: "Plátanos asados calientes acompañados de frijoles refritos y tazas de atol de elote casero.",
          games: "Escribir tres promesas secretas en papeles de colores y leerlas al amanecer.",
          estimatedTime: "2 horas",
          budget: "Gratis / Sumamente económico",
          preparationLevel: "Bajo"
        }
      ]);
    } finally {
      setLoadingCitas(false);
    }
  };

  // AI Places Generator with Grounding maps search
  const generateAiPlaces = async () => {
    setLoadingPlaces(true);
    const finalCityQuery = selectedCity === 'Otro' ? (customCity || 'San Salvador') : selectedCity;
    try {
      const response = await fetch('/api/gemini/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: finalCityQuery,
          category: selectedPlacesCategory,
          budget: placesBudget,
          dayNight: placesSchedule,
          inOut: placesAmbiance
        }),
      });
      if (!response.ok) throw new Error();
      const output = await response.json();
      if (output.data && output.data.places) {
        setAiPlacesResult(output.data.places);
        setPlacesGrounding(output.groundingChunks || []);
        triggerActivityStreak();
      }
    } catch (err) {
      console.error(err);
      // Salvadoran real places local warm fallback
      setAiPlacesResult([
        {
          name: "Cafe de Paisaje 'El Jardín de San Antón'",
          review: "Ubicado en el fresco microclima de Antiguo Cuscatlán, ideal para una pequeña plática viendo las luces del atardecer rodeados de flores coloridas.",
          recommendation: "Café de prensa francesa de especialidad de la cordillera de El Bálsamo con deliciosas quesadillas calientes de frijol maduro.",
          details: {
            budget: "Económico a Moderado",
            schedule: "Tarde/Noche",
            ambiance: "Exterior Florido",
            city: selectedCity
          }
        },
        {
          name: "La Terraza del Volcán en El Boquerón",
          review: "Una caminata preciosa para contemplar el cráter juntos y luego refugiarse en la terraza de madera para tomar chocolate caliente de molino.",
          recommendation: "Chocolate espumoso artesanal con empanadas calientes de plátano con poleada salvadoreña.",
          details: {
            budget: "Premium",
            schedule: "Día y Tarde",
            ambiance: "Exterior",
            city: "Alrededores"
          }
        }
      ]);
    } finally {
      setLoadingPlaces(false);
    }
  };

  // AI Menu planner quincenal trigger
  const generateAiWeeklyMenu = async () => {
    setLoadingWeeklyMenu(true);
    try {
      const response = await fetch('/api/gemini/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: disponiblesText }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (data.menu && Array.isArray(data.menu)) {
        setWeeklyMenu(data.menu);
        if (data.supermarketList) {
          setSupermarketList(data.supermarketList);
        }
        triggerActivityStreak();
      }
    } catch (err) {
      console.error(err);
      // Salvadoran local reutilisation menu fallback
      setWeeklyMenu([
        {
          day: "Día 1",
          desayuno: {
            title: "Desayuno Típico de Mercado",
            description: "Frijoles rojos fritos con aguacate fresco local y tortillas palmeadas tostadas.",
            reutilizacion: "Sancocho de los frijoles para espesar caldos de almuerzo."
          },
          almuerzo: {
            title: "Pollo Deshebrado al Limón con Arroz",
            description: "Guiso de pollo húmedo con especias. Fantástico para llevar tapado a la oficina sin resecarse.",
            reutilizacion: "Se deshebra extra para la cena rápida."
          },
          cena: {
            title: "Casamiento Tradicional Cuscatleco",
            description: "Unión perfecta del arroz blanco del almuerzo de ayer y los frijolitos secos cocidos.",
            reutilizacion: "Reutilización total del arroz frío."
          }
        },
        {
          day: "Día 2",
          desayuno: {
            title: "Omelette de cebollas con queso salvadoreño",
            description: "Huevos frescos picados con cebollas caramelizadas y un toque de queso rallado de hacienda.",
            reutilizacion: "Usa tallos verdes de cebollín sobrantes."
          },
          almuerzo: {
            title: "Bistec de Lomo Entomatado con Arroz Caliente",
            description: "Carne tierna cocida con mucha cebolla morada y chile verde para microondas.",
            reutilizacion: "Conserva el caldillo de carne para condimentar."
          },
          cena: {
            title: "Canoas de Plátano con Frijol Refrito",
            description: "Plátanos asados calientes partidos y rellenos con frijoles y crema fresca.",
            reutilizacion: "Aprovecha el plátano madurando en canastilla."
          }
        },
        {
          day: "Día 3",
          desayuno: {
            title: "Plátanos Fritos con Queso y Crema",
            description: "Plátano frito súper jugoso con porciones de cuajada y crema salvadoreña.",
            reutilizacion: "Usa el plátano restante cocinado rápido."
          },
          almuerzo: {
            title: "Guiso de Cerdo al Achiote salvadoreño",
            description: "Trocitos suaves de cerdo marinados en achiote y cocidos a fuego lento, ideales para taco de oficina.",
            reutilizacion: "Polvo de achiote del refrigerador."
          },
          cena: {
            title: "Pupusitas Rápidas Caseras de Quesillo",
            description: "Masa de maíz rellena con queso y asadas a la sartén en 10 minutos.",
            reutilizacion: "Usa quesillo sobrante de compras."
          }
        },
        {
          day: "Día 4",
          desayuno: {
            title: "Huevos estrellados con salsa de tomate hecha en casa",
            description: "Huevos recién bajados montados sobre tortillas fritas y abundante salsa.",
            reutilizacion: "Utiliza tomates maduros que necesitan salida rápida."
          },
          almuerzo: {
            title: "Pollo Encebollado con Puré de Aguacate",
            description: "Guiso tradicional de pollo adobado con mostaza criolla y cebollas en abundancia.",
            reutilizacion: "Reutiliza pollo de las sobras de la refrigeradora."
          },
          cena: {
            title: "Sopita casera de tortilla con queso",
            description: "Sopa caliente a base de caldo de pollo cocido, tiritas de tortilla de comal y cubos de queso.",
            reutilizacion: "Reutilización de tortillas duras acumuladas de la semana."
          }
        },
        {
          day: "Día 5",
          desayuno: {
            title: "Casamiento Mojado con rodajas de plátano",
            description: "Arroz y frijoles refritos bien jugosos con plátano de acompañante.",
            reutilizacion: "Aprovecha granos cocidos de días anteriores."
          },
          almuerzo: {
            title: "Bistec de Res al Chimichurri Casero",
            description: "Filete salteado servido en fiambrera con papas al romero.",
            reutilizacion: "Papas sobrantes de guisado previo."
          },
          cena: {
            title: "Cena campestre de tortillas con cuajada fresca",
            description: "Tortillas asadas calientes al comal enrolladas con queso duro y aguacate salpimentado.",
            reutilizacion: "Día final de limpieza de refrigerador previo a compras."
          }
        }
      ]);
      setSupermarketList(['Pechuga de Pollo', 'Frijoles de seda', 'Cinco Plátanos maduros', 'Crema salvadoreña de hacienda', 'Quesillo de Comal']);
    } finally {
      setLoadingWeeklyMenu(false);
    }
  };

  // AI Menu Office Lunchbox (Prep Meal) trigger for Manu
  const generateAiOfficeMenu = async () => {
    setLoadingOfficeMenu(true);
    try {
      const response = await fetch('/api/gemini/office-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: disponiblesText }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (data.officeMenu && Array.isArray(data.officeMenu)) {
        setOfficeMenu(data.officeMenu);
        triggerActivityStreak();
      }
    } catch (err) {
      console.error(err);
      // Perfect Office Lunch Prep-meal fallback
      setOfficeMenu([
        {
          day: "Lunes",
          mealTitle: "Pollo deshebrado entomatado con Arroz al vapor",
          description: "Pechuga cocida y desmechada en una salsa espesa de tomates frescos, cebolla y chile verde. El arroz blanco absorbe el jugo y mantiene el plato húmedo.",
          prepTip: "Empaca el arroz abajo como cama conductora y sitúa el pollo entomatado jugoso arriba.",
          reheatTime: "1:30 minutos a potencia media-alta"
        },
        {
          day: "Martes",
          mealTitle: "Carne deshilachada guisada con Jugo criollo",
          description: "Carne para deshebrar (falda) cocida y terminada en un guisado criollo húmedo con papitas picadas.",
          prepTip: "Humedece con dos cucharadas adicionales del propio caldo de cocción para evitar resecamiento.",
          reheatTime: "2:00 minutos a potencia media con tapa ventilada"
        },
        {
          day: "Miércoles",
          mealTitle: "Estofado de lomo de Cerdo al achiote y papas doradas",
          description: "Pedacitos de carne de cerdo tiernos salteados en achiote local, cocidos lentamente con caldo rico para microondas.",
          prepTip: "Empaca las papas separadas del cerdo para que no queden correosas al morder.",
          reheatTime: "1:45 minutos a potencia media-baja"
        },
        {
          day: "Jueves",
          mealTitle: "Casamiento de frijol de seda con Huevito duro picado",
          description: "Arroz y frijoles refritos del día antes, revueltos en sartén caliente con mantequilla local, acompañados de huevo duro.",
          prepTip: "Lleva aguacate entero y añádelo fresco justo después de recalentar en el comedor.",
          reheatTime: "1:15 minutos para preservar la humedad"
        },
        {
          day: "Viernes",
          mealTitle: "Picadillo de res clásico con zanahoria y tortillas de comal",
          description: "Carne molida magra de res salteada con zanahoria rallada, cebolla y ajo, para taquear fácil en la oficina.",
          prepTip: "Lleva las tortillas en una servilleta de papel húmedo aparte para calentarlas 15 segundos al final.",
          reheatTime: "1:30 minutos para la carne"
        }
      ]);
    } finally {
      setLoadingOfficeMenu(false);
    }
  };

  // Helper inside Citas module to SAVE an idea generated of any mood
  const saveDateIdea = (idea: any, status: 'guardada' | 'para_luego') => {
    const isSaved = savedIdeas.some(s => s.name === idea.name);
    if (isSaved) {
      alert("¡Esta idea mágica ya está en su repertorio de citas!");
      return;
    }
    const newSaved: SavedDateIdea = {
      id: 'saved-' + Date.now() + Math.random().toString(36).substring(2, 5),
      name: idea.name,
      description: idea.description,
      atmosphere: idea.atmosphere || 'Ambiente cozy',
      playlist: idea.playlist || 'Música romántica',
      foodIdeas: idea.foodIdeas || 'Comida sabrosa',
      games: idea.games || 'Dinámica del corazón',
      estimatedTime: idea.estimatedTime || '1.5 - 2 horas',
      budget: idea.budget || 'Económico',
      preparationLevel: idea.preparationLevel || 'Bajo',
      status: status
    };
    setSavedIdeas(prev => [newSaved, ...prev]);
    alert(`Cita "${newSaved.name}" agregada con éxito a ${status === 'guardada' ? 'Favoritas' : 'Hacer Luego'}! ✨`);
  };

  // Drag and Drop simulator for Weekly Menu Tablero
  const swapMealsInMenu = (dayIndex: number, mealType: 'desayuno' | 'almuerzo' | 'cena') => {
    const options = [
      { title: "Pupusas caseras de revoltura", description: "Masa de arroz rellena de chicharrón y quesillo derretido calientes.", reutilizacion: "Optimización de carnes" },
      { title: "Sopa espesa de frijoles colorados", description: "Con masitas de comal calientes y un toque sabroso de cilantro de monte.", reutilizacion: "Frijoles de olla" },
      { title: "Casamiento de rancho con queso duro", description: "Arroz y frijol frito con cebolla cristalizada.", reutilizacion: "Ahorro total" },
      { title: "Pechuguitas de Pollo en salsa de mostaza", description: "Pechuga cocida tierna en lumbres de ajo y mostaza rústica.", reutilizacion: "Oficina friendly" },
      { title: "Plátanos en gloria caramelizados", description: "Plátanos hervidos con canela criolla sirviendo de snack dulce.", reutilizacion: "Fruta madura" }
    ];
    // Random option to switch
    const chosen = options[Math.floor(Math.random() * options.length)];
    setWeeklyMenu(prev => prev.map((item, idx) => {
      if (idx === dayIndex) {
        return {
          ...item,
          [mealType]: chosen
        };
      }
      return item;
    }));
    triggerActivityStreak();
  };

  // Official Fortnightly Menu Board action handlers
  const [menuFeedbackMsg, setMenuFeedbackMsg] = useState<string | null>(null);

  const saveAsOfficialMenu = () => {
    if (!weeklyMenu || weeklyMenu.length === 0) {
      setMenuFeedbackMsg("No hay ningún menú de comida activo para guardar. Por favor, genera uno primero.");
      setTimeout(() => setMenuFeedbackMsg(null), 5000);
      return;
    }
    const defaultTitleInput = officialMenuTitle.trim() || `Plan del ${menuStartDate} al ${menuEndDate}`;
    const newOfficialPlan = {
      id: Math.random().toString(36).substring(2, 9),
      startDate: menuStartDate,
      endDate: menuEndDate,
      title: defaultTitleInput,
      menu: JSON.parse(JSON.stringify(weeklyMenu)),
      supermarketList: [...supermarketList],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOfficialMenus(prev => [newOfficialPlan, ...prev]);
    setOfficialMenuTitle('');
    triggerActivityStreak();
    setMenuFeedbackMsg(`¡Menú Guardado! "${defaultTitleInput}" se ha registrado oficialmente en su tablero de quincenas. ✨`);
    setTimeout(() => setMenuFeedbackMsg(null), 6000);
  };

  const deleteOfficialMenu = (id: string) => {
    setOfficialMenus(prev => prev.filter(m => m.id !== id));
    setMenuFeedbackMsg("Menú borrado del tablero oficial.");
    setTimeout(() => setMenuFeedbackMsg(null), 4000);
  };

  const loadOfficialMenu = (plan: any) => {
    setWeeklyMenu(plan.menu);
    if (plan.supermarketList) {
      setSupermarketList(plan.supermarketList);
    }
    if (plan.startDate) setMenuStartDate(plan.startDate);
    if (plan.endDate) setMenuEndDate(plan.endDate);
    
    setMenuFeedbackMsg(`Se ha cargado e instalado el menú "${plan.title}" en el plan de alimentación activo.`);
    window.scrollTo({ top: 400, behavior: 'smooth' });
    setTimeout(() => setMenuFeedbackMsg(null), 6000);
  };

  // PDF Export simulator
  const handleExportMenuPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen font-sans bg-warm-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      
      {/* HEADER BAR con Brand Nido & Clima Widget */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-stone-950/70 backdrop-blur-md border-b border-warm-200/50 dark:border-warm-800/40 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Cozy NIDO */}
          <div className="w-9 h-9 rounded-xl bg-amber-800 text-stone-50 flex items-center justify-center font-serif text-lg font-bold shadow-sm select-none">
            N
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg md:text-xl text-amber-900 dark:text-amber-500 tracking-tight flex items-center gap-1.5 leading-none">
              Nido <Heart className="h-3 w-3 fill-amber-700 text-amber-700 animate-pulse" />
            </h1>
            <p className="text-[10px] text-warm-500 dark:text-warm-400 font-medium">Pareja, Hogar & IA Alimentación</p>
          </div>
        </div>

        {/* Motivate Quote bar hidden on tiny screens */}
        <div className="hidden lg:flex items-center gap-2 max-w-lg bg-amber-50 dark:bg-stone-900/60 p-2 rounded-xl border border-amber-200/40 dark:border-stone-800">
          <Smile className="h-4 w-4 text-amber-700 animate-bounce shrink-0" />
          <p className="text-[11px] text-amber-900/90 dark:text-warm-300 italic line-clamp-1">
            "{motivationalQuotes[quoteIndex]}"
          </p>
        </div>

        {/* Right tools (Theme toggler, Weather shortcut, and Profile indicators) */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-100/60 dark:bg-stone-900 px-2.5 py-1 rounded-full text-[11px] font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1 border border-warm-200 dark:border-stone-800" title={`Clima en ${getDynamicWeather().city}: ${getDynamicWeather().condition}`}>
            <span className="text-xs">{getDynamicWeather().icon}</span>
            <span className="truncate max-w-[125px] sm:max-w-none">{getDynamicWeather().city} • {getDynamicWeather().temp}</span>
          </div>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg bg-warm-100 dark:bg-stone-900 hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-500/20 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title="Cambiar Tema"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* DETAILED NOTIFICATION ALERT ROW */}
      {reminders.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-900/5 dark:from-amber-900/20 dark:to-stone-950 px-4 py-2 text-[11px] text-stone-700 dark:text-stone-300 flex items-center justify-between gap-4 border-b border-warm-200/50 dark:border-stone-900">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="pill bg-amber-100 text-amber-800 font-bold dark:bg-amber-950 dark:text-amber-300 shrink-0">Reminders</span>
            <span className="truncate italic">"{reminders[0]}"</span>
          </div>
          <button
            onClick={() => setReminders(prev => prev.slice(1))}
            className="text-[10px] text-amber-800 dark:text-amber-500 underline font-semibold hover:no-underline cursor-pointer"
          >
            Siguiente ({reminders.length - 1} más)
          </button>
        </div>
      )}

      {/* VIEWPORT CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SIDE NAV - FROSTED GLASS ASIDE BAR */}
        <aside className="w-full md:w-24 shrink-0 bg-white/40 dark:bg-stone-900/30 border-b md:border-b-0 md:border-r border-warm-200 dark:border-warm-800/60 p-4 flex flex-row md:flex-col items-center justify-between gap-4 select-none">
          <div className="flex md:flex-col gap-3 md:gap-6 w-full items-center justify-center md:justify-start">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl w-14 md:w-16 transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-900 text-white shadow-md shadow-amber-900/20 scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-amber-900 dark:hover:text-amber-500'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-[10px] font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('citas')}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl w-14 md:w-16 transition-all duration-200 cursor-pointer ${
                activeTab === 'citas'
                  ? 'bg-amber-900 text-white shadow-md shadow-amber-900/20 scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-amber-900 dark:hover:text-amber-500'
              }`}
            >
              <Heart className="h-5 w-5" />
              <span className="text-[10px] font-medium">Citas IA</span>
            </button>

            <button
              onClick={() => setActiveTab('hogar')}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl w-14 md:w-16 transition-all duration-200 cursor-pointer ${
                activeTab === 'hogar'
                  ? 'bg-amber-900 text-white shadow-md shadow-amber-900/20 scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-amber-900 dark:hover:text-amber-500'
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="text-[10px] font-medium">Hogar</span>
            </button>

            <button
              onClick={() => setActiveTab('alimentacion')}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl w-14 md:w-16 transition-all duration-200 cursor-pointer ${
                activeTab === 'alimentacion'
                  ? 'bg-amber-900 text-white shadow-md shadow-amber-900/20 scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-amber-900 dark:hover:text-amber-500'
              }`}
            >
              <Utensils className="h-5 w-5" />
              <span className="text-[10px] font-medium">Comida</span>
            </button>

            <button
              onClick={() => setActiveTab('instantanea')}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl w-14 md:w-16 transition-all duration-200 cursor-pointer ${
                activeTab === 'instantanea'
                  ? 'bg-amber-900 text-white shadow-md shadow-amber-900/20 scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-amber-900 dark:hover:text-amber-500'
              }`}
            >
              <Flame className="h-5 w-5" />
              <span className="text-[10px] font-medium">Exprés IA</span>
            </button>

            <button
              onClick={() => setActiveTab('perfil')}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl w-14 md:w-16 transition-all duration-200 cursor-pointer ${
                activeTab === 'perfil'
                  ? 'bg-amber-900 text-white shadow-md shadow-amber-900/20 scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-amber-900 dark:hover:text-amber-500'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] font-medium">Perfil</span>
            </button>

          </div>

          {/* Quick Couple Micro avatars in Side for gamification feel */}
          <div className="hidden md:flex flex-col gap-2 items-center">
            <div className="flex -space-x-2">
              <div
                className="w-8 h-8 rounded-full bg-amber-700/20 border border-amber-900 text-stone-900 dark:text-stone-50 font-bold flex items-center justify-center text-xs"
                title={`Puntos de ${profile.partner1}: ${profile.points1}`}
              >
                {profile.partner1[0]}
              </div>
              <div
                className="w-8 h-8 rounded-full bg-stone-700/20 border border-stone-900 text-stone-900 dark:text-stone-50 font-bold flex items-center justify-center text-xs"
                title={`Puntos de ${profile.partner2}: ${profile.points2}`}
              >
                {profile.partner2[0]}
              </div>
            </div>
            <span className="text-[9px] font-mono font-medium text-stone-500">{profile.points1 + profile.points2} pts</span>
          </div>
        </aside>

        {/* CENTRAL AREA - ADAPTIVE SUB VIEWS */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          
          {menuFeedbackMsg && (
            <div id="toast-menu-feedback" className="fixed bottom-5 right-5 z-50 p-4 bg-amber-950 text-stone-55 rounded-2xl border border-amber-800 shadow-xl max-w-sm flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-sm">✨</span>
                <p className="text-xs font-semibold">{menuFeedbackMsg}</p>
              </div>
              <button type="button" onClick={() => setMenuFeedbackMsg(null)} className="text-stone-300 hover:text-white font-mono text-xs cursor-pointer">×</button>
            </div>
          )}
          
          {/* ==========================================
              VIEW 1: PRIMARY CENTRAL DASHBOARD 
              ========================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Saludo y Aniversario Countdown header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-amber-800 dark:text-amber-500 uppercase tracking-widest font-bold">{getFormattedToday()}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-50 dark:bg-stone-900 border border-warm-250 dark:border-stone-850 rounded-full text-stone-600 dark:text-stone-300 font-mono">
                      📍 {getDynamicWeather().city} • {getDynamicWeather().temp} ({getDynamicWeather().condition} {getDynamicWeather().icon})
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-stone-800 dark:text-white mt-1">
                    ¡Hola, {profile.partner1} & {profile.partner2}! ✨
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">Bienvenidos a su nido de amor. Tienen tareas pendientes y planes hermosos por vivir.</p>
                </div>

                {/* Countdown banner card widget */}
                <div className="bg-gradient-to-br from-amber-800 to-amber-950 text-stone-50 p-4 rounded-2xl flex items-center gap-4 border border-amber-700/20 min-w-[280px]">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl select-none">
                    ❤️
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-warm-300 font-bold block">Próximo Aniversario</span>
                    <span className="text-2xl font-serif font-bold block">{getDaysUntilAnniversary()} {getDaysUntilAnniversary() === 1 ? 'Día' : 'Días'}</span>
                    <span className="text-[9px] text-warm-200">{getAnniversaryType(profile.anniversaryDate)} el {profile.anniversaryDate}</span>
                  </div>
                </div>
              </div>

              {/* BANNER DE INICIO DE AVENTURA REAL */}
              {(!profile.startedAdventure || profile.streakDays === 14 || profile.streakDays === 16 || profile.points1 === 120) && (
                <div id="banner-onboarding-start" className="bg-gradient-to-r from-amber-50 to-amber-100/90 dark:from-stone-900/60 dark:to-stone-900/30 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3.5">
                    <div className="text-3xl shrink-0 p-2.5 bg-white/85 dark:bg-stone-850 rounded-xl shadow-xs">🚀</div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-amber-950 dark:text-amber-400">¡Bienvenidos al inicio de su aventura real!</h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-xl">
                        Actualmente tienen {profile.streakDays} días de racha de ejemplo acumulados. ¿Les gustaría limpiar los contadores de ejemplo para **Iniciar su Tablero Oficial desde Cero** hoy y registrar su amor en tiempo real?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          points1: 0,
                          points2: 0,
                          streakDays: 0,
                          startedAdventure: true
                        }));
                        setTasks(prev => prev.map(t => ({ ...t, completed: false })));
                        setMenuFeedbackMsg("¡Su cuenta ha sido inicializada! Racha: 0 días, Puntos: 0. ¡Muchos éxitos en su aventura!");
                        setTimeout(() => setMenuFeedbackMsg(null), 5000);
                      }}
                      className="px-4 py-2 bg-amber-900 hover:bg-amber-850 text-stone-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      ✨ Empezar de Cero (0 días, 0 pts)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          startedAdventure: true
                        }));
                      }}
                      className="px-3 py-2 bg-white/60 dark:bg-stone-800 border border-warm-250 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                    >
                      Omitir
                    </button>
                  </div>
                </div>
              )}

              {/* FIRST ROWS: BENTO GRID DASHBOARD WIDGETS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* WIDGET A: CHISMOSITO DE PROGRESO DE TAREAS HOGAR (6 cols) */}
                <div className="lg:col-span-8 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md rounded-2xl p-6 border border-warm-200 dark:border-stone-800/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-warm-100 dark:border-stone-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-amber-800 dark:text-amber-500" />
                        <h3 className="font-serif font-bold text-lg">Tablero del Hogar</h3>
                      </div>
                      <span className="pill bg-amber-100 text-amber-900 text-[10px] font-bold">
                        {progressPercent}% Completado
                      </span>
                    </div>

                    {/* Task Progress Line indicator */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-xs font-mono text-stone-500">
                        <span>Lunes a Domingo</span>
                        <span>{totalCompletedTasks} de {tasks.length} completadas</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-800 to-amber-500 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Micro display of top 3 pending daily tasks */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Tareas Prioritarias de Hoy</p>
                      {tasks.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => claimPointsTask(item.id, item.responsable === 'Él' ? 'partner1' : item.responsable === 'Ella' ? 'partner2' : 'both')}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-warm-100 dark:border-stone-850/50 bg-stone-50/50 dark:bg-stone-900/40 hover:bg-amber-50/40 dark:hover:bg-amber-500/10 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              item.completed
                                ? 'bg-amber-950 text-white border-amber-950'
                                : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900'
                            }`}>
                              {item.completed && <CheckCircle className="h-3.5 w-3.5 fill-white text-amber-950" />}
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${item.completed ? 'line-through text-stone-400' : ''}`}>
                                {item.name}
                              </p>
                              <p className="text-[9px] text-stone-400 font-mono">
                                Resp: {item.responsable} • +{item.scorePoints} Pts • {item.suggestedTime} hrs
                              </p>
                            </div>
                          </div>
                          <span className={`text-[9px] inline-block px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            item.priority === 'Alta' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' : 'bg-stone-100 text-stone-700'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-warm-150 dark:border-stone-800 flex justify-between items-center">
                    <button
                      onClick={() => setActiveTab('hogar')}
                      className="text-xs text-amber-800 dark:text-amber-500 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      Planificar todas las tareas del hogar <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* WIDGET B: GAMIFICACIÓN Y LOGROS (4 cols) */}
                <div className="lg:col-span-4 bg-stone-900 text-stone-50 rounded-2xl p-6 border border-stone-850 shadow-md flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Hogar Gamificado</span>
                      <Award className="h-5 w-5 text-amber-400" />
                    </div>

                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-full border border-amber-500/40 flex items-center justify-center mx-auto text-xl mb-1">
                        🔥
                      </div>
                      <p className="text-xs opacity-60">Racha Compartida</p>
                      <h4 className="text-3xl font-serif font-bold">{profile.streakDays} Días Activos</h4>
                      <p className="text-[10px] text-amber-300">¡Sigan así! Mantienen el hogar impecable.</p>
                    </div>

                    <div className="border-t border-stone-800 pt-3 space-y-2">
                      <p className="text-[9px] uppercase tracking-wider font-bold opacity-60">Puntos de Pareja</p>
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-amber-700/30 border border-amber-500 text-center font-bold text-stone-100 flex items-center justify-center text-xs">{profile.partner1[0]}</div>
                          <span>{profile.partner1}:</span>
                        </div>
                        <span className="font-mono font-bold text-amber-400">{profile.points1} pts</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-stone-700/30 border border-stone-500/60 text-center font-bold text-stone-100 flex items-center justify-center text-xs">{profile.partner2[0]}</div>
                          <span>{profile.partner2}:</span>
                        </div>
                        <span className="font-mono font-bold text-amber-400">{profile.points2} pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-stone-800 text-center">
                    <span className="text-[10px] text-amber-200 block italic">¡El ganador elige el postre de hoy en San Salvador!</span>
                  </div>
                </div>
              </div>

              {/* SECOND ROWS: DATAS AND PLATILLOS OF TODAY */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* CITA PLANEADA (6 cols) */}
                <div className="lg:col-span-6 bg-gradient-to-br from-white/90 to-amber-50/50 dark:from-stone-900/60 dark:to-stone-900/20 rounded-2xl p-6 border border-warm-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="pill bg-amber-100 text-amber-900 text-[10px] font-bold dark:bg-amber-950/40 dark:text-amber-400 mb-3 inline-block">
                      Próxima Cita en Pareja
                    </span>
                    
                    {appointments.filter(a => !a.completed).length > 0 ? (
                      (() => {
                        const nextApt = appointments.filter(a => !a.completed)[0];
                        return (
                          <div className="space-y-2 mt-1">
                            <h4 className="text-xl font-serif font-bold text-stone-800 dark:text-white">{nextApt.title}</h4>
                            <div className="flex flex-wrap gap-2 text-xs text-stone-500 mt-2 font-mono">
                              <span className="flex items-center gap-1 bg-white/60 dark:bg-stone-800 px-2 py-0.5 rounded">
                                🗓️ {nextApt.date}
                              </span>
                              <span className="flex items-center gap-1 bg-white/60 dark:bg-stone-800 px-2 py-0.5 rounded">
                                ⏰ {nextApt.time || '20:00'} hrs
                              </span>
                              <span className="flex items-center gap-1 bg-white/60 dark:bg-stone-800 px-2 py-0.5 rounded">
                                📍 {nextApt.location || 'En Casa'}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 italic mt-3">"Recorrer y vivir hermosas experiencias profundiza su intimidad amorosa. ¡Prepárense con anticipación!"</p>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="space-y-2 py-4">
                        <p className="text-xs text-stone-400">No tienen ninguna cita planeada todavía para este mes.</p>
                        <button
                          onClick={() => setActiveTab('citas')}
                          className="px-3 py-1.5 bg-amber-900 text-stone-100 text-xs rounded-xl hover:bg-stone-800 cursor-pointer"
                        >
                          Generar idea de cita con IA 🔮
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-warm-150 dark:border-stone-800/80">
                    <button
                      onClick={() => setActiveTab('citas')}
                      className="text-xs text-amber-900 dark:text-amber-500 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      Planificar citas & Mapa de El Salvador <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* MENU INTELIGENTE DEL DIA (6 cols) */}
                <div className="lg:col-span-6 bg-gradient-to-br from-white to-stone-50 dark:from-stone-900/60 dark:to-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="pill bg-stone-100 text-stone-700 text-[10px] font-bold dark:bg-stone-850 dark:text-stone-300 mb-3 inline-block">
                      Receta del Día • Viernes Menú
                    </span>

                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">Sugerencia Almuerzo</span>
                        <h4 className="text-lg font-serif font-bold text-stone-800 dark:text-white">
                          {weeklyMenu[4] ? weeklyMenu[4].almuerzo.title : "Pollo Encebollado tradicional"}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2">
                          {weeklyMenu[4] ? weeklyMenu[4].almuerzo.description : "Pechuguita de pollo cocida con cebollitas tiernas y mostaza, ideal para llevar a la oficina en fiambrera."}
                        </p>
                        <p className="text-[10px] text-amber-800 dark:text-amber-500 font-mono">
                          🌱 Reutilización: {weeklyMenu[4] ? weeklyMenu[4].almuerzo.reutilizacion : "Usa las sobras para taquitos del finde."}
                        </p>
                      </div>
                      
                      <div
                        className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 border border-warm-100 dark:border-stone-850"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=250')` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-warm-150 dark:border-stone-800/80">
                    <button
                      onClick={() => setActiveTab('alimentacion')}
                      className="text-xs text-amber-900 dark:text-amber-500 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      Ver plan de comida & recetario <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>

              {/* COZY INTEGRATED EMBEDDED CHATBOT PROMPT FOR USER */}
              <div className="bg-gradient-to-r from-amber-500/[0.04] via-stone-500/[0.02] to-amber-900/[0.05] p-5 rounded-2xl border border-warm-150 dark:border-warm-800/40">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-900 text-stone-50 flex items-center justify-center text-lg select-none shrink-0 font-bold">
                    N
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-serif font-bold text-sm text-amber-900 dark:text-amber-500">¿Quieren platicar de algo en especial hoy?</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Escriban a <strong className="text-stone-700 dark:text-warm-350">Nidi AI</strong> usando la burbuja verde-crema de abajo a la derecha de la pantalla. Ella puede sugerirles un menú con lo que tengan en la nevera, de forma inmediata y al estilo salvadoreño campestre tradicional.
                    </p>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      <span className="text-[10px] bg-white dark:bg-stone-900 border px-2 py-0.5 rounded font-mono text-stone-500">Recetas Criollas</span>
                      <span className="text-[10px] bg-white dark:bg-stone-900 border px-2 py-0.5 rounded font-mono text-stone-500">Citas en San Salvador</span>
                      <span className="text-[10px] bg-white dark:bg-stone-900 border px-2 py-0.5 rounded font-mono text-stone-500">Consejos de Convivencia</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              VIEW 2: MÓDULO 1 DE CITAS (IDEAS DE CITAS & MAPS)
              ========================================== */}
          {activeTab === 'citas' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-warm-150 dark:border-warm-850 pb-4">
                <div>
                  <span className="text-xs text-amber-800 dark:text-amber-500 uppercase tracking-widest font-bold">Módulo 1</span>
                  <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-white">Generador de Experiencias & Citas con IA</h2>
                  <p className="text-xs text-stone-500 mt-1">Conecten su amor diseñando citas personalizadas en casa o explorando rincones reales en El Salvador.</p>
                </div>

                <button
                  onClick={() => setShowAddAppointmentModal(true)}
                  className="px-4 py-2 bg-amber-900 text-stone-50 border border-amber-950 shadow-sm rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
                >
                  <Plus className="h-4 w-4" /> Agendar en Calendario
                </button>
              </div>

              {/* TABLERO DE CITAS MENSUAL GENERAL DE NUEVO DESARROLLO */}
              <div className="bg-white/70 dark:bg-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-warm-100 dark:border-warm-800 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-850 dark:text-neutral-100">Tablero Mensual de Citas</h3>
                      <p className="text-[11px] text-stone-400">Hagan clic en cualquier día para agendar una cita romántica en esa fecha exacta</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 bg-amber-50 dark:bg-stone-800 text-amber-950 dark:text-amber-400 font-bold rounded-lg border border-warm-250 dark:border-stone-750 self-start sm:self-auto">
                    {getCalendarDays().monthLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Monthly Grid */}
                  <div className="xl:col-span-8 bg-stone-50/50 dark:bg-stone-950/20 p-4 rounded-xl border border-warm-150 dark:border-stone-850">
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono mb-2 font-bold opacity-60">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                        <div key={d} className="py-1">{d}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {/* Fill leading blank cells */}
                      {Array.from({ length: getCalendarDays().startDayOfWeek }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="aspect-square bg-transparent rounded-lg"></div>
                      ))}
                      
                      {/* Render actual days */}
                      {Array.from({ length: getCalendarDays().daysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const today = new Date();
                        const yr = today.getFullYear();
                        const mt = String(today.getMonth() + 1).padStart(2, '0');
                        const dy = String(dayNum).padStart(2, '0');
                        const dayDateStr = `${yr}-${mt}-${dy}`;
                        
                        const isCurrentToday = today.getDate() === dayNum && today.getMonth() === today.getMonth();
                        
                        // Filter appointments for this exact day
                        const dayApts = appointments.filter(a => a.date === dayDateStr);

                        return (
                          <div
                            key={`day-${dayNum}`}
                            onClick={() => {
                              setNewAppointment({
                                title: '',
                                date: dayDateStr,
                                time: '19:00',
                                mood: 'Romántica',
                                location: 'Tonacatepeque, San Salvador',
                                notes: '',
                              });
                              setShowAddAppointmentModal(true);
                            }}
                            className={`min-h-[64px] p-1 border rounded-lg flex flex-col justify-between transition-all cursor-pointer group hover:bg-amber-50/50 dark:hover:bg-amber-500/10 ${
                              isCurrentToday
                                ? 'bg-amber-100/50 dark:bg-amber-900/20 border-amber-900/60 dark:border-amber-500 shadow-sm'
                                : 'bg-white dark:bg-stone-900 border-warm-150 dark:border-stone-800'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-[10px] font-bold p-0.5 px-1.5 rounded-full ${
                                isCurrentToday ? 'bg-amber-955 text-stone-100' : 'text-stone-500'
                              }`}>
                                {dayNum}
                              </span>
                              {dayApts.length > 0 && (
                                <span className="text-[8px] sm:text-[9px] animate-pulse">💖</span>
                              )}
                            </div>

                            {/* Quick display of appointments on cell */}
                            <div className="space-y-0.5 mt-1 overflow-hidden">
                              {dayApts.slice(0, 2).map(apt => (
                                <div
                                  key={apt.id}
                                  title={apt.title}
                                  className={`text-[8px] leading-tight px-1 rounded truncate select-none border ${
                                    apt.completed
                                      ? 'bg-stone-100 dark:bg-stone-950 text-stone-400 line-through border-transparent'
                                      : 'bg-gradient-to-r from-amber-800/20 to-amber-950/25 dark:from-amber-900/30 dark:to-amber-950/30 text-amber-950 dark:text-amber-400 border-amber-900/10'
                                  }`}
                                >
                                  {apt.title}
                                </div>
                              ))}
                              {dayApts.length > 2 && (
                                <div className="text-[7px] text-amber-800 dark:text-amber-400 font-mono text-right font-bold">
                                  +{dayApts.length - 2} más
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Side listing current appointments */}
                  <div className="xl:col-span-4 bg-stone-50/50 dark:bg-stone-950/20 p-4 rounded-xl border border-warm-150 dark:border-stone-850 space-y-4">
                    <h4 className="font-serif font-bold text-xs border-b border-warm-150 dark:border-stone-800 pb-2 text-stone-850 dark:text-neutral-100">
                      Nuestras Citas de este Mes
                    </h4>
                    
                    <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                      {appointments.filter(a => {
                        const now = new Date();
                        const [yr, mt] = a.date.split('-');
                        return Number(yr) === now.getFullYear() && Number(mt) === (now.getMonth() + 1);
                      }).length > 0 ? (
                        appointments.filter(a => {
                          const now = new Date();
                          const [yr, mt] = a.date.split('-');
                          return Number(yr) === now.getFullYear() && Number(mt) === (now.getMonth() + 1);
                        }).map(apt => (
                          <div
                            key={apt.id}
                            className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 transition-all text-xs ${
                              apt.completed
                                ? 'bg-stone-100/40 border-warm-150 dark:bg-stone-900/10 text-stone-400'
                                : 'bg-white dark:bg-stone-900 border-warm-200 dark:border-stone-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <h5 className={`font-semibold text-[11px] leading-tight ${apt.completed ? 'line-through text-stone-400' : 'text-stone-850 dark:text-neutral-100'}`}>
                                  {apt.title}
                                </h5>
                                <p className="text-[10px] text-stone-550 font-mono">
                                  📅 {apt.date} • ⏱️ {apt.time || '19:00'}
                                </p>
                                {apt.location && (
                                  <p className="text-[9px] text-amber-855 dark:text-amber-500 font-mono italic">
                                    📍 {apt.location}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAppointments(prev => prev.map(a => a.id === apt.id ? { ...a, completed: !a.completed } : a));
                                  }}
                                  className={`p-1 px-1.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                                    apt.completed
                                      ? 'bg-stone-500 text-stone-100 border-stone-605'
                                      : 'bg-amber-900 text-white hover:bg-stone-800 border-amber-955'
                                  }`}
                                >
                                  {apt.completed ? '✓' : 'Listo'}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAppointments(prev => prev.filter(a => a.id !== apt.id));
                                  }}
                                  className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Quitar"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-[11px] text-stone-405 italic">
                          No hay citas registradas para este mes todavía. ¡Hagan clic en un día en el tablero de la izquierda para planificar!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* TABS PARA CITAS EN CASA VS CITAS GENERALES FUERA */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* COLUMNA IZQUIERDA: GENERADOR CITAS EN CASA */}
                <div className="lg:col-span-6 bg-white/60 dark:bg-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800/80 space-y-6">
                  <div className="flex items-center gap-2 border-b border-warm-100 dark:border-stone-800 pb-3">
                    <span className="text-lg">🏡</span>
                    <div>
                      <h3 className="font-serif font-bold text-lg leading-tight">Citas Cozy en Casa</h3>
                      <p className="text-[11px] text-stone-400">Generadas según su estado de ánimo con IA</p>
                    </div>
                  </div>

                  {/* Mood slider list selection */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2 font-mono">Seleccionen el Mood Romántico</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {['Romántica', 'Love', 'Divertida', 'Intelectual', 'Relajante', 'Económica', 'Creativa', 'Nostálgica', 'Gaming Night'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setSelectedMood(m)}
                          className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            selectedMood === m
                              ? 'bg-amber-900 text-stone-100 border-amber-950 shadow-sm'
                              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-warm-200 dark:border-warm-800 hover:border-amber-900'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => generateAiCitas(selectedMood)}
                    disabled={loadingCitas}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-800 to-amber-950 text-stone-100 rounded-xl font-semibold text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {loadingCitas ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Inspirándose con recetas cozy IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        <span>Generar 3 Ideas Detalladas ({selectedMood})</span>
                      </>
                    )}
                  </button>

                  {/* RESULTS ROOM CITAS */}
                  <div className="space-y-4 pt-2">
                    {aiCitasResult.length > 0 ? (
                      aiCitasResult.map((idea, index) => (
                        <div
                          key={index}
                          className="p-4 bg-amber-50/45 dark:bg-stone-900/80 rounded-2xl border border-amber-100/60 dark:border-stone-800/80 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif font-bold text-stone-900 dark:text-white">{idea.name}</h4>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-950/45 dark:text-amber-400 text-[9px] uppercase font-mono font-bold rounded">
                              {idea.preparationLevel || 'Bajo'} prep
                            </span>
                          </div>
                          
                          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{idea.description}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-[11px] bg-white/70 dark:bg-stone-950/40 p-2.5 rounded-xl border border-warm-150 dark:border-stone-850">
                            <div>
                              <strong className="block text-[9px] uppercase text-stone-400">Atmósfera</strong>
                              <span className="text-stone-700 dark:text-warm-300 font-serif">{idea.atmosphere}</span>
                            </div>
                            <div>
                              <strong className="block text-[9px] uppercase text-stone-400">Playlist</strong>
                              <span className="text-stone-700 dark:text-warm-300 font-serif">{idea.playlist}</span>
                            </div>
                            <div className="col-span-2 border-t border-warm-100 dark:border-stone-800 pt-1.5 mt-1">
                              <strong className="block text-[9px] uppercase text-stone-400">Comida sugerida</strong>
                              <span className="text-stone-700 dark:text-warm-300 font-serif">{idea.foodIdeas}</span>
                            </div>
                            <div className="col-span-2 border-t border-warm-100 dark:border-stone-800 pt-1.5 mt-1">
                              <strong className="block text-[9px] uppercase text-stone-400">Juegos y Dinámica</strong>
                              <span className="text-stone-700 dark:text-warm-300 font-serif">{idea.games}</span>
                            </div>
                          </div>

                          <div className="flex justify-between text-[11px] font-mono text-stone-400">
                            <span>⏱️ {idea.estimatedTime}</span>
                            <span>💵 {idea.budget}</span>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex gap-2 pt-2 border-t border-warm-100 dark:border-stone-800">
                            <button
                              onClick={() => saveDateIdea(idea, 'guardada')}
                              className="flex-1 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold float-right cursor-pointer"
                            >
                              ❤️ Guardar en favoritas
                            </button>
                            <button
                              onClick={() => saveDateIdea(idea, 'para_luego')}
                              className="flex-1 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              ⏳ Hacer Luego
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-stone-50/50 dark:bg-stone-900/20 rounded-2xl border border-dashed border-stone-300 dark:border-stone-850">
                        <Sparkles className="h-6 w-6 text-amber-800/40 mx-auto mb-2" />
                        <p className="text-xs text-stone-400 leading-normal">Seleccionen un estado de ánimo arriba y pulsen "Generar" para inspirarse con un plan detallado en casa.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUMNA DERECHA: APIS DE GOOGLE MAPS GROUNDING Y LUGARES EN EL SALVADOR */}
                <div className="lg:col-span-6 bg-white/60 dark:bg-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800/80 space-y-6">
                  <div className="flex items-center justify-between gap-2 border-b border-warm-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-amber-800 dark:text-amber-500 animate-pulse" />
                      <div>
                        <h3 className="font-serif font-bold text-lg leading-tight">Explorador de El Salvador</h3>
                        <p className="text-[11px] text-stone-400">Localicen rincones reales para citas memorables</p>
                      </div>
                    </div>
                  </div>

                  {/* FILTROS MAPS */}
                  <div className="grid grid-cols-2 gap-3 bg-stone-105/50 p-4 rounded-2xl border border-warm-200/50 dark:border-stone-800 text-xs">
                    <div>
                      <label className="text-[9px] uppercase font-mono font-bold text-stone-400 block mb-1">Zona / Departamento</label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-2 py-1.5 rounded dark:bg-stone-800 border dark:border-stone-700 border-warm-200 cursor-pointer focus:outline-none"
                      >
                        <option value="San Salvador">San Salvador (Ciudad)</option>
                        <option value="Santa Tecla">Santa Tecla (La Libertad)</option>
                        <option value="Antiguo Cuscatlán">Antiguo Cuscatlán (La Libertad)</option>
                        <option value="Planes de Renderos">Planes de Renderos</option>
                        <option value="El Boquerón">El Boquerón / Volcán</option>
                        <option value="La Libertad Playas">La Libertad (El Tunco / El Zonte / Sunzal)</option>
                        <option value="Santa Ana">Santa Ana (Ciudad / Coatepeque)</option>
                        <option value="Sonsonate">Sonsonate (Ruta de las Flores / Salinitas)</option>
                        <option value="Ahuachapán">Ahuachapán / Apaneca / Ataco</option>
                        <option value="Suchitoto">Suchitoto (Cuscatlán)</option>
                        <option value="Chalatenango">Chalatenango (Pital / San Ignacio)</option>
                        <option value="San Miguel">San Miguel (Ciudad / El Cuco)</option>
                        <option value="Morazán">Morazán (Perquín / Ruta de la Paz)</option>
                        <option value="Usulután">Usulután (Bahía de Jiquilisco)</option>
                        <option value="San Vicente">San Vicente (Ciudad / Apastepeque)</option>
                        <option value="La Unión">La Unión (Golfo de Fonseca / Conchagua)</option>
                        <option value="La Paz">La Paz (Costa del Sol / Olocuilta)</option>
                        <option value="Cabañas">Cabañas (Ilobasco)</option>
                        <option value="Otro">Otro lugar (Tipear)...</option>
                      </select>
                      
                      {selectedCity === 'Otro' && (
                        <input
                          type="text"
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          placeholder="Ej: Juayúa, Suchitoto, etc."
                          className="mt-1.5 w-full px-2 py-1.5 bg-amber-50/50 dark:bg-stone-850 border border-amber-300 dark:border-amber-700/60 rounded text-xs focus:outline-none placeholder:text-stone-400"
                        />
                      )}
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono font-bold text-stone-400 block mb-1">Categoría</label>
                      <select
                        value={selectedPlacesCategory}
                        onChange={(e) => setSelectedPlacesCategory(e.target.value)}
                        className="w-full px-2 py-1.5 rounded dark:bg-stone-800 border dark:border-stone-700 border-warm-200 cursor-pointer focus:outline-none"
                      >
                        <option value="Restaurantes">Restaurantes</option>
                        <option value="Cafés">Cafés Cozy</option>
                        <option value="Miradores">Miradores</option>
                        <option value="Lugares económicos de paseo">Paseos económicos</option>
                        <option value="Lugares premium">Lugares Premium</option>
                        <option value="Eventos y actividades de día">Actividades de Día</option>
                        <option value="Actividades nocturnas">Actividades Nocturnas</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono font-bold text-stone-400 block mb-1">Presupuesto</label>
                      <select
                        value={placesBudget}
                        onChange={(e) => setPlacesBudget(e.target.value)}
                        className="w-full px-2 py-1.5 rounded dark:bg-stone-800 border dark:border-stone-700 border-warm-200 cursor-pointer focus:outline-none"
                      >
                        <option value="Económico">Económico ($)</option>
                        <option value="Moderado">Moderado ($$)</option>
                        <option value="Premium">Premium ($$$)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono font-bold text-stone-400 block mb-1">Ambiente</label>
                      <select
                        value={placesAmbiance}
                        onChange={(e) => setPlacesAmbiance(e.target.value)}
                        className="w-full px-2 py-1.5 rounded dark:bg-stone-800 border dark:border-stone-700 border-warm-200 cursor-pointer focus:outline-none"
                      >
                        <option value="Interior">Interior / Techo</option>
                        <option value="Exterior">Exterior / Al aire libre</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={generateAiPlaces}
                    disabled={loadingPlaces}
                    className="w-full py-2 bg-amber-900 border border-amber-955 text-white rounded-xl font-semibold text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {loadingPlaces ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Consultando Google Maps con IA...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 text-amber-300" />
                        <span>Buscar Lugares Reales de El Salvador</span>
                      </>
                    )}
                  </button>

                  {/* DISPLAY MAPS RECOMMENDED PLACES */}
                  <div className="space-y-4">
                    {aiPlacesResult.length > 0 ? (
                      aiPlacesResult.map((place, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-warm-100 dark:border-stone-850 flex gap-3 align-start"
                        >
                          <div className="p-2 sm:p-3 bg-amber-100 rounded-xl text-amber-900 h-10 w-10 flex items-center justify-center text-lg select-none shrink-0 font-serif">
                            📍
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-semibold text-xs text-stone-850 dark:text-neutral-100">{place.name}</h4>
                            <p className="text-[11px] text-stone-500 leading-relaxed font-serif">{place.review}</p>
                            
                            <div className="bg-amber-50/50 dark:bg-stone-950/50 p-2 rounded-lg border border-warm-150/40 text-[10px] space-y-1">
                              <strong>✨ Recomendado:</strong>
                              <p className="text-stone-700 dark:text-stone-300">{place.recommendation}</p>
                            </div>

                            <div className="flex justify-between items-center text-[10px] opacity-80 pt-1 font-mono">
                              <span>🌍 {place.details?.city || (selectedCity === 'Otro' ? (customCity || 'San Salvador') : selectedCity)}</span>
                              <span className="bg-stone-200 dark:bg-stone-800 px-1.5 rounded">{place.details?.ambiance || 'Clásico'}</span>
                            </div>

                            {/* Simulated Google link */}
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + (place.details?.city || (selectedCity === 'Otro' ? (customCity || 'San Salvador') : selectedCity)) + ' El Salvador')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-amber-800 dark:text-amber-500 font-bold underline hover:no-underline block pt-1.5"
                            >
                              Ver ubicación real en mapa de Google Maps 🗺️
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 md:p-8 text-center bg-stone-50/20 rounded-2xl border border-dashed border-stone-300 dark:border-stone-850">
                        <MapPin className="h-6 w-6 text-stone-300 mx-auto mb-2" />
                        <p className="text-xs text-stone-400">Escojan municipio y categoría arriba para consultar lugares gastronómicos o paseos auténticos salvadoreños.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* SAVED DATE LIST HISTORY & FAVORITES */}
              <div className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800 space-y-6">
                <div className="flex items-center gap-2 border-b border-warm-100 dark:border-warm-800 pb-3">
                  <span>📁</span>
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight">Su Bitácora & Favoritas de Citas</h3>
                    <p className="text-[11px] text-stone-400">Sus planes guardados esperando a ser experimentados</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedIdeas.map((saved) => (
                    <div
                      key={saved.id}
                      className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-warm-200 dark:border-stone-850 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className={`pill text-[9px] ${
                            saved.status === 'guardada' ? 'bg-red-50 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {saved.status === 'guardada' ? 'Favorita' : 'Hacer Luego'}
                          </span>
                          <button
                            onClick={() => {
                              setSavedIdeas(prev => prev.filter(i => i.id !== saved.id));
                            }}
                            className="text-stone-400 hover:text-red-500 text-xs transition-colors cursor-pointer"
                            title="Quitar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-xs leading-snug">{saved.name}</h4>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-3">{saved.description}</p>
                        
                        <div className="mt-3 pt-2.5 border-t border-warm-150 dark:border-stone-800 text-[10px] space-y-1">
                          <p><strong className="opacity-60">Playlist:</strong> {saved.playlist}</p>
                          <p><strong className="opacity-60">Comida:</strong> {saved.foodIdeas}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-warm-150 dark:border-stone-800 flex justify-between items-center">
                        <span className="text-[9px] font-mono opacity-60">Prepare: {saved.preparationLevel}</span>
                        <button
                          onClick={() => {
                            // Move to appointments
                            const newApt: DateAppointment = {
                              id: 'apt-' + Date.now(),
                              title: `Cita planeada: ${saved.name}`,
                              date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                              time: '20:00',
                              location: saved.atmosphere.includes('casa') || saved.atmosphere.includes('hogar') ? 'En el Hogar' : 'El Salvador',
                              completed: false,
                            };
                            setAppointments(prev => [newApt, ...prev]);
                            alert(`¡Cita agendada para este mes con éxito! ✨`);
                          }}
                          className="px-2 py-1 bg-amber-900 text-stone-50 text-[10px] font-bold rounded-md hover:bg-stone-800 cursor-pointer"
                        >
                          📅 Agendar fecha
                        </button>
                      </div>
                    </div>
                  ))}

                  {savedIdeas.length === 0 && (
                    <div className="col-span-full py-8 text-center text-xs text-stone-400">
                      Su baúl de favoritos está vacío. ¡Guarden ideas generadas por la IA para tenerlas listas!
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              VIEW 3: MÓDULO 2 (ORGANIZADOR DEL HOGAR, TAREAS)
              ========================================== */}
          {activeTab === 'hogar' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-warm-150 dark:border-warm-850 pb-4">
                <div>
                  <span className="text-xs text-amber-800 dark:text-amber-500 uppercase tracking-widest font-bold">Módulo 2</span>
                  <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-white">Organizador Doméstico & Productividad En Pareja</h2>
                  <p className="text-xs text-stone-500 mt-1">Sincronicen, compartan de manera lúdica las tareas y ganen puntos por mantener el orden sin estrés.</p>
                </div>

                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-4 py-2 bg-amber-900 text-stone-50 rounded-xl text-xs font-semibold hover:bg-stone-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Nueva Tarea del Hogar
                </button>
              </div>

              {/* METAS Y GAMIFICACION HEADER RESUMEN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="p-4 bg-white/70 dark:bg-stone-900/50 rounded-2xl border border-warm-200 dark:border-stone-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Racha Semanal</span>
                  <div className="text-3xl font-serif font-bold text-amber-900 dark:text-amber-500">{profile.streakDays} Días 🔥</div>
                  <p className="text-[10px] text-stone-400 mt-1">Premio extra por llegar a los 20 días activos sin fallar.</p>
                </div>

                <div className="p-4 bg-white/70 dark:bg-stone-900/50 rounded-2xl border border-warm-200 dark:border-stone-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Progreso General Diario</span>
                  <div className="text-3xl font-serif font-bold text-amber-900 dark:text-amber-500">{progressPercent}%</div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-amber-800" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                <div className="p-4 bg-white/70 dark:bg-stone-900/50 rounded-2xl border border-warm-200 dark:border-stone-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Metas de puntos pendientes</span>
                  <div className="text-3xl font-serif font-bold text-amber-900 dark:text-amber-500">250 pts</div>
                  <p className="text-[10px] text-stone-400 mt-1">El que tenga más puntos al fin de semana descansa del aseo.</p>
                </div>

              </div>

              {/* CORE TASKS TABLE TABLERO DIARIO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* TABLERO SEMANAL DE TAREAS DEL HOGAR */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Día actual visual week tracker */}
                  <div className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-5 border border-warm-200 dark:border-stone-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-warm-100 dark:border-stone-800 pb-3 gap-2">
                      <div>
                        <h3 className="font-serif font-bold text-base text-stone-850 dark:text-neutral-100">Planificador Semanal de Tareas</h3>
                        <p className="text-[11px] text-stone-400">Seleccionen un día para ver o delegar tareas específicas de esta semana</p>
                      </div>
                      <div className="text-[10px] font-mono bg-warm-50/55 dark:bg-stone-850 px-2.5 py-1 rounded text-stone-500 uppercase tracking-widest font-bold self-start sm:self-auto border border-warm-200 dark:border-stone-750">
                        Semana del {getCurrentWeekDates()[0].label} al {getCurrentWeekDates()[6].label}
                      </div>
                    </div>

                    {/* Horizontal 7-Day Selector Card Row */}
                    <div className="grid grid-cols-7 gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {getCurrentWeekDates().map((day) => {
                        const dayTasks = tasks.filter(t => (t.dayOfWeek || 'Lunes') === day.name);
                        const pendingCount = dayTasks.filter(t => !t.completed).length;
                        const isSelected = selectedChoreDay === day.name;

                        return (
                          <button
                            key={day.name}
                            type="button"
                            onClick={() => setSelectedChoreDay(day.name)}
                            className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all min-w-[58px] cursor-pointer ${
                              isSelected
                                ? 'bg-amber-900 border-amber-955 text-white shadow-xs font-bold scale-[1.02]'
                                : day.isToday
                                ? 'bg-amber-50 dark:bg-stone-950 border-amber-900/40 text-stone-800 dark:text-neutral-100 font-semibold animate-pulse'
                                : 'bg-stone-50/50 dark:bg-stone-900/80 border-warm-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-50/80'
                            }`}
                          >
                            <span className="text-[8px] uppercase tracking-wider block opacity-70">{day.name.slice(0, 3)}</span>
                            <span className="text-[15px] font-serif block my-0.5">{day.num}</span>
                            {pendingCount > 0 ? (
                              <span className={`text-[8px] px-1 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-red-50 text-red-750'}`}>{pendingCount}</span>
                            ) : dayTasks.length > 0 ? (
                              <span className="text-[9px] text-green-600">✓</span>
                            ) : (
                              <span className="text-[8px] opacity-25">-</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks List for the Selected Day */}
                  <div className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-warm-100 dark:border-stone-800 pb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">📌</span>
                        <h4 className="font-serif font-bold text-sm text-stone-850 dark:text-neutral-100">
                          Tareas para el día <span className="text-amber-900 dark:text-amber-500 font-sans font-bold">{selectedChoreDay}</span>
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setNewTask(p => ({ ...p, dayOfWeek: selectedChoreDay }));
                          setShowAddTaskModal(true);
                        }}
                        className="px-2 py-1 bg-amber-900 hover:bg-stone-850 text-white text-[10px] rounded-lg font-bold transition-all cursor-pointer shadow-xs"
                      >
                        + Agregar a este día
                      </button>
                    </div>

                    <div className="space-y-3">
                      {tasks.filter(t => (t.dayOfWeek || 'Lunes') === selectedChoreDay).map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            task.completed
                              ? 'bg-stone-50/50 dark:bg-stone-900/20 border-warm-150 dark:border-stone-900'
                              : 'bg-white dark:bg-stone-900 border-warm-200 dark:border-stone-800 shadow-sm hover:border-amber-900/40'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              onClick={() => claimPointsTask(task.id, task.responsable === 'Él' ? 'partner1' : task.responsable === 'Ella' ? 'partner2' : 'both')}
                              className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors mt-0.5 ${
                                task.completed
                                  ? 'bg-amber-900 text-stone-100 border-amber-955'
                                  : 'border-stone-300 dark:border-stone-700 hover:border-amber-900 bg-white dark:bg-stone-900'
                              }`}
                            >
                              {task.completed && <CheckCircle className="h-4.5 w-4.5 fill-current" />}
                            </div>
                            
                            <div>
                              <h4 className={`text-sm font-semibold truncate max-w-[280px] sm:max-w-[360px] ${
                                task.completed ? 'line-through text-stone-400' : 'text-stone-800 dark:text-white'
                              }`}>
                                {task.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-mono text-stone-500">
                                <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                                  🔁 {task.frequency}
                                </span>
                                <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                                  👤 <strong className="text-amber-800 dark:text-amber-500 font-bold">{task.responsable}</strong>
                                </span>
                                <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                                  ⏱️ {task.duration}
                                </span>
                                {task.suggestedTime && (
                                  <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                                    🔔 {task.suggestedTime}
                                  </span>
                                )}
                                <span className="bg-amber-50 dark:bg-stone-950 text-amber-905 dark:text-amber-500 px-2 py-0.5 rounded font-bold">
                                  +{task.scorePoints || 20} Pts
                                </span>
                              </div>
                              {task.completed && task.completedAt && (
                                <p className="text-[9px] text-green-605 dark:text-green-550 font-mono mt-1">
                                  ✓ Completada hoy por {task.responsable}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => {
                                alert(`Se ha reajustado el recordatorio de "${task.name}" para mañana.`);
                                setReminders(prev => [`La tarea "${task.name}" se reagendó exitosamente para mañana.`, ...prev]);
                              }}
                              className="p-1 px-2.5 rounded-lg border border-warm-200 dark:border-stone-750 text-[10px] font-semibold text-stone-605 dark:text-stone-300 hover:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer"
                            >
                              Reagendar
                            </button>
                            <button
                              onClick={() => {
                                setTasks(prev => prev.filter(t => t.id !== task.id));
                              }}
                              className="p-1.5 rounded-lg border border-red-200/50 hover:bg-red-50 hover:border-red-500 text-stone-400 hover:text-red-650 transition-colors cursor-pointer"
                              title="Quitar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {tasks.filter(t => (t.dayOfWeek || 'Lunes') === selectedChoreDay).length === 0 && (
                        <div className="p-12 text-center text-xs text-stone-400 italic">
                          No hay tareas programadas para este {selectedChoreDay}. ¡Momento de descansar y disfrutar su racha!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* VISUAL MONTH CALENDAR SIDEBAR & REMINDERS PANEL */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Monthly calendar widget view */}
                  <div className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-5 border border-warm-200 dark:border-stone-800">
                    <h4 className="font-serif font-bold text-sm mb-3 border-b pb-2 flex items-center justify-between">
                      <span>Calendario Mensual</span>
                      <span className="text-[10px] uppercase font-sans tracking-wider text-amber-800 dark:text-amber-500 font-bold">{getCalendarDays().monthLabel}</span>
                    </h4>
                    
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono mb-2">
                      {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                        <span key={d} className="font-bold opacity-60">{d}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono">
                      {/* Generar cuadricula dinámica para el mes actual */}
                      {Array.from({ length: getCalendarDays().startDayOfWeek }).map((_, i) => (
                        <span key={`empty-${i}`} className="opacity-0"></span>
                      ))}
                      {Array.from({ length: getCalendarDays().daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const now = new Date();
                        const isToday = dayNum === now.getDate();
                        const hasApointment = appointments.some(appType => {
                          try {
                            if (!appType.date) return false;
                            const [y, m, d] = appType.date.split('-').map(Number);
                            return d === dayNum && (m - 1) === now.getMonth() && y === now.getFullYear();
                          } catch {
                            return false;
                          }
                        });
                        return (
                          <div
                            key={dayNum}
                            className={`p-1 rounded-md flex flex-col items-center justify-center relative cursor-pointer ${
                              isToday
                                ? 'bg-amber-900 text-white font-bold'
                                : 'hover:bg-amber-50 dark:hover:bg-stone-800'
                            }`}
                            title={isToday ? "Hoy" : hasApointment ? "Día con Cita planeada" : undefined}
                          >
                            <span>{dayNum}</span>
                            {hasApointment && !isToday && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute bottom-0.5"></span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-3 border-t border-warm-150/50 text-[10px] space-y-2 text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-amber-900 inline-block"></span>
                        <span>Día de Hoy</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                        <span>Citas de Pareja Planificadas</span>
                      </div>
                    </div>
                  </div>

                  {/* Motivations & Advices block */}
                  <div className="bg-gradient-to-br from-amber-700 to-amber-950 text-stone-50 p-5 rounded-2xl space-y-4">
                    <h4 className="font-serif font-bold text-sm">Consejo Cozy de Convivencia</h4>
                    <p className="text-xs text-warm-200 leading-normal">
                      "Dividirse equitativamente las tareas domésticas no se trata de medir porcentajes exactos, sino de valorar el tiempo y la energía de tu pareja con un corazón empático."
                    </p>
                    <div className="text-[10px] opacity-75 font-mono text-right">- El Nido Convivencia</div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              VIEW 4: ALIMENTACIÓN Y PLANIFICACIÓN DE MENÚS (Smart IA menu & recipes)
              ========================================== */}
          {activeTab === 'alimentacion' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-warm-150 dark:border-warm-850 pb-4">
                <div>
                  <span className="text-xs text-amber-800 dark:text-amber-500 uppercase tracking-widest font-bold">Módulo 3</span>
                  <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-white">Alimentación Inteligente, Recetas & Menú Quincenal</h2>
                  <p className="text-xs text-stone-500 mt-1">Planifiquen ricas comidas tradicionales, reduzcan el desperdicio del súper e ideen platos perfectos para llevar a la oficina.</p>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <button
                    onClick={handleExportMenuPDF}
                    className="px-3.5 py-1.5 bg-white dark:bg-stone-900 border border-warm-200 dark:border-stone-850 hover:bg-stone-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer dark:text-stone-300"
                  >
                    <FileText className="h-4 w-4" /> Exportar Plan
                  </button>
                  <button
                    onClick={generateAiWeeklyMenu}
                    disabled={loadingWeeklyMenu}
                    className="px-4 py-1.5 bg-amber-900 text-stone-50 rounded-xl text-xs font-semibold hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    {loadingWeeklyMenu ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
                    <span>Generar Menú Semanal</span>
                  </button>
                </div>
              </div>

              {/* INTEGRATED INTELLIGENT MENU GENERATOR FORM WITH CURRENT INGREDIENTS */}
              <div className="bg-gradient-to-br from-white/90 to-amber-50/20 dark:from-stone-900/40 dark:to-stone-900/10 rounded-2xl p-6 border border-warm-200 dark:border-stone-800/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-warm-100 dark:border-stone-800 pb-2.5">
                  <span className="text-xl">🍲</span>
                  <div>
                    <h3 className="font-serif font-semibold text-base leading-snug">Generador Inteligente Quincenal / Semanal</h3>
                    <p className="text-[11px] text-stone-400">La IA optimiza las compras reutilizando ingredientes inteligentemente</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
                    ¿Qué ingredientes tienen en mente o en casa actualmente?
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={disponiblesText}
                      onChange={(e) => setDisponiblesText(e.target.value)}
                      placeholder="Ej: frijoles, plátanos, crema salvadoreña, cebollas, bistec picadillo, arroz salvadoreño..."
                      className="flex-1 px-3 py-2 border rounded-xl text-xs dark:bg-stone-800 dark:border-stone-700 dark:text-white border-warm-200 focus:outline-none"
                    />
                    <button
                      onClick={generateAiWeeklyMenu}
                      disabled={loadingWeeklyMenu}
                      className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-850 cursor-pointer shrink-0 disabled:opacity-60"
                    >
                      {loadingWeeklyMenu ? 'Planificando...' : 'Reordenar Recetas'}
                    </button>
                  </div>
                  <span className="text-[9px] text-stone-400 block leading-normal">
                    💡 La IA priorizará cocina real, práctica de fiambrera caliente para su oficina y comidas típicas ricas salvadoreñas (ej: casamiento, pupusas asadas, plátanos y frijoles), descartando granola, té verde o ensaladas fitness aburridas.
                  </span>
                </div>
              </div>

              {/* TABLERO DIARIO / SEMANAL VISUAL PLAN MEETING DRAG AND DROP SIMULATION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* DISPLAY OF WEEK MENU DAYS */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-serif font-bold text-lg">Distribución de Comidas de la Semana</h3>
                    <span className="text-xs text-stone-400 italic">Hagan click en el plato para regenerar opciones</span>
                  </div>

                  <div className="space-y-4">
                    {weeklyMenu.map((dayPlan, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-warm-200 dark:border-stone-850 shadow-sm space-y-4"
                      >
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="font-serif font-bold text-amber-900 dark:text-amber-500 text-sm">
                            {dayPlan.day}
                          </span>
                          <span className="text-[10px] bg-stone-105 border font-mono px-2 py-0.5 rounded text-stone-500 uppercase tracking-widest font-bold">
                            Planificado
                          </span>
                        </div>

                        {/* Three core meals */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* Desayuno */}
                          <div
                            onClick={() => swapMealsInMenu(dayIdx, 'desayuno')}
                            className="bg-stone-50/50 dark:bg-stone-950/20 p-3 rounded-xl border border-dashed border-warm-150 dark:border-stone-850 hover:bg-amber-50/40 dark:hover:bg-amber-500/5 transition-all cursor-pointer space-y-1.5"
                            title="Haz click para cambiar plato"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold uppercase opacity-60">🍳 Desayuno</span>
                              <span className="text-xs">🔄</span>
                            </div>
                            <h4 className="font-semibold text-xs text-stone-800 dark:text-white">{dayPlan.desayuno.title}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">{dayPlan.desayuno.description}</p>
                            <p className="text-[9px] text-amber-855 dark:text-amber-500 font-mono italic pt-1 border-t border-warm-150/40">
                              ♻️ {dayPlan.desayuno.reutilizacion}
                            </p>
                          </div>

                          {/* Almuerzo */}
                          <div
                            onClick={() => swapMealsInMenu(dayIdx, 'almuerzo')}
                            className="bg-stone-50/50 dark:bg-stone-950/20 p-3 rounded-xl border border-dashed border-warm-150 dark:border-stone-850 hover:bg-amber-50/40 dark:hover:bg-amber-500/5 transition-all cursor-pointer space-y-1.5"
                            title="Haz click para cambiar plato"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold uppercase opacity-60">🍱 Almuerzo (Oficina)</span>
                              <span className="text-xs">🔄</span>
                            </div>
                            <h4 className="font-semibold text-xs text-stone-800 dark:text-white">{dayPlan.almuerzo.title}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">{dayPlan.almuerzo.description}</p>
                            <p className="text-[9px] text-amber-855 dark:text-amber-500 font-mono italic pt-1 border-t border-warm-150/40">
                              ♻️ {dayPlan.almuerzo.reutilizacion}
                            </p>
                          </div>

                          {/* Cena */}
                          <div
                            onClick={() => swapMealsInMenu(dayIdx, 'cena')}
                            className="bg-stone-50/50 dark:bg-stone-950/20 p-3 rounded-xl border border-dashed border-warm-150 dark:border-stone-850 hover:bg-amber-50/40 dark:hover:bg-amber-500/5 transition-all cursor-pointer space-y-1.5"
                            title="Haz click para cambiar plato"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold uppercase opacity-60">🌙 Cena Práctica</span>
                              <span className="text-xs">🔄</span>
                            </div>
                            <h4 className="font-semibold text-xs text-stone-800 dark:text-white">{dayPlan.cena.title}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">{dayPlan.cena.description}</p>
                            <p className="text-[9px] text-amber-855 dark:text-amber-500 font-mono italic pt-1 border-t border-warm-150/40">
                              ♻️ {dayPlan.cena.reutilizacion}
                            </p>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SIDE COLUMN: LISTA DE COMPRAS DEL SUPERMERCADO */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Supermarket list panel */}
                  <div className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-5 border border-warm-200 dark:border-stone-800 space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <ShoppingBag className="h-5 w-5 text-amber-900 dark:text-amber-500" />
                      <div>
                        <h4 className="font-serif font-bold text-sm leading-tight">Lista del Supermercado</h4>
                        <p className="text-[10px] text-stone-450">Fórmulas optimizadas por ingredientes</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {supermarketList.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs p-1.5 bg-stone-50 dark:bg-stone-900 rounded-lg border border-warm-150 dark:border-stone-850"
                        >
                          <input type="checkbox" className="rounded text-amber-900 border-stone-300 focus:ring-amber-500" />
                          <span className="text-stone-700 dark:text-warm-300 font-serif">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-warm-150/50 flex gap-2">
                      <input
                        type="text"
                        placeholder="Agregar ingrediente..."
                        className="flex-1 px-2.5 py-1 text-xs border rounded-lg dark:bg-stone-850 dark:border-stone-700 dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val.trim()) {
                              setSupermarketList(p => [...p, val.trim()]);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => setSupermarketList([])}
                        className="p-1 px-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg text-[10px] font-semibold text-stone-600 dark:text-stone-350 cursor-pointer"
                      >
                        Limpiar todo
                      </button>
                    </div>
                  </div>

                  {/* ESTABLECER MENÚ COMO OFICIAL */}
                  <div className="bg-white/65 dark:bg-stone-900/40 rounded-2xl p-5 border border-warm-200 dark:border-stone-800 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <span className="text-sm">📅</span>
                      <div>
                        <h4 className="font-serif font-bold text-xs leading-tight text-stone-800 dark:text-neutral-100">Oficializar Plan Quincenal</h4>
                        <p className="text-[10px] text-stone-400">Pinchen para fijar este menú en su calendario oficial</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[9px] uppercase font-mono font-bold text-stone-450 block mb-1">Nombre o Título de la Quincena</label>
                        <input
                          type="text"
                          placeholder="Ej: Menú de Mayo - Pollo & Frijoles..."
                          value={officialMenuTitle}
                          onChange={(e) => setOfficialMenuTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded-lg dark:bg-stone-850 dark:border-stone-700 dark:text-white border-warm-200 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] uppercase font-mono font-bold text-stone-450 block mb-1">Fecha Inicio</label>
                          <input
                            type="date"
                            value={menuStartDate}
                            onChange={(e) => setMenuStartDate(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg dark:bg-stone-850 dark:border-stone-700 dark:text-white border-warm-200 focus:outline-none text-[10px]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-mono font-bold text-stone-450 block mb-1">Fecha Fin</label>
                          <input
                            type="date"
                            value={menuEndDate}
                            onChange={(e) => setMenuEndDate(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg dark:bg-stone-850 dark:border-stone-700 dark:text-white border-warm-200 focus:outline-none text-[10px]"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={saveAsOfficialMenu}
                        className="w-full py-2 bg-amber-900 hover:bg-amber-800 text-stone-50 rounded-xl font-semibold text-[11px] cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        🌟 Guardar en Tablero Oficial
                      </button>
                    </div>
                  </div>

                  {/* TABLERO DE MENÚS OFICIALES GUARDADOS */}
                  {officialMenus.length > 0 && (
                    <div id="tablero-oficial-menus" className="bg-white/65 dark:bg-stone-900/40 rounded-2xl p-5 border border-warm-200 dark:border-stone-800 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 border-b pb-2">
                        <span className="text-base">📋</span>
                        <div>
                          <h4 className="font-serif font-bold text-xs leading-tight text-stone-850 dark:text-white">Tablero de Menús de Quincena</h4>
                          <p className="text-[10px] text-stone-400 font-serif">Planes establecidos de Manu y Eve (EvÜ)</p>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {officialMenus.map((plan) => (
                          <div
                            key={plan.id}
                            className="p-3 bg-stone-50/50 dark:bg-stone-850/60 rounded-xl border border-warm-150 dark:border-stone-800 space-y-2 hover:border-amber-500/50 dark:hover:border-amber-500/55 transition-all text-xs"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h5 className="font-bold text-[11px] text-stone-850 dark:text-neutral-100 leading-tight font-serif">{plan.title}</h5>
                                <p className="text-[9px] text-amber-900 dark:text-amber-500 font-semibold font-mono mt-0.5">
                                  {plan.startDate} al {plan.endDate}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteOfficialMenu(plan.id)}
                                className="text-stone-400 hover:text-red-500 p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                                title="Eliminar quincena del tablero"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-warm-150/40 text-[10px]">
                              <span className="text-stone-400 font-mono">Días: {plan.menu?.length || 0}</span>
                              <button
                                type="button"
                                onClick={() => loadOfficialMenu(plan)}
                                className="px-2 py-0.5 bg-amber-100/70 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 rounded font-semibold transition-all scale-100 active:scale-95 cursor-pointer text-[9px]"
                              >
                                📂 Cargar Plan Activo
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meals prep office friendly tips */}
                  <div className="bg-gradient-to-br from-amber-800/10 via-amber-900/5 to-stone-50 dark:from-stone-900/40 dark:to-stone-900/20 p-5 rounded-2xl border border-warm-200 dark:border-stone-800 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-amber-900 dark:text-amber-500">
                      <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
                      <span>Meal Prep para Oficina Realista</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Elegir guisados con salsas caseras de tomate o bistec encebollado asegura que el plato mantenga toda su humedad al recalentarse en el microondas de la oficina, previniendo carnes resecas desabridas.
                    </p>
                  </div>

                </div>

              </div>

              {/* RECETARIO COMPLETO DE MINIMO 100 RECETAS */}
              <div className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-warm-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-900 dark:text-amber-500" />
                    <div>
                      <h3 className="font-serif font-bold text-lg leading-tight">El Recetario Real de mi Abuela [+100 Recetas]</h3>
                      <p className="text-[11px] text-stone-400">Comida práctica de hogar, rústica, salvadoreña y latina auténtica</p>
                    </div>
                  </div>

                  {/* Search and Category filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar almuerzo..."
                        value={recipeSearch}
                        onChange={(e) => setRecipeSearch(e.target.value)}
                        className="px-2.5 py-1.5 pl-7 border rounded-lg text-xs dark:bg-stone-800 dark:border-stone-700 dark:text-white border-warm-200 focus:outline-none"
                      />
                      <Search className="h-3.5 w-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    </div>

                    <select
                      value={selectedRecetarioCategory}
                      onChange={(e) => setSelectedRecetarioCategory(e.target.value)}
                      className="px-2.5 py-1.5 border rounded-lg text-xs dark:bg-stone-800 dark:border-stone-700 border-warm-200 cursor-pointer focus:outline-none"
                    >
                      <option value="Todos">Todas las Categorías</option>
                      <option value="Desayunos">Desayunos</option>
                      <option value="Almuerzos">Almuerzos</option>
                      <option value="Cenas">Cenas</option>
                      <option value="Snacks">Snacks / Antojos</option>
                      <option value="Comida Salvadoreña">Comida Salvadoreña Típica</option>
                      <option value="Comida Casera">Comida Casera de Rancho</option>
                      <option value="Opciones Saludables">Opciones Saludables reales</option>
                      <option value="Comida para Oficina">Para llevar a Oficina</option>
                      <option value="Comida Económica">Comida Económica de Mercado</option>
                    </select>
                  </div>
                </div>

                {/* VISUAL LAYOUT OF THOSE RECIPES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allOneHundredRecipes
                    .filter((rec) => {
                      if (selectedRecetarioCategory !== 'Todos' && rec.category !== selectedRecetarioCategory) return false;
                      if (recipeSearch && !rec.title.toLowerCase().includes(recipeSearch.toLowerCase())) return false;
                      return true;
                    })
                    .slice(0, 16) // Limit visual render to top 16 performance friendly
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-stone-50 dark:bg-stone-900 rounded-xl border border-warm-200 dark:border-stone-850 overflow-hidden flex flex-col justify-between"
                      >
                        <div
                          className="h-32 bg-cover bg-center"
                          style={{ backgroundImage: `url(${rec.image})` }}
                        />
                        <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-amber-800 dark:text-amber-500 uppercase tracking-wider font-bold">
                              {rec.category}
                            </span>
                            <h4 className="font-serif font-bold text-xs text-stone-850 dark:text-white line-clamp-2">
                              {rec.title}
                            </h4>
                          </div>

                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-warm-200/40 text-[10px] font-mono text-stone-500">
                            <span>⏱️ {rec.time}</span>
                            <span>🔥 {rec.calories} kcal</span>
                          </div>

                          {/* Trigger full popup recipe info */}
                          <button
                            onClick={() => setViewedRecipe(rec)}
                            className="w-full mt-3 py-1.5 bg-white dark:bg-stone-800 border border-warm-200 dark:border-stone-750 text-stone-700 dark:text-stone-200 rounded-md text-[11px] font-semibold hover:border-amber-900 cursor-pointer text-center"
                          >
                            Ver Receta Completa
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="bg-stone-50/50 p-3 rounded-xl border text-center text-xs text-stone-500 font-serif">
                  * Mostrando 16 resultados principales por eficiencia del navegador. Busquen platillos específicos arriba. Total: 100 deliciosas recetas listas en catálogo.
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              VIEW 4.5: COMIDA INSTANTÁNEA (RECETAS EXPRÉS AL INSTANTE)
              ========================================== */}
          {activeTab === 'instantanea' && (
            <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
              
              {/* Encabezado Principal */}
              <div className="border-b border-warm-150 dark:border-warm-850 pb-4">
                <span className="text-xs text-amber-800 dark:text-amber-500 uppercase tracking-widest font-bold flex items-center gap-1">
                  <Flame className="h-4 w-4 text-amber-600 animate-pulse" /> Cocina Express Inteligente
                </span>
                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-white mt-1">Recetas Express al Instante</h2>
                <p className="text-xs text-stone-500 mt-1">¿Tienen ingredientes al límite en la refrigeradora o en su despensa? Dígannos qué tienen y Nidi diseñará opciones deliciosas al instante para cocinar juntos con amor. 🍳</p>
              </div>

              {/* Contenedor Principal de Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Panel de Entradas */}
                <div className="lg:col-span-1 bg-white/60 dark:bg-stone-900/40 rounded-2xl p-5 border border-warm-200 dark:border-stone-800 space-y-5 h-fit shadow-sm">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase font-mono font-bold text-stone-500 dark:text-warm-400 block pb-0.5">
                      Ingredientes que tienen:
                    </label>
                    <textarea
                      value={instantIngredients}
                      onChange={(e) => setInstantIngredients(e.target.value)}
                      placeholder="Ej. plátano, frijoles, queso, aguacate, tortillas..."
                      className="w-full h-24 p-3 rounded-xl border border-warm-200 dark:border-stone-750 bg-white/50 dark:bg-stone-950 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition"
                    />
                  </div>

                  {/* Atajos Rápidos de Ingredientes */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">Atajos Rápidos:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Plátano', 'Frijoles rojos', 'Quesillo', 'Huevos', 'Tortillas', 'Aguacate', 'Pollo', 'Tomate', 'Crema', 'Chorizo', 'Cebolla', 'Arroz izquierdo'].map((ing) => {
                        const hasIng = instantIngredients.toLowerCase().includes(ing.toLowerCase());
                        return (
                          <button
                            key={ing}
                            type="button"
                            onClick={() => {
                              setInstantIngredients(prev => {
                                const list = prev.split(',').map(s => s.trim()).filter(Boolean);
                                if (!list.some(item => item.toLowerCase() === ing.toLowerCase())) {
                                  list.push(ing);
                                }
                                return list.join(', ');
                              });
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                              hasIng
                                ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-400 font-semibold'
                                : 'bg-warm-50 dark:bg-stone-800/40 border-warm-200 dark:border-stone-850 text-stone-600 dark:text-stone-400 hover:bg-warm-100 dark:hover:bg-stone-850'
                            }`}
                          >
                            + {ing}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tipo de comida */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">¿Qué momento del día?</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Al gusto', 'Desayuno', 'Almuerzo'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInstantMealType(type)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] border font-semibold text-center transition cursor-pointer ${
                            instantMealType === type
                              ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                              : 'bg-warm-50 dark:bg-stone-800/10 border-warm-200 dark:border-stone-850 text-stone-600 dark:text-stone-400 hover:bg-warm-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                      {['Cena', 'Snack', 'Postre'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInstantMealType(type)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] border font-semibold text-center transition cursor-pointer ${
                            instantMealType === type
                              ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                              : 'bg-warm-50 dark:bg-stone-800/10 border-warm-200 dark:border-stone-850 text-stone-600 dark:text-stone-400 hover:bg-warm-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tiempo límite */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">Tiempo máximo disponible:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['10 min', '20 min', '30+ min'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setInstantTimeLimit(time)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] border font-semibold text-center transition cursor-pointer ${
                            instantTimeLimit === time
                              ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                              : 'bg-warm-50 dark:bg-stone-800/10 border-warm-200 dark:border-stone-850 text-stone-600 dark:text-stone-400 hover:bg-warm-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          ⏰ {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botón de Acción Principal */}
                  <button
                    type="button"
                    onClick={generateInstantRecipes}
                    disabled={instantLoading}
                    className="w-full py-2.5 bg-amber-900 text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition shadow-md shadow-amber-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {instantLoading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>Nidi cocinando ideas...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4.5 w-4.5" />
                        <span>Idear 3 Recetas Al Instante</span>
                      </>
                    )}
                  </button>

                  {instantError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-xs flex flex-col gap-1">
                      <p className="font-semibold">⚠️ Ocurrió una inconsistencia:</p>
                      <p className="text-[11px] font-sans leading-relaxed">{instantError}</p>
                    </div>
                  )}
                </div>

                {/* Panel de Resultados */}
                <div className="lg:col-span-2 space-y-5">
                  {instantLoading ? (
                    <div className="bg-white/40 dark:bg-stone-900/40 rounded-2xl p-12 border border-warm-200 dark:border-stone-800 text-center flex flex-col items-center justify-center gap-4 shadow-sm animate-pulse">
                      <div className="relative">
                        <Flame className="h-10 w-10 text-amber-700 dark:text-amber-500 animate-bounce" />
                        <span className="absolute -top-1.5 -right-1 text-sm">✨</span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-white">Formulando magia en la cocina...</h3>
                      <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                        Nidi está analizando la combinación de ingredientes típicos y calculando tiempos de cocción para darles los mejores consejos express rústicos. Un momento por favor...
                      </p>
                    </div>
                  ) : instantRecipes.length === 0 ? (
                    <div className="bg-white/40 dark:bg-stone-900/40 rounded-2xl p-10 border border-warm-200 dark:border-stone-800 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
                      <div className="p-3 rounded-full bg-amber-500/10 text-amber-900 dark:bg-stone-800">
                        <Utensils className="h-8 w-8 text-amber-700 dark:text-amber-500" />
                      </div>
                      <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-white">¡Lista de Ingredientes Vacía!</h3>
                      <p className="text-xs text-stone-500 max-w-md leading-relaxed">
                        Denle una lista de lo que tienen listo en la refri en la barra de la izquierda, elijan un momento favorito, ¡y Nidi les presentará un menú de 3 platos express listos para devorar y compartir en su Nido!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5 animate-fadeIn">
                      
                      {/* Cabecera Informativa */}
                      <div className="bg-gradient-to-r from-amber-900/5 to-transparent border-l-4 border-amber-900 p-4 rounded-r-xl text-stone-700 dark:text-stone-300 text-xs">
                        <span className="font-bold block text-amber-900 dark:text-amber-550 mb-0.5">🍳 ¡La cocina inteligente del Nido está encendida!</span>
                        Chef Nidi les sugiere estas 3 increíbles ideas del momento. Cada plato incluye un listado con los ingredientes indispensables más ideas de despensa, y lo mejor: ¡sus pasos interactivos para que los preparen juntos y rían mientras cocinan! (Se otorgaron puntos de racha de pareja al formular este menú).
                      </div>

                      {/* Listado de 3 recetas */}
                      <div className="grid grid-cols-1 gap-6">
                        {instantRecipes.map((recipe, idx) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-stone-900 border border-warm-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                          >
                            {/* Titulo & Metadata */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-warm-100 dark:border-stone-800/80 pb-3">
                              <div>
                                <h3 className="font-serif font-bold text-lg text-amber-900 dark:text-amber-400">{recipe.title}</h3>
                                <span className="text-[10.5px] text-stone-500 mt-0.5 block flex items-center gap-1.5 uppercase font-mono">
                                  <span>🚀 Nivel: <strong>{recipe.difficulty}</strong></span>
                                  <span className="text-stone-300">•</span>
                                  <span>⏱️ Preparación: <strong>{recipe.prepTime}</strong></span>
                                </span>
                              </div>
                            </div>

                            {/* Ingredientes Usados y Extras */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-warm-50/50 dark:bg-stone-950 p-3 rounded-xl border border-warm-150/40 dark:border-stone-850">
                              <div>
                                <span className="text-[10px] uppercase font-mono font-bold text-stone-550 dark:text-warm-400 block mb-1">Ingredientes de su Refri Usados:</span>
                                <div className="flex flex-wrap gap-1">
                                  {recipe.ingredientsUsed?.map((ing: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-955/40 text-amber-900 dark:text-amber-400 rounded-md text-[10px] font-semibold">
                                      ✓ {ing}
                                    </span>
                                  )) || <span className="italic text-stone-400">Ninguno reportado</span>}
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-mono font-bold text-stone-550 dark:text-warm-400 block mb-1">Extras de despensa requeridos:</span>
                                <div className="flex flex-wrap gap-1">
                                  {recipe.extraIngredients?.map((ing: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-md text-[10px]">
                                      + {ing}
                                    </span>
                                  )) || <span className="italic text-stone-400">Solo básicos de cocina</span>}
                                </div>
                              </div>
                            </div>

                            {/* Pasos a Seguir con Estado Interactivo de Checklist */}
                            <div className="space-y-2">
                              <span className="text-[11px] uppercase font-mono font-bold text-stone-400 block">Pasos Rápidos de Preparación (¡Crucen para completar!):</span>
                              <div className="space-y-2">
                                {recipe.steps?.map((step: string, i: number) => {
                                  return (
                                    <label
                                      key={i}
                                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900 text-xs text-stone-700 dark:text-stone-300 cursor-pointer select-none border border-transparent hover:border-warm-100/50 transition-all"
                                    >
                                      <input
                                        type="checkbox"
                                        className="mt-0.5 h-3.5 w-3.5 rounded border-warm-300 text-amber-700 focus:ring-amber-500 rounded-sm"
                                      />
                                      <span className="leading-relaxed">{step}</span>
                                    </label>
                                  );
                                }) || <p className="italic text-xs text-stone-400">No se detallaron pasos para esta propuesta.</p>}
                              </div>
                            </div>

                            {/* Secreto de Nidi Chef */}
                            {recipe.chefSecret && (
                              <div className="bg-amber-950/5 dark:bg-stone-950/20 p-3 rounded-xl border border-amber-900/10 dark:border-amber-900/20 flex gap-2">
                                <span className="text-base select-none shrink-0 text-amber-800">💝</span>
                                <div className="space-y-0.5">
                                  <span className="text-[10px] uppercase font-mono font-bold text-amber-900 dark:text-amber-550">Consejo Romántico de Nidi:</span>
                                  <p className="text-[11px] italic text-stone-700 dark:text-stone-300 leading-relaxed font-serif">"{recipe.chefSecret}"</p>
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              VIEW 5: DETALLED COUPLE PROFILE SYNC SETTINGS
              ========================================== */}
          {activeTab === 'perfil' && (
            <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
              
              <div className="border-b border-warm-150 dark:border-warm-850 pb-4">
                <span className="text-xs text-amber-800 dark:text-amber-500 uppercase tracking-widest font-bold">Configuración</span>
                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-white">Perfil Sincronizado de Pareja</h2>
                <p className="text-xs text-stone-500 mt-1">Sincronicen sus cuentas, ajusten aniversarios y personalicen la paleta visual de Nido.</p>
              </div>

              {/* OPCIONES DE PERSONALIZACIÓN DE COLOR DE PAREJA */}
              <div id="panel-personalizar-tema" className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800 space-y-4 shadow-sm">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-amber-800 dark:text-amber-500" />
                    Personalización del Estilo y Colores
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-warm-400 mt-0.5">Adapten el ambiente cozy de Nido según sus gustos o el momento especial de la semana.</p>
                </div>

                <div className="space-y-3 pt-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-stone-400 dark:text-warm-500 block">Modo de Pantalla</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      id="btn-theme-claro"
                      onClick={() => setTheme('light')}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        theme === 'light'
                          ? 'bg-amber-100 dark:bg-stone-800/80 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 shadow-sm'
                          : 'bg-warm-50/50 dark:bg-stone-800/20 border-warm-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-warm-100/50'
                      }`}
                    >
                      ☀️ Modo Claro
                    </button>
                    <button
                      type="button"
                      id="btn-theme-oscuro"
                      onClick={() => setTheme('dark')}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        theme === 'dark'
                          ? 'bg-amber-100 dark:bg-stone-800/80 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 shadow-sm'
                          : 'bg-warm-50/50 dark:bg-stone-800/20 border-warm-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-warm-100/50'
                      }`}
                    >
                      🌙 Modo Oscuro
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-stone-400 dark:text-warm-500 block">Paleta de Color de Pareja</span>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    {Object.entries(colorPresets).map(([key, value]) => {
                      const isSelected = colorTheme === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          id={`color-preset-${key}`}
                          onClick={() => setColorTheme(key)}
                          className={`p-2.5 rounded-xl border text-[11px] font-medium flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-center ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/50 dark:bg-stone-800/60 font-bold scale-[1.03] shadow-inner'
                              : 'border-warm-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/10 text-stone-600 dark:text-stone-400 hover:border-warm-300'
                          }`}
                        >
                          <div className="flex gap-1" id={`colors-${key}`}>
                            <span className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: value['500'] }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: value['800'] }} />
                          </div>
                          <span>{value.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-6 border border-warm-200 dark:border-stone-800 space-y-6">
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("¡Cambios de perfil y metas de sincronización en la nube guardados con amor! 🌸");
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-mono font-bold text-stone-400 block mb-1">Nombre de Él</label>
                      <input
                        type="text"
                        value={profile.partner1}
                        onChange={(e) => setProfile(p => ({ ...p, partner1: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-xl dark:bg-stone-800 dark:border-stone-700 dark:text-white border-warm-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono font-bold text-stone-400 block mb-1">Nombre de Ella</label>
                      <input
                        type="text"
                        value={profile.partner2}
                        onChange={(e) => setProfile(p => ({ ...p, partner2: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-xl dark:bg-stone-800 dark:border-stone-700 dark:text-white border-warm-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-stone-400 block mb-1">Fecha de Aniversario</label>
                    <input
                      type="date"
                      value={profile.anniversaryDate}
                      onChange={(e) => setProfile(p => ({ ...p, anniversaryDate: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl dark:bg-stone-800 dark:border-stone-700 dark:text-white border-warm-200 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-warm-150 dark:border-stone-850">
                    <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block mb-2">Comienzo de su Aventura</span>
                    <div className="bg-stone-50/50 dark:bg-stone-900/60 p-4 rounded-xl border border-warm-200 dark:border-stone-800 flex flex-col md:flex-row justify-between items-center gap-3">
                      <div className="text-left">
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">Iniciar desde Cero (Recomendado)</span>
                        <p className="text-[10px] text-stone-400 mt-0.5">Limpia los puntos acumulados y racha de simulación (14-16 días) para comenzar con su aventura real hoy.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfile(prev => ({
                            ...prev,
                            points1: 0,
                            points2: 0,
                            streakDays: 0,
                            startedAdventure: true
                          }));
                          setTasks(prev => prev.map(t => ({ ...t, completed: false })));
                          setMenuFeedbackMsg("¡Contadores inicializados! Racha: 0 días, Puntos: 0 pts. ¡Que comience el juego!");
                          setTimeout(() => setMenuFeedbackMsg(null), 5000);
                        }}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-250 dark:bg-amber-900/40 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-semibold cursor-pointer select-none border border-amber-300/35 active:scale-95 transition-all shrink-0"
                      >
                        🔄 Resetear Racha & Puntos a 0
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/50 dark:bg-stone-950/20 rounded-xl border border-dashed border-amber-100/60 leading-relaxed font-serif text-stone-700 dark:text-warm-300">
                    <strong>Sincronización Cloud Activa:</strong> Sus perfiles de {profile.partner1} y {profile.partner2} están enlazados. Cualquier modificación en las lista de supermercado o check de tareas del hogar se reflejará instantáneamente en el dispositivo de tu pareja mediante la red segura.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-900 border border-amber-950 text-white rounded-xl font-semibold text-xs transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    Guardar Cambios de Perfil de Pareja
                  </button>
                </form>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* FLOAT CHATBOT OVERLAY COMPONENT (Nidi assistant) */}
      <ChatbotOverlay />

      {/* ==========================================
          MODALS & FLOATING POPUP DIALOGS 
          ========================================== */}
      
      {/* 1. VIEW RECIPE DIALOG POPUP */}
      {viewedRecipe && (
        <div className="fixed inset-0 bg-stone-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-warm-200 dark:border-stone-800 p-6 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-start border-b pb-2">
              <div>
                <span className="text-[9px] uppercase font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                  {viewedRecipe.category}
                </span>
                <h3 className="text-xl font-serif font-bold mt-1 text-stone-900 dark:text-white leading-snug">
                  {viewedRecipe.title}
                </h3>
              </div>
              <button
                onClick={() => setViewedRecipe(null)}
                className="text-stone-400 hover:text-stone-900 p-1 rounded-md text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <strong className="text-xs uppercase font-mono text-stone-400">Ingredientes Reales:</strong>
              <ul className="list-disc pl-5 text-xs text-stone-600 dark:text-stone-300 space-y-1 font-serif">
                {viewedRecipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 border-t pt-3">
              <strong className="text-xs uppercase font-mono text-stone-400">Instrucciones de Cocina:</strong>
              <ol className="list-decimal pl-5 text-xs text-stone-600 dark:text-stone-300 space-y-2 font-serif leading-relaxed">
                {viewedRecipe.steps.map((stp, i) => (
                  <li key={i}>{stp}</li>
                ))}
              </ol>
            </div>

            <div className="flex justify-between items-center border-t pt-3 text-[11px] font-mono text-stone-400">
              <span>⏱️ Preparación: {viewedRecipe.time}</span>
              <span>Porciones: {viewedRecipe.servings} aprx</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSupermarketList(prev => [...prev, ...viewedRecipe.ingredients.slice(0, 4)]);
                  alert("¡Ingredientes agregados a tu lista de supermercado! 🛒");
                  setViewedRecipe(null);
                }}
                className="flex-1 py-2 bg-amber-900 text-stone-50 rounded-xl text-xs font-semibold hover:bg-stone-850 cursor-pointer"
              >
                🛒 Añadir Ingredientes a la Lista
              </button>
              <button
                onClick={() => setViewedRecipe(null)}
                className="p-2 border border-warm-250 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATIVE ADD TASK DIALOG MODAL */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTask}
            className="bg-white dark:bg-stone-900 border border-warm-200 dark:border-stone-800 p-6 rounded-2xl max-w-sm w-full space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-base">Crear Tarea del Hogar</h3>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="text-stone-400 hover:text-stone-900 p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Nombre de la tarea</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sacar basura o Secar ropa"
                  value={newTask.name}
                  onChange={(e) => setNewTask(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-stone-850 dark:border-stone-750 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Frecuencia</label>
                  <select
                    value={newTask.frequency}
                    onChange={(e) => setNewTask(p => ({ ...p, frequency: e.target.value as any }))}
                    className="w-full px-2.5 py-1.5 border rounded-lg dark:bg-stone-850 dark:border-stone-750"
                  >
                    <option value="Diaria">Diaria</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Personalizada">Personalizada</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Prioridad</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value as any }))}
                    className="w-full px-2.5 py-1.5 border rounded-lg dark:bg-stone-850 dark:border-stone-750"
                  >
                    <option value="Alta">Alta (+30 pts)</option>
                    <option value="Media">Media (+20 pts)</option>
                    <option value="Baja">Baja (+10 pts)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Responsable</label>
                  <select
                    value={newTask.responsable}
                    onChange={(e) => setNewTask(p => ({ ...p, responsable: e.target.value as any }))}
                    className="w-full px-2.5 py-1.5 border rounded-lg dark:bg-stone-850 dark:border-stone-750"
                  >
                    <option value="Él">Él ({profile.partner1})</option>
                    <option value="Ella">Ella ({profile.partner2})</option>
                    <option value="Ambos">Ambos</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Día Semanal</label>
                  <select
                    value={newTask.dayOfWeek || 'Lunes'}
                    onChange={(e) => setNewTask(p => ({ ...p, dayOfWeek: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border rounded-lg dark:bg-stone-850 dark:border-stone-750"
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Tiempo sugerido</label>
                <input
                  type="text"
                  placeholder="Ej: 19:30 o 08:00"
                  value={newTask.suggestedTime}
                  onChange={(e) => setNewTask(p => ({ ...p, suggestedTime: e.target.value }))}
                  className="w-full px-3 py-1.5 border rounded-xl dark:bg-stone-850 dark:border-stone-750"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-900 hover:bg-stone-850 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Añadir Tarea
              </button>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="p-2 border border-warm-250 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. SCHEDULING DATE APPOINTMENT DIALOG MODAL */}
      {showAddAppointmentModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAppointment}
            className="bg-white dark:bg-stone-900 border border-warm-200 dark:border-stone-800 p-6 rounded-2xl max-w-sm w-full space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-base">Planificar Nueva Cita</h3>
              <button
                type="button"
                onClick={() => setShowAddAppointmentModal(false)}
                className="text-stone-400 hover:text-stone-900 p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Título de la Cita</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Picnic en la azotea o Cena en El Boquerón"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-stone-850 dark:border-stone-750 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-1.5 border rounded-xl dark:bg-stone-850 dark:border-stone-750 text-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Hora</label>
                  <input
                    type="text"
                    placeholder="Ej: 19:30"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment(p => ({ ...p, time: e.target.value }))}
                    className="w-full px-3 py-1.5 border rounded-xl dark:bg-stone-850 dark:border-stone-750"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Mood sugerido</label>
                  <select
                    value={newAppointment.mood}
                    onChange={(e) => setNewAppointment(p => ({ ...p, mood: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border rounded-lg dark:bg-stone-850 dark:border-stone-750"
                  >
                    <option value="Romántica">Romántica</option>
                    <option value="Love">Love</option>
                    <option value="Divertida">Divertida</option>
                    <option value="Relajante">Relajante</option>
                    <option value="Gaming Night">Gaming Night</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-stone-600 dark:text-stone-350">Ubicación</label>
                  <input
                    type="text"
                    placeholder="Ej: Antiguo Cuscatlán o En Casa"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-3 py-1.5 border rounded-xl dark:bg-stone-850 dark:border-stone-750"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-900 hover:bg-stone-850 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Guardar Cita
              </button>
              <button
                type="button"
                onClick={() => setShowAddAppointmentModal(false)}
                className="p-2 border border-warm-250 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
