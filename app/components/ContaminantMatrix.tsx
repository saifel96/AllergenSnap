import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contaminant } from '../utils/healthAnalysis';

interface ContaminantMatrixProps {
  contaminants: Contaminant[];
}

export const ContaminantMatrix: React.FC<ContaminantMatrixProps> = ({ contaminants }) => {
  if (contaminants.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contaminant Analysis</Text>
        <View style={styles.cleanContainer}>
          <Ionicons name="checkmark-circle" size={48} color="#34C759" />
          <Text style={styles.cleanTitle}>No Contaminants Detected</Text>
          <Text style={styles.cleanSubtitle}>This product appears to be free of major contaminants</Text>
        </View>
      </View>
    );
  }

  const getSeverityColor = (severity: number): string => {
    if (severity >= 4) return '#FF3B30';
    if (severity >= 3) return '#FF9500';
    if (severity >= 2) return '#FFCC00';
    return '#34C759';
  };

  const getSeverityLabel = (severity: number): string => {
    if (severity >= 4) return 'High Risk';
    if (severity >= 3) return 'Moderate Risk';
    if (severity >= 2) return 'Low Risk';
    return 'Minimal Risk';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contaminant Analysis</Text>
      <Text style={styles.subtitle}>{contaminants.length} contaminant{contaminants.length > 1 ? 's' : ''} detected</Text>
      
      <View style={styles.contaminantsList}>
        {contaminants.map((contaminant, index) => {
          const severityColor = getSeverityColor(contaminant.severity);
          const exceedsLimit = contaminant.maxAllowed && contaminant.level > contaminant.maxAllowed;
          const progressWidth = contaminant.maxAllowed
            ? Math.min((contaminant.level / contaminant.maxAllowed) * 100, 100)
            : contaminant.severity * 20;

          return (
            <View key={index} style={styles.contaminantCard}>
              <View style={styles.contaminantHeader}>
                <View style={styles.contaminantInfo}>
                  <View style={styles.contaminantNameRow}>
                    <Text style={styles.contaminantName}>{contaminant.name}</Text>
                    {exceedsLimit && (
                      <View style={styles.exceedsLimitBadge}>
                        <Text style={styles.exceedsLimitText}>Exceeds Limit</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.contaminantCategory}>
                    {contaminant.category.replace('_', ' ')} • {getSeverityLabel(contaminant.severity)}
                  </Text>
                </View>
                
                <View style={styles.levelContainer}>
                  <Text style={[styles.levelValue, { color: severityColor }]}>
                    {contaminant.level} {contaminant.unit}
                  </Text>
                  {contaminant.maxAllowed && (
                    <Text style={styles.maxAllowed}>
                      Max: {contaminant.maxAllowed} {contaminant.unit}
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min(progressWidth, 100)}%`,
                        backgroundColor: severityColor
                      }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(progressWidth)}%</Text>
              </View>
              
              <View style={styles.healthRiskContainer}>
                <Ionicons name="information-circle-outline" size={16} color="#8E8E93" />
                <Text style={styles.healthRiskText}>{contaminant.healthRisk}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    padding: 20,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  cleanContainer: {
    alignItems: 'center',
    padding: 40,
  },
  cleanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
    marginTop: 16,
    marginBottom: 8,
  },
  cleanSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  contaminantsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contaminantCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contaminantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contaminantInfo: {
    flex: 1,
    marginRight: 16,
  },
  contaminantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contaminantName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  exceedsLimitBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  exceedsLimitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  contaminantCategory: {
    fontSize: 13,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  levelContainer: {
    alignItems: 'flex-end',
  },
  levelValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  maxAllowed: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    minWidth: 35,
    textAlign: 'right',
  },
  healthRiskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  healthRiskText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    marginLeft: 6,
    flex: 1,
  },
});