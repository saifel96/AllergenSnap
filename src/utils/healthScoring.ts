// CORE FEATURE 1: SCORING METHODOLOGY ENGINE
import { Product, ScoreBreakdown, Contaminant, CONTAMINANT_WEIGHTS } from '../types';

export function calculateHealthScore(product: Product): { score: number; breakdown: ScoreBreakdown } {
  let score = 100; // Base score
  const explanation: string[] = [];
  
  // 1. Contaminant Penalties (up to -60 points)
  let contaminantPenalty = 0;
  product.contaminants.forEach(contaminant => {
    const weight = CONTAMINANT_WEIGHTS[contaminant.category] || 1;
    const severityMultiplier = contaminant.severity;
    const concentrationRatio = contaminant.maxAllowed ? 
      Math.min(contaminant.concentration / contaminant.maxAllowed, 2) : 1;
    
    const penalty = Math.min((weight / 100) * severityMultiplier * concentrationRatio * 60, 15);
    contaminantPenalty += penalty;
  });
  contaminantPenalty = Math.min(contaminantPenalty, 60);
  score -= contaminantPenalty;
  
  if (contaminantPenalty > 0) {
    explanation.push(`Contaminants detected: -${contaminantPenalty.toFixed(1)} points`);
  }

  // 2. Lab Verification (-25 points if not verified)
  const labVerificationPenalty = product.labVerified ? 0 : 25;
  score -= labVerificationPenalty;
  if (labVerificationPenalty > 0) {
    explanation.push(`Not lab verified: -${labVerificationPenalty} points`);
  }

  // 3. Water Source Quality
  let waterSourceAdjustment = 0;
  if (product.waterSource) {
    switch (product.waterSource) {
      case 'municipal':
        waterSourceAdjustment = -15;
        explanation.push(`Municipal water source: -15 points`);
        break;
      case 'spring':
      case 'aquifer':
        waterSourceAdjustment = 10;
        explanation.push(`Natural water source: +10 points`);
        break;
      case 'filtered':
        waterSourceAdjustment = 5;
        explanation.push(`Filtered water: +5 points`);
        break;
    }
  }
  score += waterSourceAdjustment;

  // 4. PFAS Presence (up to -50 points based on ppt concentration)
  let pfasPenalty = 0;
  if (product.pfasData.detected && product.pfasData.totalConcentration) {
    const pptLevel = product.pfasData.totalConcentration;
    if (pptLevel > 70) {
      pfasPenalty = 50; // Maximum penalty for high PFAS
    } else if (pptLevel > 20) {
      pfasPenalty = 30; // Moderate penalty
    } else if (pptLevel > 4) {
      pfasPenalty = 15; // Low penalty
    } else {
      pfasPenalty = 5; // Minimal penalty for trace amounts
    }
    
    // Additional penalty for multiple PFAS compounds
    if (product.pfasData.compounds.length > 3) {
      pfasPenalty += 10;
    }
    
    pfasPenalty = Math.min(pfasPenalty, 50);
    score -= pfasPenalty;
    explanation.push(`PFAS detected (${pptLevel} ppt): -${pfasPenalty} points`);
  }

  // 5. Packaging Material Penalties
  let packagingPenalty = 0;
  switch (product.packaging) {
    case 'glass':
      packagingPenalty = 0;
      break;
    case 'plastic':
      packagingPenalty = 5;
      explanation.push(`Plastic packaging: -5 points`);
      break;
    case 'aluminum':
      packagingPenalty = 10;
      explanation.push(`Aluminum packaging: -10 points`);
      break;
  }
  score -= packagingPenalty;

  // 6. pH Level (outside 6.5-8.5 range: -5 points)
  let phPenalty = 0;
  if (product.ph && (product.ph < 6.5 || product.ph > 8.5)) {
    phPenalty = 5;
    score -= phPenalty;
    explanation.push(`pH outside optimal range (${product.ph}): -5 points`);
  }

  // Ensure score stays within 1-100 range
  const finalScore = Math.max(1, Math.min(100, Math.round(score)));

  const breakdown: ScoreBreakdown = {
    baseScore: 100,
    contaminantPenalty,
    labVerificationPenalty,
    waterSourceAdjustment,
    pfasPenalty,
    packagingPenalty,
    phPenalty,
    finalScore,
    explanation
  };

  return { score: finalScore, breakdown };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#22C55E'; // Green
  if (score >= 60) return '#F59E0B'; // Yellow
  return '#EF4444'; // Red
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Poor';
}

export function getScoreGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Utility function for batch scoring
export function scoreProducts(products: Product[]): Product[] {
  return products.map(product => {
    const { score, breakdown } = calculateHealthScore(product);
    return {
      ...product,
      healthScore: score,
      scoreBreakdown: breakdown
    };
  });
}