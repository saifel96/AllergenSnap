// Core Types for Health Product Scanner System

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'bottled_water' | 'tap_water' | 'food' | 'beverage' | 'baby_food';
  imageUrl: string;
  
  // Health Analysis
  healthScore?: number;
  scoreBreakdown?: ScoreBreakdown;
  contaminants: Contaminant[];
  pfasData: PFASData;
  
  // Product Details
  packaging: 'glass' | 'plastic' | 'aluminum' | 'none';
  waterSource?: 'municipal' | 'spring' | 'aquifer' | 'filtered';
  ph?: number;
  labVerified: boolean;
  
  // Nutritional (for food products)
  nutritionalData?: NutritionalData;
  ingredients?: string[];
  
  // Location & Testing
  location?: string;
  testingStatus: 'pending' | 'in_progress' | 'complete';
  testDate?: string;
}

export interface Contaminant {
  name: string;
  category: ContaminantCategory;
  severity: 1 | 2 | 3 | 4 | 5;
  concentration: number;
  unit: 'ppb' | 'ppm' | 'pCi' | 'mg/L';
  maxAllowed?: number;
  healthRisk: string;
  priority: 'high' | 'medium' | 'low';
  weight: number; // Percentage weight in scoring
}

export type ContaminantCategory = 
  | 'pfas' 
  | 'radiological' 
  | 'vocs' 
  | 'microbiological' 
  | 'heavy_metals' 
  | 'disinfectants'
  | 'microplastics' 
  | 'pesticides' 
  | 'herbicides' 
  | 'haloacetic_acids' 
  | 'trihalomethanes' 
  | 'fluoride';

export interface PFASData {
  detected: boolean;
  totalConcentration?: number; // ppt
  compounds: PFASCompound[];
  status: 'detected' | 'not_detected' | 'not_tested';
  testMethod?: string;
}

export interface PFASCompound {
  name: string;
  casNumber: string;
  concentration: number; // ppt
  maxAllowed?: number;
  toxicityClass: 'carcinogenic' | 'endocrine_disruptor' | 'developmental' | 'immune_system';
  healthRisk: string;
}

export interface ScoreBreakdown {
  baseScore: 100;
  contaminantPenalty: number;
  labVerificationPenalty: number;
  waterSourceAdjustment: number;
  pfasPenalty: number;
  packagingPenalty: number;
  phPenalty: number;
  finalScore: number;
  explanation: string[];
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
  status: 'positive' | 'neutral' | 'negative';
  icon: string;
}

export interface UserProfile {
  id: string;
  healthGoals: string[];
  dietaryPreferences: string[];
  location: string;
  allergens: string[];
  preferences: {
    maxPFAS: number;
    minScore: number;
    preferredPackaging: string[];
    avoidContaminants: string[];
  };
}

export interface Recommendation {
  product: Product;
  reason: string;
  scoreImprovement: number;
  confidence: number;
  category: 'better_alternative' | 'pfas_free' | 'lab_verified' | 'lower_contaminants';
}

export interface TestingProcess {
  id: string;
  productId: string;
  status: 'pending' | 'sample_collection' | 'initial_screening' | 'advanced_analysis' | 'risk_categorization' | 'report_generation' | 'complete';
  currentStep: number;
  totalSteps: number;
  startDate: string;
  estimatedCompletion?: string;
  results?: LabReport;
}

export interface LabReport {
  id: string;
  productId: string;
  testDate: string;
  laboratory: string;
  certifications: string[];
  summary: {
    overallRating: 'excellent' | 'good' | 'fair' | 'poor';
    keyFindings: string[];
    recommendations: string[];
  };
  detailedResults: {
    contaminants: Contaminant[];
    pfasAnalysis: PFASData;
    compliance: ComplianceResult[];
  };
}

export interface ComplianceResult {
  standard: string;
  status: 'compliant' | 'non_compliant' | 'not_applicable';
  details: string;
}

// Contaminant Priority Weights (as specified)
export const CONTAMINANT_WEIGHTS = {
  // High Priority (9.68% each)
  pfas: 9.68,
  radiological: 9.68,
  vocs: 9.68,
  microbiological: 9.68,
  heavy_metals: 9.68,
  disinfectants: 9.68,
  
  // Medium Priority
  microplastics: 6.45,
  pesticides: 6.45,
  herbicides: 6.45,
  haloacetic_acids: 4.84,
  trihalomethanes: 4.84,
  fluoride: 4.03
} as const;