// @ts-nocheck
/**
 * Adım Adım - Zustand Global Durum Yönetimi
 * React Native & Expo Mobil Uygulaması İçin State Store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Task, FocusSession, TimerState, DailyStat } from './types';

interface AppState {
  // Veri Durumu (State)
  user: UserProfile;
  tasks: Task[];
  sessions: FocusSession[];
  timer: TimerState;
  dailyStats: DailyStat[];
  currentStreak: number;

  // Görev Eylemleri (Task Actions)
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskNotes: (id: string, notes: string) => void;

  // Zamanlayıcı Eylemleri (Timer Actions)
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setTimerMode: (mode: 'work' | 'break') => void;
  setTimerDuration: (minutes: number) => void;
  selectTask: (taskId: string | null) => void;
  completeSession: (notes: string) => void;

  // Profil Eylemleri
  updateUserName: (name: string) => void;
  resetProgress: () => void;
}

// Başlangıç Değerleri
const initialUser: UserProfile = {
  id: '1',
  name: 'Can Demir',
  title: 'Odaklanma Ustası',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  streakRecord: 14,
  totalFocusTime: 185 * 60, // Saniye cinsinden saklayıp arayüzde saate çeviriyoruz
  completedTasksCount: 752,
  achievements: [
    { id: '1', title: 'Seri Başlangıcı', description: 'İlk odaklanma oturumunu tamamla.', unlocked: true, unlockedAt: '2026-05-25', icon: 'zap' },
    { id: '2', title: 'Odak Kahramanı', description: 'Tek seferde 50 dakika odaklan.', unlocked: true, unlockedAt: '2026-05-26', icon: 'award' },
    { id: '3', title: 'Planlama Dehası', description: 'Aynı gün içinde 5 görev tamamla.', unlocked: true, unlockedAt: '2026-05-28', icon: 'clipboard' },
    { id: '4', title: 'Zaman Sihirbazı', description: 'Haftalık 30 saat odak süresine ulaş.', unlocked: false, icon: 'clock' },
    { id: '5', title: 'Erken Kalkan', description: 'Sabah 08:00\'den önce odaklanma oturumu yap.', unlocked: true, unlockedAt: '2026-05-29', icon: 'sun' },
    { id: '6', title: 'Odak Uzmanı', description: 'Toplamda 200 saat odaklanmaya ulaş.', unlocked: false, icon: 'shield' },
  ]
};

const initialDailyStats: DailyStat[] = [
  { day: 'Pzt', focusHours: 6.8, tasksCompleted: 5 },
  { day: 'Sal', focusHours: 4.5, tasksCompleted: 3 },
  { day: 'Çar', focusHours: 7.1, tasksCompleted: 6 },
  { day: 'Per', focusHours: 5.8, tasksCompleted: 4 },
  { day: 'Cum', focusHours: 3.2, tasksCompleted: 2 },
  { day: 'Cmt', focusHours: 2.1, tasksCompleted: 1 },
  { day: 'Paz', focusHours: 0.0, tasksCompleted: 0 },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      tasks: [
        { id: 't1', title: 'Tasarım spesifikasyonlarını tamamla', completed: true, notes: 'Gereksinimler belgelendi.', createdAt: '2026-05-30T10:00:00Z' },
        { id: 't2', title: 'Pazarlama e-postasını taslak hale getir', completed: false, notes: '', createdAt: '2026-05-30T11:00:00Z' },
        { id: 't3', title: 'Adım Adım ilerleme ikonunu tasarla', completed: false, notes: '', createdAt: '2026-05-30T12:00:00Z' },
        { id: 't4', title: 'Zustand store entegrasyonu yap', completed: true, notes: 'Zustand test edildi, sorunsuz çalışıyor.', createdAt: '2026-05-30T09:00:00Z' },
      ],
      sessions: [],
      timer: {
        duration: 25 * 60, // 25 dakika varsayılan
        timeLeft: 25 * 60,
        isRunning: false,
        mode: 'work',
        selectedTaskId: null,
      },
      dailyStats: initialDailyStats,
      currentStreak: 7,

      // --- GÖREV EYLEMLERİ ---
      addTask: (title: string) => {
        const newTask: Task = {
          id: Date.now().toString(),
          title,
          completed: false,
          notes: '',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      toggleTask: (id: string) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          );
          
          // Tamamlanan görev sayısını güncelle
          const completedCount = updatedTasks.filter((t) => t.completed).length;
          const diff = completedCount - state.tasks.filter((t) => t.completed).length;
          
          // Günün istatistiğine ekle
          const todayIndex = new Date().getDay(); // 0 Paz, 1 Pzt...
          // Dizide Pzt index 0, Paz index 6 olması için hesapla
          const arrayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
          const updatedStats = [...state.dailyStats];
          if (updatedStats[arrayIndex]) {
            updatedStats[arrayIndex].tasksCompleted = Math.max(0, updatedStats[arrayIndex].tasksCompleted + diff);
          }

          return {
            tasks: updatedTasks,
            user: {
              ...state.user,
              completedTasksCount: Math.max(0, state.user.completedTasksCount + diff),
            },
            dailyStats: updatedStats,
          };
        });
      },

      deleteTask: (id: string) => {
        set((state) => {
          const taskToDelete = state.tasks.find((t) => t.id === id);
          const wasCompleted = taskToDelete?.completed || false;
          return {
            tasks: state.tasks.filter((task) => task.id !== id),
            user: {
              ...state.user,
              completedTasksCount: wasCompleted
                ? Math.max(0, state.user.completedTasksCount - 1)
                : state.user.completedTasksCount,
            }
          };
        });
      },

      updateTaskNotes: (id: string, notes: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, notes } : task
          ),
        }));
      },

      // --- ZAMANLAYICI EYLEMLERİ ---
      startTimer: () => {
        set((state) => ({
          timer: { ...state.timer, isRunning: true },
        }));
      },

      pauseTimer: () => {
        set((state) => ({
          timer: { ...state.timer, isRunning: false },
        }));
      },

      resetTimer: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: false,
            timeLeft: state.timer.duration,
          },
        }));
      },

      tick: () => {
        const { timer, completeSession } = get();
        if (!timer.isRunning) return;

        if (timer.timeLeft <= 1) {
          // Timer bittiğinde otomatik durdur ve seansı kaydet
          set((state) => ({
            timer: {
              ...state.timer,
              isRunning: false,
              timeLeft: 0,
            },
          }));
          completeSession("Oturum başarıyla tamamlandı.");
        } else {
          set((state) => ({
            timer: {
              ...state.timer,
              timeLeft: state.timer.timeLeft - 1,
            },
          }));
        }
      },

      setTimerMode: (mode: 'work' | 'break') => {
        const duration = mode === 'work' ? 25 * 60 : 5 * 60;
        set((state) => ({
          timer: {
            ...state.timer,
            mode,
            duration,
            timeLeft: duration,
            isRunning: false,
          },
        }));
      },

      setTimerDuration: (minutes: number) => {
        const duration = minutes * 60;
        set((state) => ({
          timer: {
            ...state.timer,
            duration,
            timeLeft: duration,
            isRunning: false,
          },
        }));
      },

      selectTask: (taskId: string | null) => {
        set((state) => ({
          timer: {
            ...state.timer,
            selectedTaskId: taskId,
          },
        }));
      },

      completeSession: (notes: string) => {
        const { timer, tasks, user, dailyStats } = get();
        
        let taskTitle = undefined;
        if (timer.selectedTaskId) {
          const associatedTask = tasks.find((t) => t.id === timer.selectedTaskId);
          taskTitle = associatedTask?.title;
        }

        const newSession: FocusSession = {
          id: Date.now().toString(),
          taskId: timer.selectedTaskId || undefined,
          taskTitle,
          duration: timer.duration,
          date: new Date().toISOString().split('T')[0],
          notes,
        };

        // Toplam odaklanma süresini (saat) güncelle
        const SessionMinutes = Math.round(timer.duration / 60);
        const updatedTotalFocus = user.totalFocusTime + SessionMinutes;

        // Günlük İstatistiğe odaklanma süresini ekle (Pzt-Paz)
        const todayIndex = new Date().getDay();
        const arrayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
        const updatedStats = [...dailyStats];
        
        if (updatedStats[arrayIndex]) {
          updatedStats[arrayIndex].focusHours = parseFloat(
            (updatedStats[arrayIndex].focusHours + SessionMinutes / 60).toFixed(1)
          );
        }

        // Eğer seçili görev varsa ve çalışma modundaysa isteğe bağlı tamamlanabilir
        let updatedTasks = [...tasks];
        if (timer.selectedTaskId && timer.mode === 'work') {
          updatedTasks = tasks.map(t => 
            t.id === timer.selectedTaskId ? { ...t, completed: true, notes: notes || t.notes } : t
          );
        }

        // Başarı Kilitleri Kontrolü (Örn: Zaman sihirbazı kilidi)
        const updatedAchievements = user.achievements.map((ach) => {
          if (ach.id === '4' && !ach.unlocked && updatedTotalFocus >= 30 * 60) {
            return { ...ach, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
          }
          if (ach.id === '6' && !ach.unlocked && updatedTotalFocus >= 200 * 60) {
            return { ...ach, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
          }
          return ach;
        });

        // Başarı kapağında rozet kilit açma bildirimi veya toast mobil tarafta tetiklenebilir

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          tasks: updatedTasks,
          user: {
            ...user,
            totalFocusTime: updatedTotalFocus,
            completedTasksCount: timer.selectedTaskId ? user.completedTasksCount + 1 : user.completedTasksCount,
            achievements: updatedAchievements,
          },
          dailyStats: updatedStats,
          // Modu değiştir
          timer: {
            ...state.timer,
            mode: timer.mode === 'work' ? 'break' : 'work',
            duration: timer.mode === 'work' ? 5 * 60 : 25 * 60,
            timeLeft: timer.mode === 'work' ? 5 * 60 : 25 * 60,
            isRunning: false,
            selectedTaskId: null,
          }
        }));
      },

      // --- PROFİL EYLEMLERİ ---
      updateUserName: (name: string) => {
        set((state) => ({
          user: { ...state.user, name },
        }));
      },

      resetProgress: () => {
        set(() => ({
          user: {
            ...initialUser,
            name: get().user.name, // İsmi koru
          },
          tasks: [
            { id: 't1', title: 'Tasarım spesifikasyonlarını tamamla', completed: false, notes: '', createdAt: '2026-05-30T10:00:00Z' },
            { id: 't2', title: 'Pazarlama e-postasını taslak hale getir', completed: false, notes: '', createdAt: '2026-05-30T11:00:00Z' },
          ],
          sessions: [],
          timer: {
            duration: 25 * 60,
            timeLeft: 25 * 60,
            isRunning: false,
            mode: 'work',
            selectedTaskId: null,
          },
          dailyStats: initialDailyStats.map(s => ({ ...s, focusHours: 0, tasksCompleted: 0 })),
          currentStreak: 1,
        }));
      }
    }),
    {
      name: 'adim-adim-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Sadece kalıcı olmasını istediğimiz kısımları filtreleyebiliriz
      partialize: (state) => ({
        user: state.user,
        tasks: state.tasks,
        sessions: state.sessions,
        currentStreak: state.currentStreak,
        dailyStats: state.dailyStats,
      }),
    }
  )
);
