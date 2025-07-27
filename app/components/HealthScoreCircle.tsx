import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getHealthScoreColor } from '../utils/healthAnalysis';

interface HealthScoreCircleProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export const HealthScoreCircle: React.FC<HealthScoreCircleProps> = ({ 
  score, 
  size = 120, 
  showLabel = false 
}) => {
  const color = getHealthScoreColor(score);
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          borderWidth: size * 0.08,
        }
      ]}>
        <Text style={[styles.score, { fontSize: size * 0.25 }]}>
          {score}
        </Text>
        <Text style={[styles.maxScore, { fontSize: size * 0.12 }]}>
          /100
        </Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { color }]}>
          {getScoreLabel(score)}
        </Text>
      )}
    </View>
  );
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'High Risk';
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  score: {
    fontWeight: 'bold',
    color: '#000000',
  },
  maxScore: {
    color: '#8E8E93',
    marginTop: -4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
});