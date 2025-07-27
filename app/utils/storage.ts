import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  SCAN_HISTORY: 'scan_history',
  CACHED_PRODUCTS: 'cached_products',
};

// User Profile Management
export const getStoredUserProfile = async () => {
  try {
    const profileData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileData ? JSON.parse(profileData) : {
      name: 'User',
      selectedAllergens: [],
      customRiskItems: [],
      riskSensitivity: 3,
      notificationSettings: {
        scanReminders: true,
        healthTips: true,
        exposureAlerts: true,
      },
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

// Scan History Management
export const getStoredScans = async () => {
  try {
    const scanData = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    const scans = scanData ? JSON.parse(scanData) : [];
    // Sort by most recent first
    return scans.sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
  } catch (error) {
    console.error('Error retrieving scan history:', error);
    return [];
  }
};

export const saveScanResult = async (scanResult) => {
  try {
    const existingScans = await getStoredScans();
    const updatedScans = [scanResult, ...existingScans];
    
    // Keep only the last 1000 scans to prevent storage bloat
    const limitedScans = updatedScans.slice(0, 1000);
    
    await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(limitedScans));
    return true;
  } catch (error) {
    console.error('Error saving scan result:', error);
    return false;
  }
};

export const clearScanHistory = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing scan history:', error);
    return false;
  }
};

// Product Cache Management
export const getCachedProduct = async (barcode) => {
  try {
    const cacheData = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_PRODUCTS);
    const cache = cacheData ? JSON.parse(cacheData) : {};
    
    const cachedProduct = cache[barcode];
    if (cachedProduct && new Date(cachedProduct.expiresAt) > new Date()) {
      return cachedProduct.productData;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving cached product:', error);
    return null;
  }
};

export const cacheProduct = async (barcode, productData) => {
  try {
    const cacheData = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_PRODUCTS);
    const cache = cacheData ? JSON.parse(cacheData) : {};
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    cache[barcode] = {
      productData,
      cachedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    
    // Limit cache size to 500 products
    const cacheEntries = Object.entries(cache);
    if (cacheEntries.length > 500) {
      // Remove oldest entries
      const sortedEntries = cacheEntries.sort((a, b) => 
        new Date(a[1].cachedAt) - new Date(b[1].cachedAt)
      );
      const limitedCache = Object.fromEntries(sortedEntries.slice(-500));
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_PRODUCTS, JSON.stringify(limitedCache));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_PRODUCTS, JSON.stringify(cache));
    }
    
    return true;
  } catch (error) {
    console.error('Error caching product:', error);
    return false;
  }
};

// Data Management
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROFILE,
      STORAGE_KEYS.SCAN_HISTORY,
      STORAGE_KEYS.CACHED_PRODUCTS,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

export const getStorageStats = async () => {
  try {
    const scans = await getStoredScans();
    const profile = await getStoredUserProfile();
    const cacheData = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_PRODUCTS);
    const cache = cacheData ? JSON.parse(cacheData) : {};
    
    return {
      totalScans: scans.length,
      profileExists: !!profile,
      cachedProducts: Object.keys(cache).length,
      storageSize: JSON.stringify({ scans, profile, cache }).length,
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      totalScans: 0,
      profileExists: false,
      cachedProducts: 0,
      storageSize: 0,
    };
  }
};