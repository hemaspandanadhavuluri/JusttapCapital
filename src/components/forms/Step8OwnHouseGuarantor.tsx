import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useApplicationStore } from '../../store/useApplicationStore';

const RELATIONSHIP_TYPES = [
  { label: 'Father', value: 'Father' },
  { label: 'Mother', value: 'Mother' },
  { label: 'Spouse', value: 'Spouse' },
  { label: 'Brother', value: 'Brother' },
  { label: 'Sister', value: 'Sister' },
  { label: 'Uncle', value: 'Uncle' },
  { label: 'Aunty', value: 'Aunty' },
  { label: 'Cousin', value: 'Cousin' },
  { label: 'Guardian', value: 'Guardian' },
];

const EMPLOYMENT_TYPES = [
  { label: 'Salaried', value: 'Salaried' },
  { label: 'Business Owner', value: 'Business Owner' },
  { label: 'Pensioner / Retired', value: 'Pensioner' },
  { label: 'Farmer', value: 'Farmer' },
];

export const Step8OwnHouseGuarantor = ({ onSave, onBack }: { onSave: (data: any) => Promise<void>; onBack: () => void }) => {
  const rawStoreData = useApplicationStore((state: any) => state.ownHouseGuarantor);
  const storeData = rawStoreData || {};

  // Get relations from Step 7
  const relations = useApplicationStore((state: any) => state.coApplicant?.relations || []);

  const [loading, setLoading] = useState(false);

  // Local state for the guarantor selection
  const [selectedSource, setSelectedSource] = useState<string | number>(storeData.relationId || '');
  const [manualData, setManualData] = useState({
    name: storeData.name || '',
    relationshipType: storeData.relationshipType || '',
    employmentType: storeData.employmentType || 'Salaried'
  });

  // Prepare dropdown options from Step 7 + Manual Entry option
  const guarantorOptions = [
    ...relations.map((r: any) => ({ label: `${r.name} (${r.relationshipType})`, value: r.id })),
    { label: 'Add New / Manual Entry', value: 'manual' }
  ];

  // Find the selected relation from the list if not manual
  const selectedRelation = relations.find((r: any) => r.id === selectedSource);

  const handleSubmit = async () => {
    if (!selectedSource) {
      Alert.alert("Required", "Please select who owns the primary residential property.");
      return;
    }

    if (selectedSource === 'manual' && (!manualData.name || !manualData.relationshipType)) {
      Alert.alert("Missing Info", "Please provide the name and relationship for the guarantor.");
      return;
    }

    setLoading(true);
    try {
      let payload;
      if (selectedSource === 'manual') {
        payload = {
          relationId: 'manual',
          isManual: true,
          name: manualData.name,
          relationshipType: manualData.relationshipType,
          employmentType: manualData.employmentType
        };
      } else {
        payload = {
          relationId: selectedSource,
          isManual: false,
          name: selectedRelation.name,
          relationshipType: selectedRelation.relationshipType,
          employmentType: selectedRelation.employmentType,
          // Persist extra metadata from Step 7 for internal verification
          phone: selectedRelation.phoneNumber,
          annualIncome: selectedRelation.annualIncome
        };
      }

      await onSave(payload);
    } catch (err) {
      Alert.alert("Sync Failure", "Could not save guarantor details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.ohgHeader}>
        <Ionicons name="home" size={32} color="#4B2C85" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.sectionTitle}>Own House Guarantor</Text>
          <Text style={styles.description}>
            Select a family member who owns a house/flat. This is for contact purpose only, NOT taken as collateral.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Who owns the primary residential house?</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={guarantorOptions}
          labelField="label" valueField="value"
          placeholder="Select a person"
          value={selectedSource}
          onChange={item => setSelectedSource(item.value)}
        />
      </View>

      {selectedSource && selectedSource !== 'manual' && selectedRelation && (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Guarantor Details (from Relations)</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{selectedRelation.name}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Relation:</Text><Text style={styles.detailValue}>{selectedRelation.relationshipType}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Employment:</Text><Text style={styles.detailValue}>{selectedRelation.employmentType}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Annual Income:</Text><Text style={styles.detailValue}>₹{selectedRelation.annualIncome} L</Text></View>
        </View>
      )}

      {selectedSource === 'manual' && (
        <View style={styles.card}>
          <Text style={styles.detailsTitle}>Provide Manual Details</Text>
          
          <Text style={styles.label}>Guarantor Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Ramesh Gupta" value={manualData.name} onChangeText={v => setManualData({...manualData, name: v})} />

          <Text style={styles.label}>Relationship to Student</Text>
          <Dropdown
            style={styles.dropdown}
            data={RELATIONSHIP_TYPES}
            labelField="label" valueField="value"
            placeholder="Choose relationship"
            value={manualData.relationshipType}
            onChange={item => setManualData({...manualData, relationshipType: item.value})}
          />

          <Text style={styles.label}>Employment Type</Text>
          <Dropdown
            style={styles.dropdown}
            data={EMPLOYMENT_TYPES}
            labelField="label" valueField="value"
            value={manualData.employmentType}
            onChange={item => setManualData({...manualData, employmentType: item.value})}
          />
        </View>
      )}

      <View style={styles.btnWrapperRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={loading}><Text style={styles.backButtonText}>Back</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.submitBtn, loading && styles.disabledBtn]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.submitBtnText}>Continue</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20, backgroundColor: '#F8FAFC' },
  ohgHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#4B2C85' },
  description: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18, paddingRight: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 15, color: '#1E293B', marginBottom: 12 },
  dropdown: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 50 },
  placeholderStyle: { fontSize: 16, color: '#94A3B8' },
  selectedTextStyle: { fontSize: 16, color: '#1E293B' },
  detailsBox: { backgroundColor: '#F3E8FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#C084FC', marginBottom: 20 },
  detailsTitle: { fontSize: 14, fontWeight: '800', color: '#4B2C85', marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailLabel: { fontSize: 13, color: '#7C3AED', fontWeight: '600' },
  detailValue: { fontSize: 13, color: '#4B2C85', fontWeight: '700' },
  btnWrapperRow: { flexDirection: 'row', gap: 12, marginTop: 40, marginBottom: 50 },
  backButton: { flex: 1, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: '#4B2C85', fontSize: 16, fontWeight: '700' },
  submitBtn: { flex: 2, backgroundColor: '#FF8A00', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});