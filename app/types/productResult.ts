export interface ProductResult {
  id: string;
  name: string;
  brand: string;
  category: 'baby_food' | 'water' | 'spring_water' | 'frozen_vegetables' | 'beverage' | 'food';
  imageUrl: string;
  overallScore: number;
  scoreLabel: string;
  labTested: boolean;
  testCount?: number;
  userReviews?: number;
  
  // Key indicators
  microplastics: 'none' | 'minimal' | 'likely';
  contaminants: ContaminantIndicator[];
  beneficialIngredients: BeneficialIngredient[];
  
  // Nutritional data (for food products)
  nutritionalData?: NutritionalData;
  
  // Findings
  positiveFindings: Finding[];
  negativeFindings: Finding[];
  
  // Recommendations
  alternatives?: AlternativeProduct[];
  adviceBanner?: string;
  
  // Expandable sections
  expandableSections: ExpandableSection[];
}

export interface ContaminantIndicator {
  name: string;
  severity: 'low' | 'medium' | 'high';
  value?: string;
  icon: string;
}

export interface BeneficialIngredient {
  name: string;
  value?: string;
  icon: string;
}

export interface NutritionalData {
  per100g: {
    calories: number;
    protein: number;
    fiber: number;
    sugar: number;
    salt: number;
    fat?: number;
    carbs?: number;
  };
  verdicts: NutritionalVerdict[];
}

export interface NutritionalVerdict {
  label: string;
  labelDe: string;
  status: 'positive' | 'neutral' | 'negative';
  icon: string;
}

export interface Finding {
  text: string;
  textDe: string;
  status: 'positive' | 'negative';
  icon: string;
}

export interface AlternativeProduct {
  id: string;
  name: string;
  brand: string;
  score: number;
  improvement: number;
  imageUrl: string;
}

export interface ExpandableSection {
  title: string;
  titleDe: string;
  icon: string;
  content: string;
  contentDe: string;
}

export type Language = 'en' | 'de';