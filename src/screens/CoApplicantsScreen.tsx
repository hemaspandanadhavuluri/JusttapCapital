import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, Switch 
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

const RELATIONS = [
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Brother', value: 'brother' },
  { label: 'Sister', value: 'sister' },
  { label: 'Uncle', value: 'uncle' },
  { label: 'Aunt', value: 'aunt' },
];

const EMPLOYMENT_TYPES = [
  { label: 'Salaried', value: 'salaried' },
  { label: 'Self-Employed / Business', value: 'business' },
  { label: 'Retired', value: 'retired' },
  { label: 'Farmer', value: 'farmer' },
];

const CoApplicantsScreen = ({ navigation }: any) => {
  const { setStepData } = useLeadStore();
  
  const [coApplicants, setCoApplicants] = useState<any[]>([{
    id: Date.now(), relation: '', name: '', empType: '', income: '', phone: '', hasCibilIssue: false, isCoApplicant: true
  }]);

  const [houseGuarantor, setHouseGuarantor] = useState(null);

  const addRelation = () => {
    setCoApplicants([...coApplicants, {
      id: Date.now(), relation: '', name: '', empType: '', income: '', phone: '', hasCibilIssue: false, isCoApplicant: true
    }]);
  };

  const updateRelation = (id: number, key: string, value: any) => {
    setCoApplicants(coApplicants.map(item => item.id === id ? { ...item, [key]: value } : item));
  };

  const handleNext = () => {
    setStepData({ 
      coApplicants, 
      houseGuarantor 
    });
    navigation.navigate('References');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Relationships & Co-applicants</Text>

        {coApplicants.map((person, index) => (
          <View key={person.id} style={styles.card}>
            <Text style={styles.sectionHeader}>Relation #{index + 1}</Text>
            
            <Text style={styles.label}>Relationship Type</Text>
            <Dropdown
              style={styles.dropdown}
              data={RELATIONS}
              labelField="label" valueField="value"
              placeholder="Select Relation"
              value={person.relation}
              onChange={item => updateRelation(person.id, 'relation', item.value)}
            />

            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Legal Name" 
              onChangeText={(val) => updateRelation(person.id, 'name', val)}
            />

            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Employment Status</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={EMPLOYMENT_TYPES}
                  labelField="label" valueField="value"
                  placeholder="Select"
                  value={person.empType}
                  onChange={item => updateRelation(person.id, 'empType', item.value)}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Monthly Income</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="₹ Amount" 
                  keyboardType="number-pad"
                  onChangeText={(val) => updateRelation(person.id, 'income', val)}
                />
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Any CIBIL/Credit Issues?</Text>
              <Switch 
                value={person.hasCibilIssue} 
                onValueChange={(val) => updateRelation(person.id, 'hasCibilIssue', val)}
                trackColor={{ false: '#DDD', true: '#FF4D4D' }}
              />
            </View>

            <View style={[styles.switchRow, styles.coAppRow]}>
              <View>
                <Text style={styles.coAppTitle}>Add as Co-applicant?</Text>
                <Text style={styles.coAppSub}>Highly recommended for income pooling</Text>
              </View>
              <Switch 
                value={person.isCoApplicant} 
                onValueChange={(val) => updateRelation(person.id, 'isCoApplicant', val)}
                trackColor={{ false: '#DDD', true: '#4B2C85' }}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addMoreBtn} onPress={addRelation}>
          <Ionicons name="person-add" size={20} color={Colors.primary} />
          <Text style={styles.addMoreText}>Add Another Relative</Text>
        </TouchableOpacity>

        {/* 29. Own House Guarantor */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Ionicons name="home-outline" size={20} color={Colors.primary} />
            <Text style={[styles.label, {marginLeft: 10, marginTop: 0}]}>Own House Guarantor</Text>
          </View>
          <Text style={styles.subText}>Who owns the primary residential house?</Text>
          <Dropdown
            style={styles.dropdown}
            data={RELATIONS}
            labelField="label" valueField="value"
            placeholder="Select Owner"
            value={houseGuarantor}
            onChange={item => setHouseGuarantor(item.value)}
          />
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next: Personal References</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 15, elevation: 2 },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: '#999', marginBottom: 10, textTransform: 'uppercase' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 15, marginBottom: 8 },
  subText: { fontSize: 12, color: '#666', marginBottom: 12 },
  dropdown: { height: 48, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12 },
  input: { height: 48, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  switchLabel: { fontSize: 14, color: '#444', fontWeight: '500' },
  coAppRow: { backgroundColor: '#F0FDF4', padding: 10, borderRadius: 8, marginTop: 20 },
  coAppTitle: { fontSize: 14, fontWeight: '700', color: '#166534' },
  coAppSub: { fontSize: 11, color: '#166534' },
  addMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  addMoreText: { marginLeft: 10, fontWeight: '700', color: Colors.primary },
  nextBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 10 }
});

export default CoApplicantsScreen;