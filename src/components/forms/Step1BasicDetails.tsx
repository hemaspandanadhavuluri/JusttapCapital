import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useApplicationStore } from '../../store/useApplicationStore';
import { INDIAN_STATES, CITIES_BY_STATE, COUNTRY_CODES } from './locationData';

export const Step1BasicDetails = ({ onSave }: { onSave: (data: any) => Promise<void> }) => {
  const storeData = useApplicationStore((state) => state.basicDetails);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(storeData.fullName);
  const [email, setEmail] = useState(storeData.email);
  const [city, setCity] = useState(storeData.city);
  const [stateRegion, setStateRegion] = useState(storeData.stateRegion);
  const [studyDestination, setStudyDestination] = useState(storeData.studyDestination);

  // Initialize phone numbers from store or default to one empty row
  const [phoneNumbers, setPhoneNumbers] = useState(
    storeData.phones && storeData.phones.length > 0
      ? storeData.phones.map((p: string, index: number) => ({
          id: index,
          code: p.length > 10 ? p.substring(0, p.length - 10) : '+91',
          number: p.slice(-10)
        }))
      : [{ id: Date.now(), code: '+91', number: '' }]
  );

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { id: Date.now(), code: '+91', number: '' }]);
  };

  const removePhoneNumber = (id: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter(p => p.id !== id));
    }
  };

  const updatePhone = (id: number, field: 'code' | 'number', value: string) => {
    setPhoneNumbers(phoneNumbers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmit = async () => {
    const allPhonesValid = phoneNumbers.every(p => p.number.length >= 10);
    
    if (!fullName || !email || !city || !stateRegion || !studyDestination || !allPhonesValid) {
      Alert.alert("Required Fields Missing", "Please provide answers for all application fields.");
      return;
    }

    if (studyDestination === 'India') {
      Alert.alert(
        "Service Notice", 
        "Currently Justtap Capitals is not processing Education Loans for India."
      );
      return;
    }

    setLoading(true);
    try {
      await onSave({
        fullName,
        email,
        city,
        stateRegion,
        studyDestination,
        phones: phoneNumbers.map(p => `${p.code}${p.number}`)
      });
    } catch (err) {
      Alert.alert("Sync Failure", "Failed to update current operational profile status details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Basic Profile Details</Text>
      
      <Text style={styles.label}>Full Name (As matching Passport/PAN)</Text>
      <TextInput style={styles.input} placeholder="e.g. Rahul Sharma" value={fullName} onChangeText={setFullName} editable={!loading} />

      <Text style={styles.label}>Email Address</Text>
      <TextInput style={styles.input} placeholder="e.g. rahul@domain.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} editable={!loading} />

      <Text style={styles.label}>Phone Number(s)</Text>
      {phoneNumbers.map((phone, index) => (
        <View key={phone.id} style={styles.phoneRow}>
          <Dropdown
            style={[styles.dropdown, styles.countryCodeDropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={COUNTRY_CODES}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={phone.code}
            onChange={item => updatePhone(phone.id, 'code', item.value)}
            disable={loading}
          />
          <TextInput 
            style={[styles.input, styles.phoneInput]} 
            placeholder="Mobile Number" 
            keyboardType="phone-pad" 
            maxLength={10}
            value={phone.number} 
            onChangeText={val => updatePhone(phone.id, 'number', val)} 
            editable={!loading} 
          />
          {phoneNumbers.length > 1 && (
            <TouchableOpacity onPress={() => removePhoneNumber(phone.id)} style={styles.removeBtn}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      
      <TouchableOpacity style={styles.addPhoneBtn} onPress={addPhoneNumber} disabled={loading}>
        <Ionicons name="add-circle-outline" size={20} color="#4B2C85" />
        <Text style={styles.addPhoneText}>Add another number</Text>
      </TouchableOpacity>

      <Text style={styles.label}>State Region</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={INDIAN_STATES}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select State"
        value={stateRegion}
        onChange={item => {
          setStateRegion(item.value);
          setCity(''); // Reset city when state changes
        }}
        disable={loading}
      />

      <Text style={styles.label}>Current City</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={stateRegion ? (CITIES_BY_STATE[stateRegion] || []) : []}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={stateRegion ? "Select City" : "Select State First"}
        value={city}
        onChange={item => setCity(item.value)}
        disable={loading}
      />

      <Text style={styles.label}>Target Study Destination</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggleBtn, studyDestination === 'Abroad' && styles.activeToggle]} onPress={() => setStudyDestination('Abroad')} disabled={loading}>
          <Text style={[styles.toggleText, studyDestination === 'Abroad' && styles.activeToggleText]}>Abroad / Global</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleBtn, studyDestination === 'India' && styles.activeToggleVariant]} 
          onPress={() => {
            setStudyDestination('India');
            Alert.alert("Service Notice", "Currently Justtap Capitals is not processing Education Loans for India.");
          }} 
          disabled={loading}
        >
          <Text style={[styles.toggleText, studyDestination === 'India' && styles.activeToggleTextVariant]}>Domestic / India</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.submitBtn, loading && styles.disabledBtn]} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.submitBtnText}>Save & Next</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#4B2C85', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginTop: 14, marginBottom: 6 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 16, color: '#1E293B' },
  dropdown: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 54 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  countryCodeDropdown: { flex: 0.45 },
  phoneInput: { flex: 1, marginTop: 0 },
  removeBtn: { padding: 8 },
  addPhoneBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 14 },
  addPhoneText: { color: '#4B2C85', fontWeight: '700', fontSize: 14 },
  placeholderStyle: { fontSize: 16, color: '#94A3B8' },
  selectedTextStyle: { fontSize: 16, color: '#1E293B' },
  inputSearchStyle: { height: 40, fontSize: 16 },
  toggleRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  toggleBtn: { flex: 1, padding: 15, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', backgroundColor: '#FFF' },
  activeToggle: { borderColor: '#4B2C85', backgroundColor: '#F3E8FF' },
  activeToggleVariant: { borderColor: '#EF4444', backgroundColor: '#FEE2E2' },
  toggleText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  activeToggleText: { color: '#4B2C85', fontWeight: '700' },
  activeToggleTextVariant: { color: '#EF4444', fontWeight: '700' },
  submitBtn: { backgroundColor: '#FF8A00', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 35, marginBottom: 40 },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});