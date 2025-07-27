import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  recommendations: string[];
}

interface RiskAssessmentCardProps {
  riskAssessment: RiskAssessment;
  pfasDetected: boolean;
  pfasLevel?: number;
  labVerified: boolean;
}

export const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({
  riskAssessment,
  pfasDetected,
  pfasLevel,
  labVerified,
}) => {
  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'critical': return '#FF3B30';
      case 'high': return '#FF9500';
      case 'medium': return '#FFCC00';
      default: return '#34C759';
    }
  };

  const getRiskIcon = (risk: string): string => {
    switch (risk) {
      case 'critical': return 'close-circle';
      case 'high': return 'warning';
      case 'medium': return 'alert-circle';
      default: return 'checkmark-circle';
    }
  };

  const riskColor = getRiskColor(riskAssessment.overallRisk);
  const riskIcon = getRiskIcon(riskAssessment.overallRisk);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Risk Assessment</Text>
        <View style={[styles.riskBadge, { backgroundColor: riskColor + '20' }]}>
          <Ionicons name={riskIcon as any} size={16} color={riskColor} />
          <Text style={[styles.riskText, { color: riskColor }]}>
            {riskAssessment.overallRisk.toUpperCase()} RISK
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: pfasDetected ? '#FF3B30' + '20' : '#34C759' + '20' }]}>
            <Ionicons 
              name={pfasDetected ? 'warning' : 'checkmark'} 
              size={20} 
              color={pfasDetected ? '#FF3B30' : '#34C759'} 
            />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>PFAS Status</Text>
            <Text style={[styles.statValue, { color: pfasDetected ? '#FF3B30' : '#34C759' }]}>
              {pfasDetected ? 'Detected' : 'None'}
            </Text>
            {pfasLevel && (
              <Text style={styles.statSubtext}>{pfasLevel.toFixed(1)} ppt</Text>
            )}
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: labVerified ? '#34C759' + '20' : '#FF9500' + '20' }]}>
            <Ionicons 
              name={labVerified ? 'shield-checkmark' : 'shield-outline'} 
              size={20} 
              color={labVerified ? '#34C759' : '#FF9500'} 
            />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Lab Verification</Text>
            <Text style={[styles.statValue, { color: labVerified ? '#34C759' : '#FF9500' }]}>
              {labVerified ? 'Verified' : 'Pending'}
            </Text>
            <Text style={styles.statSubtext}>Third-party testing</Text>
          </View>
        </View>
      </View>

      {/* Risk Factors */}
      {riskAssessment.riskFactors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Factors</Text>
          {riskAssessment.riskFactors.map((factor, index) => (
            <View key={index} style={styles.factorItem}>
              <Ionicons name="alert-circle-outline" size={16} color="#FF9500" />
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Recommendations */}
      {riskAssessment.recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {riskAssessment.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="bulb-outline" size={16} color="#007AFF" />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  factorText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});