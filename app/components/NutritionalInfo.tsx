import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NutritionalData, Language } from '../types/productResult';

interface NutritionalInfoProps {
  data: NutritionalData;
  language: Language;
}

export const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ data, language }) => {
  const renderNutrientRow = (label: string, value: number, unit: string) => (
    <View style={styles.nutrientRow}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <Text style={styles.nutrientValue}>{value}{unit}</Text>
    </View>
  );

  const renderVerdict = (verdict: any, index: number) => {
    const getVerdictColor = (status: string) => {
      switch (status) {
        case 'positive': return '#22C55E';
        case 'negative': return '#EF4444';
        default: return '#F59E0B';
      }
    };

    return (
      <View key={index} style={[styles.verdictChip, { borderColor: getVerdictColor(verdict.status) }]}>
        <Ionicons 
          name={verdict.icon} 
          size={14} 
          color={getVerdictColor(verdict.status)} 
        />
        <Text style={[styles.verdictText, { color: getVerdictColor(verdict.status) }]}>
          {language === 'de' ? verdict.labelDe : verdict.label}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'de' ? 'Nährwerte pro 100g' : 'Nutrition per 100g'}
      </Text>
      
      <View style={styles.nutrientsGrid}>
        {renderNutrientRow(
          language === 'de' ? 'Kalorien' : 'Calories', 
          data.per100g.calories, 
          ' kcal'
        )}
        {renderNutrientRow(
          language === 'de' ? 'Protein' : 'Protein', 
          data.per100g.protein, 
          'g'
        )}
        {renderNutrientRow(
          language === 'de' ? 'Ballaststoffe' : 'Fiber', 
          data.per100g.fiber, 
          'g'
        )}
        {renderNutrientRow(
          language === 'de' ? 'Zucker' : 'Sugar', 
          data.per100g.sugar, 
          'g'
        )}
        {renderNutrientRow(
          language === 'de' ? 'Salz' : 'Salt', 
          data.per100g.salt, 
          'g'
        )}
        {data.per100g.fat && renderNutrientRow(
          language === 'de' ? 'Fett' : 'Fat', 
          data.per100g.fat, 
          'g'
        )}
      </View>

      <View style={styles.verdictsContainer}>
        <Text style={styles.verdictsTitle}>
          {language === 'de' ? 'Bewertung' : 'Assessment'}
        </Text>
        <View style={styles.verdictsGrid}>
          {data.verdicts.map(renderVerdict)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  nutrientsGrid: {
    gap: 8,
    marginBottom: 20,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  verdictsContainer: {
    marginTop: 8,
  },
  verdictsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  verdictsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  verdictChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  verdictText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});