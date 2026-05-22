import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, Alert 
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

const REF_RELATIONS = [
  { label: 'Friend', value: 'friend' },
  { label: 'Neighbor', value: 'neighbor' },
  { label: 'Colleague', value: 'colleague' },
  { label: 'Relative (Extended)', value: 'relative' },
];

const ReferencesScreen = ({ navigation }: any) => {
  const { setStepData } = useLeadStore();

  // Local state for exactly two references
  const [ref1, setRef1] = useState({ name: '', relation: '', phone: '', address: '' });
  const [ref2, setRef2] = useState({ name: '', relation: '', phone: '', address: '' });

  const handleNext = () => {
    // 30. Requirement: Should have 2 references for sure
    if (!ref1.name || !ref1.phone || !ref2.name || !ref2.phone) {
      Alert.alert("Required", "Please provide two references to proceed.");
      return;
    }

    setStepData({ references: [ref1, ref2] });
    navigation.navigate('IdentityVerification');
  };

  const ReferenceCard = ({ num, data, setData }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>0{num}</Text>
        </View>
        <Text style={styles.sectionTitle}>Reference {num === 1 ? 'One' : 'Two'}</Text>
      </View>

      <Text style={styles.label}>Full Name</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={18} color="#999" />
        <TextInput 
          style={styles.input} 
          placeholder="Enter full name" 
          value={data.name}
          onChangeText={(val) => setData({ ...data, name: val })}
        />
      </View>

      <Text style={styles.label}>Relationship</Text>
      <Dropdown
        style={styles.dropdown}
        data={REF_RELATIONS}
        labelField="label" valueField="value"
        placeholder="Select Relation"
        value={data.relation}
        onChange={item => setData({ ...data, relation: item.value })}
      />

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={18} color="#999" />
        <TextInput 
          style={styles.input} 
          placeholder="+91 00000 00000" 
          keyboardType="phone-pad"
          value={data.phone}
          onChangeText={(val) => setData({ ...data, phone: val })}
        />
      </View>

      <Text style={styles.label}>Residential Address</Text>
      <View style={[styles.inputContainer, styles.textAreaContainer]}>
        <Ionicons name="location-outline" size={18} color="#999" style={{ marginTop: 12 }} />
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Enter complete address" 
          multiline 
          numberOfLines={3}
          value={data.address}
          onChangeText={(val) => setData({ ...data, address: val })}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Personal References</Text>
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            Please provide two references. Note: These are for contact verification purposes only and will not be co-borrowers.
          </Text>
        </View>

        <ReferenceCard num={1} data={ref1} setData={setRef1} />
        <ReferenceCard num={2} data={ref2} setData={setRef2} />

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next: Identity Verification</Text>
          <Ionicons name="shield-checkmark-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 10 },
  noteBox: { backgroundColor: '#FFFBEB', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#F59E0B', marginBottom: 20 },
  noteText: { fontSize: 13, color: '#92400E', lineHeight: 18 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  badge: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginLeft: 10 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', marginTop: 15, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, height: 50 },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
  dropdown: { height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12 },
  textAreaContainer: { height: 100, alignItems: 'flex-start' },
  textArea: { height: 80, textAlignVertical: 'top', marginTop: 10 },
  nextBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  nextBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700', marginRight: 10 }
});

export default ReferencesScreen;