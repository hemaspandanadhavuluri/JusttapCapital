import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const Section = ({ title, icon, children }: any) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={Colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionText}>{children}</Text>
  </View>
);

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBadge}>
           <Ionicons name="shield-checkmark" size={16} color="#057A55" />
           <Text style={styles.badgeText}>PRIVACY & TRUST</Text>
        </View>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: October 24, 2023</Text>

        <Section title="Introduction" icon="information-circle-outline">
          This Privacy Policy describes how JusttapCapital ("we", "us", or "our") collects, uses, and shares your personal information when you use our education loan platform.
        </Section>

        <Section title="Data Collection" icon="person-outline">
          We collect Personal Identity (Full name, DOB), Academic Records (Transcripts), and Financial Status (Income proof, bank statements) to process your application.
        </Section>

        {/* Data Security Highlight Box */}
        <View style={styles.securityBox}>
          <View style={styles.row}>
            <Ionicons name="lock-closed" size={24} color="#FFF" />
            <Text style={styles.securityTitle}>Data Security</Text>
          </View>
          <Text style={styles.securityText}>
            We employ industry-leading AES-256 encryption. Our infrastructure is regularly audited for compliance with global data protection standards.
          </Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}><Text style={styles.tagText}>ISO 27001 Certified</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>24/7 Monitoring</Text></View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Questions?</Text>
          <Text style={styles.footerSub}>Our Data Protection Officer is here to help with any privacy-related inquiries.</Text>
          <TouchableOpacity style={styles.emailBtn} onPress={() => Linking.openURL('mailto:privacy@justtap.com')}>
            <Ionicons name="mail-outline" size={18} color="#FFF" />
            <Text style={styles.emailBtnText}>Email Privacy Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  headerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 10 },
  badgeText: { color: '#057A55', fontSize: 11, fontWeight: '800', marginLeft: 5 },
  title: { fontSize: 32, fontWeight: '800', color: '#0F172A' },
  lastUpdated: { fontSize: 13, color: '#64748B', marginTop: 5, marginBottom: 20 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 15, elevation: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginLeft: 10 },
  sectionText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  securityBox: { backgroundColor: '#1E293B', borderRadius: 12, padding: 20, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  securityTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', marginLeft: 10 },
  securityText: { color: '#94A3B8', fontSize: 13, lineHeight: 20 },
  tagRow: { flexDirection: 'row', marginTop: 15 },
  tag: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  tagText: { color: '#FFF', fontSize: 10, fontWeight: '600' },
  footer: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#FFF', borderRadius: 12, marginTop: 10 },
  footerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  footerSub: { textAlign: 'center', color: '#64748B', fontSize: 13, paddingHorizontal: 20, marginTop: 8 },
  emailBtn: { backgroundColor: '#0F172A', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  emailBtnText: { color: '#FFF', fontWeight: '700', marginLeft: 10 }
});

export default PrivacyPolicyScreen;