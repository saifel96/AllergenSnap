import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { ProductResultScreen } from './components/ProductResultScreen';
import { mockProductResults } from './data/mockProductResults';
import { Language } from './types/productResult';

export default function ProductResultDemo() {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [language, setLanguage] = useState<Language>('en');

  const currentProduct = mockProductResults[selectedProductIndex];

  return (
    <View style={styles.container}>
      {/* Demo Controls */}
      <View style={styles.controls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockProductResults.map((product, index) => (
            <TouchableOpacity
              key={product.id}
              style={[
                styles.productButton,
                selectedProductIndex === index && styles.activeProductButton
              ]}
              onPress={() => setSelectedProductIndex(index)}
            >
              <Text style={[
                styles.productButtonText,
                selectedProductIndex === index && styles.activeProductButtonText
              ]}>
                {product.name.split(' ').slice(0, 2).join(' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setLanguage(language === 'en' ? 'de' : 'en')}
        >
          <Text style={styles.languageButtonText}>
            {language === 'en' ? '🇺🇸 EN' : '🇩🇪 DE'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Result Screen */}
      <ProductResultScreen
        product={currentProduct}
        language={language}
        onBack={() => console.log('Back pressed')}
        onShare={() => console.log('Share pressed')}
        onReview={() => console.log('Review pressed')}
        onViewAlternatives={() => console.log('View alternatives pressed')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  productButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  activeProductButton: {
    backgroundColor: '#3B82F6',
  },
  productButtonText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  activeProductButtonText: {
    color: '#FFFFFF',
  },
  languageButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});