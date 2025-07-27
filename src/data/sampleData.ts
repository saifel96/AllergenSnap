// SAMPLE DATA: 50+ Mock Product Records
import { Product, Contaminant, PFASCompound } from '../types';

// PFAS Compounds Database
export const pfasCompounds: PFASCompound[] = [
  {
    name: 'PFOA',
    casNumber: '335-67-1',
    concentration: 0,
    maxAllowed: 4,
    toxicityClass: 'carcinogenic',
    healthRisk: 'Cancer, liver damage, decreased fertility'
  },
  {
    name: 'PFOS',
    casNumber: '1763-23-1',
    concentration: 0,
    maxAllowed: 4,
    toxicityClass: 'carcinogenic',
    healthRisk: 'Immune system effects, cancer'
  },
  {
    name: 'PFNA',
    casNumber: '375-95-1',
    concentration: 0,
    maxAllowed: 70,
    toxicityClass: 'developmental',
    healthRisk: 'Developmental effects, liver toxicity'
  },
  {
    name: 'PFHxS',
    casNumber: '355-46-4',
    concentration: 0,
    maxAllowed: 70,
    toxicityClass: 'immune_system',
    healthRisk: 'Immune system suppression'
  },
  {
    name: 'PFBS',
    casNumber: '375-73-5',
    concentration: 0,
    maxAllowed: 2000,
    toxicityClass: 'endocrine_disruptor',
    healthRisk: 'Kidney and liver effects'
  }
];

// Sample Products Database
export const sampleProducts: Product[] = [
  // BOTTLED WATER PRODUCTS
  {
    id: '1',
    name: 'Evian Natural Spring Water',
    brand: 'Evian',
    category: 'bottled_water',
    imageUrl: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
    packaging: 'plastic',
    waterSource: 'spring',
    ph: 7.2,
    labVerified: true,
    contaminants: [
      {
        name: 'Fluoride',
        category: 'fluoride',
        severity: 2,
        concentration: 0.1,
        unit: 'ppm',
        maxAllowed: 4.0,
        healthRisk: 'Dental fluorosis at high levels',
        priority: 'medium',
        weight: 4.03
      }
    ],
    pfasData: {
      detected: false,
      compounds: [],
      status: 'not_detected',
      testMethod: 'LC-MS/MS'
    },
    testingStatus: 'complete',
    location: 'France'
  },
  
  {
    id: '2',
    name: 'Fiji Natural Artesian Water',
    brand: 'Fiji',
    category: 'bottled_water',
    imageUrl: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg',
    packaging: 'plastic',
    waterSource: 'aquifer',
    ph: 7.7,
    labVerified: true,
    contaminants: [
      {
        name: 'Silica',
        category: 'heavy_metals',
        severity: 1,
        concentration: 93,
        unit: 'ppm',
        healthRisk: 'Generally beneficial for health',
        priority: 'high',
        weight: 9.68
      }
    ],
    pfasData: {
      detected: false,
      compounds: [],
      status: 'not_detected'
    },
    testingStatus: 'complete',
    location: 'Fiji'
  },

  {
    id: '3',
    name: 'Smartwater Electrolyte',
    brand: 'Smartwater',
    category: 'bottled_water',
    imageUrl: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg',
    packaging: 'plastic',
    waterSource: 'filtered',
    ph: 7.0,
    labVerified: true,
    contaminants: [],
    pfasData: {
      detected: false,
      compounds: [],
      status: 'not_detected'
    },
    testingStatus: 'complete'
  },

  // TAP WATER SAMPLES
  {
    id: '4',
    name: 'Tap Water - New York City',
    brand: 'NYC Water',
    category: 'tap_water',
    imageUrl: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg',
    packaging: 'none',
    waterSource: 'municipal',
    ph: 7.1,
    labVerified: true,
    contaminants: [
      {
        name: 'Chlorine',
        category: 'disinfectants',
        severity: 2,
        concentration: 1.2,
        unit: 'ppm',
        maxAllowed: 4.0,
        healthRisk: 'Respiratory irritation',
        priority: 'high',
        weight: 9.68
      },
      {
        name: 'Lead',
        category: 'heavy_metals',
        severity: 4,
        concentration: 8,
        unit: 'ppb',
        maxAllowed: 15,
        healthRisk: 'Neurological damage',
        priority: 'high',
        weight: 9.68
      }
    ],
    pfasData: {
      detected: true,
      totalConcentration: 12,
      compounds: [
        { ...pfasCompounds[0], concentration: 7 },
        { ...pfasCompounds[1], concentration: 5 }
      ],
      status: 'detected',
      testMethod: 'LC-MS/MS'
    },
    testingStatus: 'complete',
    location: 'New York, NY'
  },

  {
    id: '5',
    name: 'Tap Water - Los Angeles',
    brand: 'LADWP',
    category: 'tap_water',
    imageUrl: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg',
    packaging: 'none',
    waterSource: 'municipal',
    ph: 8.2,
    labVerified: true,
    contaminants: [
      {
        name: 'Chromium-6',
        category: 'heavy_metals',
        severity: 5,
        concentration: 0.8,
        unit: 'ppb',
        maxAllowed: 0.1,
        healthRisk: 'Carcinogenic',
        priority: 'high',
        weight: 9.68
      },
      {
        name: 'Trihalomethanes',
        category: 'trihalomethanes',
        severity: 3,
        concentration: 45,
        unit: 'ppb',
        maxAllowed: 80,
        healthRisk: 'Cancer risk',
        priority: 'medium',
        weight: 4.84
      }
    ],
    pfasData: {
      detected: true,
      totalConcentration: 85,
      compounds: [
        { ...pfasCompounds[0], concentration: 35 },
        { ...pfasCompounds[1], concentration: 28 },
        { ...pfasCompounds[2], concentration: 22 }
      ],
      status: 'detected'
    },
    testingStatus: 'complete',
    location: 'Los Angeles, CA'
  },

  // BEVERAGES
  {
    id: '6',
    name: 'Coca-Cola Classic',
    brand: 'Coca-Cola',
    category: 'beverage',
    imageUrl: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg',
    packaging: 'aluminum',
    waterSource: 'municipal',
    ph: 2.5,
    labVerified: true,
    contaminants: [
      {
        name: 'High Fructose Corn Syrup',
        category: 'heavy_metals',
        severity: 3,
        concentration: 39000,
        unit: 'ppm',
        healthRisk: 'Obesity, diabetes risk',
        priority: 'high',
        weight: 9.68
      },
      {
        name: 'Phosphoric Acid',
        category: 'disinfectants',
        severity: 2,
        concentration: 500,
        unit: 'ppm',
        healthRisk: 'Bone density reduction',
        priority: 'high',
        weight: 9.68
      },
      {
        name: 'Caffeine',
        category: 'vocs',
        severity: 1,
        concentration: 34,
        unit: 'ppm',
        healthRisk: 'Sleep disruption',
        priority: 'high',
        weight: 9.68
      }
    ],
    pfasData: {
      detected: false,
      compounds: [],
      status: 'not_detected'
    },
    nutritionalData: {
      per100g: {
        calories: 42,
        protein: 0,
        fiber: 0,
        sugar: 10.6,
        salt: 0.01
      },
      verdicts: [
        { label: 'High Sugar', status: 'negative', icon: '⚠️' },
        { label: 'No Nutrients', status: 'negative', icon: '❌' },
        { label: 'Low Salt', status: 'positive', icon: '✅' }
      ]
    },
    ingredients: ['Carbonated water', 'High fructose corn syrup', 'Caramel color', 'Phosphoric acid', 'Natural flavor', 'Caffeine'],
    testingStatus: 'complete'
  },

  // BABY FOOD
  {
    id: '7',
    name: 'Organic Apple & Carrot Baby Pouch',
    brand: 'Little Sprouts',
    category: 'baby_food',
    imageUrl: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg',
    packaging: 'plastic',
    labVerified: true,
    contaminants: [
      {
        name: 'Heavy Metals (Lead)',
        category: 'heavy_metals',
        severity: 4,
        concentration: 2.3,
        unit: 'ppb',
        maxAllowed: 1.0,
        healthRisk: 'Developmental issues in children',
        priority: 'high',
        weight: 9.68
      },
      {
        name: 'Pesticide Residue',
        category: 'pesticides',
        severity: 2,
        concentration: 0.8,
        unit: 'ppm',
        maxAllowed: 2.0,
        healthRisk: 'Endocrine disruption',
        priority: 'medium',
        weight: 6.45
      },
      {
        name: 'Microplastics',
        category: 'microplastics',
        severity: 3,
        concentration: 12,
        unit: 'ppb',
        healthRisk: 'Unknown long-term effects',
        priority: 'medium',
        weight: 6.45
      }
    ],
    pfasData: {
      detected: true,
      totalConcentration: 15,
      compounds: [
        { ...pfasCompounds[4], concentration: 15 }
      ],
      status: 'detected'
    },
    nutritionalData: {
      per100g: {
        calories: 68,
        protein: 0.8,
        fiber: 2.1,
        sugar: 12.5,
        salt: 0.02
      },
      verdicts: [
        { label: 'High Sugar', status: 'negative', icon: '⚠️' },
        { label: 'Good Fiber', status: 'positive', icon: '✅' },
        { label: 'Low Salt', status: 'positive', icon: '✅' },
        { label: 'Organic', status: 'positive', icon: '🌱' }
      ]
    },
    ingredients: ['Organic apples', 'Organic carrots', 'Organic lemon juice', 'Vitamin C'],
    testingStatus: 'complete'
  },

  // FOOD PRODUCTS
  {
    id: '8',
    name: 'Organic Frozen Mixed Vegetables',
    brand: 'Green Valley',
    category: 'food',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    packaging: 'plastic',
    labVerified: true,
    contaminants: [],
    pfasData: {
      detected: false,
      compounds: [],
      status: 'not_detected'
    },
    nutritionalData: {
      per100g: {
        calories: 42,
        protein: 2.8,
        fiber: 4.2,
        sugar: 3.1,
        salt: 0.08
      },
      verdicts: [
        { label: 'Low Calories', status: 'positive', icon: '✅' },
        { label: 'High Fiber', status: 'positive', icon: '✅' },
        { label: 'Low Sugar', status: 'positive', icon: '✅' },
        { label: 'Very Low Salt', status: 'positive', icon: '✅' },
        { label: 'Organic', status: 'positive', icon: '🌱' }
      ]
    },
    ingredients: ['Organic broccoli', 'Organic carrots', 'Organic green beans', 'Organic corn'],
    testingStatus: 'complete'
  },

  // Additional products to reach 50+...
  {
    id: '9',
    name: 'Crystal Geyser Alpine Spring Water',
    brand: 'Crystal Geyser',
    category: 'bottled_water',
    imageUrl: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
    packaging: 'plastic',
    waterSource: 'spring',
    ph: 7.8,
    labVerified: false,
    contaminants: [
      {
        name: 'Arsenic',
        category: 'heavy_metals',
        severity: 4,
        concentration: 8.2,
        unit: 'ppb',
        maxAllowed: 10,
        healthRisk: 'Cancer risk, skin lesions',
        priority: 'high',
        weight: 9.68
      }
    ],
    pfasData: {
      detected: false,
      compounds: [],
      status: 'not_tested'
    },
    testingStatus: 'pending'
  },

  {
    id: '10',
    name: 'Dasani Purified Water',
    brand: 'Dasani',
    category: 'bottled_water',
    imageUrl: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg',
    packaging: 'plastic',
    waterSource: 'filtered',
    ph: 5.6,
    labVerified: true,
    contaminants: [
      {
        name: 'Magnesium Sulfate',
        category: 'disinfectants',
        severity: 1,
        concentration: 2.4,
        unit: 'ppm',
        healthRisk: 'Generally safe additive',
        priority: 'high',
        weight: 9.68
      }
    ],
    pfasData: {
      detected: false,
      compounds: [],
      status: 'not_detected'
    },
    testingStatus: 'complete'
  }

  // ... Continue with more products to reach 50+
];

// Add more products programmatically
const additionalProducts: Product[] = [];

// Generate more tap water samples for different cities
const cities = [
  'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 
  'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'
];

cities.forEach((city, index) => {
  additionalProducts.push({
    id: `tap_${index + 11}`,
    name: `Tap Water - ${city.split(',')[0]}`,
    brand: 'Municipal Water',
    category: 'tap_water',
    imageUrl: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg',
    packaging: 'none',
    waterSource: 'municipal',
    ph: 6.8 + Math.random() * 1.4, // Random pH between 6.8-8.2
    labVerified: Math.random() > 0.3,
    contaminants: [
      {
        name: 'Chlorine',
        category: 'disinfectants',
        severity: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3,
        concentration: Math.random() * 3,
        unit: 'ppm',
        maxAllowed: 4.0,
        healthRisk: 'Respiratory irritation',
        priority: 'high',
        weight: 9.68
      }
    ],
    pfasData: {
      detected: Math.random() > 0.6,
      totalConcentration: Math.random() > 0.6 ? Math.random() * 100 : undefined,
      compounds: Math.random() > 0.6 ? [{ ...pfasCompounds[0], concentration: Math.random() * 50 }] : [],
      status: Math.random() > 0.6 ? 'detected' : 'not_detected'
    },
    testingStatus: 'complete',
    location: city
  });
});

// Generate more bottled water products
const waterBrands = [
  'Aquafina', 'Nestle Pure Life', 'Poland Spring', 'Deer Park', 
  'Ice Mountain', 'Ozarka', 'Zephyrhills', 'Arrowhead'
];

waterBrands.forEach((brand, index) => {
  additionalProducts.push({
    id: `water_${index + 20}`,
    name: `${brand} Purified Water`,
    brand,
    category: 'bottled_water',
    imageUrl: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg',
    packaging: 'plastic',
    waterSource: Math.random() > 0.5 ? 'filtered' : 'spring',
    ph: 6.5 + Math.random() * 2, // Random pH between 6.5-8.5
    labVerified: Math.random() > 0.2,
    contaminants: Math.random() > 0.7 ? [
      {
        name: 'Microplastics',
        category: 'microplastics',
        severity: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3,
        concentration: Math.random() * 10,
        unit: 'ppb',
        healthRisk: 'Unknown long-term effects',
        priority: 'medium',
        weight: 6.45
      }
    ] : [],
    pfasData: {
      detected: Math.random() > 0.8,
      totalConcentration: Math.random() > 0.8 ? Math.random() * 20 : undefined,
      compounds: [],
      status: Math.random() > 0.8 ? 'detected' : 'not_detected'
    },
    testingStatus: 'complete'
  });
});

export const allProducts = [...sampleProducts, ...additionalProducts];