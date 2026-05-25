import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useApplicationStore } from '../../store/useApplicationStore';

const REF_RELATIONS = [
  { label: 'Friend', value: 'Friend' },
  { label: 'Neighbor', value: 'Neighbor' },
  { label: 'Relative (Extended)', value: 'Relative' },
  { label: 'Colleague', value: 'Colleague' },
];

const ReferenceCard = ({ data, setData, num }: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Reference {num}</Text>
    
    <Text style={styles.label}>Full Name</Text>
    <TextInput style={styles.input} placeholder="e.g. Amit Singh" value={data.name} onChangeText={v => setData({...data, name: v})} />

    <Text style={styles.label}>Relationship</Text>
    <Dropdown
      style={styles.dropdown}
      data={REF_RELATIONS}
      labelField="label" valueField="value"
      placeholder="Select Type"
      value={data.relationship}
      onChange={item => setData({...data, relationship: item.value})}
    />

    <Text style={styles.label}>Phone Number</Text>
    <TextInput style={styles.input} placeholder="10 Digits" keyboardType="phone-pad" maxLength={10} value={data.phoneNumber} onChangeText={v => setData({...data, phoneNumber: v})} />

    <Text style={styles.label}>Residential Address</Text>
    <TextInput 
      style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
      placeholder="Full Address" 
      multiline 
      value={data.address} 
      onChangeText={v => setData({...data, address: v})} 
    />
  </View>
);

export const Step9References = ({ onSave, onBack }: { onSave: (data: any) => Promise<void>; onBack: () => void }) => {
  const rawStoreData = useApplicationStore((state: any) => state.references);
  const storeData = rawStoreData || [];
  const [loading, setLoading] = useState(false);
  
  const [ref1, setRef1] = useState(storeData[0] || { name: '', relationship: '', phoneNumber: '', address: '' });
  const [ref2, setRef2] = useState(storeData[1] || { name: '', relationship: '', phoneNumber: '', address: '' });

  useEffect(() => {
    if (storeData[0]) setRef1(storeData[0]);
    if (storeData[1]) setRef2(storeData[1]);
  }, [rawStoreData]);

  const handleSubmit = async () => {
    if (!ref1.name || !ref1.phoneNumber || !ref2.name || !ref2.phoneNumber) {
      Alert.alert("Two References Required", "Please provide complete details for exactly two references.");
      return;
    }

    setLoading(true);
    try {
      await onSave([ref1, ref2]);
    } catch (err) {
      Alert.alert("Sync Failure", "Failed to save references.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <Text style={styles.sectionTitle}>Personal References</Text>
      
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#92400E" />
        <Text style={styles.infoText}>
          References should be people other than your parents and siblings. E.g. friends, neighbors, or distant relatives. They are for contact purposes only.
        </Text>
      </View>

      <ReferenceCard num={1} data={ref1} setData={setRef1} />
      <ReferenceCard num={2} data={ref2} setData={setRef2} />

      <View style={styles.btnWrapperRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={loading}><Text style={styles.backButtonText}>Back</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.submitBtn, loading && styles.disabledBtn]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.submitBtnText}>Finalize Details</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#4B2C85', marginBottom: 12 },
  infoBox: { flexDirection: 'row', backgroundColor: '#FFFBEB', padding: 14, borderRadius: 12, marginBottom: 20, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#FEF3C7' },
  infoText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 18 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#4B2C85', marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 15 },
  dropdown: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, height: 50 },
  btnWrapperRow: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 50 },
  backButton: { flex: 1, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: '#4B2C85', fontSize: 16, fontWeight: '700' },
  submitBtn: { flex: 2, backgroundColor: '#FF8A00', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});