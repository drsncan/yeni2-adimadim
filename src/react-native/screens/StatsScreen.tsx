// @ts-nocheck
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
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
        
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İLERLEME VE ANALİZ</Text>
          <Text style={styles.headerSubtitle}>Gelişim İstatistikleri 📈</Text>
        </View>

        {/* Özet Kartları Row */}
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

        {/* Haftalık İlerleme Sütun Grafiği (Custom React Native Bar Chart) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Haftalık Genel Bakış (Odaklanma Saati)</Text>
          <Text style={styles.chartSubtitle}>Pazartesi - Pazar Günlük Grafiği</Text>

          <View style={styles.barChartContainer}>
            {dailyStats.map((item, index) => {
              // En yüksek değere göre yükseklik hesabı (örnek max 8 saat)
              const maxHourLimit = 8;
              const barHeightPct = Math.min((item.focusHours / maxHourLimit) * 100, 100);
              
              return (
                <View key={index} style={styles.chartColumn}>
                  <Text style={styles.barValueText}>{item.focusHours > 0 ? `${item.focusHours}h` : ''}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${barHeightPct}%` }]} />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Temel Performans Göstergeleri (KPI Cards) */}
        <View style={styles.statsGrid}>
          <Text style={styles.sectionTitle}>Performans Göstergeleri</Text>
          
          <View style={styles.kpiItem}>
            <View style={styles.kpiLeft}>
              <Text style={styles.kpiEmoji}>📊</Text>
              <View>
                <Text style={styles.kpiTitle}>Görev Başarı Oranı</Text>
                <Text style={styles.kpiDesc}>Tamamlanan işlerin toplam görevlere oranı</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>%{user.completedTasksCount > 0 ? '88' : '0'}</Text>
          </View>

          <View style={styles.kpiItem}>
            <View style={styles.kpiLeft}>
              <Text style={styles.kpiEmoji}>🎯</Text>
              <View>
                <Text style={styles.kpiTitle}>Günlük Odaklanma Hedefi</Text>
                <Text style={styles.kpiDesc}>Gün başına ortalama 6.5 saat / 7 gün</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>6.5 / 7 s</Text>
          </View>

          <View style={styles.kpiItem}>
            <View style={styles.kpiLeft}>
              <Text style={styles.kpiEmoji}>🔋</Text>
              <View>
                <Text style={styles.kpiTitle}>İstikrar Skoru</Text>
                <Text style={styles.kpiDesc}>Haftalık aktif kalınan gün sayısı</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>6/7 Gün</Text>
          </View>
        </View>

        {/* Son Odaklanma Oturumları Geçmişi */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Son İlgilenilen Oturumlar</Text>
          
          {sessions.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>Henüz kayıtlı bir odaklanma seansı yok. İlk Pomodoro'nuzu tamamlayın!</Text>
            </View>
          ) : (
            sessions.map((session) => (
              <View key={session.id} style={styles.historyItem}>
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyItemTask}>
                    {session.taskTitle ? `🎯 ${session.taskTitle}` : 'Genel Odak Seansı'}
                  </Text>
                  <Text style={styles.historyItemDuration}>
                    {Math.round(session.duration / 60)} dk
                  </Text>
                </View>
                {session.notes ? (
                  <Text style={styles.historyItemNotes}>“{session.notes}”</Text>
                ) : null}
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
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
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
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  highlightCard: {
    backgroundColor: '#1E1F29',
    width: '48%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  highlightValue: {
    color: '#6246EA',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  highlightLabel: {
    color: '#8F8F9F',
    fontSize: 12,
  },
  chartCard: {
    backgroundColor: '#1E1F29',
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  chartSubtitle: {
    color: '#8F8F9F',
    fontSize: 11,
    marginBottom: 20,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 10,
  },
  chartColumn: {
    alignItems: 'center',
    width: '12%',
  },
  barValueText: {
    color: '#E1E1E6',
    fontSize: 10,
    marginBottom: 4,
    fontWeight: '600',
  },
  barTrack: {
    height: 110,
    width: 14,
    backgroundColor: '#2D2D3D',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#FF8906',
    borderRadius: 8,
  },
  barLabel: {
    color: '#8F8F9F',
    fontSize: 10,
    marginTop: 6,
    fontWeight: '500',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    marginBottom: 25,
  },
  kpiItem: {
    flexDirection: 'row',
    backgroundColor: '#1E1F29',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  kpiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  kpiEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  kpiTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  kpiDesc: {
    color: '#8F8F9F',
    fontSize: 11,
    marginTop: 2,
  },
  kpiValue: {
    color: '#FF8906',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  },
  historyContainer: {
    marginBottom: 10,
  },
  emptyHistory: {
    backgroundColor: '#1E1F29',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyHistoryText: {
    color: '#8F8F9F',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  historyItem: {
    backgroundColor: '#1E1F29',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyItemTask: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyItemDuration: {
    color: '#6246EA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  historyItemNotes: {
    color: '#B2B2C0',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  historyItemDate: {
    color: '#8F8F9F',
    fontSize: 10,
  }
});
