import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HealthScoreCircle } from './HealthScoreCircle';

interface ScanHistoryItemProps {
  scan: any;
  onPress: () => void;
}

export const ScanHistoryItem: React.FC<ScanHistoryItemProps> = ({ scan, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getRiskBadges = () => {
    const badges = [];
    
    if (scan.allergensDetected?.length > 0) {
      badges.push({ text: `${scan.allergensDetected.length} Allergen${scan.allergensDetected.length > 1 ? 's' : ''}`, color: '#FF3B30' });
    }
    
    if (scan.toxinsDetected?.length > 0) {
      badges.push({ text: `${scan.toxinsDetected.length} Toxin${scan.toxinsDetected.length > 1 ? 's' : ''}`, color: '#FF9500' });
    }
    
    if (scan.additivesDetected?.length > 0) {
      badges.push({ text: `${scan.additivesDetected.length} Additive${scan.additivesDetected.length > 1 ? 's' : ''}`, color: '#FF9500' });
    }
    
    return badges.slice(0, 2); // Show max 2 badges
  };

  const riskBadges = getRiskBadges();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {scan.productImage ? (
          <Image source={{ uri: scan.productImage }} style={styles.productImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={24} color="#C7C7CC" />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {scan.productName}
          </Text>
          <Text style={styles.scanDate}>
            {formatDate(scan.scannedAt)}
          </Text>
        </View>
        
        {riskBadges.length > 0 && (
          <View style={styles.badgesContainer}>
            {riskBadges.map((badge, index) => (
              <View key={index} style={[styles.riskBadge, { backgroundColor: badge.color + '20' }]}>
                <Text style={[styles.riskBadgeText, { color: badge.color }]}>
                  {badge.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.scoreContainer}>
        <HealthScoreCircle score={scan.healthScore} size={60} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productInfo: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
  },
  scanDate: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreContainer: {
    justifyContent: 'center',
    marginLeft: 16,
  },
});