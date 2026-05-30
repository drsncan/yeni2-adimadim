// @ts-nocheck
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
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
      
      {/* Üst Kısım / Header */}
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
        {/* Özet Kartları Row */}
        <View style={styles.statsRow}>
          {/* Seri (Streak) Kartı */}
          <View style={styles.statCard}>
            <Text style={styles.statCardEmoji}>🔥</Text>
            <Text style={styles.statCardValue}>{currentStreak} Gün</Text>
            <Text style={styles.statCardTitle}>Mevcut Seri</Text>
          </View>

          {/* Tamamlama Oranı Kartı */}
          <View style={styles.statCard}>
            <Text style={styles.statCardEmoji}>🎯</Text>
            <Text style={styles.statCardValue}>%{completionRate}</Text>
            <Text style={styles.statCardTitle}>Görev Oranı</Text>
          </View>
        </View>

        {/* Aktif Odaklanma Oturumu Daveti (Hızlı Kısayol) */}
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

        {/* Yeni Görev Ekleme Alanı */}
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

        {/* Görev Listesi */}
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
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  welcomeText: {
    color: '#a0a0ab',
    fontSize: 14,
    fontFamily: 'System',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF8906',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3a3a4a',
  },
  profileBadgeText: {
    color: '#FFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#2E2F3E',
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statCardEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statCardValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCardTitle: {
    color: '#8F8F9F',
    fontSize: 12,
  },
  focusShortcutCard: {
    backgroundColor: '#3E342B',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#6246EA',
  },
  focusShortcutLeft: {
    flex: 1,
    marginRight: 10,
  },
  focusTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  focusSubtitle: {
    color: '#b0b1c0',
    fontSize: 12,
  },
  focusButton: {
    backgroundColor: '#FF8906',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  focusButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: '#8F8F9F',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#1E1F29',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  addButton: {
    width: 60,
    height: 50,
    backgroundColor: '#6246EA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#8F8F9F',
    fontSize: 14,
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1F29',
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderColor: '#FF8906',
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#FF8906',
  },
  checkmark: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  taskText: {
    color: '#E1E1E6',
    fontSize: 15,
    flex: 1,
  },
  taskTextCompleted: {
    color: '#8F8F9F',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: '#FF453A',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
