import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Finding, Language } from '../types/productResult';

interface FindingsSectionProps {
  positiveFindings: Finding[];
  negativeFindings: Finding[];
  language: Language;
}

export const FindingsSection: React.FC<FindingsSectionProps> = ({
  positiveFindings,
  negativeFindings,
  language,
}) => {
  const renderFinding = (finding: Finding, index: number) => (
    <View key={index} style={styles.findingItem}>
      <Ionicons 
        name={finding.icon as any} 
        size={16} 
        color={finding.status === 'positive' ? '#22C55E' : '#EF4444'} 
      />
      <Text style={styles.findingText}>
        {language === 'de' ? finding.textDe : finding.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Positive Findings */}
      {positiveFindings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
            <Text style={[styles.sectionTitle, { color: '#22C55E' }]}>
              {language === 'de' ? 'Positiv' : 'Positive'}
            </Text>
          </View>
          <View style={styles.findingsList}>
            {positiveFindings.map(renderFinding)}
          </View>
        </View>
      )}

      {/* Negative Findings */}
      {negativeFindings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>
              {language === 'de' ? 'Negativ' : 'Negative'}
            </Text>
          </View>
          <View style={styles.findingsList}>
            {negativeFindings.map(renderFinding)}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  findingsList: {
    gap: 8,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  findingText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});