import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface RiskSensitivitySliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export const RiskSensitivitySlider: React.FC<RiskSensitivitySliderProps> = ({
  value,
  onValueChange,
}) => {
  const getSensitivityLabel = (val: number) => {
    if (val <= 1.5) return 'Very Conservative';
    if (val <= 2.5) return 'Conservative';
    if (val <= 3.5) return 'Balanced';
    if (val <= 4.5) return 'Relaxed';
    return 'Very Relaxed';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Risk Sensitivity</Text>
        <Text style={styles.currentValue}>{getSensitivityLabel(value)}</Text>
      </View>
      
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#E5E5EA"
        thumbStyle={styles.thumbStyle}
      />
      
      <View style={styles.labels}>
        <Text style={styles.labelText}>Conservative</Text>
        <Text style={styles.labelText}>Relaxed</Text>
      </View>
      
      <Text style={styles.description}>
        Conservative mode flags more potential risks, while relaxed mode is more permissive.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  currentValue: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
  slider: {
    height: 40,
    marginBottom: 8,
  },
  thumbStyle: {
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    textAlign: 'center',
  },
});