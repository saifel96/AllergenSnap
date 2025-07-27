import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getStoredScans, getStoredUserProfile } from '../utils/storage';
import { fetchProductData, getAllProducts } from '../utils/api';
import { calculateAdvancedHealthScore, EnhancedProduct } from '../utils/healthAnalysis';
import { HealthScoreCircle } from '../components/HealthScoreCircle';
import { QuickStatsCard } from '../components/QuickStatsCard';
import { RecentScansCard } from '../components/RecentScansCard';
import { HealthTipCard } from '../components/HealthTipCard';

export default function HomeScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [recentScans, setRecentScans] = useState([]);
  const [userStats, setUserStats] = useState({
    totalScans: 0,
    risksAvoided: 0,
    averageScore: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const scans = await getStoredScans();
      const recentFive = scans.slice(0, 5);
      setRecentScans(recentFive);

      // Calculate stats
      const totalScans = scans.length;
      const risksAvoided = scans.filter(scan => scan.healthScore < 60).length;
      const averageScore = scans.length > 0 
        ? Math.round(scans.reduce((sum, scan) => sum + scan.healthScore, 0) / scans.length)
        : 0;

      setUserStats({ totalScans, risksAvoided, averageScore });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const startScanning = () => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    setIsScanning(true);
  };

  const handleBarcodeScanned = async ({ data }) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsScanning(false);
    
    try {
      const productData = await fetchProductData(data);
      if (productData) {
        // Calculate health score with user profile
        const userProfile = await getStoredUserProfile();
        const enhancedProduct = {
          ...productData,
          healthScore: calculateAdvancedHealthScore(productData, userProfile)
        };
        
        router.push({
          pathname: '/scan-result',
          params: { barcode: data, productData: JSON.stringify(enhancedProduct) }
        });
      } else {
        // Show sample products for demo
        const sampleProducts = getAllProducts();
        const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const userProfile = await getStoredUserProfile();
        const enhancedProduct = {
          ...randomProduct,
          barcode: data,
          healthScore: calculateAdvancedHealthScore(randomProduct, userProfile)
        };
        
        router.push({
          pathname: '/scan-result',
          params: { barcode: data, productData: JSON.stringify(enhancedProduct) }
        });
      }
    } catch (error) {
      Alert.alert('Scan Error', 'Failed to process the barcode. Please try again.');
    }
  };

  if (isScanning) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'code128'],
          }}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <Text style={styles.scannerText}>
            Position barcode within the frame
          </Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsScanning(false)}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.title}>Allergen Snap</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
        <View style={styles.scanButtonInner}>
          <Ionicons name="camera" size={32} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Scan Product</Text>
          <Text style={styles.scanButtonSubtext}>Tap to start scanning</Text>
        </View>
      </TouchableOpacity>

      <QuickStatsCard stats={userStats} />

      {recentScans.length > 0 && (
        <RecentScansCard scans={recentScans} onRefresh={loadUserData} />
      )}

      <HealthTipCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  notificationButton: {
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
  scanButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonInner: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  scanButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  scanButtonSubtext: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  scannerContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  cancelButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});