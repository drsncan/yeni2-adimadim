// @ts-nocheck
import React, { useEffect, useState } from 'react';
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

  // Geri sayım için useEffect tick bağlaması
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer.isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, tick]);

  // Zaman formatlama (ss:dd)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedTask = tasks.find(t => t.id === timer.selectedTaskId);
  const activeTasks = tasks.filter(t => !t.completed);

  // Kalan süre yüzdesi (progress bar gösterimi için)
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
        
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ODAKLANMA SEANSI</Text>
          <Text style={styles.headerSubtitle}>
            {timer.mode === 'work' ? 'Çalışma Zamanı 🎯' : 'Mola Zamanı ☕'}
          </Text>
        </View>

        {/* Çalışma / Mola Modu Seçicisi */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, timer.mode === 'work' && styles.modeTabActive]}
            onPress={() => setTimerMode('work')}
          >
            <Text style={[styles.modeTabText, timer.mode === 'work' && styles.modeTabTextActive]}>
              Pomodoro
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modeTab, timer.mode === 'break' && styles.modeTabActive]}
            onPress={() => setTimerMode('break')}
          >
            <Text style={[styles.modeTabText, timer.mode === 'break' && styles.modeTabTextActive]}>
              Kısa Mola
            </Text>
          </TouchableOpacity>
        </View>

        {/* Büyük Dairesel Süre Göstergesi */}
        <View style={styles.timerCircleOuter}>
          <View style={styles.timerCircleInner}>
            <Text style={styles.timerLabel}>Kalan Süre</Text>
            <Text style={styles.timerText}>{formatTime(timer.timeLeft)}</Text>
            <Text style={styles.taskStatusText}>
              {timer.isRunning ? 'Odaklanılıyor...' : 'HAZIR'}
            </Text>
          </View>
          {/* Progress Bar Geri Sayım Şeridi */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Görev İlişkilendirme */}
        <View style={styles.taskSelectorContainer}>
          <Text style={styles.sectionTitle}>İlişkili Görev</Text>
          <TouchableOpacity 
            style={styles.taskDropdown}
            onPress={() => setShowTaskSelector(!showTaskSelector)}
          >
            <Text style={styles.taskDropdownText}>
              {selectedTask ? `🎯 ${selectedTask.title}` : 'Görev seçilmedi (Dokun ve Seç)'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Görev Seçme Listesi (Accordion / Dropdown) */}
          {showTaskSelector && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity 
                style={[styles.dropdownItem, !timer.selectedTaskId && styles.dropdownItemActive]}
                onPress={() => {
                  selectTask(null);
                  setShowTaskSelector(false);
                }}
              >
                <Text style={styles.dropdownItemText}>Görevsiz Odaklan (Genel)</Text>
              </TouchableOpacity>
              
              {activeTasks.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.dropdownItem, timer.selectedTaskId === t.id && styles.dropdownItemActive]}
                  onPress={() => {
                    selectTask(t.id);
                    setShowTaskSelector(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{t.title}</Text>
                </TouchableOpacity>
              ))}

              {activeTasks.length === 0 && (
                <Text style={styles.noTasksWarning}>Aktif göreviniz bulunmuyor. Ana sekmeme gidip ekleyebilirsiniz.</Text>
              )}
            </View>
          )}
        </View>

        {/* Seans Not Alma Ekranı */}
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Seans Notları</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Odaklanma seansı sırasında aklınıza gelenleri not edin..."
            placeholderTextColor="#8F8F9F"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Kontrol Butonları */}
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
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    color: '#8F8F9F',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#1E1F29',
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#6246EA',
  },
  modeTabText: {
    color: '#8F8F9F',
    fontWeight: '600',
    fontSize: 14,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  timerCircleOuter: {
    alignSelf: 'center',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1E1F29',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#3E3F4E',
    shadowColor: '#6246EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  timerCircleInner: {
    alignItems: 'center',
    zIndex: 2,
  },
  timerLabel: {
    color: '#8F8F9F',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 4,
    fontFamily: 'System',
  },
  taskStatusText: {
    color: '#FF8906',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#2D2D3D',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF8906',
  },
  taskSelectorContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskDropdown: {
    backgroundColor: '#1E1F29',
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  taskDropdownText: {
    color: '#E1E1E6',
    fontSize: 14,
    flex: 1,
  },
  dropdownArrow: {
    color: '#8F8F9F',
    fontSize: 12,
  },
  dropdownMenu: {
    backgroundColor: '#1E1F29',
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#2D2D3D',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D3D',
  },
  dropdownItemActive: {
    backgroundColor: '#2E2F3E',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  noTasksWarning: {
    color: '#8F8F9F',
    fontSize: 12,
    padding: 16,
    textAlign: 'center',
  },
  notesContainer: {
    marginBottom: 25,
  },
  notesInput: {
    backgroundColor: '#1E1F29',
    borderRadius: 12,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  playBtn: {
    backgroundColor: '#FF8906',
  },
  pauseBtn: {
    backgroundColor: '#3E342B',
    borderWidth: 1,
    borderColor: '#FF8906',
  },
  resetBtn: {
    backgroundColor: '#2E2F3E',
  },
  doneBtn: {
    backgroundColor: '#6246EA',
  },
  btnDisabled: {
    backgroundColor: '#1C1B22',
    opacity: 0.5,
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
