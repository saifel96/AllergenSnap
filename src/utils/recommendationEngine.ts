// CORE FEATURE 4: TAILORED SUGGESTIONS ENGINE
import { Product, UserProfile, Recommendation } from '../types';
import { calculateHealthScore } from './healthScoring';

export class RecommendationEngine {
  static generateRecommendations(
    currentProduct: Product,
    allProducts: Product[],
    userProfile: UserProfile,
    scanHistory: Product[] = []
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Filter products in same category
    const sameCategory = allProducts.filter(p => 
      p.id !== currentProduct.id && 
      p.category === currentProduct.category
    );

    // Calculate scores for comparison
    const currentScore = calculateHealthScore(currentProduct).score;
    
    sameCategory.forEach(product => {
      const { score } = calculateHealthScore(product);
      const scoreImprovement = score - currentScore;
      
      if (scoreImprovement > 0) {
        const recommendation = this.analyzeProduct(
          product, 
          currentProduct, 
          userProfile, 
          scoreImprovement
        );
        
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }
    });

    // Sort by score improvement and confidence
    return recommendations
      .sort((a, b) => {
        const scoreWeight = (b.scoreImprovement - a.scoreImprovement) * 0.7;
        const confidenceWeight = (b.confidence - a.confidence) * 0.3;
        return scoreWeight + confidenceWeight;
      })
      .slice(0, 5); // Top 5 recommendations
  }

  private static analyzeProduct(
    product: Product,
    currentProduct: Product,
    userProfile: UserProfile,
    scoreImprovement: number
  ): Recommendation | null {
    let confidence = 0.5; // Base confidence
    let reason = '';
    let category: Recommendation['category'] = 'better_alternative';

    // Analyze why this product is better
    const reasons: string[] = [];

    // PFAS-free advantage
    if (currentProduct.pfasData.detected && !product.pfasData.detected) {
      reasons.push('PFAS-free');
      confidence += 0.2;
      category = 'pfas_free';
    }

    // Lab verification advantage
    if (!currentProduct.labVerified && product.labVerified) {
      reasons.push('Lab verified');
      confidence += 0.15;
      if (category === 'better_alternative') category = 'lab_verified';
    }

    // Lower contaminants
    if (product.contaminants.length < currentProduct.contaminants.length) {
      reasons.push(`${currentProduct.contaminants.length - product.contaminants.length} fewer contaminants`);
      confidence += 0.1;
      if (category === 'better_alternative') category = 'lower_contaminants';
    }

    // Better packaging
    if (product.packaging === 'glass' && currentProduct.packaging !== 'glass') {
      reasons.push('Glass packaging');
      confidence += 0.1;
    }

    // User preference alignment
    if (userProfile.preferences.preferredPackaging.includes(product.packaging)) {
      confidence += 0.1;
    }

    // Avoid user's contaminant preferences
    const hasAvoidedContaminants = product.contaminants.some(c => 
      userProfile.preferences.avoidContaminants.includes(c.category)
    );
    if (hasAvoidedContaminants) {
      confidence -= 0.2;
    }

    // Health goal alignment
    if (userProfile.healthGoals.includes('pfas_free') && !product.pfasData.detected) {
      confidence += 0.15;
    }
    if (userProfile.healthGoals.includes('low_sodium') && product.nutritionalData) {
      if (product.nutritionalData.per100g.salt < 0.3) {
        confidence += 0.1;
        reasons.push('Low sodium');
      }
    }

    // Minimum confidence threshold
    if (confidence < 0.4) return null;

    reason = reasons.length > 0 ? reasons.join(', ') : 'Better overall health score';

    return {
      product,
      reason,
      scoreImprovement,
      confidence: Math.min(confidence, 1.0),
      category
    };
  }

  static getPersonalizedInsights(
    scanHistory: Product[],
    userProfile: UserProfile
  ): {
    averageScore: number;
    improvementOpportunities: string[];
    healthGoalProgress: { goal: string; progress: number }[];
  } {
    if (scanHistory.length === 0) {
      return {
        averageScore: 0,
        improvementOpportunities: [],
        healthGoalProgress: []
      };
    }

    // Calculate average score
    const scores = scanHistory.map(p => calculateHealthScore(p).score);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Identify improvement opportunities
    const improvementOpportunities: string[] = [];
    
    const pfasProducts = scanHistory.filter(p => p.pfasData.detected).length;
    if (pfasProducts > scanHistory.length * 0.3) {
      improvementOpportunities.push('Consider PFAS-free alternatives');
    }

    const unverifiedProducts = scanHistory.filter(p => !p.labVerified).length;
    if (unverifiedProducts > scanHistory.length * 0.5) {
      improvementOpportunities.push('Choose more lab-verified products');
    }

    const plasticProducts = scanHistory.filter(p => p.packaging === 'plastic').length;
    if (plasticProducts > scanHistory.length * 0.6) {
      improvementOpportunities.push('Switch to glass packaging when possible');
    }

    // Health goal progress
    const healthGoalProgress = userProfile.healthGoals.map(goal => {
      let progress = 0;
      
      switch (goal) {
        case 'pfas_free':
          const pfasFreeCount = scanHistory.filter(p => !p.pfasData.detected).length;
          progress = (pfasFreeCount / scanHistory.length) * 100;
          break;
        case 'low_sodium':
          const lowSodiumCount = scanHistory.filter(p => 
            p.nutritionalData && p.nutritionalData.per100g.salt < 0.3
          ).length;
          progress = (lowSodiumCount / scanHistory.length) * 100;
          break;
        case 'organic':
          // This would need to be tracked in product data
          progress = 50; // Placeholder
          break;
        default:
          progress = 0;
      }
      
      return { goal, progress: Math.round(progress) };
    });

    return {
      averageScore: Math.round(averageScore),
      improvementOpportunities,
      healthGoalProgress
    };
  }
}