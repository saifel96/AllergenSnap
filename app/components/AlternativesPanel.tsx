import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { EnhancedProduct } from '../utils/healthAnalysis';
import { HealthScoreCircle } from './HealthScoreCircle';

interface AlternativesPanelProps {
  alternatives: EnhancedProduct[];
  currentScore: number;
}

export const AlternativesPanel: React.FC<AlternativesPanelProps> = ({ 
  alternatives, 
  currentScore 
}) => {
  const handleAlternativePress = (alternative: EnhancedProduct) => {
    router.push({
      pathname: '/scan-result',
      params: { 
        barcode: alternative.barcode || alternative.id, 
        productData: JSON.stringify(alternative),
        fromHistory: 'false'
      }
    });
  };

  if (alternatives.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recommended Alternatives</Text>
        <View style={styles.noAlternativesContainer}>
          <Ionicons name="checkmark-circle" size={48} color="#34C759" />
          <Text style={styles.noAlternativesTitle}>Great Choice!</Text>
          <Text style={styles.noAlternativesSubtitle}>
            This is already one of the safest options in its category
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Alternatives</Text>
        <Text style={styles.subtitle}>
          {alternatives.length} better option{alternatives.length > 1 ? 's' : ''} found
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.alternativesList}
      >
        {alternatives.map((alternative, index) => {
          const improvement = alternative.healthScore - currentScore;
          
          return (
            <TouchableOpacity
              key={alternative.id}
              style={styles.alternativeCard}
              onPress={() => handleAlternativePress(alternative)}
            >
              <View style={styles.alternativeImageContainer}>
                {alternative.imageUrl ? (
                  <Image 
                    source={{ uri: alternative.imageUrl }} 
                    style={styles.alternativeImage} 
                  />
                ) : (
                  <View style={styles.alternativeImagePlaceholder}>
                    <Ionicons name="image" size={32} color="#C7C7CC" />
                  </View>
                )}
                
                <View style={styles.scoreOverlay}>
                  <HealthScoreCircle score={alternative.healthScore} size={50} />
                </View>
              </View>

              <View style={styles.alternativeContent}>
                <Text style={styles.alternativeName} numberOfLines={2}>
                  {alternative.name}
                </Text>
                
                {alternative.brands && (
                  <Text style={styles.alternativeBrand} numberOfLines={1}>
                    {alternative.brands}
                  </Text>
                )}

                <View style={styles.improvementContainer}>
                  <Ionicons name="trending-up" size={16} color="#34C759" />
                  <Text style={styles.improvementText}>
                    +{improvement} points better
                  </Text>
                </View>

                <View style={styles.benefitsContainer}>
                  {!alternative.pfasDetected && (
                    <View style={styles.benefitBadge}>
                      <Text style={styles.benefitText}>PFAS-Free</Text>
                    </View>
                  )}
                  {alternative.labVerified && (
                    <View style={[styles.benefitBadge, styles.verifiedBadge]}>
                      <Text style={[styles.benefitText, styles.verifiedText]}>✓ Verified</Text>
                    </View>
                  )}
                  {alternative.packaging === 'glass' && (
                    <View style={[styles.benefitBadge, styles.glassBadge]}>
                      <Text style={[styles.benefitText, styles.glassText]}>Glass</Text>
                    </View>
                  )}
                  {alternative.labels_tags?.includes('en:organic') && (
                    <View style={[styles.benefitBadge, styles.organicBadge]}>
                      <Text style={[styles.benefitText, styles.organicText]}>Organic</Text>
                    </View>
                  )}
                </View>

                <View style={styles.keyImprovements}>
                  <Text style={styles.improvementsTitle}>Key Improvements:</Text>
                  {getKeyImprovements(alternative, currentScore).map((improvement, idx) => (
                    <Text key={idx} style={styles.improvementItem}>
                      • {improvement}
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const getKeyImprovements = (alternative: EnhancedProduct, currentScore: number): string[] => {
  const improvements: string[] = [];
  
  if (!alternative.pfasDetected) {
    improvements.push('No PFAS detected');
  }
  
  if (alternative.packaging === 'glass') {
    improvements.push('Glass packaging (no plastic)');
  }
  
  if (alternative.labels_tags?.includes('en:organic')) {
    improvements.push('Certified organic');
  }
  
  if (alternative.source === 'spring' || alternative.source === 'aquifer') {
    improvements.push('Natural water source');
  }
  
  if (alternative.labVerified) {
    improvements.push('Third-party lab verified');
  }
  
  if (alternative.contaminants.length === 0) {
    improvements.push('No contaminants detected');
  }
  
  return improvements.slice(0, 3); // Show max 3 improvements
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
  noAlternativesContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noAlternativesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
    marginTop: 16,
    marginBottom: 8,
  },
  noAlternativesSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  alternativesList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  alternativeCard: {
    width: 280,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  alternativeImageContainer: {
    position: 'relative',
    height: 120,
  },
  alternativeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  alternativeImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alternativeContent: {
    padding: 16,
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
    marginBottom: 4,
  },
  alternativeBrand: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  improvementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  improvementText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 6,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  benefitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#007AFF' + '20',
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#007AFF',
  },
  verifiedBadge: {
    backgroundColor: '#34C759' + '20',
  },
  verifiedText: {
    color: '#34C759',
  },
  glassBadge: {
    backgroundColor: '#5AC8FA' + '20',
  },
  glassText: {
    color: '#5AC8FA',
  },
  organicBadge: {
    backgroundColor: '#34C759' + '20',
  },
  organicText: {
    color: '#34C759',
  },
  keyImprovements: {
    marginTop: 8,
  },
  improvementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  improvementItem: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
    marginBottom: 2,
  },
});