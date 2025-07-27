// Main App Component
import React, { useState, useEffect } from 'react';
import { Search, Scan, BarChart3, Database, FileText, Settings, Shield, MapPin } from 'lucide-react';
import { Product, UserProfile, TestingProcess } from './types';
import { allProducts } from './data/sampleData';
import { ProductScanner } from './components/ProductScanner';
import { HealthScoreDisplay } from './components/HealthScoreDisplay';
import { ContaminantMatrix } from './components/ContaminantMatrix';
import { Dashboard } from './components/Dashboard';

// Mock user profile
const defaultUserProfile: UserProfile = {
  id: '1',
  healthGoals: ['pfas_free', 'low_sodium', 'organic'],
  dietaryPreferences: ['organic', 'non_gmo'],
  location: 'New York, NY',
  allergens: ['gluten', 'dairy'],
  preferences: {
    maxPFAS: 70,
    minScore: 75,
    preferredPackaging: ['glass'],
    avoidContaminants: ['pfas', 'heavy_metals']
  }
};

function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'dashboard' | 'database' | 'reports' | 'settings'>('scanner');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scanHistory, setScanHistory] = useState<Product[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [testingProcess, setTestingProcess] = useState<TestingProcess | null>(null);

  // Load scan history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save scan history to localStorage
  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleStartTesting = async (product: Product) => {
    const testing: TestingProcess = {
      id: Date.now().toString(),
      productId: product.id,
      status: 'sample_collection',
      currentStep: 1,
      totalSteps: 5,
      startDate: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    setTestingProcess(testing);
    
    // Simulate testing process
    const steps = ['sample_collection', 'initial_screening', 'advanced_analysis', 'risk_categorization', 'report_generation', 'complete'];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestingProcess(prev => prev ? {
        ...prev,
        status: steps[i] as any,
        currentStep: i + 1
      } : null);
    }

    // Add to scan history
    setScanHistory(prev => [product, ...prev.slice(0, 49)]); // Keep last 50 scans
    setSelectedProduct(product);
    setTestingProcess(null);
  };

  const TestingProcessDisplay = () => {
    if (!testingProcess) return null;

    const steps = [
      { id: 'sample_collection', label: 'Sample Collection', icon: '🧪' },
      { id: 'initial_screening', label: 'Initial Screening', icon: '🔍' },
      { id: 'advanced_analysis', label: 'Advanced Analysis', icon: '⚗️' },
      { id: 'risk_categorization', label: 'Risk Assessment', icon: '📊' },
      { id: 'report_generation', label: 'Report Generation', icon: '📄' }
    ];

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Testing in Progress</h3>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = testingProcess.status === step.id;
            const isCompleted = testingProcess.currentStep > index + 1;
            
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  isCompleted ? 'bg-green-100 text-green-600' :
                  isActive ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? '✅' : isActive ? '⏳' : step.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isCompleted ? 'text-green-600' :
                    isActive ? 'text-blue-600' :
                    'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Health Product Scanner</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{userProfile.location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'scanner', label: 'Scanner', icon: Scan },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'database', label: 'Database', icon: Database },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {testingProcess && <TestingProcessDisplay />}
        
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <ProductScanner 
              onProductSelect={handleProductSelect}
              onStartTesting={handleStartTesting}
            />
            {selectedProduct && (
              <div className="space-y-6">
                <HealthScoreDisplay product={selectedProduct} />
                <ContaminantMatrix contaminants={selectedProduct.contaminants} />
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard scanHistory={scanHistory} userProfile={userProfile} />
        )}
        
        {activeTab === 'database' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">PFAS Database</h2>
            <div className="text-center py-8">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">PFAS Compound Database</h3>
              <p className="text-gray-600 mb-4">Searchable database of PFAS compounds and their health impacts</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Explore Database
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Lab Reports</h2>
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Lab Reports</h3>
              <p className="text-gray-600 mb-4">Comprehensive testing reports with charts and analysis</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">User Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={userProfile.location}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max PFAS Tolerance (ppt)</label>
                    <input
                      type="number"
                      value={userProfile.preferences.maxPFAS}
                      onChange={(e) => setUserProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, maxPFAS: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Health Goals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['pfas_free', 'low_sodium', 'organic', 'non_gmo', 'glass_packaging', 'lab_verified'].map(goal => (
                    <label key={goal} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={userProfile.healthGoals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUserProfile(prev => ({
                              ...prev,
                              healthGoals: [...prev.healthGoals, goal]
                            }));
                          } else {
                            setUserProfile(prev => ({
                              ...prev,
                              healthGoals: prev.healthGoals.filter(g => g !== goal)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize">{goal.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;