import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface HealthTrendChartProps {
  data: Array<{ day: string; score: number }>;
}

export const HealthTrendChart: React.FC<HealthTrendChartProps> = ({ data }) => {
  const chartWidth = width - 40;
  const chartHeight = 200;
  const maxScore = 100;

  const getPointY = (score: number) => {
    return chartHeight - 40 - ((score / maxScore) * (chartHeight - 80));
  };

  const getPointX = (index: number) => {
    return 40 + (index * ((chartWidth - 80) / (data.length - 1)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Score Trend</Text>
        <Text style={styles.subtitle}>Last 7 days</Text>
      </View>
      
      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {/* Y-axis labels */}
        {[100, 75, 50, 25, 0].map((value) => (
          <View
            key={value}
            style={[
              styles.yAxisLine,
              { top: getPointY(value) },
            ]}
          >
            <Text style={styles.yAxisLabel}>{value}</Text>
          </View>
        ))}
        
        {/* Chart line */}
        <View style={styles.chartArea}>
          {data.length > 1 && data.map((point, index) => {
            if (index === 0) return null;
            
            const prevPoint = data[index - 1];
            const x1 = getPointX(index - 1);
            const y1 = getPointY(prevPoint.score);
            const x2 = getPointX(index);
            const y2 = getPointY(point.score);
            
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            return (
              <View
                key={index}
                style={[
                  styles.chartLine,
                  {
                    width: length,
                    left: x1,
                    top: y1,
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              />
            );
          })}
          
          {/* Data points */}
          {data.map((point, index) => (
            <View
              key={index}
              style={[
                styles.dataPoint,
                {
                  left: getPointX(index) - 6,
                  top: getPointY(point.score) - 6,
                  backgroundColor: point.score >= 70 ? '#34C759' : point.score >= 40 ? '#FF9500' : '#FF3B30',
                },
              ]}
            />
          ))}
        </View>
        
        {/* X-axis labels */}
        <View style={styles.xAxisContainer}>
          {data.map((point, index) => (
            <Text
              key={index}
              style={[
                styles.xAxisLabel,
                { left: getPointX(index) - 15 },
              ]}
            >
              {point.day}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
  chartContainer: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  yAxisLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#8E8E93',
    position: 'absolute',
    left: -30,
    textAlign: 'right',
    width: 25,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  chartLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#007AFF',
    transformOrigin: 'left center',
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  xAxisContainer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 20,
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    width: 30,
    bottom: 0,
  },
});