import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Ingredient {
  name: string;
  tag: string;
  icon: string;
  color: string;
  risk: string;
  description: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
}

export const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filterOptions = [
    { key: 'ALL', label: 'All', count: ingredients.length },
    { key: 'ALLERGEN', label: 'Allergens', count: ingredients.filter(i => i.tag === 'ALLERGEN').length },
    { key: 'TOXIN', label: 'Toxins', count: ingredients.filter(i => i.tag === 'TOXIN').length },
    { key: 'ADDITIVE', label: 'Additives', count: ingredients.filter(i => i.tag === 'ADDITIVE').length },
    { key: 'SAFE', label: 'Safe', count: ingredients.filter(i => i.tag === 'SAFE').length },
  ];

  const filteredIngredients = selectedFilter === 'ALL' 
    ? ingredients 
    : ingredients.filter(ingredient => ingredient.tag === selectedFilter);

  const displayedIngredients = isExpanded 
    ? filteredIngredients 
    : filteredIngredients.slice(0, 5);

  const renderIngredient = ({ item }: { item: Ingredient }) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientHeader}>
        <Text style={styles.ingredientIcon}>{item.icon}</Text>
        <Text style={styles.ingredientName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={[styles.riskTag, { backgroundColor: item.color + '20' }]}>
          <Text style={[styles.riskTagText, { color: item.color }]}>
            {item.tag}
          </Text>
        </View>
      </View>
      {item.description && (
        <Text style={styles.ingredientDescription}>
          {item.description}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ingredients Analysis</Text>
        <Text style={styles.subtitle}>
          {ingredients.length} ingredients found
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={filterOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === item.key && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === item.key && styles.activeFilterChipText,
                ]}
              >
                {item.label} {item.count > 0 && `(${item.count})`}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <View style={styles.ingredientsList}>
        <FlatList
          data={displayedIngredients}
          renderItem={renderIngredient}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          scrollEnabled={false}
        />

        {filteredIngredients.length > 5 && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.expandButtonText}>
              {isExpanded 
                ? 'Show Less' 
                : `Show ${filteredIngredients.length - 5} More`
              }
            </Text>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#007AFF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
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
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  activeFilterChip: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  ingredientsList: {
    padding: 20,
  },
  ingredientItem: {
    marginBottom: 16,
  },
  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ingredientIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    marginRight: 12,
  },
  riskTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskTagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ingredientDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 24,
    lineHeight: 18,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  expandButtonText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 6,
  },
});