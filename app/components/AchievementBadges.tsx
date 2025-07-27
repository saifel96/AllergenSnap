import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
}

interface AchievementBadgesProps {
  achievements: Achievement[];
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ achievements }) => {
  if (achievements.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Keep scanning to earn achievements!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgesContainer}
      >
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.badge}>
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeEmoji}>{achievement.icon}</Text>
            </View>
            <Text style={styles.badgeTitle}>{achievement.title}</Text>
            <Text style={styles.badgeDescription}>
              {achievement.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  badgesContainer: {
    paddingRight: 16,
  },
  badge: {
    width: 140,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginRight: 12,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
  },
});