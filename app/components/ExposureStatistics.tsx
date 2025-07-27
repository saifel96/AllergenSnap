import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExposureStatisticsProps {
  averageScore: number;
  allergensAvoided: number;
  toxinsDetected: number;
  safeProductsPercentage: number;
}

export const ExposureStatistics: React.FC<ExposureStatisticsProps> = ({
  averageScore,
  allergensAvoided,
  toxinsDetected,
  safeProductsPercentage,
}) => {
  const stats = [
    {
      icon: 'analytics-outline',
      label: 'Average Score',
      value: `${averageScore}/100`,
      subtitle: 'This Week',
      color: averageScore >= 70 ? '#34C759' : averageScore >= 40 ? '#FF9500' : '#FF3B30',
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Allergens Avoided',
      value: allergensAvoided.toString(),
      subtitle: 'Incidents',
      color: '#34C759',
    },
    {
      icon: 'warning-outline',
      label: 'Toxins Detected',
      value: toxinsDetected.toString(),
      subtitle: 'Items',
      color: '#FF9500',
    },
    {
      icon: 'checkmark-circle-outline',
      label: 'Safe Products',
      value: `${safeProductsPercentage}%`,
      subtitle: 'Of scans',
      color: '#34C759',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exposure Statistics</Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
});