export const EXPO_INSTALL_GUIDE = `# 🚀 Adım Adım- React Native & Expo Kurulum Rehberi

Bu adım, "Adım Adım" odaklanma ve verimlilik uygulamasını yerel bilgisayarınızda veya mobil cihazınızda (iOS/Android emülatör veya gerçek telefon) çalıştırmak için izlemeniz gereken adımları içerir.

## 1. Yeni Bir Expo TypeScript Projesi Oluşturma
Terminalinizi açın ve aşağıdaki komutla yeni bir Expo TypeScript projesi başlatın:
\`\`\`bash
npx create-expo-app@latest AdimAdim --template blank-typescript
cd AdimAdim
\`\`\`

## 2. Gerekli Kütüphanelerin Kurulumu
Uygulamanın navigasyon hiyerarşisi ve Zustand durum yönetimi için gerekli paketleri yükleyin:
\`\`\`bash
# Navigasyon Kütüphaneleri
npm install @react-navigation/native @react-navigation/bottom-tabs

# Navigasyon Bağımlılıkları (Expo CLI optimize edilmiş sürümler için)
npx expo install react-native-screens react-native-safe-area-context

# Zustand ve Kalıcı Kayıt (Storage) Bağımlılıkları
npm install zustand
npx expo install @react-native-async-storage/async-storage

# Gelişmiş İkonlar ve Stiller (İsteğe bağlı)
npm install lucide-react-native
\`\`\`

## 3. Kod Dosyası Düzeni
Oluşturduğunuz Expo projesinin dizin yapısını aşağıdaki gibi kurun:
\`\`\`text
AdimAdim/
├── App.tsx             # Ana uygulama navigasyon dosyası
└── src/
    ├── store.ts        # Zustand durum yönetim mağazası
    ├── types.ts        # TypeScript tip tanımları
    └── screens/
        ├── HomeScreen.tsx    # Ana Sayfa / Görevler Ekranı
        ├── FocusScreen.tsx   # Pomodoro Geri Sayım Ekranı
        ├── StatsScreen.tsx   # Grafik ve Analizler Ekranı
        └── ProfileScreen.tsx # Üye Profili ve Başarı Rozetleri
\`\`\`

## 4. Dosyaları Kopyalama
Yandaki dosya sekmelerinden kopyaladığınız kodları ilgili dosya yollarına yapıştırın.

## 5. Uygulamayı Başlatma
Proje klasörünüzde terminalden projeyi başlatın:
\`\`\`bash
npx expo start
\`\`\`

### Çalıştırma Metotları:
* **Gerçek Cihazda Deneme**: Telefonunuza App Store veya Google Play Store'dan **"Expo Go"** uygulamasını indirin. Terminalde beliren QR kodu telefonunuzun kamerası (iOS) veya Expo Go (Android) ile taratın.
* **Android Emülatör**: Bilgisayarınızda Android Studio emülatörü açıkken terminalde **"a"** tuşuna basın.
* **iOS Simülatör (Sadece macOS)**: Bilgisayarınızda Xcode simülatörü etkinken terminalde **"i"** tuşuna basın.
`;

export const TYPES_CODE = `/**
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
`;

export const STORE_CODE = `/**
 * Adım Adım - Zustand Global Durum Yönetimi
 * React Native & Expo Mobil Uygulaması İçin State Store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Task, FocusSession, TimerState, DailyStat } from './types';

interface AppState {
  user: UserProfile;
  tasks: Task[];
  sessions: FocusSession[];
  timer: TimerState;
  dailyStats: DailyStat[];
  currentStreak: number;

  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskNotes: (id: string, notes: string) => void;

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setTimerMode: (mode: 'work' | 'break') => void;
  setTimerDuration: (minutes: number) => void;
  selectTask: (taskId: string | null) => void;
  completeSession: (notes: string) => void;

  updateUserName: (name: string) => void;
  resetProgress: () => void;
}

const initialUser: UserProfile = {
  id: '1',
  name: 'Can Demir',
  title: 'Odaklanma Ustası',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  streakRecord: 14,
  totalFocusTime: 185 * 60,
  completedTasksCount: 752,
  achievements: [
    { id: '1', title: 'Seri Başlangıcı', description: 'İlk odaklanma oturumunu tamamla.', unlocked: true, unlockedAt: '2026-05-25', icon: 'zap' },
    { id: '2', title: 'Odak Kahramanı', description: 'Tek seferde 50 dakika odaklan.', unlocked: true, unlockedAt: '2026-05-26', icon: 'award' },
    { id: '3', title: 'Planlama Dehası', description: 'Aynı gün içinde 5 görev tamamla.', unlocked: true, unlockedAt: '2026-05-28', icon: 'clipboard' },
    { id: '4', title: 'Zaman Sihirbazı', description: 'Haftalık 30 saat odak süresine ulaş.', unlocked: false, icon: 'clock' },
    { id: '5', title: 'Erken Kalkan', description: 'Sabah 08:00\\'den önce odaklanma oturumu yap.', unlocked: true, unlockedAt: '2026-05-29', icon: 'sun' },
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
        duration: 25 * 60,
        timeLeft: 25 * 60,
        isRunning: false,
        mode: 'work',
        selectedTaskId: null,
      },
      dailyStats: initialDailyStats,
      currentStreak: 7,

      addTask: (title: string) => {
        const newTask: Task = {
          id: Date.now().toString(),
          title,
          completed: false,
          notes: '',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      toggleTask: (id: string) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          );
          const completedCount = updatedTasks.filter((t) => t.completed).length;
          const diff = completedCount - state.tasks.filter((t) => t.completed).length;
          
          const todayIndex = new Date().getDay();
          const arrayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
          const updatedStats = [...state.dailyStats];
          if (updatedStats[arrayIndex]) {
            updatedStats[arrayIndex].tasksCompleted = Math.max(0, updatedStats[arrayIndex].tasksCompleted + diff);
          }

          return {
            tasks: updatedTasks,
            user: { ...state.user, completedTasksCount: Math.max(0, state.user.completedTasksCount + diff) },
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
            user: { ...state.user, completedTasksCount: wasCompleted ? Math.max(0, state.user.completedTasksCount - 1) : state.user.completedTasksCount }
          };
        });
      },

      updateTaskNotes: (id: string, notes: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) => task.id === id ? { ...task, notes } : task),
        }));
      },

      startTimer: () => set((state) => ({ timer: { ...state.timer, isRunning: true } })),
      pauseTimer: () => set((state) => ({ timer: { ...state.timer, isRunning: false } })),
      resetTimer: () => set((state) => ({ timer: { ...state.timer, isRunning: false, timeLeft: state.timer.duration } })),

      tick: () => {
        const { timer, completeSession } = get();
        if (!timer.isRunning) return;

        if (timer.timeLeft <= 1) {
          set((state) => ({ timer: { ...state.timer, isRunning: false, timeLeft: 0 } }));
          completeSession("Oturum başarıyla tamamlandı.");
        } else {
          set((state) => ({ timer: { ...state.timer, timeLeft: state.timer.timeLeft - 1 } }));
        }
      },

      setTimerMode: (mode: 'work' | 'break') => {
        const duration = mode === 'work' ? 25 * 60 : 5 * 60;
        set((state) => ({
          timer: { ...state.timer, mode, duration, timeLeft: duration, isRunning: false },
        }));
      },

      setTimerDuration: (minutes: number) => {
        const duration = minutes * 60;
        set((state) => ({
          timer: { ...state.timer, duration, timeLeft: duration, isRunning: false },
        }));
      },

      selectTask: (taskId: string | null) => set((state) => ({ timer: { ...state.timer, selectedTaskId: taskId } })),

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

        const SessionMinutes = Math.round(timer.duration / 60);
        const updatedTotalFocus = user.totalFocusTime + SessionMinutes;

        const todayIndex = new Date().getDay();
        const arrayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
        const updatedStats = [...dailyStats];
        if (updatedStats[arrayIndex]) {
          updatedStats[arrayIndex].focusHours = parseFloat((updatedStats[arrayIndex].focusHours + SessionMinutes / 60).toFixed(1));
        }

        let updatedTasks = [...tasks];
        if (timer.selectedTaskId && timer.mode === 'work') {
          updatedTasks = tasks.map(t => t.id === timer.selectedTaskId ? { ...t, completed: true, notes: notes || t.notes } : t);
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          tasks: updatedTasks,
          user: {
            ...user,
            totalFocusTime: updatedTotalFocus,
            completedTasksCount: timer.selectedTaskId ? user.completedTasksCount + 1 : user.completedTasksCount,
          },
          dailyStats: updatedStats,
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

      updateUserName: (name: string) => set((state) => ({ user: { ...state.user, name } })),

      resetProgress: () => set(() => ({
        user: { ...initialUser, name: get().user.name },
        tasks: [
          { id: 't1', title: 'Tasarım spesifikasyonlarını tamamla', completed: false, notes: '', createdAt: '2026-05-30T10:00:00Z' },
          { id: 't2', title: 'Pazarlama e-postasını taslak hale getir', completed: false, notes: '', createdAt: '2026-05-30T11:00:00Z' },
        ],
        sessions: [],
        timer: { duration: 25 * 60, timeLeft: 25 * 60, isRunning: false, mode: 'work', selectedTaskId: null },
        dailyStats: initialDailyStats.map(s => ({ ...s, focusHours: 0, tasksCompleted: 0 })),
        currentStreak: 1,
      }))
    }),
    {
      name: 'adim-adim-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
`;

export const APP_CODE = `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

// Ekranların İçe Aktarımı
import HomeScreen from './screens/HomeScreen';
import FocusScreen from './screens/FocusScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  let emoji = '🏠';
  if (label === 'Odaklanma') emoji = '⏱️';
  if (label === 'İstatistikler') emoji = '📈';
  if (label === 'Profil') emoji = '👤';

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>{emoji}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#FF8906',
          tabBarInactiveTintColor: '#8F8F9F',
          tabBarStyle: {
            backgroundColor: '#1E1F29',
            borderTopColor: '#2D2D3D',
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused }) => {
            return <TabIcon label={route.name} focused={focused} />;
          },
        })}
      >
        <Tab.Screen 
          name="Ana Sayfa" 
          component={HomeScreen} 
          options={{ title: 'Ana Sayfa' }}
        />
        <Tab.Screen 
          name="Odaklanma" 
          component={FocusScreen} 
          options={{ title: 'Odak' }}
        />
        <Tab.Screen 
          name="İstatistikler" 
          component={StatsScreen} 
          options={{ title: 'Analiz' }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen} 
          options={{ title: 'Profil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconTextActive: {
    opacity: 1,
  },
});
`;

export const HOME_SCREEN_CODE = `import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store';

export default function HomeScreen({ navigation }: any) {
  const { user, tasks, addTask, toggleTask, deleteTask, currentStreak } = useAppStore();
  const [taskTitle, setTaskTitle] = useState('');

  const handleAddTask = () => {
    if (taskTitle.trim() === '') return;
    addTask(taskTitle);
    setTaskTitle('');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Merhaba,</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileBadge}
          onPress={() => navigation.navigate('Profil')}
        >
          <Text style={styles.profileBadgeText}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statCardEmoji}>🔥</Text>
            <Text style={styles.statCardValue}>{currentStreak} Gün</Text>
            <Text style={styles.statCardTitle}>Mevcut Seri</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statCardEmoji}>🎯</Text>
            <Text style={styles.statCardValue}>%{completionRate}</Text>
            <Text style={styles.statCardTitle}>Görev Oranı</Text>
          </View>
        </View>

        <View style={styles.focusShortcutCard}>
          <View style={styles.focusShortcutLeft}>
            <Text style={styles.focusTitle}>Odaklanma Zamanı!</Text>
            <Text style={styles.focusSubtitle}>Pomodoro sayacını başlat ve üretkenliğini artır.</Text>
          </View>
          <TouchableOpacity 
            style={styles.focusButton}
            onPress={() => navigation.navigate('Odaklanma')}
          >
            <Text style={styles.focusButtonText}>Başlat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Görevlerim</Text>
          <Text style={styles.sectionSubtitle}>{completedCount}/{tasks.length} tamamlandı</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Yeni bir görev yazın..."
            placeholderTextColor="#8F8F9F"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Text style={styles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz hiç göreviniz yok. Yukarıdan ekleyin!</Text>
          </View>
        ) : (
          tasks.map((item) => (
            <View key={item.id} style={styles.taskItem}>
              <TouchableOpacity
                style={[styles.checkbox, item.completed && styles.checkboxChecked]}
                onPress={() => toggleTask(item.id)}
              >
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              
              <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                {item.title}
              </Text>

              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 15 },
  welcomeText: { color: '#a0a0ab', fontSize: 14 },
  userName: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  profileBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF8906', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#3a3a4a' },
  profileBadgeText: { color: '#FFFF', fontWeight: 'bold', fontSize: 16 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#2E2F3E', width: '48%', borderRadius: 16, padding: 16, alignItems: 'center' },
  statCardEmoji: { fontSize: 24, marginBottom: 8 },
  statCardValue: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statCardTitle: { color: '#8F8F9F', fontSize: 12 },
  focusShortcutCard: { backgroundColor: '#3E342B', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25, borderWidth: 1, borderColor: '#6246EA' },
  focusShortcutLeft: { flex: 1, marginRight: 10 },
  focusTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  focusSubtitle: { color: '#b0b1c0', fontSize: 12 },
  focusButton: { backgroundColor: '#FF8906', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  focusButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  sectionTitle: { color: '#FFFF', fontSize: 18, fontWeight: 'bold' },
  sectionSubtitle: { color: '#8F8F9F', fontSize: 12 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, height: 50, backgroundColor: '#1E1F29', borderRadius: 12, paddingHorizontal: 16, color: '#FFFFFF', fontSize: 15, borderWidth: 1, borderColor: '#2D2D3D' },
  addButton: { width: 60, height: 50, backgroundColor: '#6246EA', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  addButtonText: { color: '#FFFF', fontSize: 15, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { color: '#8F8F9F', fontSize: 14, textAlign: 'center' },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1F29', padding: 15, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2D2D3D' },
  checkbox: { width: 24, height: 24, borderColor: '#FF8906', borderWidth: 2, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkboxChecked: { backgroundColor: '#FF8906' },
  checkmark: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  taskText: { color: '#E1E1E6', fontSize: 15, flex: 1 },
  taskTextCompleted: { color: '#8F8F9F', textDecorationLine: 'line-through' },
  deleteButton: { padding: 5 },
  deleteButtonText: { color: '#FF453A', fontSize: 16, fontWeight: 'bold' }
});
`;

export const FOCUS_SCREEN_CODE = `import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppStore } from '../store';

export default function FocusScreen() {
  const {
    timer,
    tasks,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    setTimerMode,
    selectTask,
    completeSession,
  } = useAppStore();

  const [notes, setNotes] = useState('');
  const [showTaskSelector, setShowTaskSelector] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer.isRunning) {
      interval = setInterval(() => tick(), 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [timer.isRunning, tick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
  };

  const selectedTask = tasks.find(t => t.id === timer.selectedTaskId);
  const activeTasks = tasks.filter(t => !t.completed);
  const progressPercent = ((timer.duration - timer.timeLeft) / timer.duration) * 100;

  const handleCompleteSession = () => {
    Alert.alert(
      "Oturumu Tamamla",
      "Bu odaklanma seansını kaydetmek ve sonlandırmak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Kaydet ve Bitir", 
          onPress: () => {
            completeSession(notes);
            setNotes('');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ODAKLANMA SEANSI</Text>
          <Text style={styles.headerSubtitle}>
            {timer.mode === 'work' ? 'Çalışma Zamanı 🎯' : 'Mola Zamanı ☕'}
          </Text>
        </View>

        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, timer.mode === 'work' && styles.modeTabActive]}
            onPress={() => setTimerMode('work')}
          >
            <Text style={[styles.modeTabText, timer.mode === 'work' && styles.modeTabTextActive]}>Pomodoro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, timer.mode === 'break' && styles.modeTabActive]}
            onPress={() => setTimerMode('break')}
          >
            <Text style={[styles.modeTabText, timer.mode === 'break' && styles.modeTabTextActive]}>Kısa Mola</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerCircleOuter}>
          <View style={styles.timerCircleInner}>
            <Text style={styles.timerLabel}>Kalan Süre</Text>
            <Text style={styles.timerText}>{formatTime(timer.timeLeft)}</Text>
            <Text style={styles.taskStatusText}>{timer.isRunning ? 'Odaklanılıyor...' : 'HAZIR'}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: \`\${progressPercent}%\` }]} />
          </View>
        </View>

        <View style={styles.taskSelectorContainer}>
          <Text style={styles.sectionTitle}>İlişkili Görev</Text>
          <TouchableOpacity style={styles.taskDropdown} onPress={() => setShowTaskSelector(!showTaskSelector)}>
            <Text style={styles.taskDropdownText}>
              {selectedTask ? \`🎯 \${selectedTask.title}\` : 'Görev seçilmedi (Dokun ve Seç)'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {showTaskSelector && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity 
                style={[styles.dropdownItem, !timer.selectedTaskId && styles.dropdownItemActive]}
                onPress={() => { selectTask(null); setShowTaskSelector(false); }}
              >
                <Text style={styles.dropdownItemText}>Görevsiz Odaklan (Genel)</Text>
              </TouchableOpacity>
              
              {activeTasks.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.dropdownItem, timer.selectedTaskId === t.id && styles.dropdownItemActive]}
                  onPress={() => { selectTask(t.id); setShowTaskSelector(false); }}
                >
                  <Text style={styles.dropdownItemText}>{t.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Seans Notları</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Aklınıza gelenleri yazın..."
            placeholderTextColor="#8F8F9F"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.controlsRow}>
          {timer.isRunning ? (
            <TouchableOpacity style={[styles.controlBtn, styles.pauseBtn]} onPress={pauseTimer}>
              <Text style={styles.controlBtnText}>Duraklat</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.controlBtn, styles.playBtn]} onPress={startTimer}>
              <Text style={styles.controlBtnText}>Başlat</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.controlBtn, styles.resetBtn]} onPress={resetTimer}>
            <Text style={styles.controlBtnText}>Sıfırla</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlBtn, styles.doneBtn, timer.timeLeft === timer.duration && styles.btnDisabled]} 
            onPress={handleCompleteSession}
            disabled={timer.timeLeft === timer.duration}
          >
            <Text style={styles.controlBtnText}>Bitir</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 15 },
  headerTitle: { color: '#8F8F9F', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  headerSubtitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  modeTabs: { flexDirection: 'row', backgroundColor: '#1E1F29', borderRadius: 12, padding: 4, marginBottom: 25 },
  modeTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  modeTabActive: { backgroundColor: '#6246EA' },
  modeTabText: { color: '#8F8F9F', fontWeight: '600', fontSize: 14 },
  modeTabTextActive: { color: '#FFFFFF' },
  timerCircleOuter: { alignSelf: 'center', width: 230, height: 230, borderRadius: 115, backgroundColor: '#1E1F29', justifyContent: 'center', alignItems: 'center', borderWidth: 6, borderColor: '#3E3F4E', marginBottom: 30, overflow: 'hidden', position: 'relative' },
  timerCircleInner: { alignItems: 'center', zIndex: 2 },
  timerLabel: { color: '#8F8F9F', fontSize: 12 },
  timerText: { color: '#FFFFFF', fontSize: 44, fontWeight: 'bold', marginVertical: 4 },
  taskStatusText: { color: '#FF8906', fontWeight: 'bold', fontSize: 12 },
  progressBarBg: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, backgroundColor: '#2D2D3D' },
  progressBarFill: { height: '100%', backgroundColor: '#FF8906' },
  taskSelectorContainer: { marginBottom: 20 },
  sectionTitle: { color: '#FFFF', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  taskDropdown: { backgroundColor: '#1E1F29', height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderWidth: 1, borderColor: '#2D2D3D' },
  taskDropdownText: { color: '#E1E1E6', fontSize: 14, flex: 1 },
  dropdownArrow: { color: '#8F8F9F', fontSize: 12 },
  dropdownMenu: { backgroundColor: '#1E1F29', borderRadius: 12, marginTop: 5, borderWidth: 1, borderColor: '#2D2D3D', overflow: 'hidden' },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#2D2D3D' },
  dropdownItemActive: { backgroundColor: '#2E2F3E' },
  dropdownItemText: { color: '#FFFFFF', fontSize: 14 },
  notesContainer: { marginBottom: 25 },
  notesInput: { backgroundColor: '#1E1F29', borderRadius: 12, padding: 15, color: '#FFFFFF', fontSize: 14, minHeight: 90, textAlignVertical: 'top', borderWidth: 1, borderColor: '#2D2D3D' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  controlBtn: { flex: 1, height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginHorizontal: 4 },
  playBtn: { backgroundColor: '#FF8906' },
  pauseBtn: { backgroundColor: '#3E342B', borderWidth: 1, borderColor: '#FF8906' },
  resetBtn: { backgroundColor: '#2E2F3E' },
  doneBtn: { backgroundColor: '#6246EA' },
  btnDisabled: { backgroundColor: '#1C1B22', opacity: 0.5 },
  controlBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }
});
`;

export const STATS_SCREEN_CODE = `import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store';

export default function StatsScreen() {
  const { dailyStats, sessions, user } = useAppStore();

  const totalWeeklyHours = dailyStats
    .reduce((sum, item) => sum + item.focusHours, 0)
    .toFixed(1);

  const completedSessionsCount = sessions.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İLERLEME VE ANALİZ</Text>
          <Text style={styles.headerSubtitle}>Gelişim İstatistikleri 📈</Text>
        </View>

        <View style={styles.highlightRow}>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightValue}>{totalWeeklyHours} sa</Text>
            <Text style={styles.highlightLabel}>Bu Haftaki Odak</Text>
          </View>

          <View style={styles.highlightCard}>
            <Text style={styles.highlightValue}>{completedSessionsCount}</Text>
            <Text style={styles.highlightLabel}>Tamamlanan Seans</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Haftalık Genel Bakış (Odaklanma Saati)</Text>
          <View style={styles.barChartContainer}>
            {dailyStats.map((item, index) => {
              const maxHourLimit = 8;
              const barHeightPct = Math.min((item.focusHours / maxHourLimit) * 100, 100);
              return (
                <View key={index} style={styles.chartColumn}>
                  <Text style={styles.barValueText}>{item.focusHours > 0 ? \`\${item.focusHours}h\` : ''}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: \`\${barHeightPct}%\` }]} />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Text style={styles.sectionTitle}>Performans Göstergeleri</Text>
          
          <View style={styles.kpiItem}>
            <Text style={styles.kpiEmoji}>📊</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.kpiTitle}>Görev Başarı Oranı</Text>
              <Text style={styles.kpiDesc}>Tamamlanan işlerin oran analizi</Text>
            </View>
            <Text style={styles.kpiValue}>%88</Text>
          </View>

          <View style={styles.kpiItem}>
            <Text style={styles.kpiEmoji}>🎯</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.kpiTitle}>Günlük Odaklanma Hedefi</Text>
              <Text style={styles.kpiDesc}>Hedeflenen vizyon: 6.5sa/gün</Text>
            </View>
            <Text style={styles.kpiValue}>6.5 s</Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Son Oturum Geçmişi</Text>
          {sessions.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>Henüz seans yok.</Text>
            </View>
          ) : (
            sessions.map((session) => (
              <View key={session.id} style={styles.historyItem}>
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyItemTask}>{session.taskTitle || 'Genel Odaklanma'}</Text>
                  <Text style={styles.historyItemDuration}>{Math.round(session.duration / 60)} dk</Text>
                </View>
                <Text style={styles.historyItemDate}>{session.date}</Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { paddingTop: 20, paddingBottom: 15 },
  headerTitle: { color: '#8F8F9F', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  headerSubtitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  highlightRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  highlightCard: { backgroundColor: '#1E1F29', width: '48%', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2D2D3D' },
  highlightValue: { color: '#6246EA', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  highlightLabel: { color: '#8F8F9F', fontSize: 12 },
  chartCard: { backgroundColor: '#1E1F29', borderRadius: 16, padding: 18, marginBottom: 25, borderWidth: 1, borderColor: '#2D2D3D' },
  chartTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, paddingTop: 10 },
  chartColumn: { alignItems: 'center', width: '12%' },
  barValueText: { color: '#E1E1E6', fontSize: 10, marginBottom: 4 },
  barTrack: { height: 90, width: 14, backgroundColor: '#2D2D3D', borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: '#FF8906', borderRadius: 8 },
  barLabel: { color: '#8F8F9F', fontSize: 10, marginTop: 6 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  statsGrid: { marginBottom: 25 },
  kpiItem: { flexDirection: 'row', backgroundColor: '#1E1F29', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#2D2D3D' },
  kpiEmoji: { fontSize: 20 },
  kpiTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  kpiDesc: { color: '#8F8F9F', fontSize: 11 },
  kpiValue: { color: '#FF8906', fontWeight: 'bold', fontSize: 14 },
  historyContainer: { marginBottom: 10 },
  emptyHistory: { backgroundColor: '#1E1F29', padding: 15, borderRadius: 12, alignItems: 'center' },
  emptyHistoryText: { color: '#8F8F9F', fontSize: 13 },
  historyItem: { backgroundColor: '#1E1F29', borderRadius: 12, padding: 14, marginBottom: 10 },
  historyItemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  historyItemTask: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  historyItemDuration: { color: '#6246EA', fontSize: 13, fontWeight: 'bold' },
  historyItemDate: { color: '#8F8F9F', fontSize: 10 }
});
`;

export const PROFILE_SCREEN_CODE = `import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useAppStore } from '../store';

export default function ProfileScreen() {
  const { user, resetProgress, updateUserName } = useAppStore();
  const [userName, setUserName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveName = () => {
    if (userName.trim() === '') return;
    updateUserName(userName);
    setIsEditing(false);
  };

  const handleReset = () => {
    Alert.alert(
      "Verileri Temizle",
      "Tüm odaklanma verilerinizi sıfırlamak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        { text: "Sıfırla", style: "destructive", onPress: () => { resetProgress(); setUserName(user.name); } }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          {isEditing ? (
            <View style={styles.editingContainer}>
              <TextInput style={styles.nameInput} value={userName} onChangeText={setUserName} />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName}>
                <Text style={styles.saveBtnText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{user.name}</Text>
              <Text style={styles.titleText}>{user.title}</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                <Text style={styles.editBtnText}>Profili Düzenle</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.summaryStatsGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{user.streakRecord} Gün</Text>
            <Text style={styles.summaryLabel}>Seri Rekoru</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{(user.totalFocusTime / 3600).toFixed(1)} sa</Text>
            <Text style={styles.summaryLabel}>Odaklanma</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{user.completedTasksCount}</Text>
            <Text style={styles.summaryLabel}>Görevler</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressCardTitle}>Bir Sonraki Seviye</Text>
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarInner, { width: '75%' }]} />
          </View>
          <Text style={styles.progressBadgeHint}>Bir sonraki unvan: "Odaklanma Gurusu" 🌟</Text>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Sertifikalı Başarılar</Text>
          <View style={styles.badgesGrid}>
            {user.achievements.map((badge) => (
              <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}>
                <Text style={styles.badgeIcon}>🏅</Text>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.resetSettingsBtn} onPress={handleReset}>
          <Text style={styles.resetSettingsBtnText}>Verileri Sıfırla ve Yeniden Başla</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', paddingVertical: 25 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#6246EA' },
  nameContainer: { alignItems: 'center', marginTop: 10 },
  nameText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  titleText: { color: '#FF8906', fontSize: 13, marginTop: 4 },
  editBtn: { marginTop: 10 },
  editBtnText: { color: '#8F8F9F', fontSize: 12 },
  editingContainer: { width: '100%', alignItems: 'center' },
  nameInput: { height: 40, backgroundColor: '#1E1F29', color: '#FFF', borderRadius: 8, paddingHorizontal: 10 },
  saveBtn: { backgroundColor: '#6246EA', padding: 8, borderRadius: 8 },
  saveBtnText: { color: '#FFF' },
  summaryStatsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: '#1E1F29', padding: 10, alignItems: 'center' },
  summaryValue: { color: '#FFF', fontWeight: 'bold' },
  summaryLabel: { color: '#8F8F9F' },
  progressCard: { backgroundColor: '#1C1625', padding: 15, borderRadius: 12 },
  progressCardTitle: { color: '#FFF', fontWeight: 'bold' },
  progressBarOuter: { height: 8, backgroundColor: '#2E263D', borderRadius: 4, marginTop: 8 },
  progressBarInner: { backgroundColor: '#A855F7', height: '100%' },
  progressBadgeHint: { color: '#8F8F9F', fontSize: 11 },
  achievementsSection: { marginTop: 20 },
  sectionTitle: { color: '#FFF', fontWeight: 'bold' },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badgeCard: { width: '48%', backgroundColor: '#1E1F29', padding: 10, marginVertical: 4 },
  badgeCardLocked: { opacity: 0.5 },
  badgeIcon: { fontSize: 24 },
  badgeTitle: { color: '#FFF', fontWeight: 'bold' },
  badgeDesc: { color: '#8F8F9F', fontSize: 11 },
  resetSettingsBtn: { backgroundColor: '#2D1B1B', padding: 15, alignItems: 'center', marginTop: 20 }
});
`;
