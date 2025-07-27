import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductResult, Language } from '../types/productResult';
import { CircularProgress } from './CircularProgress';
import { KeyIndicators } from './KeyIndicators';
import { FindingsSection } from './FindingsSection';
import { NutritionalInfo } from './NutritionalInfo';
import { AlternativesCarousel } from './AlternativesCarousel';
import { ExpandableSections } from './ExpandableSections';
import { ActionBottomBar } from './ActionBottomBar';

const { width } = Dimensions.get('window');

interface ProductResultScreenProps {
  product: ProductResult;
  language?: Language;
  onBack?: () => void;
  onShare?: () => void;
  onReview?: () => void;
  onViewAlternatives?: () => void;
}

export const ProductResultScreen: React.FC<ProductResultScreenProps> = ({
  product,
  language = 'en',
  onBack,
  onShare,
  onReview,
  onViewAlternatives,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#22C55E'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getScoreLabel = (score: number): string => {
    if (language === 'de') {
      if (score >= 90) return 'Ausgezeichnet';
      if (score >= 80) return 'Sehr gut';
      if (score >= 70) return 'Gut';
      if (score >= 60) return 'Befriedigend';
      if (score >= 40) return 'Mangelhaft';
      return 'Ungenügend';
    }
    
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Very Poor';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Header */}
        <View style={styles.productHeader}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.brandName}>{product.brand}</Text>
            {product.userReviews && (
              <Text style={styles.reviewCount}>
                {product.userReviews} {language === 'de' ? 'Bewertungen' : 'reviews'}
              </Text>
            )}
          </View>
        </View>

        {/* Health Score */}
        <View style={styles.scoreSection}>
          <CircularProgress
            score={product.overallScore}
            size={120}
            color={getScoreColor(product.overallScore)}
            label={getScoreLabel(product.overallScore)}
          />
          <Text style={styles.scoreDescription}>
            {language === 'de' ? 'Gesundheitsbewertung' : 'Health Score'}
          </Text>
        </View>

        {/* Key Indicators */}
        <KeyIndicators product={product} language={language} />

        {/* Nutritional Information (for food products) */}
        {product.nutritionalData && (
          <NutritionalInfo data={product.nutritionalData} language={language} />
        )}

        {/* Advice Banner */}
        {product.adviceBanner && (
          <View style={[
            styles.adviceBanner,
            { backgroundColor: product.overallScore >= 80 ? '#DCFCE7' : '#FEF3C7' }
          ]}>
            <Ionicons 
              name={product.overallScore >= 80 ? "checkmark-circle" : "information-circle"} 
              size={20} 
              color={product.overallScore >= 80 ? '#16A34A' : '#D97706'} 
            />
            <Text style={[
              styles.adviceText,
              { color: product.overallScore >= 80 ? '#16A34A' : '#D97706' }
            ]}>
              {product.adviceBanner}
            </Text>
          </View>
        )}

        {/* Findings Sections */}
        <FindingsSection
          positiveFindings={product.positiveFindings}
          negativeFindings={product.negativeFindings}
          language={language}
        />

        {/* Alternatives */}
        {product.alternatives && product.alternatives.length > 0 && (
          <AlternativesCarousel
            alternatives={product.alternatives}
            language={language}
            onViewMore={onViewAlternatives}
          />
        )}

        {/* Expandable Sections */}
        <ExpandableSections
          sections={product.expandableSections}
          language={language}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
        />

        {/* Bottom spacing for action bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Action Bottom Bar */}
      <ActionBottomBar
        language={language}
        onViewMore={() => {}}
        onReview={onReview}
        onShare={onShare}
        onAlternatives={onViewAlternatives}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#94A3B8',
  },
  scoreSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
    fontWeight: '500',
  },
  adviceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
  },
  adviceText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 100,
  },
});