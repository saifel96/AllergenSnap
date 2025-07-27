import { ProductResult } from '../types/productResult';

export const mockProductResults: ProductResult[] = [
  // Baby Food Pouch - Low Score
  {
    id: 'baby-food-1',
    name: 'Organic Apple & Carrot Baby Pouch',
    brand: 'Little Sprouts',
    category: 'baby_food',
    imageUrl: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg',
    overallScore: 53,
    scoreLabel: 'Poor',
    labTested: true,
    testCount: 3,
    userReviews: 127,
    
    microplastics: 'likely',
    contaminants: [
      { name: 'Heavy Metals', severity: 'medium', value: '2.3 ppb', icon: 'alert-triangle' },
      { name: 'Pesticide Residue', severity: 'low', value: '0.8 ppm', icon: 'bug' },
      { name: 'BPA', severity: 'high', value: '12 ppb', icon: 'flask' }
    ],
    beneficialIngredients: [
      { name: 'Vitamin C', value: '45mg', icon: 'apple' },
      { name: 'Fiber', value: '2.1g', icon: 'wheat' }
    ],
    
    nutritionalData: {
      per100g: {
        calories: 68,
        protein: 0.8,
        fiber: 2.1,
        sugar: 12.5,
        salt: 0.02,
        fat: 0.3,
        carbs: 15.2
      },
      verdicts: [
        { label: 'High Sugar', labelDe: 'Viel Zucker', status: 'negative', icon: 'candy' },
        { label: 'Low Salt', labelDe: 'Wenig Salz', status: 'positive', icon: 'droplets' },
        { label: 'No Additives', labelDe: 'Keine Zusatzstoffe', status: 'positive', icon: 'check-circle' }
      ]
    },
    
    positiveFindings: [
      { text: 'Organic certified ingredients', textDe: 'Bio-zertifizierte Zutaten', status: 'positive', icon: 'leaf' },
      { text: 'No artificial preservatives', textDe: 'Keine künstlichen Konservierungsstoffe', status: 'positive', icon: 'shield-check' },
      { text: 'Rich in natural vitamins', textDe: 'Reich an natürlichen Vitaminen', status: 'positive', icon: 'heart' }
    ],
    
    negativeFindings: [
      { text: 'Microplastics detected in packaging', textDe: 'Mikroplastik in Verpackung nachgewiesen', status: 'negative', icon: 'alert-circle' },
      { text: 'BPA levels above recommended', textDe: 'BPA-Werte über Empfehlung', status: 'negative', icon: 'x-circle' },
      { text: 'High sugar content for babies', textDe: 'Hoher Zuckergehalt für Babys', status: 'negative', icon: 'alert-triangle' }
    ],
    
    alternatives: [
      { id: 'alt-1', name: 'Pure Organic Baby Food', brand: 'Earth\'s Best', score: 89, improvement: 36, imageUrl: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg' },
      { id: 'alt-2', name: 'Glass Jar Baby Food', brand: 'Gerber', score: 76, improvement: 23, imageUrl: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg' }
    ],
    
    adviceBanner: 'Consider alternatives with glass packaging to reduce microplastic exposure',
    
    expandableSections: [
      {
        title: 'Lab Report Details',
        titleDe: 'Laborberichtdetails',
        icon: 'file-text',
        content: 'Comprehensive testing performed by certified laboratories including heavy metal analysis, pesticide screening, and microplastic detection.',
        contentDe: 'Umfassende Tests von zertifizierten Laboren einschließlich Schwermetallanalyse, Pestizid-Screening und Mikroplastik-Nachweis.'
      },
      {
        title: 'What\'s Inside',
        titleDe: 'Inhaltsstoffe',
        icon: 'list',
        content: 'Organic apples (60%), organic carrots (35%), organic lemon juice (3%), vitamin C (2%)',
        contentDe: 'Bio-Äpfel (60%), Bio-Karotten (35%), Bio-Zitronensaft (3%), Vitamin C (2%)'
      }
    ]
  },

  // Filtered Water Bottle - High Score
  {
    id: 'water-filtered-1',
    name: 'Premium Filtered Water',
    brand: 'PureFlow',
    category: 'water',
    imageUrl: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg',
    overallScore: 92,
    scoreLabel: 'Excellent',
    labTested: true,
    testCount: 8,
    userReviews: 2341,
    
    microplastics: 'none',
    contaminants: [],
    beneficialIngredients: [
      { name: 'Essential Minerals', value: 'Balanced', icon: 'droplets' },
      { name: 'Electrolytes', value: 'Added', icon: 'zap' },
      { name: 'pH Balance', value: '7.4', icon: 'activity' }
    ],
    
    positiveFindings: [
      { text: 'Advanced 7-stage filtration', textDe: '7-stufige Filtration', status: 'positive', icon: 'filter' },
      { text: 'No PFAS detected', textDe: 'Keine PFAS nachgewiesen', status: 'positive', icon: 'shield-check' },
      { text: 'BPA-free packaging', textDe: 'BPA-freie Verpackung', status: 'positive', icon: 'leaf' },
      { text: 'Optimal mineral content', textDe: 'Optimaler Mineralgehalt', status: 'positive', icon: 'droplets' }
    ],
    
    negativeFindings: [],
    
    adviceBanner: 'Excellent choice! This product meets all safety standards.',
    
    expandableSections: [
      {
        title: 'Filtration Process',
        titleDe: 'Filtrationsprozess',
        icon: 'settings',
        content: '7-stage filtration including activated carbon, reverse osmosis, UV sterilization, and mineral enhancement.',
        contentDe: '7-stufige Filtration mit Aktivkohle, Umkehrosmose, UV-Sterilisation und Mineralanreicherung.'
      },
      {
        title: 'Lab Certifications',
        titleDe: 'Laborzertifizierungen',
        icon: 'award',
        content: 'NSF/ANSI 53 certified, FDA approved, ISO 9001 quality management certified.',
        contentDe: 'NSF/ANSI 53 zertifiziert, FDA zugelassen, ISO 9001 Qualitätsmanagement zertifiziert.'
      }
    ]
  },

  // Spring Water - Mid Score
  {
    id: 'spring-water-1',
    name: 'Natural Spring Water',
    brand: 'Mountain Fresh',
    category: 'spring_water',
    imageUrl: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
    overallScore: 76,
    scoreLabel: 'Good',
    labTested: true,
    testCount: 5,
    userReviews: 892,
    
    microplastics: 'minimal',
    contaminants: [
      { name: 'Fluoride', severity: 'low', value: '0.3 ppm', icon: 'droplets' }
    ],
    beneficialIngredients: [
      { name: 'Natural Minerals', value: 'Present', icon: 'mountain' },
      { name: 'Calcium', value: '78mg/L', icon: 'bone' },
      { name: 'Magnesium', value: '24mg/L', icon: 'heart' }
    ],
    
    positiveFindings: [
      { text: 'Natural spring source', textDe: 'Natürliche Quelle', status: 'positive', icon: 'mountain' },
      { text: 'Rich in natural minerals', textDe: 'Reich an natürlichen Mineralien', status: 'positive', icon: 'gem' },
      { text: 'No chemical treatment', textDe: 'Keine chemische Behandlung', status: 'positive', icon: 'leaf' }
    ],
    
    negativeFindings: [
      { text: 'Plastic bottle packaging', textDe: 'Plastikflaschen-Verpackung', status: 'negative', icon: 'package' },
      { text: 'Minimal microplastic traces', textDe: 'Minimale Mikroplastik-Spuren', status: 'negative', icon: 'alert-triangle' }
    ],
    
    alternatives: [
      { id: 'alt-3', name: 'Glass Bottle Spring Water', brand: 'Alpine Pure', score: 89, improvement: 13, imageUrl: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg' }
    ],
    
    adviceBanner: 'Good quality water, consider glass packaging for even better score',
    
    expandableSections: [
      {
        title: 'Source Information',
        titleDe: 'Quelleninformationen',
        icon: 'map-pin',
        content: 'Sourced from protected mountain springs at 2,400m elevation, naturally filtered through granite rock formations.',
        contentDe: 'Aus geschützten Bergquellen in 2.400m Höhe, natürlich gefiltert durch Granitgestein.'
      }
    ]
  },

  // Frozen Vegetables - High Score
  {
    id: 'frozen-veg-1',
    name: 'Organic Mixed Vegetables',
    brand: 'Green Valley',
    category: 'frozen_vegetables',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    overallScore: 88,
    scoreLabel: 'Excellent',
    labTested: true,
    testCount: 4,
    userReviews: 1567,
    
    microplastics: 'none',
    contaminants: [],
    beneficialIngredients: [
      { name: 'Vitamin A', value: '184% DV', icon: 'eye' },
      { name: 'Vitamin C', value: '67% DV', icon: 'shield' },
      { name: 'Fiber', value: '4.2g', icon: 'wheat' },
      { name: 'Antioxidants', value: 'High', icon: 'heart' }
    ],
    
    nutritionalData: {
      per100g: {
        calories: 42,
        protein: 2.8,
        fiber: 4.2,
        sugar: 3.1,
        salt: 0.08,
        fat: 0.4,
        carbs: 8.1
      },
      verdicts: [
        { label: 'Low Calories', labelDe: 'Wenig Kalorien', status: 'positive', icon: 'trending-down' },
        { label: 'High Fiber', labelDe: 'Viele Ballaststoffe', status: 'positive', icon: 'wheat' },
        { label: 'Low Sugar', labelDe: 'Wenig Zucker', status: 'positive', icon: 'check-circle' },
        { label: 'Very Low Salt', labelDe: 'Sehr wenig Salz', status: 'positive', icon: 'droplets' }
      ]
    },
    
    positiveFindings: [
      { text: 'Certified organic', textDe: 'Bio-zertifiziert', status: 'positive', icon: 'leaf' },
      { text: 'Flash-frozen at peak freshness', textDe: 'Schockgefroren bei optimaler Frische', status: 'positive', icon: 'snowflake' },
      { text: 'No preservatives added', textDe: 'Keine Konservierungsstoffe', status: 'positive', icon: 'shield-check' },
      { text: 'High nutritional value', textDe: 'Hoher Nährwert', status: 'positive', icon: 'heart' }
    ],
    
    negativeFindings: [],
    
    adviceBanner: 'Excellent nutritional choice! Perfect for healthy meals.',
    
    expandableSections: [
      {
        title: 'Nutritional Benefits',
        titleDe: 'Nährwertvorteile',
        icon: 'heart',
        content: 'Rich in vitamins A, C, and K. High fiber content supports digestive health. Antioxidants help protect against cellular damage.',
        contentDe: 'Reich an Vitaminen A, C und K. Hoher Ballaststoffgehalt unterstützt die Verdauung. Antioxidantien schützen vor Zellschäden.'
      },
      {
        title: 'Organic Certification',
        titleDe: 'Bio-Zertifizierung',
        icon: 'award',
        content: 'USDA Organic certified, EU Organic compliant, non-GMO verified.',
        contentDe: 'USDA Bio-zertifiziert, EU-Bio-konform, gentechnikfrei verifiziert.'
      }
    ]
  }
];