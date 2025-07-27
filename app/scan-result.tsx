import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { saveScanResult, getStoredUserProfile } from './utils/storage';
import { calculateAdvancedHealthScore, classifyIngredientsAdvanced, assessContaminantRisk, getSaferAlternatives, EnhancedProduct } from './utils/healthAnalysis';
import { getAllProducts } from './utils/api';
import { HealthScoreCircle } from './components/HealthScoreCircle';
import { ContaminantMatrix } from './components/ContaminantMatrix';
import { RiskAssessmentCard } from './components/RiskAssessmentCard';
import { IngredientsList } from './components/IngredientsList';
import { AlternativesPanel } from './components/AlternativesPanel.tsx';

export default function ScanResultScreen() {
  const { barcode, productData, fromHistory } = useLocalSearchParams();
  const [product, setProduct] = useState<EnhancedProduct | null>(null);
  const [healthAnalysis, setHealthAnalysis] = useState(null);
  const [alternatives, setAlternatives] = useState<EnhancedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeProduct();
  }, []);

  const analyzeProduct = async () => {
    try {
      const productInfo: EnhancedProduct = JSON.parse(productData as string);
      const userProfile = await getStoredUserProfile();
      
      // Calculate advanced health score and classify ingredients
      const healthScore = calculateAdvancedHealthScore(productInfo, userProfile);
      const classifiedIngredients = classifyIngredientsAdvanced(
        productInfo.ingredients || [],
        productInfo.contaminants || [],
        userProfile.selectedAllergens || []
      );
      
      // Assess contaminant risk
      const riskAssessment = assessContaminantRisk(productInfo.contaminants || []);
      
      // Get safer alternatives
      const allProducts = getAllProducts();
      const saferOptions = getSaferAlternatives(productInfo, allProducts, userProfile);

      const analysis = {
        healthScore,
        classifiedIngredients,
        riskAssessment,
        allergensDetected: classifiedIngredients.filter(ing => ing.tag === 'ALLERGEN'),
        toxinsDetected: classifiedIngredients.filter(ing => ing.tag === 'TOXIN'),
        pfasDetected: classifiedIngredients.filter(ing => ing.tag === 'PFAS'),
        contaminantsDetected: classifiedIngredients.filter(ing => ing.tag === 'CONTAMINANT'),
        additivesDetected: classifiedIngredients.filter(ing => ing.tag === 'ADDITIVE'),
        safeIngredients: classifiedIngredients.filter(ing => ing.tag === 'SAFE'),
      };

      setProduct(productInfo);
      setHealthAnalysis(analysis);
      setAlternatives(saferOptions);

      // Save to history if not coming from history
      if (fromHistory !== 'true') {
        await saveScanResult({
          id: Date.now().toString(),
          barcode,
          productName: productInfo.product_name || 'Unknown Product',
          productImage: productInfo.imageUrl || '',
          healthScore: analysis.healthScore,
          allergensDetected: analysis.allergensDetected.map(ing => ing.name),
          toxinsDetected: analysis.toxinsDetected.map(ing => ing.name),
          pfasDetected: productInfo.pfasDetected || false,
          pfasLevel: productInfo.pfasLevel,
          contaminants: productInfo.contaminants || [],
          additivesDetected: analysis.additivesDetected.map(ing => ing.name),
          ingredientTags: analysis.classifiedIngredients,
          scannedAt: new Date().toISOString(),
          category: productInfo.category || 'food',
        });
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
      Alert.alert('Analysis Error', 'Failed to analyze product data.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const message = `${product.name}\nHealth Score: ${healthAnalysis.healthScore}/100\n\nScanned with Allergen Snap`;
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFindAlternatives = () => {
    router.push({
      pathname: '/alternatives',
      params: { productName: product.name, category: product.category }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Analyzing product...</Text>
      </View>
    );
  }

  if (!product || !healthAnalysis) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Analysis Failed</Text>
        <Text style={styles.errorSubtitle}>Unable to analyze this product</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.product_name || 'Product Analysis'}
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {product.imageUrl && (
          <View style={styles.productImageContainer}>
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
            <View style={styles.imageOverlay}>
              <HealthScoreCircle score={healthAnalysis.healthScore} size={100} />
            </View>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {product.name || 'Unknown Product'}
            </Text>
            {product.brands && (
              <Text style={styles.productBrand}>{product.brands}</Text>
            )}
            
            {/* Product Details */}
            <View style={styles.productDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{product.category.replace('_', ' ')}</Text>
              </View>
              {product.packaging && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Packaging:</Text>
                  <Text style={styles.detailValue}>{product.packaging}</Text>
                </View>
              )}
              {product.source && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Source:</Text>
                  <Text style={styles.detailValue}>{product.source}</Text>
                </View>
              )}
              {product.ph && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>pH:</Text>
                  <Text style={styles.detailValue}>{product.ph.toFixed(1)}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Risk Assessment */}
          <RiskAssessmentCard 
            riskAssessment={healthAnalysis.riskAssessment}
            pfasDetected={product.pfasDetected}
            pfasLevel={product.pfasLevel}
            labVerified={product.labVerified}
          />
          
          {/* Contaminant Matrix */}
          {product.contaminants && product.contaminants.length > 0 && (
            <ContaminantMatrix contaminants={product.contaminants} />
          )}

          <IngredientsList ingredients={healthAnalysis.classifiedIngredients} />
          
          {/* Alternatives Panel */}
          {alternatives.length > 0 && (
            <AlternativesPanel 
              alternatives={alternatives}
              currentScore={healthAnalysis.healthScore}
            />
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleFindAlternatives}
            >
              <Ionicons name="search" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Find Alternatives</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => router.push('/(tabs)/history')}
            >
              <Ionicons name="bookmark-outline" size={20} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: -50,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  productInfo: {
    marginBottom: 24,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 32,
  },
  productBrand: {
    fontSize: 17,
    color: '#8E8E93',
    marginTop: 4,
  },
  productDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    fontSize: 17,
    color: '#8E8E93',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
  },
  errorSubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});