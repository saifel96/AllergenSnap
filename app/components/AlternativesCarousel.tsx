import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlternativeProduct, Language } from '../types/productResult';

interface AlternativesCarouselProps {
  alternatives: AlternativeProduct[];
  language: Language;
  onViewMore?: () => void;
}

export const AlternativesCarousel: React.FC<AlternativesCarouselProps> = ({
  alternatives,
  language,
  onViewMore,
}) => {
  const renderAlternative = (alternative: AlternativeProduct, index: number) => (
    <TouchableOpacity key={alternative.id} style={styles.alternativeCard}>
      <Image source={{ uri: alternative.imageUrl }} style={styles.alternativeImage} />
      <View style={styles.alternativeInfo}>
        <Text style={styles.alternativeName} numberOfLines={2}>
          {alternative.name}
        </Text>
        <Text style={styles.alternativeBrand} numberOfLines={1}>
          {alternative.brand}
        </Text>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{alternative.score}</Text>
          </View>
          <View style={styles.improvementBadge}>
            <Ionicons name="trending-up" size={12} color="#22C55E" />
            <Text style={styles.improvementText}>
              +{alternative.improvement}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'de' ? 'Alternative Produkte' : 'Alternative Products'}
        </Text>
        {onViewMore && (
          <TouchableOpacity onPress={onViewMore}>
            <Text style={styles.viewMoreText}>
              {language === 'de' ? 'Alle anzeigen' : 'View All'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {alternatives.map(renderAlternative)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  alternativeCard: {
    width: 160,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alternativeImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  alternativeInfo: {
    flex: 1,
  },
  alternativeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 18,
  },
  alternativeBrand: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  improvementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  improvementText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#22C55E',
    marginLeft: 2,
  },
});