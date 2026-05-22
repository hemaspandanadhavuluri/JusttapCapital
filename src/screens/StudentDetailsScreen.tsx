import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

const StudentDetailsScreen = ({ navigation }: any) => {
  const { setStepData } = useLeadStore();

  // 15-20 Student Details State
  const [details, setDetails] = useState({
    age: '',
    workExp: '',
    tenthScore: '',
    tenthYear: '',
    twelfthScore: '',
    twelfthYear: '',
    gradScore: '',
    gradYear: '',
    hasExistingLoan: null,
    loanPayer: ''
  });

  const handleNext = () => {
    // Validation: Ensure mandatory academic fields are filled
    if (!details.tenthScore || !details.twelfthScore || !details.gradScore) {
      Alert.alert("Missing Information", "Please provide your academic scores to calculate eligibility.");
      return;
    }

    setStepData({ academicBackground: details });
    navigation.navigate('CourseFinancials');
  };

  const AcademicRow = ({ label, scoreKey, yearKey, placeholder }: any) => (
    <View style={styles.academicSection}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 2, marginRight: 10 }]}
          placeholder={placeholder}
          keyboardType="decimal-pad"
          onChangeText={(val) => setDetails({ ...details, [scoreKey]: val })}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="YYYY"
          keyboardType="number-pad"
          maxLength={4}
          onChangeText={(val) => setDetails({ ...details, [yearKey]: val })}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Academic Background</Text>
        
        <View style={styles.card}>
          {/* 15 & 16: Age and Work Experience */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Age</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Years" 
                keyboardType="number-pad"
                onChangeText={(val) => setDetails({ ...details, age: val })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Work Exp (Months)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Total months" 
                keyboardType="number-pad"
                onChangeText={(val) => setDetails({ ...details, workExp: val })}
              />
            </View>
          </View>

          {/* 17, 18, 19: Academic Scores */}
          <AcademicRow label="10th Standard" scoreKey="tenthScore" yearKey="tenthYear" placeholder="e.g. 92%" />
          <AcademicRow label="12th / Intermediate" scoreKey="twelfthScore" yearKey="twelfthYear" placeholder="e.g. 88%" />
          <AcademicRow label="Graduation CGPA/%" scoreKey="gradScore" yearKey="gradYear" placeholder="e.g. 7.5 CGPA" />
        </View>

        {/* 20: Existing Loans Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Do you have any active financial commitments (Loans)?</Text>
          <View style={styles.choiceRow}>
            <TouchableOpacity 
              style={[styles.choiceBtn, details.hasExistingLoan === true && styles.choiceActive]}
              onPress={() => setDetails({ ...details, hasExistingLoan: true })}
            >
              <Text style={details.hasExistingLoan === true ? styles.whiteText : styles.darkText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.choiceBtn, details.hasExistingLoan === false && styles.choiceActive]}
              onPress={() => setDetails({ ...details, hasExistingLoan: false })}
            >
              <Text style={details.hasExistingLoan === false ? styles.whiteText : styles.darkText}>No</Text>
            </TouchableOpacity>
          </View>

          {details.hasExistingLoan && (
            <View style={{ marginTop: 15 }}>
              <Text style={styles.label}>Who is paying the loan?</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Specify relation (e.g. Father, Self)" 
                onChangeText={(val) => setDetails({ ...details, loanPayer: val })}
              />
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next: Course Financials</Text>
          <Ionicons name="cash-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  academicSection: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
  row: { flexDirection: 'row' },
  input: { height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, fontSize: 16, backgroundColor: '#FAFAFA' },
  choiceRow: { flexDirection: 'row', marginTop: 10 },
  choiceBtn: { flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, marginRight: 10 },
  choiceActive: { backgroundColor: Colors.primary },
  whiteText: { color: '#FFF', fontWeight: '700' },
  darkText: { color: Colors.primary, fontWeight: '700' },
  nextBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 10 }
});

export default StudentDetailsScreen;