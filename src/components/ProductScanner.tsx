// CORE COMPONENT: ProductScanner.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, ScanLine, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { allProducts } from '../data/sampleData';
import { calculateHealthScore, getScoreColor, getScoreLabel } from '../utils/healthScoring';

interface ProductScannerProps {
  onProductSelect: (product: Product) => void;
  onStartTesting: (product: Product) => void;
}

export const ProductScanner: React.FC<ProductScannerProps> = ({ 
  onProductSelect, 
  onStartTesting 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'category'>('score');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let filtered = allProducts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Calculate scores and sort
    const scoredProducts = filtered.map(product => {
      const { score } = calculateHealthScore(product);
      return { ...product, healthScore: score };
    });

    // Apply sorting
    scoredProducts.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return (b.healthScore || 0) - (a.healthScore || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredProducts(scoredProducts);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleScanProduct = async (product: Product) => {
    setIsScanning(true);
    
    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsScanning(false);
    onStartTesting(product);
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'bottled_water', label: 'Bottled Water' },
    { value: 'tap_water', label: 'Tap Water' },
    { value: 'beverage', label: 'Beverages' },
    { value: 'food', label: 'Food' },
    { value: 'baby_food', label: 'Baby Food' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ScanLine className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Scanner</h2>
            <p className="text-gray-600">Scan or search for products to analyze their health impact</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or brands..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'score' | 'category')}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="score">Sort by Health Score</option>
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>{filteredProducts.length} products found</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Excellent (80-100)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Good (60-79)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Poor (&lt;60)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const score = product.healthScore || 0;
          const scoreColor = getScoreColor(score);
          const scoreLabel = getScoreLabel(score);

          return (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    style={{ backgroundColor: scoreColor }}
                  >
                    {score}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {product.category.replace('_', ' ')}
                  </p>
                </div>

                {/* Health Indicators */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.pfasData.detected && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      PFAS
                    </span>
                  )}
                  {product.labVerified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      ✓ Verified
                    </span>
                  )}
                  {product.contaminants.length > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {product.contaminants.length} Contaminants
                    </span>
                  )}
                  {product.packaging === 'glass' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Glass
                    </span>
                  )}
                </div>

                {/* Score Label */}
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: scoreColor }}
                  >
                    {scoreLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    {score >= 80 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : score >= 60 ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onProductSelect(product)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <BarChart3 className="w-4 h-4 inline mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleScanProduct(product)}
                    disabled={isScanning}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    <ScanLine className="w-4 h-4 inline mr-1" />
                    {isScanning ? 'Scanning...' : 'Scan'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};