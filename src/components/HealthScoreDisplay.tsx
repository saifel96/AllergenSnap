// CORE COMPONENT: HealthScoreDisplay.tsx
import React from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Product, ScoreBreakdown } from '../types';
import { calculateHealthScore, getScoreColor, getScoreLabel, getScoreGrade } from '../utils/healthScoring';

interface HealthScoreDisplayProps {
  product: Product;
  showBreakdown?: boolean;
}

export const HealthScoreDisplay: React.FC<HealthScoreDisplayProps> = ({ 
  product, 
  showBreakdown = true 
}) => {
  const { score, breakdown } = calculateHealthScore(product);
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const scoreGrade = getScoreGrade(score);

  // Circular progress calculation
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
          <p className="text-gray-600">{product.brand}</p>
          <p className="text-sm text-gray-500 capitalize">
            {product.category.replace('_', ' ')}
          </p>
        </div>

        {/* Circular Score Display */}
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke={scoreColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: scoreColor }}>
                {score}
              </div>
              <div className="text-xs text-gray-500">/100</div>
              <div className="text-xs font-medium mt-1" style={{ color: scoreColor }}>
                Grade {scoreGrade}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Label and Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="px-4 py-2 rounded-full text-white font-medium"
            style={{ backgroundColor: scoreColor }}
          >
            {scoreLabel}
          </div>
          {score >= 80 ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : score >= 60 ? (
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-500" />
          )}
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Health Impact</p>
          <p className="font-medium" style={{ color: scoreColor }}>
            {score >= 80 ? 'Minimal Risk' : score >= 60 ? 'Moderate Risk' : 'High Risk'}
          </p>
        </div>
      </div>

      {showBreakdown && (
        <>
          {/* Score Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {/* Base Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">+100</span>
                </div>
              </div>

              {/* Contaminant Penalty */}
              {breakdown.contaminantPenalty > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contaminants</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(breakdown.contaminantPenalty / 60) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -{breakdown.contaminantPenalty.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}

              {/* Lab Verification */}
              {breakdown.labVerificationPenalty > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lab Verification</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full w-full"></div>
                    </div>
                    <span className="text-sm font-medium text-red-600">-25</span>
                  </div>
                </div>
              )}

              {/* Water Source */}
              {breakdown.waterSourceAdjustment !== 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Water Source</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${breakdown.waterSourceAdjustment > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.abs(breakdown.waterSourceAdjustment) * 4}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${breakdown.waterSourceAdjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {breakdown.waterSourceAdjustment > 0 ? '+' : ''}{breakdown.waterSourceAdjustment}
                    </span>
                  </div>
                </div>
              )}

              {/* PFAS Penalty */}
              {breakdown.pfasPenalty > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">PFAS Presence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(breakdown.pfasPenalty / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -{breakdown.pfasPenalty}
                    </span>
                  </div>
                </div>
              )}

              {/* Packaging Penalty */}
              {breakdown.packagingPenalty > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Packaging</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(breakdown.packagingPenalty / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-orange-600">
                      -{breakdown.packagingPenalty}
                    </span>
                  </div>
                </div>
              )}

              {/* pH Penalty */}
              {breakdown.phPenalty > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">pH Level</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full w-full"></div>
                    </div>
                    <span className="text-sm font-medium text-orange-600">-5</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Score Explanation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {breakdown.explanation.map((explanation, index) => (
                    <li key={index}>• {explanation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};