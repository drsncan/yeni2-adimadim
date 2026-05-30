/**
 * Adım Adım - TypeScript Interfaces & Types
 * React Native & Expo Mobil Uygulaması İçin Tip Tanımlamaları
 */

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatar: string; // Avatar URL veya yerel görsel ismi
  streakRecord: number; // En yüksek seri rekoru (gün)
  totalFocusTime: number; // Toplam odaklanma süresi (dakika)
  completedTasksCount: number; // Tamamlanan toplam görev sayısı
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string; // Lucide / Expo Vector Icon adı
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  notes: string;
  createdAt: string; // ISO Tarih String'i
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  duration: number; // Odaklanılan süre (saniye cinsinden)
  date: string; // YYYY-MM-DD formatında tarih
  notes: string; // Odaklanma sırasında alınan notlar
}

export interface TimerState {
  duration: number; // Toplam süre (saniye)
  timeLeft: number; // Kalan süre (saniye)
  isRunning: boolean;
  mode: 'work' | 'break'; // 'work' (çalışma) veya 'break' (mola)
  selectedTaskId: string | null;
}

export interface DailyStat {
  day: string; // Örn: 'Pzt', 'Sal', 'Çar...'
  focusHours: number; // Odaklanma saati
  tasksCompleted: number; // Tamamlanan görev sayısı
}
