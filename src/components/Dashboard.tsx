// CORE COMPONENT: Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Shield, Droplets, Zap, Users, Calendar } from 'lucide-react';
import { Product, UserProfile } from '../types';
import { calculateHealthScore } from '../utils/healthScoring';
import { RecommendationEngine } from '../utils/recommendationEngine';
import { allProducts } from '../data/sampleData';

interface DashboardProps {
  scanHistory: Product[];
  userProfile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ scanHistory, userProfile }) => {
  const [insights, setInsights] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    const personalizedInsights = RecommendationEngine.getPersonalizedInsights(
      scanHistory,
      userProfile
    );
    setInsights(personalizedInsights);
  }, [scanHistory, userProfile]);

  // Calculate statistics
  const totalScans = scanHistory.length;
  const averageScore = insights?.averageScore || 0;
  const pfasProducts = scanHistory.filter(p => p.pfasData.detected).length;
  const highRiskProducts = scanHistory.filter(p => {
    const { score } = calculateHealthScore(p);
    return score < 60;
  }).length;
  const labVerifiedProducts = scanHistory.filter(p => p.labVerified).length;

  // Recent activity
  const recentScans = scanHistory.slice(0, 5);

  // Health goal progress
  const healthGoalProgress = insights?.healthGoalProgress || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
            <p className="text-gray-600">Track your product health analysis and progress</p>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{averageScore}</p>
              <p className="text-sm text-gray-600">Average Health Score</p>
              <div className="flex items-center gap-1 mt-1">
                {averageScore >= 80 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs ${averageScore >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                  {averageScore >= 80 ? 'Excellent' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalScans}</p>
              <p className="text-sm text-gray-600">Products Scanned</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">
                  {labVerifiedProducts} lab verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pfasProducts}</p>
              <p className="text-sm text-gray-600">PFAS Detected</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-red-600">
                  {totalScans > 0 ? Math.round((pfasProducts / totalScans) * 100) : 0}% of products
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{highRiskProducts}</p>
              <p className="text-sm text-gray-600">High Risk Items</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-orange-600">
                  Score &lt; 60
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Goals Progress */}
      {healthGoalProgress.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Goals Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthGoalProgress.map((goal, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {goal.goal.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      goal.progress >= 80 ? 'bg-green-500' :
                      goal.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Opportunities */}
      {insights?.improvementOpportunities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Opportunities</h3>
          <div className="space-y-3">
            {insights.improvementOpportunities.map((opportunity: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">{opportunity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Scans */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        
        {recentScans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No scans yet</p>
            <p>Start by scanning your first product to see your health analysis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentScans.map((product, index) => {
              const { score } = calculateHealthScore(product);
              const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
              const bgColor = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';

              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${bgColor}`}>
                      {score}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {product.category.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {product.pfasDetected && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        PFAS
                      </span>
                    )}
                    {product.labVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        ✓ Verified
                      </span>
                    )}
                    <span className={`text-sm font-medium ${scoreColor}`}>
                      {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Poor'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Profile Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Health Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Health Goals</h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.healthGoals.map((goal, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {goal.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Dietary Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.dietaryPreferences.map((pref, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {pref}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Allergens to Avoid</h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.allergens.map((allergen, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
            <p className="text-sm text-gray-600">{userProfile.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};