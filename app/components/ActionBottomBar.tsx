import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '../types/productResult';

interface ActionBottomBarProps {
  language: Language;
  onViewMore?: () => void;
  onReview?: () => void;
  onShare?: () => void;
  onAlternatives?: () => void;
}

export const ActionBottomBar: React.FC<ActionBottomBarProps> = ({
  language,
  onViewMore,
  onReview,
  onShare,
  onAlternatives,
}) => {
  const actions = [
    {
      icon: 'information-circle-outline',
      label: language === 'de' ? 'Mehr' : 'More',
      onPress: onViewMore,
    },
    {
      icon: 'star-outline',
      label: language === 'de' ? 'Bewerten' : 'Review',
      onPress: onReview,
    },
    {
      icon: 'share-outline',
      label: language === 'de' ? 'Teilen' : 'Share',
      onPress: onShare,
    },
    {
      icon: 'swap-horizontal-outline',
      label: language === 'de' ? 'Alternativen' : 'Alternatives',
      onPress: onAlternatives,
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.actionButton}
          onPress={action.onPress}
        >
          <Ionicons name={action.icon as any} size={24} color="#64748B" />
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
});