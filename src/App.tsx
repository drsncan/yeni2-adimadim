import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Trash2, 
  Plus, 
  Award, 
  TrendingUp, 
  User, 
  Clock, 
  ClipboardList, 
  Flame, 
  Copy, 
  FileText, 
  CheckCheck, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  BookOpen, 
  Wifi, 
  Battery, 
  Moon, 
  ChevronDown, 
  MessageSquare,
  Activity,
  Award as TrophyIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// React Native stringified codes
import { 
  EXPO_INSTALL_GUIDE, 
  TYPES_CODE, 
  STORE_CODE, 
  APP_CODE, 
  HOME_SCREEN_CODE, 
  FOCUS_SCREEN_CODE, 
  STATS_SCREEN_CODE, 
  PROFILE_SCREEN_CODE 
} from './codeData';

// Simulated Task type
interface SimulatedTask {
  id: string;
  title: string;
  completed: boolean;
  notes: string;
  createdAt: string;
}

// Simulated Focus Session
interface SimulatedSession {
  id: string;
  taskTitle?: string;
  duration: number; // in seconds
  date: string;
  notes: string;
}

// Simulated Achievement
interface SimulatedAchievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
  category: string;
}

export default function App() {
  // Mobile active screen tab: 'home' | 'focus' | 'stats' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'focus' | 'stats' | 'profile'>('home');
  const [navigatorLoading, setNavigatorLoading] = useState(true);

  // Active file for IDE explorer
  const [selectedFile, setSelectedFile] = useState<string>('guide');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);

  // --- MOBIL SIMULATOR STATE ---
  const [userProfile, setUserProfile] = useState({
    name: 'Can Demir',
    title: 'Odaklanma Ustası',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    streakRecord: 14,
    totalFocusTime: 11100, // in seconds (185 mins)
    completedTasksCount: 4,
  });

  const [currentStreak, setCurrentStreak] = useState(7);
  const [tasks, setTasks] = useState<SimulatedTask[]>([
    { id: 't1', title: 'Tasarım spesifikasyonlarını tamamla', completed: true, notes: 'Gereksinimler belgelendi.', createdAt: '2026-05-30T10:00:00Z' },
    { id: 't2', title: 'Pazarlama e-postasını taslak hale getir', completed: false, notes: '', createdAt: '2026-05-30T11:00:00Z' },
    { id: 't3', title: 'Adım Adım ilerleme ikonunu tasarla', completed: false, notes: '', createdAt: '2026-05-30T12:00:00Z' },
    { id: 't4', title: 'Zustand store entegrasyonu yap', completed: true, notes: 'Zustand test edildi, sorunsuz çalışıyor.', createdAt: '2026-05-30T09:00:00Z' },
  ]);

  const [sessions, setSessions] = useState<SimulatedSession[]>([
    { id: 's1', taskTitle: 'Zustand store entegrasyonu yap', duration: 1500, date: '2026-05-30', notes: 'Devamlı odaklandım!' },
    { id: 's2', taskTitle: 'Tasarım spesifikasyonlarını tamamla', duration: 1500, date: '2026-05-30', notes: 'Tüm taslaklar çizildi.' }
  ]);

  const [dailyStats, setDailyStats] = useState([
    { day: 'Pzt', focusHours: 6.8, tasksCompleted: 5 },
    { day: 'Sal', focusHours: 4.5, tasksCompleted: 3 },
    { day: 'Çar', focusHours: 7.1, tasksCompleted: 6 },
    { day: 'Per', focusHours: 5.8, tasksCompleted: 4 },
    { day: 'Cum', focusHours: 3.2, tasksCompleted: 2 },
    { day: 'Cmt', focusHours: 2.1, tasksCompleted: 1 },
    { day: 'Paz', focusHours: 0.8, tasksCompleted: 2 },
  ]);

  const [achievements, setAchievements] = useState<SimulatedAchievement[]>([
    { id: '1', title: 'Seri Başlangıcı', description: 'İlk odaklanma oturumunu tamamla.', unlocked: true, icon: 'zap', category: 'streak' },
    { id: '2', title: 'Odak Kahramanı', description: 'Tek seferde 50 dakika odaklan.', unlocked: true, icon: 'award', category: 'focus' },
    { id: '3', title: 'Planlama Dehası', description: 'Aynı gün içinde 5 görev tamamla.', unlocked: true, icon: 'clipboard', category: 'task' },
    { id: '4', title: 'Zaman Sihirbazı', description: 'Haftalık 30 saat odak süresine ulaş.', unlocked: false, icon: 'clock', category: 'time' },
    { id: '5', title: 'Erken Kalkan', description: 'Sabah 08:00\'den önce odaklanma oturumu yap.', unlocked: true, icon: 'sun', category: 'time' },
    { id: '6', title: 'Odak Uzmanı', description: 'Toplamda 200 saat odaklanmaya ulaş.', unlocked: false, icon: 'shield', category: 'focus' },
  ]);

  // --- POMODORO TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState(25 * 60); // In seconds
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [selectedTaskIdForTimer, setSelectedTaskIdForTimer] = useState<string | null>(null);
  const [focusNotes, setFocusNotes] = useState('');
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);

  // New task text
  const [newTaskInput, setNewTaskInput] = useState('');
  const [editingProfileName, setEditingProfileName] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState(userProfile.name);

  // Audio/Visual Feedback Alerts
  const [simulatedAlert, setSimulatedAlert] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Simulate startup load
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigatorLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Timer Tick Trigger
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer Finished! Let's auto-complete
            setIsTimerRunning(false);
            triggerTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning, timeLeft]);

  const triggerTimerEnd = () => {
    showSimulatedToast(
      timerMode === 'work' 
        ? "Tebrikler! Odaklanma seansınız bitti. Mola vermeye hak kazandınız." 
        : "Molanız bitti! Şimdi odaklanma zamanı.",
      'success'
    );
    // Auto trigger completion dialog flow or auto complete
    simulateSessionCompletion();
  };

  const showSimulatedToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setSimulatedAlert({ message: msg, type });
    setTimeout(() => {
      setSimulatedAlert(null);
    }, 4500);
  };

  // --- INTERACTIONS & FUNCTIONS ---
  const handleAddNewTask = (titleText: string) => {
    if (titleText.trim() === '') return;
    const newTask: SimulatedTask = {
      id: 't_' + Date.now(),
      title: titleText,
      completed: false,
      notes: '',
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    showSimulatedToast("Yeni görev başarıyla eklendi!", "success");
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        showSimulatedToast(nextCompleted ? "Görev tamamlandı olarak işaretlendi! 🎉" : "Görev aktif duruma çekildi.", "info");
        return { ...task, completed: nextCompleted };
      }
      return task;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    showSimulatedToast("Görev silindi.", "info");
  };

  const handleSetTimerMode = (mode: 'work' | 'break') => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    const durationSec = mode === 'work' ? 25 * 60 : 5 * 60;
    setTotalDuration(durationSec);
    setTimeLeft(durationSec);
    showSimulatedToast(mode === 'work' ? "Çalışma modu (25 dk) seçildi." : "Mola modu (5 dk) seçildi.", "info");
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(totalDuration);
    showSimulatedToast("Zamanlayıcı sıfırlandı.", "info");
  };

  const simulateSessionCompletion = () => {
    // Collect stats and add focus session
    const associatedTask = tasks.find(t => t.id === selectedTaskIdForTimer);
    const completedMinutes = Math.round(totalDuration / 60);

    const newSession: SimulatedSession = {
      id: 's_' + Date.now(),
      taskTitle: associatedTask?.title,
      duration: totalDuration,
      date: new Date().toISOString().split('T')[0],
      notes: focusNotes || "Oturum başarıyla tamamlandı."
    };

    setSessions(prev => [newSession, ...prev]);

    // Update user profile focus stats
    setUserProfile(prev => ({
      ...prev,
      totalFocusTime: prev.totalFocusTime + totalDuration,
      completedTasksCount: selectedTaskIdForTimer ? prev.completedTasksCount + 1 : prev.completedTasksCount
    }));

    // If a task was selected during work mode, complete it
    if (selectedTaskIdForTimer && timerMode === 'work') {
      setTasks(prev => prev.map(t => t.id === selectedTaskIdForTimer ? { ...t, completed: true, notes: focusNotes || t.notes } : t));
    }

    // Add hours to today's stats (Paz index 6)
    const todayIndex = new Date().getDay();
    const arrayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    setDailyStats(prev => {
      const copy = [...prev];
      if (copy[arrayIndex]) {
        copy[arrayIndex].focusHours = parseFloat((copy[arrayIndex].focusHours + completedMinutes / 60).toFixed(1));
        if (selectedTaskIdForTimer) {
          copy[arrayIndex].tasksCompleted += 1;
        }
      }
      return copy;
    });

    // Check achievement unlock
    let achievementUnlocked = false;
    setAchievements(prev => prev.map(ach => {
      if (ach.id === '4' && !ach.unlocked && (userProfile.totalFocusTime + totalDuration) >= 30 * 3600) {
        achievementUnlocked = true;
        return { ...ach, unlocked: true };
      }
      return ach;
    }));

    // Reset focus parameters
    setSelectedTaskIdForTimer(null);
    setFocusNotes('');
    
    // Toggle back mode
    const nextMode = timerMode === 'work' ? 'break' : 'work';
    setTimerMode(nextMode);
    const nextDuration = nextMode === 'work' ? 25 * 60 : 5 * 60;
    setTotalDuration(nextDuration);
    setTimeLeft(nextDuration);

    showSimulatedToast(
      achievementUnlocked 
        ? "Harika! Odaklanma oturumu kaydedildi ve yeni bir BAŞARI ROZETİ kazandınız! 🏆" 
        : "Odaklanma seansınız kaydedildi! Bilgileriniz başarıyla güncellendi.", 
      "success"
    );
  };

  const handleResetAllData = () => {
    if (window.confirm("Bütün ilerlemeniz, odaklanma süreniz ve başarı rozetleriniz sıfırlanacaktır. Devam etmek istiyor musunuz?")) {
      setUserProfile({
        name: 'Can Demir',
        title: 'Odaklanma Meraklısı',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        streakRecord: 7,
        totalFocusTime: 0,
        completedTasksCount: 0,
      });
      setCurrentStreak(1);
      setTasks([
        { id: 't1', title: 'Tasarım spesifikasyonlarını tamamla', completed: false, notes: '', createdAt: '2026-05-30T10:00:00Z' },
        { id: 't2', title: 'Pazarlama e-postasını taslak hale getir', completed: false, notes: '', createdAt: '2026-05-30T11:00:00Z' }
      ]);
      setSessions([]);
      setDailyStats([
        { day: 'Pzt', focusHours: 0, tasksCompleted: 0 },
        { day: 'Sal', focusHours: 0, tasksCompleted: 0 },
        { day: 'Çar', focusHours: 0, tasksCompleted: 0 },
        { day: 'Per', focusHours: 0, tasksCompleted: 0 },
        { day: 'Cum', focusHours: 0, tasksCompleted: 0 },
        { day: 'Cmt', focusHours: 0, tasksCompleted: 0 },
        { day: 'Paz', focusHours: 0, tasksCompleted: 0 },
      ]);
      setAchievements(prev => prev.map(ach => ({ ...ach, unlocked: ach.id === '1' })));
      setIsTimerRunning(false);
      setTimerMode('work');
      setTimeLeft(25 * 60);
      setTotalDuration(25 * 60);
      showSimulatedToast("Tüm veriler başarıyla sıfırlandı.", "info");
    }
  };

  // Utilities
  const formatTimeMinutes = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getFileContent = () => {
    switch (selectedFile) {
      case 'guide': return EXPO_INSTALL_GUIDE;
      case 'types': return TYPES_CODE;
      case 'store': return STORE_CODE;
      case 'app': return APP_CODE;
      case 'home': return HOME_SCREEN_CODE;
      case 'focus': return FOCUS_SCREEN_CODE;
      case 'stats': return STATS_SCREEN_CODE;
      case 'profile': return PROFILE_SCREEN_CODE;
      default: return '';
    }
  };

  const getFileName = () => {
    switch (selectedFile) {
      case 'guide': return 'INSTALL_GUIDE.md';
      case 'types': return 'src/types.ts';
      case 'store': return 'src/store.ts';
      case 'app': return 'App.tsx';
      case 'home': return 'src/screens/HomeScreen.tsx';
      case 'focus': return 'src/screens/FocusScreen.tsx';
      case 'stats': return 'src/screens/StatsScreen.tsx';
      case 'profile': return 'src/screens/ProfileScreen.tsx';
      default: return '';
    }
  };

  const handleCopyCode = () => {
    const code = getFileContent();
    navigator.clipboard.writeText(code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  // Active associated task in Focus
  const focusedTask = tasks.find(t => t.id === selectedTaskIdForTimer);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* HEADER BAR */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/10">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-orange-400 bg-clip-text text-transparent">
                Adım Adım
              </h1>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-500/30 font-semibold font-mono">
                Expo Mobile Simulator v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">İnteraktif Odaklanma & Verimlilik Mobil Uygulama Geliştirme Platformu</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-lg">
            <TrophyIcon className="w-4 h-4 text-orange-400" />
            <span>Mevcut Seri: <strong>{currentStreak} Gün</strong></span>
            <span className="text-slate-700">|</span>
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Toplam Odak: <strong>{Math.round(userProfile.totalFocusTime / 60)} dk</strong></span>
          </div>
          
          <button 
            onClick={handleResetAllData}
            title="Uygulamayı Sıfırla"
            className="flex items-center gap-2 text-xs bg-red-950/40 text-red-400 hover:bg-red-900/40 border border-red-900/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simülatörü Sıfırla</span>
          </button>
        </div>
      </header>

      {/* SPLIT SCREEN LAYOUT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COMPONENT: CORE MOBILE PHONE EMULATOR (5 COLUMNS) */}
        <section className="lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-start self-start sticky top-24">
          
          {/* SIMULATED DEVICE SHELL */}
          <div className="relative w-[345px] sm:w-[365px] h-[720px] bg-slate-900 rounded-[50px] p-3 border-4 border-slate-800 shadow-2xl shadow-indigo-950/40 hover:shadow-orange-950/20 transition-all duration-700 flex flex-col overflow-hidden">
            
            {/* SCREEN CAMERA NOTCH & SPEAKER */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-between px-4">
              <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-sky-900 rounded-full animate-pulse"></div>
              <div className="w-12 h-1 bg-neutral-900 rounded-full"></div>
            </div>

            {/* SCREEN INNER FRAME */}
            <div className="bg-[#0F0E17] flex-1 rounded-[42px] overflow-hidden flex flex-col relative border border-slate-950">
              
              {/* STATUS BAR */}
              <div className="h-10 pt-2 px-6 flex items-center justify-between text-xs text-slate-300 select-none z-30 bg-[#0F0E17]">
                <span className="font-semibold">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-400">5G</span>
                  <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                </div>
              </div>

              {/* SIMULATED TOAST ALERT SYSTEM */}
              <AnimatePresence>
                {simulatedAlert && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-12 left-3 right-3 z-50 p-3.5 rounded-xl shadow-lg border text-xs flex items-start gap-2.5 backdrop-blur-md bg-slate-900/95 text-slate-100"
                    style={{
                      borderColor: simulatedAlert.type === 'success' ? '#10b981' : simulatedAlert.type === 'error' ? '#ef4444' : '#6366f1'
                    }}
                  >
                    <span className="text-base">
                      {simulatedAlert.type === 'success' ? '🎯' : simulatedAlert.type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <p className="flex-1 font-medium leading-relaxed">{simulatedAlert.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SCREEN LOADER SPIN */}
              {navigatorLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#181628] to-[#0F0E17]">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-100">Adım Adım</h3>
                    <p className="text-xs text-slate-400 mt-1">Gereksinimler yükleniyor...</p>
                  </div>
                </div>
              ) : (
                
                /* EXPO ACTIVE CONTAINER NAV */
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* MAIN CANVAS SCROLLABLE AREA */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden pt-1 pb-6 select-none custom-scrollbar">
                    
                    {/* TAB SCREEN: HOME (ANA SAYFA) */}
                    {activeTab === 'home' && (
                      <div className="px-5">
                        
                        {/* Welcome User Header */}
                        <div className="flex justify-between items-center mt-3 mb-5">
                          <div>
                            <span className="text-xs text-slate-400 font-medium">Merhaba,</span>
                            <h2 className="text-xl font-bold text-white tracking-tight">{userProfile.name}</h2>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm border-2 border-slate-800 shadow-md">
                            {userProfile.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>

                        {/* Top Highlights: Streak & Task Stats Cards */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="bg-[#1E1F29] border border-slate-800/80 rounded-2xl p-3.5 flex flex-col items-center">
                            <span className="text-2xl mb-1">🔥</span>
                            <span className="text-base font-bold text-slate-100">{currentStreak} Gün</span>
                            <span className="text-[10px] text-slate-400 font-medium">Mevcut Seri</span>
                          </div>

                          <div className="bg-[#1E1F29] border border-slate-800/80 rounded-2xl p-3.5 flex flex-col items-center">
                            <span className="text-2xl mb-1">🎯</span>
                            <span className="text-base font-bold text-slate-100">
                              %{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Görev Oranı</span>
                          </div>
                        </div>

                        {/* Focus Shortcut Area */}
                        <div className="bg-[#3E342B]/80 border border-[#6246EA]/40 rounded-2xl p-4 flex items-center justify-between mb-6">
                          <div className="flex-1 mr-3">
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Hemen Odaklan</span>
                            <h4 className="text-sm font-bold text-white mt-0.5">Odaklanma Zamanı!</h4>
                            <p className="text-[10.5px] text-slate-300 mt-1">Sayaçla odaklan ve verimliliğini üst düzeye taşı.</p>
                          </div>
                          <button 
                            onClick={() => setActiveTab('focus')}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-lg transition-all"
                          >
                            Başlat
                          </button>
                        </div>

                        {/* Title and stats summary */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Benim Görevlerim</h3>
                          <span className="text-[10.5px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                            {tasks.filter(t => t.completed).length}/{tasks.length} tamamlandı
                          </span>
                        </div>

                        {/* Inline Task Add Input */}
                        <div className="flex gap-2 mb-4">
                          <input 
                            type="text"
                            placeholder="Yeni bir görev yazın..."
                            value={newTaskInput}
                            onChange={(e) => setNewTaskInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddNewTask(newTaskInput);
                                setNewTaskInput('');
                              }
                            }}
                            className="flex-1 bg-[#1E1F29] border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100 placeholder:text-slate-500"
                          />
                          <button 
                            onClick={() => {
                              handleAddNewTask(newTaskInput);
                              setNewTaskInput('');
                            }}
                            className="w-10 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-500 active:scale-95 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Tasks List */}
                        <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                          {tasks.map(task => (
                            <div key={task.id} className="bg-[#1E1F29]/60 border border-slate-800/85 rounded-xl p-3 flex items-center justify-between gap-3 group">
                              <button 
                                onClick={() => handleToggleTask(task.id)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  task.completed 
                                    ? 'bg-orange-500 border-orange-500 text-white' 
                                    : 'border-slate-700 hover:border-orange-500'
                                }`}
                              >
                                {task.completed && <Check className="w-3.5 h-3.5 font-black" />}
                              </button>

                              <span className={`text-[12px] flex-1 truncate transition-all ${
                                task.completed ? 'text-slate-500 line-through' : 'text-slate-250'
                              }`}>
                                {task.title}
                              </span>

                              <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="opacity-60 hover:opacity-100 hover:text-red-500 p-1 rounded transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          {tasks.length === 0 && (
                            <div className="text-center py-6">
                              <p className="text-xs text-slate-500">Görev bulunmuyor. Yeni bir tane ekleyin!</p>
                            </div>
                          )}
                        </div>

                      </div>
                    )}


                    {/* TAB SCREEN: FOCUS TIMER (ODAKLANMA) */}
                    {activeTab === 'focus' && (
                      <div className="px-5">
                        
                        {/* Header */}
                        <div className="text-center mt-3 mb-6">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ODAKLANMA SEANSI</span>
                          <h2 className="text-lg font-bold text-white mt-0.5">
                            {timerMode === 'work' ? 'Çalışma Zamanı 🎯' : 'Mola Zamanı ☕'}
                          </h2>
                        </div>

                        {/* Mode Selectors */}
                        <div className="flex bg-[#1E1F29] p-1 rounded-xl mb-6">
                          <button 
                            onClick={() => handleSetTimerMode('work')}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                              timerMode === 'work' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-250'
                            }`}
                          >
                            Pomodoro
                          </button>
                          <button 
                            onClick={() => handleSetTimerMode('break')}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                              timerMode === 'break' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-250'
                            }`}
                          >
                            Kısa Mola
                          </button>
                        </div>

                        {/* Circular Progress Countdown Box */}
                        <div className="relative w-[190px] h-[190px] mx-auto rounded-full bg-[#1E1F29] border-4 border-slate-800 flex flex-col items-center justify-center shadow-xl shadow-slate-950/20 mb-6 overflow-hidden">
                          
                          {/* Circle Background Watermark progress fill */}
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-orange-500/10 transition-all duration-100" 
                            style={{ height: `${((totalDuration - timeLeft) / totalDuration) * 100}%` }}
                          />

                          <div className="z-10 text-center">
                            <span className="text-[9px] font-bold text-slate-400 tracking-wider">KALAN SÜRE</span>
                            <div className="text-3xl font-bold font-mono text-white tracking-tight my-1">
                              {formatTimeMinutes(timeLeft)}
                            </div>
                            <span className="text-[9.5px] font-bold text-orange-400 tracking-widest uppercase">
                              {isTimerRunning ? 'ODAKLANILIYOR' : 'HAZIRDA'}
                            </span>
                          </div>

                          {/* Outer Border Stroke Simulation */}
                          <div className="absolute top-0 bottom-0 left-0 right-0 border border-orange-500/20 rounded-full animate-ping-slow pointer-events-none"></div>
                        </div>

                        {/* Associated Task Dropdown */}
                        <div className="mb-5 relative">
                          <label className="text-xs font-bold text-slate-300 block mb-2">İlişkili Görev</label>
                          <button 
                            onClick={() => setShowTaskDropdown(!showTaskDropdown)}
                            className="w-full bg-[#1E1F29] border border-slate-850 h-10 rounded-xl px-3.5 flex items-center justify-between text-xs text-slate-250"
                          >
                            <span className="truncate max-w-[210px]">
                              {focusedTask ? `🎯 ${focusedTask.title}` : 'Görev seçilmedi (Dokun ve Seç)'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          </button>

                          {/* Dropdown Options */}
                          {showTaskDropdown && (
                            <div className="absolute top-16 left-0 right-0 bg-[#1E1F29] border border-slate-800 rounded-xl shadow-2xl z-30 overflow-hidden max-h-[145px] overflow-y-auto border-t-0">
                              <button 
                                onClick={() => {
                                  setSelectedTaskIdForTimer(null);
                                  setShowTaskDropdown(false);
                                }}
                                className={`w-full p-3 text-left text-xs border-b border-slate-850 hover:bg-slate-800 transition-all ${
                                  !selectedTaskIdForTimer ? 'bg-slate-800 text-indigo-400 font-bold' : 'text-slate-300'
                                }`}
                              >
                                Görevsiz Odaklan (Genel)
                              </button>
                              {tasks.filter(t => !t.completed).map(task => (
                                <button 
                                  key={task.id}
                                  onClick={() => {
                                    setSelectedTaskIdForTimer(task.id);
                                    setShowTaskDropdown(false);
                                  }}
                                  className={`w-full p-3 text-left text-xs border-b border-slate-850 hover:bg-slate-800 transition-all truncate ${
                                    selectedTaskIdForTimer === task.id ? 'bg-slate-805 text-indigo-400 font-bold' : 'text-slate-300'
                                  }`}
                                >
                                  {task.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* focus notes */}
                        <div className="mb-6">
                          <label className="text-xs font-bold text-slate-300 block mb-2">Seans Notları</label>
                          <textarea 
                            placeholder="Çalışırken aklınıza gelen fikirleri veya notları kaydedin..."
                            value={focusNotes}
                            onChange={(e) => setFocusNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-[#1E1F29] border border-slate-850 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 resize-none"
                          />
                        </div>

                        {/* Interactive Timer Controls Row */}
                        <div className="flex gap-2.5">
                          {isTimerRunning ? (
                            <button 
                              onClick={() => {
                                setIsTimerRunning(false);
                                showSimulatedToast("Zamanlayıcı duraklatıldı.", "info");
                              }}
                              className="flex-1 bg-slate-800 border border-orange-500 text-orange-400 font-bold text-xs h-11 rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-750 transition-all active:scale-95"
                            >
                              <Pause className="w-3.5 h-3.5" />
                              <span>Durdur</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                setIsTimerRunning(true);
                                showSimulatedToast("Kritik odak oturumu başladı! ⚡ Başarılar dileriz.", "success");
                              }}
                              className="flex-1 bg-orange-500 text-white font-bold text-xs h-11 rounded-xl flex items-center justify-center gap-1.5 hover:bg-orange-600 transition-all active:scale-95"
                            >
                              <Play className="w-3.5 h-3.5 text-white" />
                              <span>Başlat</span>
                            </button>
                          )}

                          <button 
                            onClick={handleResetTimer}
                            className="bg-[#2E2F3E] text-slate-200 text-xs py-2 px-3.5 rounded-xl flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all"
                            title="Sıfırla"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={simulateSessionCompletion}
                            disabled={timeLeft === totalDuration}
                            className={`px-4 text-xs font-bold rounded-xl flex items-center justify-center ${
                              timeLeft === totalDuration 
                                ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 text-xs transition-all'
                            }`}
                          >
                            Bitir
                          </button>
                        </div>

                      </div>
                    )}


                    {/* TAB SCREEN: STATISTICS (İSTATİSTİKLER) */}
                    {activeTab === 'stats' && (
                      <div className="px-5">
                        
                        {/* Title */}
                        <div className="mt-3 mb-5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">İLERLEME ANALİZİ</span>
                          <h2 className="text-xl font-bold text-white mt-0.5">Gelişim İstatistikleri 📈</h2>
                        </div>

                        {/* Top Highlights Summary Row */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="bg-[#1E1F29]/60 border border-slate-850 rounded-2xl p-3.5 text-center">
                            <span className="text-xs text-indigo-400 font-bold block">
                              {(userProfile.totalFocusTime / 3600).toFixed(1)} sa
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 block">Toplam Odak Süresi</span>
                          </div>

                          <div className="bg-[#1E1F29]/60 border border-slate-850 rounded-2xl p-3.5 text-center">
                            <span className="text-xs text-emerald-400 font-bold block">
                              {sessions.length} seans
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 block">Oturum Kaydı</span>
                          </div>
                        </div>

                        {/* Styled custom bar chart */}
                        <div className="bg-[#1E1F29] border border-slate-800 rounded-2xl p-4 mb-5">
                          <h4 className="text-xs font-bold text-white mb-1">Haftalık Genel Bakış</h4>
                          <span className="text-[9px] text-slate-400 block mb-4">Pazartesi-Pazar Günlük Çalışma Saatleri</span>

                          {/* Chart Bars */}
                          <div className="flex items-end justify-between h-[115px] pt-4 select-none">
                            {dailyStats.map((item, id) => {
                              const maxVal = 8;
                              const heightPct = Math.min((item.focusHours / maxVal) * 100, 100);
                              return (
                                <div key={id} className="flex flex-col items-center w-[12%]">
                                  <span className="text-[8px] text-slate-300 font-mono mb-1">
                                    {item.focusHours > 0 ? `${item.focusHours}h` : ''}
                                  </span>
                                  {/* Bar line */}
                                  <div className="w-[10px] h-[70px] bg-slate-800 rounded-full flex flex-col justify-end overflow-hidden">
                                    <div 
                                      className="bg-gradient-to-t from-orange-600 to-amber-400 rounded-full w-full transition-all duration-500"
                                      style={{ height: `${heightPct}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] text-slate-400 mt-2 font-medium">{item.day}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* KPI Performance Metrics */}
                        <div className="space-y-2 mb-5">
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">Performans Metrikleri</h4>
                          
                          <div className="bg-[#1E1F29]/40 border border-slate-850 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">📊</span>
                              <div>
                                <h5 className="text-[11.5px] font-bold text-white">Görev Başarı Oranı</h5>
                                <p className="text-[9.5px] text-slate-400">Tamamlanan görev oranı</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-orange-400">%88</span>
                          </div>

                          <div className="bg-[#1E1F29]/40 border border-slate-850 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">🎯</span>
                              <div>
                                <h5 className="text-[11.5px] font-bold text-white">Günlük Hedef</h5>
                                <p className="text-[9.5px] text-slate-400">Ortalama odak hedefi</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-indigo-400">6.5 sa/gün</span>
                          </div>
                        </div>

                        {/* Recent Completed Focus Sessions List */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-2">Oturum Geçmişi</h4>
                          <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
                            {sessions.map(sess => (
                              <div key={sess.id} className="bg-[#1E1F29] border border-slate-850 p-3 rounded-xl">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11.5px] font-bold text-slate-100 truncate max-w-[160px]">
                                    {sess.taskTitle ? `🎯 ${sess.taskTitle}` : 'Genel Odak Oturumu'}
                                  </span>
                                  <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                    {Math.round(sess.duration / 60)} dk
                                  </span>
                                </div>
                                {sess.notes && (
                                  <p className="text-[10.5px] text-slate-400 italic mt-1 bg-slate-900/60 p-1.5 rounded border border-slate-850/65">
                                    “{sess.notes}”
                                  </p>
                                )}
                                <div className="flex justify-between items-center text-[9px] text-slate-500 mt-2">
                                  <span>Odaklanma</span>
                                  <span>{sess.date}</span>
                                </div>
                              </div>
                            ))}
                            {sessions.length === 0 && (
                              <div className="text-center py-6 bg-[#1E1F29]/30 rounded-xl border border-dashed border-slate-800">
                                <p className="text-xs text-slate-500">Kayıtlı oturum bulunamadı.</p>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    )}


                    {/* TAB SCREEN: PROFILE & STREAKS (PROFİL) */}
                    {activeTab === 'profile' && (
                      <div className="px-5">
                        
                        {/* Avatar Header */}
                        <div className="flex flex-col items-center py-4 text-center">
                          <div className="relative mb-2">
                            <img 
                              src={userProfile.avatar} 
                              alt="avatar" 
                              referrerPolicy="no-referrer"
                              className="w-20 h-20 rounded-full border-3 border-indigo-500 object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-slate-900">
                              ⚡
                            </div>
                          </div>

                          {editingProfileName ? (
                            <div className="flex gap-1.5 items-center justify-center w-full px-2">
                              <input 
                                type="text"
                                value={profileNameInput}
                                onChange={(e) => setProfileNameInput(e.target.value)}
                                className="bg-[#1E1F29] border border-indigo-500 rounded-lg text-xs py-1 px-2 text-center text-white"
                                placeholder="İsim yazın..."
                                autoFocus
                              />
                              <button 
                                onClick={() => {
                                  if (profileNameInput.trim() !== '') {
                                    setUserProfile(prev => ({ ...prev, name: profileNameInput }));
                                    setEditingProfileName(false);
                                    showSimulatedToast("İsim başarıyla güncellendi.", "success");
                                  }
                                }}
                                className="bg-[#FF8906] hover:bg-[#FF8906]/90 px-2 py-1 text-[10px] rounded text-white font-bold"
                              >
                                Ekle
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-1 justify-center">
                                <h3 className="text-base font-bold text-white">{userProfile.name}</h3>
                                <button 
                                  onClick={() => setEditingProfileName(true)}
                                  className="text-slate-450 hover:text-white text-xs pl-0.5"
                                >
                                  ✏️
                                </button>
                              </div>
                              <span className="text-[11px] font-semibold text-orange-400 mt-0.5 block">{userProfile.title}</span>
                            </div>
                          )}
                        </div>

                        {/* Profil Rekor Sayıları Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-[#1E1F29]/70 border border-slate-850 rounded-xl p-2.5 text-center">
                            <span className="text-xs font-bold text-white block">{userProfile.streakRecord} Gün</span>
                            <span className="text-[8.5px] text-slate-400 block mt-0.5">Seri Rekoru</span>
                          </div>

                          <div className="bg-[#1E1F29]/70 border border-slate-850 rounded-xl p-2.5 text-center">
                            <span className="text-xs font-bold text-white block">{Math.round(userProfile.totalFocusTime / 60)} dk</span>
                            <span className="text-[8.5px] text-slate-400 block mt-0.5">Toplam Odak</span>
                          </div>

                          <div className="bg-[#1E1F29]/70 border border-slate-850 rounded-xl p-2.5 text-center">
                            <span className="text-xs font-bold text-white block">
                              {tasks.filter(t => t.completed).length + sessions.length}
                            </span>
                            <span className="text-[8.5px] text-slate-400 block mt-0.5">Bitirilen İş</span>
                          </div>
                        </div>

                        {/* Next Level Progression Card */}
                        <div className="bg-[#1C1625] border border-[#3E103E] rounded-xl p-3.5 mb-5">
                          <div className="flex justify-between items-center text-xs text-slate-100 font-bold mb-1.5">
                            <h4>Sonraki Seviye Hedefi</h4>
                            <span className="text-[#D1ACFF] text-[10px]">75% Tamamlandı</span>
                          </div>
                          {/* Progress bar line */}
                          <div className="w-full h-2 bg-[#2D233C] rounded-full overflow-hidden mb-1.5">
                            <div className="bg-[#A855F7] h-full rounded-full" style={{ width: '75%' }} />
                          </div>
                          <span className="text-[9.5px] text-slate-400 block italic">Sonraki unvan: "Odaklanma Gurusu" 💎</span>
                        </div>

                        {/* Achievement Badges Segment */}
                        <div className="mb-4">
                          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-2.5">Sertifikalı Başarılar</h4>
                          
                          <div className="grid grid-cols-2 gap-2 max-h-[145px] overflow-y-auto pr-1">
                            {achievements.map(ach => (
                              <div 
                                key={ach.id} 
                                className={`p-2.5 rounded-xl border border-slate-850 text-center flex flex-col items-center justify-between ${
                                  ach.unlocked ? 'bg-[#1E1F29]' : 'bg-[#1E1F29]/30 opacity-40'
                                }`}
                              >
                                <span className="text-xl mb-1.5">
                                  {ach.icon === 'zap' ? '⚡' : 
                                   ach.icon === 'award' ? '🏆' : 
                                   ach.icon === 'clipboard' ? '📋' : 
                                   ach.icon === 'clock' ? '⏱️' : 
                                   ach.icon === 'sun' ? '☀️' : '🛡️'}
                                </span>
                                <h5 className="text-[10.5px] font-bold text-white leading-tight">{ach.title}</h5>
                                <p className="text-[8px] text-slate-400 mt-1 line-clamp-2 leading-snug">{ach.description}</p>
                                
                                <span className="text-[7.5px] font-bold uppercase mt-2 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                                  {ach.unlocked ? 'Kilit Açık' : 'Kilitli'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* SMARTPHONE BOTTOM BAR NAVIGATION TAB (Expo Tab Simulator) */}
                  <div className="h-16 bg-[#1E1F29] border-t border-slate-800 flex items-center justify-around px-2 py-1 select-none z-30">
                    
                    <button 
                      onClick={() => setActiveTab('home')}
                      className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                        activeTab === 'home' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-base">🏠</span>
                      <span className="text-[9px] font-semibold mt-0.5">Ana Sayfa</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('focus')}
                      className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                        activeTab === 'focus' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-base">⏱️</span>
                      <span className="text-[9px] font-semibold mt-0.5">Odak</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('stats')}
                      className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                        activeTab === 'stats' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-base">📈</span>
                      <span className="text-[9px] font-semibold mt-0.5">Analiz</span>
                      {sessions.length > 2 && (
                        <span className="absolute top-1 right-5 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      )}
                    </button>

                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                        activeTab === 'profile' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-base">👤</span>
                      <span className="text-[9px] font-semibold mt-0.5">Profil</span>
                    </button>

                  </div>

                  {/* BOTTOM iOS HOME INDICATOR BAR */}
                  <div className="h-3 bg-[#0F0E17] flex items-center justify-center pb-1">
                    <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
                  </div>

                </div>
              )}

            </div>
          </div>
          
          <div className="text-center mt-3 max-w-[280px]">
            <p className="text-[10px] text-slate-500 italic leading-relaxed">
              * Bu bir interaktif React Native/Zustand simülatörüdür. Sol panelden verileri değiştirebilir, sayaç çalıştırabilir ve sağ panelden Expo dosyalarını kopyalayabilirsiniz.
            </p>
          </div>

        </section>

        {/* RIGHT COMPONENT: DEV EXPLORER / CODE VIEWER PANEL (8 COLUMNS) */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          
          {/* WINDOW STYLED TOP BAR */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-505 bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-slate-700 ml-2 font-mono">|</span>
              <span className="text-xs font-mono text-slate-300 font-semibold bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>{getFileName()}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 italic mr-2">Cihazla Senkronize React Native Kodu</span>
              <button 
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all bg-indigo-600"
              >
                {copiedFile ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kodu Kopyala</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* CODE FILES SELECTOR TABS BAR */}
          <div className="bg-slate-950/40 p-2 border-b border-slate-905 border-slate-850 overflow-x-auto flex gap-1 custom-scrollbar">
            
            <button
              onClick={() => setSelectedFile('guide')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                selectedFile === 'guide' 
                  ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <Sparkles className="w-3 text-amber-400" />
              <span>1. Kurulum Rehberi</span>
            </button>

            <button
              onClick={() => setSelectedFile('types')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
                selectedFile === 'types' 
                  ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <span className="text-indigo-400 text-[10px] font-mono">TS</span>
              <span>types.ts</span>
            </button>

            <button
              onClick={() => setSelectedFile('store')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
                selectedFile === 'store' 
                  ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <span className="text-yellow-400 text-[10px] font-mono">JS</span>
              <span>store.ts (Zustand)</span>
            </button>

            <button
              onClick={() => setSelectedFile('app')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
                selectedFile === 'app' 
                  ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <span className="text-sky-400 text-[10px] font-mono font-bold">X</span>
              <span>App.tsx (Navigator)</span>
            </button>

            <button
              onClick={() => setSelectedFile('home')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
                selectedFile === 'home' 
                  ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <span className="text-orange-400 text-[10px] font-mono">R</span>
              <span>HomeScreen.tsx</span>
            </button>

            <button
              onClick={() => setSelectedFile('focus')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
                selectedFile === 'focus' 
                  ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <span className="text-orange-400 text-[10px] font-mono">R</span>
              <span>FocusScreen.tsx</span>
            </button>

            <button
              onClick={() => setSelectedFile('stats')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
                selectedFile === 'stats' 
                  ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <span className="text-orange-400 text-[10px] font-mono">R</span>
              <span>StatsScreen.tsx</span>
            </button>

            <button
              onClick={() => setSelectedFile('profile')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
                selectedFile === 'profile' 
                  ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <span className="text-orange-400 text-[10px] font-mono">R</span>
              <span>ProfileScreen.tsx</span>
            </button>

          </div>

          {/* THE EDITOR CONTENT SCREEN */}
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-950 font-mono text-xs sm:text-[13px] leading-relaxed custom-scrollbar max-h-[580px] select-text">
            {selectedFile === 'guide' ? (
              <div className="text-slate-300 font-sans p-2 prose prose-invert max-w-none">
                
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
                  <span className="p-1 px-1 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono">EXPO</span>
                  Yerel Ortam Kurulum Talimatları 📱
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  "Adım Adım" mobil projesi standard Expo Go altyapısına göre hazırlanmıştır. Geliştirilen kaynak dosyalar TypeScript kuralları ve Zustand modellemesi ile tam entegre çalışır.
                </p>

                <div className="my-5 bg-indigo-950/40 border border-indigo-900/30 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Neden React Native / Expo Tercih Edildi?</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-[11.5px] text-slate-300 font-sans mt-2">
                    <li><strong>Platformlar Arası (Cross-Platform)</strong>: Tek bir kod tabanıyla hem iOS hem de Android için derleyebilirsiniz.</li>
                    <li><strong>Hızlı Hot Reloading</strong>: Kodda yaptığınız değişiklikler saniyeler içinde doğrudan simülatöre veya cihazınıza yansır.</li>
                    <li><strong>Zustand & AsyncStorage Kalıcılığı</strong>: Önemli Pomodoro verilerinizi ve görevlerinizi yerel disk depolamasında otomatik tutar.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 mb-1">Adım 1: Yeni Expo Projesi Oluşturma</h4>
                    <pre className="bg-slate-900 p-3.5 rounded-xl text-slate-300 font-mono text-xs border border-slate-800">
                      npx create-expo-app@latest AdimAdim --template blank-typescript
                      {"\n"}cd AdimAdim
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-100 mb-1">Adım 2: Gerekli Kütüphanelerin Temini</h4>
                    <pre className="bg-slate-900 p-3.5 rounded-xl text-slate-300 font-mono text-xs border border-slate-800">
                      npm install @react-navigation/native @react-navigation/bottom-tabs
                      {"\n"}npx expo install react-native-screens react-native-safe-area-context
                      {"\n"}npm install zustand
                      {"\n"}npx expo install @react-native-async-storage/async-storage
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-100 mb-1">Adım 3: Kaynak Dosyaların Yerleşimi ve Uygulamayı Başlatma</h4>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                      Üst sekmelerde yer alan <strong className="text-indigo-400">types.ts</strong>, <strong className="text-indigo-400">store.ts</strong>, <strong className="text-indigo-400">App.tsx</strong> ve <strong className="text-indigo-400 font-mono">screens/</strong> dosyalarının kodlarını projenize kopyalayıp yerleştirin. Ardından alttaki komutla yerel simülasyonu çalıştırın:
                    </p>
                    <pre className="bg-slate-900 p-3.5 rounded-xl text-slate-300 font-mono text-xs border border-slate-800">
                      npx expo start
                    </pre>
                  </div>
                </div>

              </div>
            ) : (
              <pre className="text-slate-300 whitespace-pre font-mono leading-relaxed select-text">
                <code>{getFileContent()}</code>
              </pre>
            )}
          </div>

          {/* DIRECTORY CONTEXT INDICATOR */}
          <div className="bg-slate-950 px-6 py-3 border-t border-slate-850/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Dizin Yolu: <strong className="text-indigo-400">/src/react-native/...</strong></span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Tüm dosyalar diske güvenle kaydedilmiştir</span>
            </span>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-5 mt-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 text-center md:text-left">
          <span>&copy; 2026 Adım Adım Focus Inc. Başarıya adım adım yaklaşın.</span>
          <span className="hidden md:inline mx-2 text-slate-800">|</span>
          <span className="block md:inline mt-1 md:mt-0 font-mono">Ankara Üniversitesi Bilgisayar Mühendisliği BLM 4538 Proje Çıktısı</span>
        </div>
        
        <div className="flex gap-4">
          <span className="text-[11px] bg-slate-900 border border-slate-850 px-3 py-1 text-slate-400 rounded-lg">
            Teknolojiler: <strong>React Native, Expo, Zustand, TypeScript</strong>
          </span>
        </div>
      </footer>

    </div>
  );
}
