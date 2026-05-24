export type TaskPriority = 'Alta' | 'Media' | 'Baja';
export type TaskFrecuency = 'Diaria' | 'Semanal' | 'Mensual' | 'Personalizada';
export type TaskResponsable = 'Él' | 'Ella' | 'Ambos';

export interface CoupleTask {
  id: string;
  name: string;
  frequency: TaskFrecuency;
  priority: TaskPriority;
  suggestedTime: string;
  responsable: TaskResponsable;
  duration: string; // e.g. "30 min"
  autoRepeat: boolean;
  completed: boolean;
  completedAt?: string;
  scorePoints: number;
  dayOfWeek?: string; // Day of the week: "Lunes", "Martes", etc.
}

export interface DateAppointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  mood?: string;
  location?: string;
  notes?: string;
  completed: boolean;
}

export interface SavedDateIdea {
  id: string;
  name: string;
  description: string;
  atmosphere: string;
  playlist: string;
  foodIdeas: string;
  games: string;
  estimatedTime: string;
  budget: string;
  preparationLevel: string;
  status: 'guardada' | 'para_luego' | 'completada';
}

export interface DayMenu {
  day: string; // e.g., "Día 1", "Lunes"
  desayuno: {
    title: string;
    description: string;
    reutilizacion: string;
  };
  almuerzo: {
    title: string;
    description: string;
    reutilizacion: string;
  };
  cena: {
    title: string;
    description: string;
    reutilizacion: string;
  };
}

export interface CoupleProfile {
  partner1: string;
  partner2: string;
  anniversaryDate: string; // YYYY-MM-DD
  points1: number;
  points2: number;
  streakDays: number;
  startedAdventure?: boolean;
  lastActivityDate?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface OfficialMenu {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  menu: DayMenu[];
  supermarketList: string[];
  createdAt: string;
}

