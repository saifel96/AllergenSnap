import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Allergen {
  id: string;
  label: string;
  icon: string;
}

interface AllergenSelectorProps {
  allergens: Allergen[];
  selectedAllergens: string[];
  onAllergenToggle: (allergenId: string) => void;
}

export const AllergenSelector: React.FC<AllergenSelectorProps> = ({
  allergens,
  selectedAllergens,
  onAllergenToggle,
}) => {
  return (
    <View style={styles.container}>
      {allergens.map((allergen) => (
        <TouchableOpacity
          key={allergen.id}
          style={[
            styles.allergenChip,
            selectedAllergens.includes(allergen.id) && styles.allergenChipActive,
          ]}
          onPress={() => onAllergenToggle(allergen.id)}
        >
          <Text style={styles.allergenIcon}>{allergen.icon}</Text>
          <Text style={[
            styles.allergenLabel,
            selectedAllergens.includes(allergen.id) && styles.allergenLabelActive,
          ]}>
            {allergen.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  allergenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  allergenChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  allergenIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  allergenLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  allergenLabelActive: {
    color: '#FFFFFF',
  },
});