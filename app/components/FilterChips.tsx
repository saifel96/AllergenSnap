import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterOption {
  id: string;
  label: string;
  icon: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ 
  options, 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.chip,
            activeFilter === option.id && styles.activeChip,
          ]}
          onPress={() => onFilterChange(option.id)}
        >
          <Ionicons
            name={option.icon as any}
            size={16}
            color={activeFilter === option.id ? '#FFFFFF' : '#8E8E93'}
            style={styles.chipIcon}
          />
          <Text
            style={[
              styles.chipText,
              activeFilter === option.id && styles.activeChipText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
});