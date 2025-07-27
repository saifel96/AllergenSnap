import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExpandableSection, Language } from '../types/productResult';

interface ExpandableSectionsProps {
  sections: ExpandableSection[];
  language: Language;
  expandedSections: Set<string>;
  onToggleSection: (sectionTitle: string) => void;
}

export const ExpandableSections: React.FC<ExpandableSectionsProps> = ({
  sections,
  language,
  expandedSections,
  onToggleSection,
}) => {
  const renderSection = (section: ExpandableSection, index: number) => {
    const title = language === 'de' ? section.titleDe : section.title;
    const content = language === 'de' ? section.contentDe : section.content;
    const isExpanded = expandedSections.has(title);

    return (
      <View key={index} style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => onToggleSection(title)}
        >
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name={section.icon as any} size={20} color="#64748B" />
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#94A3B8"
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>{content}</Text>
          </View>
        )}
      </View>
    );
  };

  if (sections.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>
        {language === 'de' ? 'Weitere Informationen' : 'More Information'}
      </Text>
      {sections.map(renderSection)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 12,
  },
  sectionContent: {
    paddingBottom: 16,
    paddingLeft: 32,
  },
  sectionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});