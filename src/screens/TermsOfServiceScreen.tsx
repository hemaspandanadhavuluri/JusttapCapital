import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../theme/colors';

const TermsOfServiceScreen = ({ navigation }: any) => {
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (!agreed) {
      Alert.alert("Agreement Required", "Please check the box to agree to the terms.");
      return;
    }
    navigation.goBack(); // Or navigate to the next step
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last updated: October 24, 2023</Text>

        <View style={styles.termsBox}>
          <Text style={styles.termsContent}>
            Welcome to JusttapCapital. By accessing or using our education loan platform, you agree to comply with and be bound by the following terms and conditions...
          </Text>
          
          <Text style={styles.sectionNumber}>01. <Text style={styles.sectionHeader}>Acceptance of Terms</Text></Text>
          <Text style={styles.termsContent}>
            By registering for an account, you represent that you have read, understood, and agree to be bound by these Terms of Service.
          </Text>

          <Text style={styles.sectionNumber}>02. <Text style={styles.sectionHeader}>Eligibility</Text></Text>
          <Text style={styles.termsContent}>
            You must be at least 18 years of age and a legal resident of India to apply for loans through this platform.
          </Text>
        </View>

        {/* Agreement Interaction */}
        <View style={styles.footerCard}>
          <TouchableOpacity 
            style={styles.checkboxRow} 
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checked]}>
              {agreed && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>I have read and agree to the Terms of Service</Text>
          </TouchableOpacity>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.declineBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.acceptBtn, !agreed && styles.disabledBtn]} 
              onPress={handleAccept}
            >
              <Text style={styles.acceptText}>Accept Terms</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  lastUpdated: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  termsBox: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionNumber: { fontSize: 20, fontWeight: '800', color: '#057A55', marginTop: 25 },
  sectionHeader: { color: '#0F172A' },
  termsContent: { fontSize: 14, color: '#4B2C85', lineHeight: 22, marginTop: 10 },
  footerCard: { marginTop: 20, backgroundColor: '#F1F5F9', padding: 20, borderRadius: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#CBD5E1', borderRadius: 4, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkMark: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  checkboxLabel: { marginLeft: 12, fontSize: 13, color: '#334155', fontWeight: '600' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  declineBtn: { width: '45%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#FFF' },
  declineText: { color: '#4B2C85', fontWeight: '700' },
  acceptBtn: { width: '45%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#057A55' },
  acceptText: { color: '#FFF', fontWeight: '700' },
  disabledBtn: { backgroundColor: '#94A3B8' }
});

export default TermsOfServiceScreen;