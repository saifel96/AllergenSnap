import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RiskSummaryCardsProps {
  allergensCount: number;
  toxinsCount: number;
  additivesCount: number;
  safeCount: number;
}

export const RiskSummaryCards: React.FC<RiskSummaryCardsProps> = ({
  allergensCount,
  toxinsCount,
  additivesCount,
  safeCount,
}) => {
  const cards = [
    {
      title: 'Allergens',
      count: allergensCount,
      icon: 'medical',
      color: '#FF3B30',
      bgColor: '#FF3B30' + '20',
    },
    {
      title: 'Toxins',
      count: toxinsCount,
      icon: 'warning',
      color: '#FF9500',
      bgColor: '#FF9500' + '20',
    },
    {
      title: 'Additives',
      count: additivesCount,
      icon: 'flask',
      color: '#FF9500',
      bgColor: '#FF9500' + '20',
    },
    {
      title: 'Safe',
      count: safeCount,
      icon: 'checkmark-circle',
      color: '#34C759',
      bgColor: '#34C759' + '20',
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <View key={index} style={[styles.card, { backgroundColor: card.bgColor }]}>
          <View style={styles.cardHeader}>
            <Ionicons name={card.icon as any} size={20} color={card.color} />
            <Text style={[styles.cardCount, { color: card.color }]}>
              {card.count}
            </Text>
          </View>
          <Text style={styles.cardTitle}>{card.title}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  cardCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
});