import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickStatsCardProps {
  stats: {
    totalScans: number;
    risksAvoided: number;
    averageScore: number;
  };
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Ionicons name="scan" size={20} color="#007AFF" />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statNumber}>{stats.totalScans}</Text>
          <Text style={styles.statLabel}>Products Scanned</Text>
        </View>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statNumber}>{stats.risksAvoided}</Text>
          <Text style={styles.statLabel}>Risks Avoided</Text>
        </View>
      </View>
      
      {stats.averageScore > 0 && (
        <>
          <View style={styles.separator} />
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="trending-up" size={20} color="#FF9500" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{stats.averageScore}</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  separator: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
});