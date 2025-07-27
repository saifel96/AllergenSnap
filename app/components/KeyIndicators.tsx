import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductResult, Language } from '../types/productResult';

interface KeyIndicatorsProps {
  product: ProductResult;
  language: Language;
}

export const KeyIndicators: React.FC<KeyIndicatorsProps> = ({ product, language }) => {
  const getMicroplasticsColor = (level: string): string => {
    switch (level) {
      case 'none': return '#22C55E';
      case 'minimal': return '#F59E0B';
      case 'likely': return '#EF4444';
      default: return '#94A3B8';
    }
  };

  const getMicroplasticsLabel = (level: string): string => {
    if (language === 'de') {
      switch (level) {
        case 'none': return 'Keine';
        case 'minimal': return 'Minimal';
        case 'likely': return 'Wahrscheinlich';
        default: return 'Unbekannt';
      }
    }
    
    switch (level) {
      case 'none': return 'None';
      case 'minimal': return 'Minimal';
      case 'likely': return 'Likely';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'de' ? 'Wichtige Indikatoren' : 'Key Indicators'}
      </Text>
      
      {/* Lab Tested */}
      <View style={styles.indicatorRow}>
        <View style={styles.indicatorLeft}>
          <Ionicons name="flask" size={20} color="#64748B" />
          <Text style={styles.indicatorLabel}>
            {language === 'de' ? 'Laborgeprüft' : 'Lab Tested'}
          </Text>
        </View>
        <View style={styles.indicatorRight}>
          <View style={[
            styles.statusDot,
            { backgroundColor: product.labTested ? '#22C55E' : '#EF4444' }
          ]} />
          <Text style={[
            styles.indicatorValue,
            { color: product.labTested ? '#22C55E' : '#EF4444' }
          ]}>
            {product.labTested 
              ? (language === 'de' ? 'Ja' : 'Yes')
              : (language === 'de' ? 'Nein' : 'No')
            }
          </Text>
          {product.testCount && (
            <Text style={styles.testCount}>
              ({product.testCount} {language === 'de' ? 'Tests' : 'tests'})
            </Text>
          )}
        </View>
      </View>

      {/* Microplastics */}
      <View style={styles.indicatorRow}>
        <View style={styles.indicatorLeft}>
          <Ionicons name="water" size={20} color="#64748B" />
          <Text style={styles.indicatorLabel}>
            {language === 'de' ? 'Mikroplastik' : 'Microplastics'}
          </Text>
        </View>
        <View style={styles.indicatorRight}>
          <View style={[
            styles.statusDot,
            { backgroundColor: getMicroplasticsColor(product.microplastics) }
          ]} />
          <Text style={[
            styles.indicatorValue,
            { color: getMicroplasticsColor(product.microplastics) }
          ]}>
            {getMicroplasticsLabel(product.microplastics)}
          </Text>
        </View>
      </View>

      {/* Contaminants */}
      <View style={styles.indicatorRow}>
        <View style={styles.indicatorLeft}>
          <Ionicons name="alert-triangle" size={20} color="#64748B" />
          <Text style={styles.indicatorLabel}>
            {language === 'de' ? 'Schadstoffe' : 'Contaminants'}
          </Text>
        </View>
        <View style={styles.indicatorRight}>
          {product.contaminants.length === 0 ? (
            <>
              <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
              <Text style={[styles.indicatorValue, { color: '#22C55E' }]}>
                {language === 'de' ? 'Keine' : 'None'}
              </Text>
            </>
          ) : (
            <>
              <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.indicatorValue, { color: '#EF4444' }]}>
                {product.contaminants.length} {language === 'de' ? 'gefunden' : 'detected'}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Beneficial Ingredients */}
      {product.beneficialIngredients.length > 0 && (
        <View style={styles.indicatorRow}>
          <View style={styles.indicatorLeft}>
            <Ionicons name="heart" size={20} color="#64748B" />
            <Text style={styles.indicatorLabel}>
              {language === 'de' ? 'Nützliche Inhaltsstoffe' : 'Beneficial Ingredients'}
            </Text>
          </View>
          <View style={styles.indicatorRight}>
            <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
            <Text style={[styles.indicatorValue, { color: '#22C55E' }]}>
              {product.beneficialIngredients.length} {language === 'de' ? 'vorhanden' : 'present'}
            </Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  indicatorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicatorLabel: {
    fontSize: 16,
    color: '#475569',
    marginLeft: 12,
  },
  indicatorRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  testCount: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
});