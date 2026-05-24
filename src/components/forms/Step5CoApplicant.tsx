import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Switch } from 'react-native';
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

export const Step7StudentRelations = ({ onSave, onBack }: { onSave: (data: any) => Promise<void>; onBack: () => void }) => {
  const rawStoreData = useApplicationStore((state: any) => state.coApplicant);
  const storeData = rawStoreData || {};

  const [loading, setLoading] = useState(false);
  const [relations, setRelations] = useState<any[]>(storeData.relations || [
    { id: Date.now(), relationshipType: 'Father', name: '', employmentType: 'Salaried', annualIncome: '', phoneNumber: '', currentObligations: '', cibilIssues: '', isCoApplicant: true }
  ]);

  const addRelation = () => {
    setRelations([...relations, { id: Date.now(), relationshipType: '', name: '', employmentType: 'Salaried', annualIncome: '', phoneNumber: '', currentObligations: '', cibilIssues: '', isCoApplicant: false }]);
  };

  const updateRelation = (id: number, field: string, value: any) => {
    setRelations(relations.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRelation = (id: number) => {
    if (relations.length > 1) setRelations(relations.filter(r => r.id !== id));
  };

  const handleSubmit = async () => {
    const isValid = relations.every(r => r.name && r.annualIncome && r.phoneNumber);
    if (!isValid) {
      Alert.alert("Required Fields", "Please provide names, income, and phone numbers for all relations.");
      return;
    }

    setLoading(true);
    try {
      await onSave({ relations });
    } catch (err) {
      Alert.alert("Sync Failure", "Failed to preserve co-applicant details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Student Relations</Text>

      {relations.map((rel, index) => (
        <View key={rel.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Relation #{index + 1}</Text>
            {relations.length > 1 && (
              <TouchableOpacity onPress={() => removeRelation(rel.id)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Relationship Type</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={RELATIONSHIP_TYPES}
            labelField="label" valueField="value"
            placeholder="Select Type"
            value={rel.relationshipType}
            onChange={item => updateRelation(rel.id, 'relationshipType', item.value)}
          />

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Rajesh Kumar" value={rel.name} onChangeText={v => updateRelation(rel.id, 'name', v)} />

          <Text style={styles.label}>Employment Type</Text>
          <Dropdown
            style={styles.dropdown}
            data={EMPLOYMENT_TYPES}
            labelField="label" valueField="value"
            value={rel.employmentType}
            onChange={item => updateRelation(rel.id, 'employmentType', item.value)}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Annual Income (Lakhs)</Text>
              <TextInput style={styles.input} placeholder="e.g. 12" keyboardType="numeric" value={rel.annualIncome} onChangeText={v => updateRelation(rel.id, 'annualIncome', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} placeholder="10 Digits" keyboardType="phone-pad" maxLength={10} value={rel.phoneNumber} onChangeText={v => updateRelation(rel.id, 'phoneNumber', v)} />
            </View>
          </View>

          <Text style={styles.label}>Current Obligations / Loans (INR)</Text>
          <TextInput style={styles.input} placeholder="e.g. 25000 per month" value={rel.currentObligations} onChangeText={v => updateRelation(rel.id, 'currentObligations', v)} />

          <Text style={styles.label}>Any CIBIL Issues?</Text>
          <TextInput style={styles.input} placeholder="Describe or enter 'None'" value={rel.cibilIssues} onChangeText={v => updateRelation(rel.id, 'cibilIssues', v)} />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Add as Co-Applicant?</Text>
            <Switch 
              value={rel.isCoApplicant} 
              onValueChange={v => updateRelation(rel.id, 'isCoApplicant', v)}
              trackColor={{ false: '#E2E8F0', true: '#4B2C85' }}
            />
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addRelation}>
        <Ionicons name="add-circle" size={22} color="#4B2C85" />
        <Text style={styles.addBtnText}>Add Another Relation</Text>
      </TouchableOpacity>

      <View style={styles.btnWrapperRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={loading}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitBtn, loading && styles.disabledBtn]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.submitBtnText}>Continue</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#4B2C85', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 15, color: '#1E293B' },
  dropdown: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, height: 50 },
  placeholderStyle: { fontSize: 15, color: '#94A3B8' },
  selectedTextStyle: { fontSize: 15, color: '#1E293B' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#4B2C85' },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10 },
  switchLabel: { fontSize: 14, fontWeight: '700', color: '#4B2C85' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, marginBottom: 10 },
  addBtnText: { marginLeft: 8, fontWeight: '800', color: '#4B2C85', fontSize: 15 },
  btnWrapperRow: { flexDirection: 'row', gap: 12, marginTop: 40, marginBottom: 50 },
  backButton: { flex: 1, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: '#4B2C85', fontSize: 16, fontWeight: '700' },
  submitBtn: { flex: 2, backgroundColor: '#FF8A00', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});