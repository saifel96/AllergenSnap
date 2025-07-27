import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CategoryBreakdownProps {
  data: Record<string, number>;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Category Breakdown</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  const categories = Object.entries(data)
    .map(([category, count]) => ({
      category: category.replace('en:', '').replace(/-/g, ' '),
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Show top 5 categories

  const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5AC8FA'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Breakdown</Text>
      
      <View style={styles.chartContainer}>
        {categories.map((item, index) => (
          <View key={item.category} style={styles.categoryRow}>
            <View style={styles.categoryInfo}>
              <View
                style={[
                  styles.colorIndicator,
                  { backgroundColor: colors[index] || '#8E8E93' },
                ]}
              />
              <Text style={styles.categoryName}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Text>
            </View>
            <View style={styles.categoryStats}>
              <Text style={styles.categoryCount}>{item.count}</Text>
              <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Products: {total}</Text>
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
  chartContainer: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    minWidth: 30,
    textAlign: 'right',
  },
  categoryPercentage: {
    fontSize: 13,
    color: '#8E8E93',
    minWidth: 35,
    textAlign: 'right',
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  totalText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
  },
});