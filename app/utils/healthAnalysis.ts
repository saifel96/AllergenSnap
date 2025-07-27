// Enhanced Types and Interfaces
export interface Contaminant {
  name: string;
  level: number;
  unit: 'ppb' | 'ppm' | 'ppt';
  severity: 1 | 2 | 3 | 4 | 5;
  category: 'heavy_metals' | 'pfas' | 'microbiological' | 'chemical' | 'microplastics' | 'pesticides';
  maxAllowed?: number;
  healthRisk: string;
}

export interface PFASCompound {
  name: string;
  casNumber: string;
  aliases: string[];
  toxicityIndex: number;
  regulatoryStatus: 'regulated' | 'monitoring' | 'unregulated';
  healthRisk: string;
}

export interface EnhancedProduct {
  id: string;
  name: string;
  category: 'bottled_water' | 'tap_water' | 'food' | 'beverage';
  healthScore: number;
  contaminants: Contaminant[];
  pfasDetected: boolean;
  pfasLevel?: number;
  packaging: 'glass' | 'plastic' | 'aluminum' | 'none';
  source: 'municipal' | 'spring' | 'aquifer' | 'filtered';
  ph?: number;
  labVerified: boolean;
  ingredients?: string[];
  imageUrl?: string;
  barcode?: string;
  brands?: string;
  allergens_tags?: string[];
  additives_tags?: string[];
  labels_tags?: string[];
}

// PFAS Database
export const pfasDatabase: PFASCompound[] = [
  {
    name: 'PFOA',
    casNumber: '335-67-1',
    aliases: ['Perfluorooctanoic acid', 'C8'],
    toxicityIndex: 9,
    regulatoryStatus: 'regulated',
    healthRisk: 'Cancer, liver damage, decreased fertility'
  },
  {
    name: 'PFOS',
    casNumber: '1763-23-1',
    aliases: ['Perfluorooctane sulfonic acid'],
    toxicityIndex: 8,
    regulatoryStatus: 'regulated',
    healthRisk: 'Immune system effects, cancer'
  },
  {
    name: 'PFNA',
    casNumber: '375-95-1',
    aliases: ['Perfluorononanoic acid'],
    toxicityIndex: 7,
    regulatoryStatus: 'monitoring',
    healthRisk: 'Developmental effects, liver toxicity'
  },
  {
    name: 'PFBS',
    casNumber: '375-73-5',
    aliases: ['Perfluorobutane sulfonic acid'],
    toxicityIndex: 6,
    regulatoryStatus: 'monitoring',
    healthRisk: 'Kidney and liver effects'
  },
  {
    name: 'PFHxS',
    casNumber: '355-46-4',
    aliases: ['Perfluorohexane sulfonic acid'],
    toxicityIndex: 7,
    regulatoryStatus: 'monitoring',
    healthRisk: 'Immune system suppression'
  }
];

// Enhanced Health Scoring Algorithm
export const calculateAdvancedHealthScore = (product: EnhancedProduct, userProfile?: any): number => {
  let score = 100;
  
  // Contaminant penalties with severity weighting
  product.contaminants?.forEach(contaminant => {
    const severityMultiplier = contaminant.severity * 3;
    const concentrationRatio = contaminant.maxAllowed ? 
      (contaminant.level / contaminant.maxAllowed) : 1;
    const penalty = Math.min(severityMultiplier * concentrationRatio, 15);
    score -= penalty;
    
    // Extra penalty for exceeding regulatory limits
    if (contaminant.maxAllowed && contaminant.level > contaminant.maxAllowed) {
      score -= 10;
    }
  });
  
  // Personal allergen penalties (-25 each)
  if (userProfile?.selectedAllergens && product.allergens_tags) {
    userProfile.selectedAllergens.forEach(allergen => {
      const allergenKeywords = getAllergenKeywords(allergen);
      const hasAllergen = allergenKeywords.some(keyword => 
        product.allergens_tags?.some(tag => tag.includes(keyword)) ||
        product.ingredients?.some(ingredient => 
          ingredient.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      if (hasAllergen) {
        score -= 25;
      }
    });
  }
  
  // Lab verification bonus/penalty
  if (!product.labVerified) score -= 25;
  else score += 5;
  
  // Water source adjustments
  if (product.source === 'municipal') score -= 15;
  if (product.source === 'spring' || product.source === 'aquifer') score += 10;
  if (product.source === 'filtered') score += 5;
  
  // PFAS penalties with compound-specific weighting
  if (product.pfasDetected && product.pfasLevel) {
    const pfasPenalty = Math.min(product.pfasLevel / 10, 20);
    score -= pfasPenalty;
    
    // Additional penalty based on user's PFAS tolerance
    if (userProfile?.preferences?.maxPFAS && product.pfasLevel > userProfile.preferences.maxPFAS) {
      score -= 15;
    }
  }
  
  // Packaging penalties
  if (product.packaging === 'plastic') score -= 8;
  if (product.packaging === 'aluminum') score -= 5;
  if (product.packaging === 'glass') score += 5;
  
  // pH adjustments for water products
  if (product.ph && (product.category === 'bottled_water' || product.category === 'tap_water')) {
    if (product.ph < 6.5 || product.ph > 8.5) {
      score -= 10;
    } else if (product.ph >= 7.0 && product.ph <= 7.5) {
      score += 5; // Optimal pH range
    }
  }
  
  // Toxic ingredient penalties (-10 each)
  const toxicIngredients = [
    'phthalates', 'sucralose', 'aspartame', 
    'sodium benzoate', 'red dye 40', 'bpa',
    'high fructose corn syrup', 'trans fat',
    'sodium nitrite', 'sulfur dioxide',
    'potassium bromate', 'propyl gallate'
  ];
  
  if (product.ingredients) {
    const ingredientsText = product.ingredients.join(' ').toLowerCase();
    toxicIngredients.forEach(toxin => {
      if (ingredientsText.includes(toxin)) {
        score -= 10;
      }
    });
  }
  
  // E-number additive penalties (-5 each)
  if (product.additives_tags) {
    const eNumbers = product.additives_tags.filter(tag => /e\d{3,4}/i.test(tag));
    score -= (eNumbers.length * 5);
  }
  
  // Organic/natural bonuses
  if (product.labels_tags?.includes('en:organic')) {
    score += 15;
  }
  if (product.labels_tags?.includes('en:natural')) {
    score += 8;
  }
  if (product.labels_tags?.includes('en:non-gmo')) {
    score += 5;
  }
  
  // Apply user sensitivity multiplier
  const sensitivity = userProfile?.riskSensitivity || 3;
  const sensitivityMultiplier = sensitivity / 3; // 1 = conservative, 3 = normal, 5 = relaxed
  score = 100 - ((100 - score) * sensitivityMultiplier);
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Enhanced ingredient classification with contaminant detection
export const classifyIngredientsAdvanced = (ingredients: string[], contaminants: Contaminant[], userAllergens: string[] = []) => {
  if (!ingredients || !Array.isArray(ingredients)) {
    return [];
  }
  
  return ingredients.map(ingredient => {
    const cleanIngredient = ingredient.trim();
    const lowerIngredient = cleanIngredient.toLowerCase();
    
    // Check for personal allergens
    const hasAllergen = userAllergens.some(allergen => {
      const allergenKeywords = getAllergenKeywords(allergen);
      return allergenKeywords.some(keyword => lowerIngredient.includes(keyword));
    });
    
    if (hasAllergen) {
      return {
        name: cleanIngredient,
        tag: 'ALLERGEN',
        icon: '❗',
        color: '#FF3B30',
        risk: 'high',
        description: 'Contains allergen in your profile'
      };
    }
    
    // Check against detected contaminants
    const matchingContaminant = contaminants.find(c => 
      lowerIngredient.includes(c.name.toLowerCase())
    );
    
    if (matchingContaminant) {
      return {
        name: cleanIngredient,
        tag: 'CONTAMINANT',
        icon: '☢️',
        color: matchingContaminant.severity >= 4 ? '#FF3B30' : '#FF9500',
        risk: matchingContaminant.severity >= 4 ? 'high' : 'medium',
        description: matchingContaminant.healthRisk
      };
    }
    
    // Check for PFAS compounds
    const pfasMatch = pfasDatabase.find(pfas => 
      pfas.name.toLowerCase() === lowerIngredient ||
      pfas.aliases.some(alias => alias.toLowerCase() === lowerIngredient)
    );
    
    if (pfasMatch) {
      return {
        name: cleanIngredient,
        tag: 'PFAS',
        icon: '🧪',
        color: '#FF3B30',
        risk: 'high',
        description: pfasMatch.healthRisk
      };
    }
    
    // Check for toxic substances
    const toxicSubstances = [
      'phthalates', 'microplastics', 'artificial colors',
      'red dye 40', 'yellow dye 5', 'blue dye 1',
      'sodium benzoate', 'potassium sorbate',
      'bha', 'bht', 'tbhq', 'propyl gallate',
      'aspartame', 'sucralose', 'acesulfame potassium'
    ];
    
    const hasToxin = toxicSubstances.some(toxin => lowerIngredient.includes(toxin));
    if (hasToxin) {
      return {
        name: cleanIngredient,
        tag: 'TOXIN',
        icon: '⚠️',
        color: '#FF9500',
        risk: 'medium',
        description: 'Potentially harmful substance'
      };
    }
    
    // Check for E-number additives
    if (/e\d{3,4}/i.test(lowerIngredient)) {
      return {
        name: cleanIngredient,
        tag: 'ADDITIVE',
        icon: '🧪',
        color: '#FF9500',
        risk: 'low',
        description: 'Food additive (E-number)'
      };
    }
    
    // Check for artificial ingredients
    const artificialIngredients = [
      'artificial flavor', 'artificial color', 'artificial sweetener',
      'high fructose corn syrup', 'corn syrup',
      'monosodium glutamate', 'msg', 'modified corn starch'
    ];
    
    const hasArtificial = artificialIngredients.some(artificial => 
      lowerIngredient.includes(artificial)
    );
    
    if (hasArtificial) {
      return {
        name: cleanIngredient,
        tag: 'ARTIFICIAL',
        icon: '🔬',
        color: '#FF9500',
        risk: 'low',
        description: 'Artificial ingredient'
      };
    }
    
    // Check for beneficial ingredients
    const beneficialIngredients = [
      'organic', 'natural', 'vitamin', 'mineral',
      'fiber', 'protein', 'omega', 'antioxidant',
      'probiotic', 'whole grain', 'spring water',
      'filtered water', 'electrolytes'
    ];
    
    const hasBeneficial = beneficialIngredients.some(beneficial => 
      lowerIngredient.includes(beneficial)
    );
    
    if (hasBeneficial) {
      return {
        name: cleanIngredient,
        tag: 'BENEFICIAL',
        icon: '💚',
        color: '#34C759',
        risk: 'none',
        description: 'Beneficial ingredient'
      };
    }
    
    // Default to safe
    return {
      name: cleanIngredient,
      tag: 'SAFE',
      icon: '✅',
      color: '#34C759',
      risk: 'none',
      description: 'Generally safe ingredient'
    };
  });
};

// Contaminant risk assessment
export const assessContaminantRisk = (contaminants: Contaminant[]): {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  recommendations: string[];
} => {
  if (contaminants.length === 0) {
    return {
      overallRisk: 'low',
      riskFactors: [],
      recommendations: ['This product appears to be free of major contaminants']
    };
  }
  
  const highSeverityContaminants = contaminants.filter(c => c.severity >= 4);
  const exceedsLimits = contaminants.filter(c => c.maxAllowed && c.level > c.maxAllowed);
  const pfasContaminants = contaminants.filter(c => c.category === 'pfas');
  const heavyMetals = contaminants.filter(c => c.category === 'heavy_metals');
  
  let overallRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
  const riskFactors: string[] = [];
  const recommendations: string[] = [];
  
  // Determine overall risk level
  if (exceedsLimits.length > 0 || highSeverityContaminants.length >= 2) {
    overallRisk = 'critical';
  } else if (highSeverityContaminants.length > 0 || pfasContaminants.length > 0) {
    overallRisk = 'high';
  } else if (contaminants.some(c => c.severity >= 3)) {
    overallRisk = 'medium';
  }
  
  // Generate risk factors
  if (exceedsLimits.length > 0) {
    riskFactors.push(`${exceedsLimits.length} contaminant(s) exceed regulatory limits`);
  }
  if (pfasContaminants.length > 0) {
    riskFactors.push(`PFAS compounds detected (${pfasContaminants.length})`);
  }
  if (heavyMetals.length > 0) {
    riskFactors.push(`Heavy metals present (${heavyMetals.length})`);
  }
  
  // Generate recommendations
  if (overallRisk === 'critical') {
    recommendations.push('Avoid this product - serious health risks detected');
    recommendations.push('Consider reporting to local health authorities');
  } else if (overallRisk === 'high') {
    recommendations.push('Use caution - significant contaminants detected');
    recommendations.push('Consider safer alternatives');
  } else if (overallRisk === 'medium') {
    recommendations.push('Monitor usage - some contaminants present');
    recommendations.push('Consider filtration if using regularly');
  }
  
  return { overallRisk, riskFactors, recommendations };
};

// Enhanced product comparison
export const compareProducts = (products: EnhancedProduct[], userProfile?: any): EnhancedProduct[] => {
  return products
    .map(product => ({
      ...product,
      healthScore: calculateAdvancedHealthScore(product, userProfile)
    }))
    .sort((a, b) => b.healthScore - a.healthScore);
};

// Get safer alternatives
export const getSaferAlternatives = (
  currentProduct: EnhancedProduct, 
  allProducts: EnhancedProduct[], 
  userProfile?: any
): EnhancedProduct[] => {
  const currentScore = calculateAdvancedHealthScore(currentProduct, userProfile);
  
  return allProducts
    .filter(p => 
      p.id !== currentProduct.id &&
      p.category === currentProduct.category
    )
    .map(product => ({
      ...product,
      healthScore: calculateAdvancedHealthScore(product, userProfile)
    }))
    .filter(p => p.healthScore > currentScore)
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 5);
};

const getAllergenKeywords = (allergen: string): string[] => {
  const allergenMap: Record<string, string[]> = {
    dairy: ['milk', 'lactose', 'casein', 'whey', 'butter', 'cheese', 'cream', 'yogurt'],
    gluten: ['wheat', 'barley', 'rye', 'gluten', 'malt', 'flour'],
    peanuts: ['peanut', 'groundnut', 'arachis'],
    eggs: ['egg', 'albumin', 'lecithin', 'mayonnaise'],
    fish: ['fish', 'salmon', 'tuna', 'cod', 'anchovy'],
    shellfish: ['shrimp', 'crab', 'lobster', 'shellfish', 'crustacean'],
    soy: ['soy', 'soybean', 'tofu', 'tempeh', 'miso'],
    nuts: ['almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'brazil nut'],
  };
  
  return allergenMap[allergen] || [allergen];
};

export const getHealthScoreColor = (score: number): string => {
  if (score >= 80) return '#34C759'; // Green
  if (score >= 60) return '#FF9500'; // Orange
  if (score >= 40) return '#FF9500'; // Orange
  return '#FF3B30'; // Red
};

export const getHealthScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate Risk';
  return 'High Risk';
};

export const getRiskRecommendation = (score: number, allergensDetected: any[], toxinsDetected: any[]): string => {
  if (allergensDetected.length > 0) {
    return 'AVOID: Contains allergens from your profile';
  }
  
  if (score < 40) {
    return 'AVOID: High health risk detected';
  }
  
  if (score < 60) {
    return 'CAUTION: Consider healthier alternatives';
  }
  
  if (score < 80) {
    return 'OKAY: Generally safe but could be better';
  }
  
  return 'EXCELLENT: Great healthy choice!';
};