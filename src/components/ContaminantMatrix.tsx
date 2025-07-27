// CORE FEATURE 2: CONTAMINANT DETECTION & ANALYSIS SYSTEM
import React, { useState } from 'react';
import { AlertTriangle, Filter, TrendingUp, TrendingDown, Info, Zap } from 'lucide-react';
import { Contaminant, CONTAMINANT_WEIGHTS } from '../types';

interface ContaminantMatrixProps {
  contaminants: Contaminant[];
  showHeatmap?: boolean;
}

export const ContaminantMatrix: React.FC<ContaminantMatrixProps> = ({ 
  contaminants, 
  showHeatmap = true 
}) => {
  const [sortBy, setSortBy] = useState<'severity' | 'concentration' | 'priority'>('severity');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Sort and filter contaminants
  const processedContaminants = contaminants
    .filter(contaminant => {
      if (filterBy === 'all') return true;
      return contaminant.priority === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'severity':
          return b.severity - a.severity;
        case 'concentration':
          return b.concentration - a.concentration;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const getSeverityColor = (severity: number): string => {
    if (severity >= 5) return '#DC2626'; // Red
    if (severity >= 4) return '#EA580C'; // Orange
    if (severity >= 3) return '#D97706'; // Amber
    if (severity >= 2) return '#EAB308'; // Yellow
    return '#059669'; // Green
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#DC2626';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  const getConcentrationPercentage = (contaminant: Contaminant): number => {
    if (!contaminant.maxAllowed) return contaminant.severity * 20;
    return Math.min((contaminant.concentration / contaminant.maxAllowed) * 100, 100);
  };

  if (contaminants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contaminant Analysis</h3>
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-lg font-medium text-green-800 mb-2">Clean Product</h4>
          <p className="text-green-700">No contaminants detected in this product</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Contaminant Analysis</h3>
          <p className="text-sm text-gray-600">
            {contaminants.length} contaminant{contaminants.length > 1 ? 's' : ''} detected
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="text-sm border rounded-lg px-3 py-1"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded-lg px-3 py-1"
          >
            <option value="severity">Sort by Severity</option>
            <option value="concentration">Sort by Concentration</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Priority Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Priority Weighting System</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium">High Priority (9.68% each)</span>
            </div>
            <p className="text-gray-600 ml-5">PFAS, Heavy Metals, VOCs, Radiological, Microbiological, Disinfectants</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-medium">Medium Priority (4.84-6.45%)</span>
            </div>
            <p className="text-gray-600 ml-5">Microplastics, Pesticides, Herbicides, Haloacetic acids, Trihalomethanes, Fluoride</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">Severity Scale</span>
            </div>
            <p className="text-gray-600 ml-5">1 = Minimal, 2 = Low, 3 = Moderate, 4 = High, 5 = Critical</p>
          </div>
        </div>
      </div>

      {/* Contaminant List */}
      <div className="space-y-4">
        {processedContaminants.map((contaminant, index) => {
          const severityColor = getSeverityColor(contaminant.severity);
          const priorityColor = getPriorityColor(contaminant.priority);
          const concentrationPercentage = getConcentrationPercentage(contaminant);
          const exceedsLimit = contaminant.maxAllowed && contaminant.concentration > contaminant.maxAllowed;
          const weight = CONTAMINANT_WEIGHTS[contaminant.category] || 1;

          return (
            <div key={index} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{contaminant.name}</h4>
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: priorityColor }}
                    >
                      {contaminant.priority.toUpperCase()}
                    </div>
                    {exceedsLimit && (
                      <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                        EXCEEDS LIMIT
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>Category: {contaminant.category.replace('_', ' ')}</span>
                    <span>Weight: {weight}%</span>
                    <span>Severity: {contaminant.severity}/5</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: severityColor }}>
                    {contaminant.concentration} {contaminant.unit}
                  </div>
                  {contaminant.maxAllowed && (
                    <div className="text-xs text-gray-500">
                      Max: {contaminant.maxAllowed} {contaminant.unit}
                    </div>
                  )}
                </div>
              </div>

              {/* Concentration Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Concentration Level</span>
                  <span>{concentrationPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(concentrationPercentage, 100)}%`,
                      backgroundColor: exceedsLimit ? '#DC2626' : severityColor
                    }}
                  ></div>
                </div>
              </div>

              {/* Health Risk */}
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Health Risk</p>
                  <p className="text-sm text-gray-600">{contaminant.healthRisk}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Visualization */}
      {showHeatmap && contaminants.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Contamination Heatmap</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {processedContaminants.map((contaminant, index) => {
              const intensity = contaminant.severity / 5;
              const color = getSeverityColor(contaminant.severity);
              
              return (
                <div
                  key={index}
                  className="aspect-square rounded-lg flex items-center justify-center text-white text-xs font-medium relative group cursor-pointer"
                  style={{ 
                    backgroundColor: color,
                    opacity: 0.3 + (intensity * 0.7)
                  }}
                >
                  <span className="text-center leading-tight">
                    {contaminant.name.split(' ')[0]}
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {contaminant.name}: {contaminant.concentration} {contaminant.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {processedContaminants.length === 0 && filterBy !== 'all' && (
        <div className="text-center py-8 text-gray-500">
          <Filter className="w-8 h-8 mx-auto mb-2" />
          <p>No contaminants found for the selected filter</p>
        </div>
      )}
    </div>
  );
};