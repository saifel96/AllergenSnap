import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStoredScans, getStoredUserProfile } from '../utils/storage';
import { HealthTrendChart } from '../components/HealthTrendChart';
import { ExposureStatistics } from '../components/ExposureStatistics';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { AchievementBadges } from '../components/AchievementBadges';
import { WeeklyGoals } from '../components/WeeklyGoals';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [dashboardData, setDashboardData] = useState({
    weeklyScores: [],
    averageScore: 0,
    allergensAvoided: 0,
    toxinsDetected: 0,
    safeProductsPercentage: 0,
    categoryBreakdown: {},
    achievements: [],
    weeklyGoals: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const scans = await getStoredScans();
      const userProfile = await getStoredUserProfile();
      
      // Calculate weekly trend (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weeklyScans = scans.filter(scan => 
        new Date(scan.scannedAt) >= oneWeekAgo
      );

      // Group by day for trend chart
      const weeklyScores = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayScans = weeklyScans.filter(scan => {
          const scanDate = new Date(scan.scannedAt);
          return scanDate.toDateString() === date.toDateString();
        });
        
        const averageDayScore = dayScans.length > 0
          ? Math.round(dayScans.reduce((sum, scan) => sum + scan.healthScore, 0) / dayScans.length)
          : 0;
          
        weeklyScores.push({
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          score: averageDayScore,
        });
      }

      // Calculate statistics
      const averageScore = weeklyScans.length > 0
        ? Math.round(weeklyScans.reduce((sum, scan) => sum + scan.healthScore, 0) / weeklyScans.length)
        : 0;

      const allergensAvoided = weeklyScans.filter(scan => 
        scan.allergensDetected.length > 0
      ).length;

      const toxinsDetected = weeklyScans.reduce((sum, scan) => 
        sum + scan.toxinsDetected.length, 0
      );

      const safeProducts = weeklyScans.filter(scan => scan.healthScore >= 70).length;
      const safeProductsPercentage = weeklyScans.length > 0
        ? Math.round((safeProducts / weeklyScans.length) * 100)
        : 0;

      // Category breakdown
      const categoryBreakdown = weeklyScans.reduce((acc, scan) => {
        const category = scan.category || 'Unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Calculate achievements
      const achievements = calculateAchievements(scans, weeklyScans);

      // Weekly goals
      const weeklyGoals = {
        scanTarget: { current: weeklyScans.length, target: 10 },
        avgScoreTarget: { current: averageScore, target: 80 },
        safeProductsTarget: { current: safeProductsPercentage, target: 85 },
      };

      setDashboardData({
        weeklyScores,
        averageScore,
        allergensAvoided,
        toxinsDetected,
        safeProductsPercentage,
        categoryBreakdown,
        achievements,
        weeklyGoals,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (allScans, weeklyScans) => {
    const achievements = [];

    // Scan streak
    if (weeklyScans.length >= 7) {
      achievements.push({
        id: 'week-streak',
        title: '7-Day Streak',
        description: 'Scanned products every day this week',
        icon: '🔥',
        earned: true,
      });
    }

    // Toxin detective
    const toxinScans = allScans.filter(scan => scan.toxinsDetected.length > 0).length;
    if (toxinScans >= 10) {
      achievements.push({
        id: 'toxin-detective',
        title: 'Toxin Detective',
        description: 'Detected toxins in 10+ products',
        icon: '🕵️',
        earned: true,
      });
    }

    // Health champion
    const highScoreScans = allScans.filter(scan => scan.healthScore >= 80).length;
    if (highScoreScans >= 20) {
      achievements.push({
        id: 'health-champion',
        title: 'Health Champion',
        description: 'Found 20+ healthy products',
        icon: '🏆',
        earned: true,
      });
    }

    return achievements;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Dashboard</Text>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
          <Text style={styles.dateText}>This Week</Text>
        </View>
      </View>

      <HealthTrendChart data={dashboardData.weeklyScores} />

      <ExposureStatistics
        averageScore={dashboardData.averageScore}
        allergensAvoided={dashboardData.allergensAvoided}
        toxinsDetected={dashboardData.toxinsDetected}
        safeProductsPercentage={dashboardData.safeProductsPercentage}
      />

      <CategoryBreakdown data={dashboardData.categoryBreakdown} />

      <AchievementBadges achievements={dashboardData.achievements} />

      <WeeklyGoals goals={dashboardData.weeklyGoals} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 4,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    fontSize: 17,
    color: '#8E8E93',
  },
});