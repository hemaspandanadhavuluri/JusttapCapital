import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, 
  ScrollView, TextInput, Alert 
} from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';
import { createLead } from '../api/leadApi'; // Your API helper

const DEGREES = [
  { label: 'Masters', value: 'masters' },
  { label: 'Graduation', value: 'graduation' },
  { label: 'PhD', value: 'phd' },
  { label: 'MBBS', value: 'mbbs' },
];

const ADMISSION_STATUS = [
  { label: 'Received Admission', value: 'received' },
  { label: 'Applied, not admit yet', value: 'applied' },
  { label: 'Not yet applied', value: 'not_applied' },
];

const FurtherEducationScreen = ({ navigation }: any) => {
  const { stepData, setStepData } = useLeadStore();

  // Local State for Form
  const [loanType, setLoanType] = useState('New Loan');
  const [degree, setDegree] = useState(null);
  const [status, setStatus] = useState(null);
  const [approachedBank, setApproachedBank] = useState<boolean | null>(null);
  const [bankDetails, setBankDetails] = useState({ name: '', logged: false, sanctioned: false });

  const handleFinalSubmit = async () => {
    const finalData = { ...stepData, loanType, degree, status, approachedBank, bankDetails };
    
    try {
      // TRIGGER LEAD CREATION (Step 13 requirement)
      const response = await createLead(finalData); 
      
      // Save FO details returned from API to store
      setStepData({ assignedFO: response.assignedFO });

      Alert.alert("Lead Created", `You have been assigned to ${response.assignedFO.name}`);
      navigation.navigate('AcademicExcellence');
    } catch (error) {
      Alert.alert("Error", "Failed to create lead. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Further Education Details</Text>

        {/* 6. Loan Type */}
        <View style={styles.card}>
          <Text style={styles.label}>Loan Type</Text>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.chip, loanType === 'New Loan' && styles.chipActive]} 
              onPress={() => setLoanType('New Loan')}
            >
              <Text style={loanType === 'New Loan' ? styles.whiteText : styles.purpleText}>New Loan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.chip, loanType === 'Balance Transfer' && styles.chipActive]} 
              onPress={() => setLoanType('Balance Transfer')}
            >
              <Text style={loanType === 'Balance Transfer' ? styles.whiteText : styles.purpleText}>Balance Transfer</Text>
            </TouchableOpacity>
          </View>

          {/* 9. Degree */}
          <Text style={styles.label}>Degree</Text>
          <Dropdown
            style={styles.dropdown}
            data={DEGREES}
            labelField="label"
            valueField="value"
            placeholder="Select Degree"
            value={degree}
            onChange={item => setDegree(item.value)}
          />

          {/* 12. Admission Status */}
          <Text style={styles.label}>Admission Status</Text>
          <Dropdown
            style={styles.dropdown}
            data={ADMISSION_STATUS}
            labelField="label"
            valueField="value"
            placeholder="Select Status"
            value={status}
            onChange={item => setStatus(item.value)}
          />

          {/* Conditional Field: If Received Admission */}
          {status === 'received' && (
            <TextInput 
              style={styles.input} 
              placeholder="Admitted University Name" 
              onChangeText={(text) => setStepData({ university: text })}
            />
          )}
        </View>

        {/* 13. Bank History */}
        <View style={styles.card}>
          <Text style={styles.label}>Have you approached any bank before?</Text>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.radio, approachedBank === true && styles.radioActive]} 
              onPress={() => setApproachedBank(true)}
            >
              <Text>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.radio, approachedBank === false && styles.radioActive]} 
              onPress={() => setApproachedBank(false)}
            >
              <Text>No</Text>
            </TouchableOpacity>
          </View>

          {approachedBank && (
            <View>
              <TextInput 
                style={styles.input} 
                placeholder="Bank Name" 
                onChangeText={(text) => setBankDetails({...bankDetails, name: text})}
              />
              <Text style={styles.label}>File Logged?</Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => setBankDetails({...bankDetails, logged: true})}>
                  <Text style={bankDetails.logged ? styles.bold : {}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 20}} onPress={() => setBankDetails({...bankDetails, logged: false})}>
                  <Text style={!bankDetails.logged ? styles.bold : {}}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleFinalSubmit}>
          <Text style={styles.nextBtnText}>Submit Lead & Continue</Text>
          <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 20, color: Colors.primary },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginVertical: 10 },
  dropdown: { height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
  input: { height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.primary, marginRight: 10 },
  chipActive: { backgroundColor: Colors.primary },
  purpleText: { color: Colors.primary, fontWeight: '600' },
  whiteText: { color: '#FFF', fontWeight: '600' },
  radio: { padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, marginRight: 10, width: 80, alignItems: 'center' },
  radioActive: { borderColor: Colors.primary, backgroundColor: '#F0EBFF' },
  bold: { fontWeight: 'bold', color: Colors.primary },
  nextBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 10 }
});

export default FurtherEducationScreen;