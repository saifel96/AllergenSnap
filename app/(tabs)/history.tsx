import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getStoredScans, clearScanHistory } from '../utils/storage';
import { ScanHistoryItem } from '../components/ScanHistoryItem';
import { FilterChips } from '../components/FilterChips';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'high-risk', label: 'High Risk', icon: 'warning' },
  { id: 'allergens', label: 'Allergens', icon: 'medical' },
  { id: 'week', label: 'This Week', icon: 'calendar' },
];

export default function HistoryScreen() {
  const [scans, setScans] = useState([]);
  const [filteredScans, setFilteredScans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    totalScans: 0,
    highRiskAvoided: 0,
  });

  useEffect(() => {
    loadScanHistory();
  }, []);

  useEffect(() => {
    filterScans();
  }, [scans, searchQuery, activeFilter]);

  const loadScanHistory = async () => {
    try {
      const scanHistory = await getStoredScans();
      setScans(scanHistory);
      
      // Calculate stats
      const totalScans = scanHistory.length;
      const highRiskAvoided = scanHistory.filter(scan => scan.healthScore < 40).length;
      setStats({ totalScans, highRiskAvoided });
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  const filterScans = () => {
    let filtered = scans;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(scan =>
        scan.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'high-risk':
        filtered = filtered.filter(scan => scan.healthScore < 40);
        break;
      case 'allergens':
        filtered = filtered.filter(scan => scan.allergensDetected.length > 0);
        break;
      case 'week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(scan => new Date(scan.scannedAt) >= oneWeekAgo);
        break;
    }

    setFilteredScans(filtered);
  };

  const handleItemPress = (scan) => {
    router.push({
      pathname: '/scan-result',
      params: { 
        barcode: scan.barcode, 
        productData: JSON.stringify(scan),
        fromHistory: 'true'
      }
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all scan history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearScanHistory();
            setScans([]);
            setFilteredScans([]);
            setStats({ totalScans: 0, highRiskAvoided: 0 });
          },
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="scan" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>No Scans Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start scanning products to see your history here
      </Text>
      <TouchableOpacity
        style={styles.scanFirstButton}
        onPress={() => router.push('/(tabs)/')}
      >
        <Text style={styles.scanFirstButtonText}>Scan First Product</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Scan History</Text>
        {scans.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>

      {scans.length > 0 && (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalScans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.highRiskAvoided}</Text>
              <Text style={styles.statLabel}>High-Risk Avoided</Text>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
            />
          </View>

          <FilterChips
            options={FILTER_OPTIONS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredScans}
        renderItem={({ item }) => (
          <ScanHistoryItem scan={item} onPress={() => handleItemPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={scans.length === 0 ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scans.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#F2F2F7',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  scanFirstButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  scanFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});