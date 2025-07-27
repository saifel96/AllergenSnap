import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStoredUserProfile, updateUserProfile, clearAllData } from '../utils/storage';
import { AllergenSelector } from '../components/AllergenSelector';
import { RiskSensitivitySlider } from '../components/RiskSensitivitySlider';

const COMMON_ALLERGENS = [
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
  { id: 'gluten', label: 'Gluten', icon: '🌾' },
  { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'fish', label: 'Fish', icon: '🐟' },
  { id: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { id: 'soy', label: 'Soy', icon: '🫘' },
  { id: 'nuts', label: 'Tree Nuts', icon: '🌰' },
];

export default function SettingsScreen() {
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    selectedAllergens: [],
    riskSensitivity: 3,
    notificationSettings: {
      scanReminders: true,
      healthTips: true,
      exposureAlerts: true,
    },
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getStoredUserProfile();
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const saveUserProfile = async (updates) => {
    try {
      const updatedProfile = { ...userProfile, ...updates };
      await updateUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error saving user profile:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleAllergenToggle = (allergenId) => {
    const selectedAllergens = userProfile.selectedAllergens.includes(allergenId)
      ? userProfile.selectedAllergens.filter(id => id !== allergenId)
      : [...userProfile.selectedAllergens, allergenId];
    
    saveUserProfile({ selectedAllergens });
  };

  const handleNotificationToggle = (setting) => {
    const notificationSettings = {
      ...userProfile.notificationSettings,
      [setting]: !userProfile.notificationSettings[setting],
    };
    saveUserProfile({ notificationSettings });
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your health data will be exported as a PDF report.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export data') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Account Deleted', 'All data has been removed.');
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingRow = ({ icon, title, subtitle, rightComponent, onPress }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingRowLeft}>
        <Ionicons name={icon} size={24} color="#007AFF" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <SettingSection title="Profile">
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileSubtext}>Health-conscious user</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </SettingSection>

      <SettingSection title="Allergen Management">
        <View style={styles.allergenGrid}>
          {COMMON_ALLERGENS.map((allergen) => (
            <TouchableOpacity
              key={allergen.id}
              style={[
                styles.allergenChip,
                userProfile.selectedAllergens.includes(allergen.id) && styles.allergenChipActive,
              ]}
              onPress={() => handleAllergenToggle(allergen.id)}
            >
              <Text style={styles.allergenIcon}>{allergen.icon}</Text>
              <Text style={[
                styles.allergenLabel,
                userProfile.selectedAllergens.includes(allergen.id) && styles.allergenLabelActive,
              ]}>
                {allergen.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SettingSection>

      <SettingSection title="Risk Sensitivity">
        <RiskSensitivitySlider
          value={userProfile.riskSensitivity}
          onValueChange={(value) => saveUserProfile({ riskSensitivity: value })}
        />
      </SettingSection>

      <SettingSection title="Notifications">
        <SettingRow
          icon="notifications-outline"
          title="Scan Reminders"
          subtitle="Daily reminders to scan products"
          rightComponent={
            <Switch
              value={userProfile.notificationSettings.scanReminders}
              onValueChange={() => handleNotificationToggle('scanReminders')}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            />
          }
        />
        <SettingRow
          icon="bulb-outline"
          title="Health Tips"
          subtitle="Weekly health and nutrition tips"
          rightComponent={
            <Switch
              value={userProfile.notificationSettings.healthTips}
              onValueChange={() => handleNotificationToggle('healthTips')}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            />
          }
        />
        <SettingRow
          icon="warning-outline"
          title="Exposure Alerts"
          subtitle="Alerts when allergens are detected"
          rightComponent={
            <Switch
              value={userProfile.notificationSettings.exposureAlerts}
              onValueChange={() => handleNotificationToggle('exposureAlerts')}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            />
          }
        />
      </SettingSection>

      <SettingSection title="Data & Privacy">
        <SettingRow
          icon="download-outline"
          title="Export Health Report"
          subtitle="Download your scan data as PDF"
          rightComponent={<Ionicons name="chevron-forward" size={20} color="#C7C7CC" />}
          onPress={handleExportData}
        />
        <SettingRow
          icon="trash-outline"
          title="Delete Account"
          subtitle="Permanently remove all data"
          rightComponent={<Ionicons name="chevron-forward" size={20} color="#C7C7CC" />}
          onPress={handleDeleteAccount}
        />
      </SettingSection>

      <SettingSection title="About">
        <SettingRow
          icon="information-circle-outline"
          title="App Version"
          subtitle="1.0.0"
          rightComponent={null}
        />
        <SettingRow
          icon="document-text-outline"
          title="Privacy Policy"
          rightComponent={<Ionicons name="chevron-forward" size={20} color="#C7C7CC" />}
          onPress={() => console.log('Open privacy policy')}
        />
        <SettingRow
          icon="mail-outline"
          title="Contact Support"
          rightComponent={<Ionicons name="chevron-forward" size={20} color="#C7C7CC" />}
          onPress={() => console.log('Contact support')}
        />
      </SettingSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  profileSubtext: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
  },
  allergenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  allergenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  allergenChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  allergenIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  allergenLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  allergenLabelActive: {
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
  },
  settingSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
  },
});