import { EnhancedProduct, Contaminant } from './healthAnalysis';

const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

// Sample enhanced products database
const enhancedProductsDatabase: EnhancedProduct[] = [
  {
    id: '1',
    name: 'Evian Natural Spring Water',
    category: 'bottled_water',
    healthScore: 92,
    contaminants: [
      { 
        name: 'Fluoride', 
        level: 0.1, 
        unit: 'ppm', 
        severity: 2, 
        category: 'chemical', 
        maxAllowed: 4.0, 
        healthRisk: 'Dental fluorosis at high levels' 
      }
    ],
    pfasDetected: false,
    packaging: 'plastic',
    source: 'spring',
    ph: 7.2,
    labVerified: true,
    barcode: '3068320355108',
    brands: 'Evian',
    ingredients: ['Natural spring water', 'Natural minerals'],
    labels_tags: ['en:natural'],
    imageUrl: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg'
  },
  {
    id: '2',
    name: 'Tap Water - New York City',
    category: 'tap_water',
    healthScore: 78,
    contaminants: [
      { 
        name: 'Chlorine', 
        level: 1.2, 
        unit: 'ppm', 
        severity: 2, 
        category: 'chemical', 
        maxAllowed: 4.0, 
        healthRisk: 'Respiratory irritation' 
      },
      { 
        name: 'Lead', 
        level: 8, 
        unit: 'ppb', 
        severity: 4, 
        category: 'heavy_metals', 
        maxAllowed: 15, 
        healthRisk: 'Neurological damage' 
      },
      { 
        name: 'PFOA', 
        level: 12, 
        unit: 'ppt', 
        severity: 4, 
        category: 'pfas', 
        maxAllowed: 70, 
        healthRisk: 'Cancer, liver damage' 
      }
    ],
    pfasDetected: true,
    pfasLevel: 12,
    packaging: 'none',
    source: 'municipal',
    ph: 7.1,
    labVerified: true,
    barcode: 'tap_water_nyc',
    ingredients: ['Municipal water', 'Chlorine', 'Fluoride'],
    imageUrl: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg'
  },
  {
    id: '3',
    name: 'Coca-Cola Classic',
    category: 'beverage',
    healthScore: 35,
    contaminants: [
      { 
        name: 'High Fructose Corn Syrup', 
        level: 39000, 
        unit: 'ppm', 
        severity: 3, 
        category: 'chemical', 
        healthRisk: 'Obesity, diabetes risk' 
      },
      { 
        name: 'Phosphoric Acid', 
        level: 500, 
        unit: 'ppm', 
        severity: 2, 
        category: 'chemical', 
        healthRisk: 'Bone density reduction' 
      },
      { 
        name: 'Caffeine', 
        level: 34, 
        unit: 'ppm', 
        severity: 1, 
        category: 'chemical', 
        healthRisk: 'Sleep disruption' 
      }
    ],
    pfasDetected: false,
    packaging: 'aluminum',
    source: 'municipal',
    ph: 2.5,
    labVerified: true,
    barcode: '049000028911',
    brands: 'Coca-Cola',
    ingredients: ['Carbonated water', 'High fructose corn syrup', 'Caramel color', 'Phosphoric acid', 'Natural flavor', 'Caffeine'],
    additives_tags: ['e150d', 'e338'],
    imageUrl: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg'
  },
  {
    id: '4',
    name: 'Fiji Natural Artesian Water',
    category: 'bottled_water',
    healthScore: 88,
    contaminants: [
      { 
        name: 'Silica', 
        level: 93, 
        unit: 'ppm', 
        severity: 1, 
        category: 'chemical', 
        healthRisk: 'Generally beneficial for health' 
      }
    ],
    pfasDetected: false,
    packaging: 'plastic',
    source: 'aquifer',
    ph: 7.7,
    labVerified: true,
    barcode: '632565000012',
    brands: 'Fiji',
    ingredients: ['Natural artesian water', 'Electrolytes'],
    labels_tags: ['en:natural'],
    imageUrl: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg'
  },
  {
    id: '5',
    name: 'Organic Valley Whole Milk',
    category: 'beverage',
    healthScore: 82,
    contaminants: [],
    pfasDetected: false,
    packaging: 'glass',
    source: 'filtered',
    labVerified: true,
    barcode: '023244020019',
    brands: 'Organic Valley',
    ingredients: ['Organic whole milk', 'Vitamin D3'],
    allergens_tags: ['en:milk'],
    labels_tags: ['en:organic', 'en:grass-fed'],
    imageUrl: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg'
  },
  {
    id: '6',
    name: 'Smartwater Electrolyte',
    category: 'bottled_water',
    healthScore: 85,
    contaminants: [],
    pfasDetected: false,
    packaging: 'plastic',
    source: 'filtered',
    ph: 7.0,
    labVerified: true,
    barcode: '786162001634',
    brands: 'Smartwater',
    ingredients: ['Vapor distilled water', 'Electrolytes', 'Calcium chloride', 'Magnesium chloride', 'Potassium bicarbonate'],
    labels_tags: ['en:electrolytes'],
    imageUrl: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg'
  }
];

export const fetchProductData = async (barcode: string): Promise<EnhancedProduct | null> => {
  try {
    // First check local enhanced database
    const localProduct = enhancedProductsDatabase.find(p => p.barcode === barcode);
    if (localProduct) {
      return localProduct;
    }

    // Check cache
    const { getCachedProduct, cacheProduct } = await import('./storage');
    const cachedProduct = await getCachedProduct(barcode);
    
    if (cachedProduct) {
      return cachedProduct;
    }

    // Fetch from Open Food Facts API
    const response = await fetch(`${OPEN_FOOD_FACTS_API}/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      // Transform Open Food Facts data to our enhanced format
      const enhancedProduct = transformToEnhancedProduct(data.product, barcode);
      
      // Cache the product data
      await cacheProduct(barcode, enhancedProduct);
      return enhancedProduct;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
};

const transformToEnhancedProduct = (product: any, barcode: string): EnhancedProduct => {
  // Simulate contaminant analysis based on product type and ingredients
  const contaminants = analyzeContaminants(product);
  const pfasAnalysis = analyzePFAS(product);
  
  return {
    id: barcode,
    name: product.product_name || 'Unknown Product',
    category: determineCategory(product),
    healthScore: 0, // Will be calculated later
    contaminants,
    pfasDetected: pfasAnalysis.detected,
    pfasLevel: pfasAnalysis.level,
    packaging: determinePackaging(product),
    source: determineSource(product),
    ph: extractPH(product),
    labVerified: Math.random() > 0.3, // Simulate lab verification
    ingredients: product.ingredients_text?.split(',').map((i: string) => i.trim()) || [],
    imageUrl: product.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    barcode,
    brands: product.brands,
    allergens_tags: product.allergens_tags || [],
    additives_tags: product.additives_tags || [],
    labels_tags: product.labels_tags || []
  };
};

const analyzeContaminants = (product: any): Contaminant[] => {
  const contaminants: Contaminant[] = [];
  const ingredients = product.ingredients_text?.toLowerCase() || '';
  
  // Simulate contaminant detection based on ingredients and product type
  if (ingredients.includes('high fructose corn syrup')) {
    contaminants.push({
      name: 'High Fructose Corn Syrup',
      level: 35000,
      unit: 'ppm',
      severity: 3,
      category: 'chemical',
      healthRisk: 'Obesity, diabetes risk, metabolic syndrome'
    });
  }
  
  if (ingredients.includes('artificial color') || ingredients.includes('red dye')) {
    contaminants.push({
      name: 'Artificial Food Coloring',
      level: 50,
      unit: 'ppm',
      severity: 2,
      category: 'chemical',
      healthRisk: 'Hyperactivity in children, allergic reactions'
    });
  }
  
  if (ingredients.includes('sodium benzoate')) {
    contaminants.push({
      name: 'Sodium Benzoate',
      level: 1000,
      unit: 'ppm',
      severity: 2,
      category: 'chemical',
      maxAllowed: 1000,
      healthRisk: 'DNA damage when combined with vitamin C'
    });
  }
  
  // Simulate water-specific contaminants
  if (product.categories_tags?.some((cat: string) => cat.includes('water'))) {
    if (Math.random() > 0.7) {
      contaminants.push({
        name: 'Chlorine',
        level: Math.random() * 2,
        unit: 'ppm',
        severity: 2,
        category: 'chemical',
        maxAllowed: 4.0,
        healthRisk: 'Respiratory irritation, dry skin'
      });
    }
    
    if (Math.random() > 0.8) {
      contaminants.push({
        name: 'Lead',
        level: Math.random() * 20,
        unit: 'ppb',
        severity: 4,
        category: 'heavy_metals',
        maxAllowed: 15,
        healthRisk: 'Neurological damage, developmental issues'
      });
    }
  }
  
  return contaminants;
};

const analyzePFAS = (product: any): { detected: boolean; level?: number } => {
  // Simulate PFAS detection - higher chance in packaged foods and tap water
  const pfasRisk = product.categories_tags?.some((cat: string) => 
    cat.includes('packaged') || cat.includes('processed')
  ) ? 0.3 : 0.1;
  
  if (Math.random() < pfasRisk) {
    return {
      detected: true,
      level: Math.random() * 100 // ppt
    };
  }
  
  return { detected: false };
};

const determineCategory = (product: any): 'bottled_water' | 'tap_water' | 'food' | 'beverage' => {
  const categories = product.categories_tags || [];
  
  if (categories.some((cat: string) => cat.includes('water'))) {
    return categories.some((cat: string) => cat.includes('bottled')) ? 'bottled_water' : 'tap_water';
  }
  
  if (categories.some((cat: string) => cat.includes('beverage') || cat.includes('drink'))) {
    return 'beverage';
  }
  
  return 'food';
};

const determinePackaging = (product: any): 'glass' | 'plastic' | 'aluminum' | 'none' => {
  const packaging = product.packaging_tags || [];
  
  if (packaging.some((p: string) => p.includes('glass'))) return 'glass';
  if (packaging.some((p: string) => p.includes('plastic'))) return 'plastic';
  if (packaging.some((p: string) => p.includes('aluminum') || p.includes('can'))) return 'aluminum';
  
  // Default based on product type
  const categories = product.categories_tags || [];
  if (categories.some((cat: string) => cat.includes('water'))) return 'plastic';
  if (categories.some((cat: string) => cat.includes('soda') || cat.includes('cola'))) return 'aluminum';
  
  return 'none';
};

const determineSource = (product: any): 'municipal' | 'spring' | 'aquifer' | 'filtered' => {
  const name = product.product_name?.toLowerCase() || '';
  const ingredients = product.ingredients_text?.toLowerCase() || '';
  
  if (name.includes('spring') || ingredients.includes('spring water')) return 'spring';
  if (name.includes('artesian') || ingredients.includes('artesian')) return 'aquifer';
  if (name.includes('filtered') || ingredients.includes('filtered')) return 'filtered';
  
  return 'municipal';
};

const extractPH = (product: any): number | undefined => {
  // Simulate pH extraction - in real implementation, this would come from lab data
  const category = determineCategory(product);
  
  if (category === 'bottled_water' || category === 'tap_water') {
    return 6.5 + Math.random() * 2; // pH between 6.5 and 8.5
  }
  
  if (category === 'beverage') {
    const name = product.product_name?.toLowerCase() || '';
    if (name.includes('cola') || name.includes('soda')) {
      return 2.5 + Math.random() * 1.5; // Acidic beverages
    }
  }
  
  return undefined;
};

export const fetchWaterQualityData = async (latitude: number, longitude: number) => {
  try {
    // Mock data for demonstration - in production, integrate with real API
    return {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      contaminants: [
        { name: 'Chlorine', level: '2.1mg/L', status: 'acceptable' },
        { name: 'Lead', level: '0.003mg/L', status: 'good' },
        { name: 'Fluoride', level: '0.8mg/L', status: 'good' },
        { name: 'pH Level', level: '7.2', status: 'excellent' },
      ],
      pfasLevel: Math.random() * 50,
      location: 'Local Water District',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching water quality data:', error);
    return null;
  }
};

export const fetchAirQualityData = async (latitude: number, longitude: number) => {
  try {
    // Mock data for demonstration - in production, integrate with real API
    const aqi = Math.floor(Math.random() * 100) + 20; // 20-120
    
    let status = 'Good';
    let color = '#34C759';
    
    if (aqi > 100) {
      status = 'Unhealthy';
      color = '#FF3B30';
    } else if (aqi > 75) {
      status = 'Moderate';
      color = '#FF9500';
    }
    
    return {
      aqi,
      status,
      color,
      pollutants: [
        { name: 'PM2.5', value: Math.floor(Math.random() * 20) + 10, unit: 'μg/m³' },
        { name: 'PM10', value: Math.floor(Math.random() * 30) + 15, unit: 'μg/m³' },
        { name: 'NO2', value: Math.floor(Math.random() * 40) + 20, unit: 'μg/m³' },
        { name: 'O3', value: Math.floor(Math.random() * 60) + 40, unit: 'μg/m³' },
      ],
      location: 'Current Location',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return null;
  }
};

export const searchAlternativeProducts = async (productName: string, category: string): Promise<EnhancedProduct[]> => {
  try {
    // Filter products by category and exclude current product
    const alternatives = enhancedProductsDatabase
      .filter(p => 
        p.category === category && 
        !p.name.toLowerCase().includes(productName.toLowerCase())
      )
      .slice(0, 5);
    
    return alternatives;
  } catch (error) {
    console.error('Error searching alternatives:', error);
    return [];
  }
};

// Get all products for testing
export const getAllProducts = (): EnhancedProduct[] => {
  return enhancedProductsDatabase;
};