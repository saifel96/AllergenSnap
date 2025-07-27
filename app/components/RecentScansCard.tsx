import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { HealthScoreCircle } from './HealthScoreCircle';

interface RecentScansCardProps {
  scans: any[];
  onRefresh: () => void;
}

export const RecentScansCard: React.FC<RecentScansCardProps> = ({ scans, onRefresh }) => {
  const handleScanPress = (scan) => {
    router.push({
      pathname: '/scan-result',
      params: { 
        barcode: scan.barcode, 
        productData: JSON.stringify(scan),
        fromHistory: 'true'
      }
    });
  };

  const renderScanItem = ({ item }) => (
    <TouchableOpacity
      style={styles.scanItem}
      onPress={() => handleScanPress(item)}
    >
      {item.productImage ? (
        <Image source={{ uri: item.productImage }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Ionicons name="image" size={24} color="#C7C7CC" />
        </View>
      )}
      <View style={styles.scanInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.productName}
        </Text>
        <Text style={styles.scanDate}>
          {new Date(item.scannedAt).toLocaleDateString()}
        </Text>
      </View>
      <HealthScoreCircle score={item.healthScore} size={50} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Scans</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={scans}
        renderItem={renderScanItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  viewAllText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  scanItem: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanInfo: {
    flex: 1,
    marginBottom: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 20,
  },
  scanDate: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
});