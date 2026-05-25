import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApplicationStore } from '../store/useApplicationStore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoansScreen() {
  const insets = useSafeAreaInsets();
  const store = useApplicationStore((state: any) => state);

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Loan Application Summary</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Education Details</Text>
          <InfoRow label="Degree" value={store.educationDetails?.degree} />
          <InfoRow label="Field" value={store.educationDetails?.fieldOfInterest} />
          <InfoRow label="Admission Status" value={store.educationDetails?.admissionStatus} />
          <InfoRow label="Intake" value={`${store.educationDetails?.courseStartMonth} ${store.educationDetails?.courseStartYear}`} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Financial Requirements</Text>
          <InfoRow label="Course Duration" value={store.courseFinancials?.courseDuration} />
          <InfoRow label="Tuition Fee" value={`₹${store.courseFinancials?.tuitionFee} L`} />
          <InfoRow label="Requested Loan" value={`₹${store.courseFinancials?.requestedLoanAmount} L`} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Academic Highlights</Text>
          <InfoRow label="Undergrad College" value={store.academicHistory?.undergradCollege} />
          <InfoRow label="GPA / Percentage" value={store.academicHistory?.gpaScore} />
          <InfoRow label="Work Exp (Months)" value={store.academicHistory?.workExpMonths} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  title: { fontSize: 20, fontWeight: '800', color: '#4B2C85' },
  scroll: { padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  value: { fontSize: 13, color: '#0F172A', fontWeight: '700', textAlign: 'right', flex: 1, marginLeft: 20 }
});