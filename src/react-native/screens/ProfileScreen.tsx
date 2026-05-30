// @ts-nocheck
import React, { useState } from 'react';
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
    Alert.alert("Başarılı", "Profil adınız başarıyla güncellendi.");
  };

  const handleReset = () => {
    Alert.alert(
      "Verileri Temizle",
      "Tüm odaklanma verilerinizi ve görev geçmişinizi sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.",
      [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Sıfırla", 
          style: "destructive",
          onPress: () => {
            resetProgress();
            setUserName(user.name);
            Alert.alert("Tebrikler", "Tüm ilerlemeniz temizlendi, yeni bir başlangıç yapmaya hazırsınız!");
          }
        }
      ]
    );
  };

  // Saniye cinsinden saklanan değeri saate çevirme
  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Üst Kısım / Profil Başlığı */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.avatar} 
            />
            <View style={styles.editPenBadge}>
              <Text style={styles.editPenText}>✏️</Text>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editingContainer}>
              <TextInput
                style={styles.nameInput}
                value={userName}
                onChangeText={setUserName}
                autoFocus
              />
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

        {/* Özet Kart Kümesi */}
        <View style={styles.summaryStatsGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{user.streakRecord} Gün</Text>
            <Text style={styles.summaryLabel}>Seri Rekoru</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{formatHours(user.totalFocusTime)} sa</Text>
            <Text style={styles.summaryLabel}>Odaklanma Süresi</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{user.completedTasksCount}</Text>
            <Text style={styles.summaryLabel}>Tamamlanan Görev</Text>
          </View>
        </View>

        {/* İleri Seviye İlerleme Kartı */}
        <View style={styles.progressCard}>
          <Text style={styles.progressCardTitle}>Bir Sonraki Seviye İlerlemesi</Text>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>75% Tamamlandı</Text>
            <Text style={styles.progressDetails}>18 / 24 Oturum</Text>
          </View>
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarInner, { width: '75%' }]} />
          </View>
          <Text style={styles.progressBadgeHint}>Bir sonraki seviye: "Odaklanma Gurusu" 🌟</Text>
        </View>

        {/* Başarı Rozetleri (Achievements Badges) Grid */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Sertifikalı Başarı Rozetleri</Text>
          
          <View style={styles.badgesGrid}>
            {user.achievements.map((badge) => (
              <View 
                key={badge.id} 
                style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}
              >
                <Text style={[styles.badgeIcon, !badge.unlocked && styles.badgeIconLocked]}>
                  {badge.icon === 'zap' ? '⚡' : 
                   badge.icon === 'award' ? '🏆' : 
                   badge.icon === 'clipboard' ? '📋' : 
                   badge.icon === 'clock' ? '⏱️' : 
                   badge.icon === 'sun' ? '☀️' : '🛡️'}
                </Text>
                <Text style={[styles.badgeTitle, !badge.unlocked && styles.badgeTitleLocked]}>
                  {badge.title}
                </Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
                {badge.unlocked ? (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedBadgeText}>KİLİT AÇIK</Text>
                  </View>
                ) : (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeText}>KİLİTLİ</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Temizleme ve Ayarlar Butonları */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.resetSettingsBtn} onPress={handleReset}>
            <Text style={styles.resetSettingsBtnText}>Verileri Sıfırla ve Baştan Başla</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 25,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#6246EA',
  },
  editPenBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1E1F29',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0F0E17',
  },
  editPenText: {
    fontSize: 12,
  },
  nameContainer: {
    alignItems: 'center',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleText: {
    color: '#FF8906',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  editBtn: {
    backgroundColor: '#1E1F29',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  editBtnText: {
    color: '#8F8F9F',
    fontSize: 12,
    fontWeight: '600',
  },
  editingContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  nameInput: {
    width: '100%',
    height: 45,
    backgroundColor: '#1E1F29',
    color: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#6246EA',
  },
  saveBtn: {
    backgroundColor: '#6246EA',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1E1F29',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#a0a0ab',
    fontSize: 10,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: '#1C1625',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3E103E',
    marginBottom: 25,
  },
  progressCardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#D1ACFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressDetails: {
    color: '#8F8F9F',
    fontSize: 12,
  },
  progressBarOuter: {
    height: 10,
    backgroundColor: '#2E263D',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#A855F7',
    borderRadius: 5,
  },
  progressBadgeHint: {
    color: '#8F8F9F',
    fontSize: 11,
    fontStyle: 'italic',
  },
  achievementsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#1E1F29',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  badgeCardLocked: {
    opacity: 0.45,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  badgeIconLocked: {
    tintColor: '#a0a0ab',
  },
  badgeTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeTitleLocked: {
    color: '#8F8F9F',
  },
  badgeDesc: {
    color: '#8F8F9F',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 13,
  },
  unlockedBadge: {
    backgroundColor: '#FF8906',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unlockedBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  lockedBadge: {
    backgroundColor: '#2D2D3D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lockedBadgeText: {
    color: '#8F8F9F',
    fontSize: 8,
    fontWeight: 'bold',
  },
  settingsSection: {
    marginTop: 10,
  },
  resetSettingsBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#1C1515',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#511E1E',
  },
  resetSettingsBtnText: {
    color: '#FF453A',
    fontWeight: '700',
    fontSize: 13,
  }
});
