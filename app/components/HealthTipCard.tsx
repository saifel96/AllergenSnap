import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HEALTH_TIPS = [
  {
    title: 'Read Ingredient Lists',
    description: 'Ingredients are listed by weight. If sugar is in the first few ingredients, the product is high in sugar.',
    icon: 'list-outline',
    color: '#007AFF',
  },
  {
    title: 'Watch for Hidden Sugars',
    description: 'Sugar has many names: high fructose corn syrup, dextrose, maltose, and sucrose are all forms of sugar.',
    icon: 'eye-outline',
    color: '#FF9500',
  },
  {
    title: 'Choose Organic When Possible',
    description: 'Organic products are free from synthetic pesticides, herbicides, and GMOs.',
    icon: 'leaf-outline',
    color: '#34C759',
  },
  {
    title: 'Limit Processed Foods',
    description: 'The more processed a food is, the more likely it contains artificial additives and preservatives.',
    icon: 'warning-outline',
    color: '#FF3B30',
  },
  {
    title: 'Check Sodium Levels',
    description: 'High sodium intake can lead to high blood pressure. Look for products with less than 140mg per serving.',
    icon: 'water-outline',
    color: '#5AC8FA',
  },
];

export const HealthTipCard: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    // Rotate tips daily
    const today = new Date().getDate();
    setCurrentTip(today % HEALTH_TIPS.length);
  }, []);

  const tip = HEALTH_TIPS[currentTip];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: tip.color + '20' }]}>
          <Ionicons name={tip.icon as any} size={24} color={tip.color} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.tipLabel}>Daily Health Tip</Text>
          <Text style={styles.tipTitle}>{tip.title}</Text>
        </View>
      </View>
      
      <Text style={styles.tipDescription}>
        {tip.description}
      </Text>
      
      <TouchableOpacity style={styles.learnMoreButton}>
        <Text style={styles.learnMoreText}>Learn More</Text>
        <Ionicons name="arrow-forward" size={16} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  tipLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 2,
  },
  tipDescription: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 22,
    marginBottom: 16,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 8,
  },
});