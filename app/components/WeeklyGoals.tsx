import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Goal {
  current: number;
  target: number;
}

interface WeeklyGoalsProps {
  goals: {
    scanTarget: Goal;
    avgScoreTarget: Goal;
    safeProductsTarget: Goal;
  };
}

export const WeeklyGoals: React.FC<WeeklyGoalsProps> = ({ goals }) => {
  const goalData = [
    {
      icon: 'scan-outline',
      title: 'Weekly Scans',
      current: goals.scanTarget.current,
      target: goals.scanTarget.target,
      unit: '',
      color: '#007AFF',
    },
    {
      icon: 'trending-up-outline',
      title: 'Average Score',
      current: goals.avgScoreTarget.current,
      target: goals.avgScoreTarget.target,
      unit: '',
      color: '#34C759',
    },
    {
      icon: 'checkmark-circle-outline',
      title: 'Safe Products',
      current: goals.safeProductsTarget.current,
      target: goals.safeProductsTarget.target,
      unit: '%',
      color: '#FF9500',
    },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Goals</Text>
      
      <View style={styles.goalsContainer}>
        {goalData.map((goal, index) => {
          const progress = getProgressPercentage(goal.current, goal.target);
          const isCompleted = progress >= 100;
          
          return (
            <View key={index} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                  <Ionicons name={goal.icon as any} size={20} color={goal.color} />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalProgress}>
                    {goal.current}{goal.unit} / {goal.target}{goal.unit}
                  </Text>
                </View>
                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${progress}%`,
                        backgroundColor: goal.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(progress)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 40,
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
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  goalProgress: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    minWidth: 35,
    textAlign: 'right',
  },
});