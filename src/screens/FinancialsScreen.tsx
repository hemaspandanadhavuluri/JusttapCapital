import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, Platform 
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Slider from '@react-native-community/slider'; 
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

const DURATIONS = [
  { label: '1 Year', value: '1' },
  { label: '2 Years', value: '2' },
  { label: '3 Years', value: '3' },
  { label: '4 Years', value: '4' },
];

const FinancialsScreen = ({ navigation }: any) => {
  const { setStepData } = useLeadStore();

  // Financial States (Values in Lakhs)
  const [duration, setDuration] = useState('2');
  const [tuitionFee, setTuitionFee] = useState('');
  const [livingExpenses, setLivingExpenses] = useState(12.0); // Default fixed for some countries
  const [otherExpenses, setOtherExpenses] = useState(3.0); 
  const [requestedLoan, setRequestedLoan] = useState('');

  // 25. Total Calculation
  const totalExpenses = (Number(tuitionFee || 0) + livingExpenses + otherExpenses).toFixed(2);

  // Calculate Coverage Percentage for requested loan
  const coverage = requestedLoan ? ((Number(requestedLoan) / Number(totalExpenses)) * 100).toFixed(0) : 0;

  const handleNext = () => {
    setStepData({
      courseDuration: duration,
      tuitionFee,
      livingExpenses,
      otherExpenses,
      totalEstimatedExpenses: totalExpenses,
      requestedLoanAmount: requestedLoan
    });
    navigation.navigate('AssetsCollateral');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Course & Loan Financials</Text>
        <Text style={styles.subtitle}>Provide a clear breakdown of your expected expenses and the loan amount you require.</Text>

        {/* 21. Duration */}
        <Text style={styles.label}>Course Duration</Text>
        <Dropdown
          style={styles.dropdown}
          data={DURATIONS}
          labelField="label"
          valueField="value"
          value={duration}
          onChange={item => setDuration(item.value)}
        />

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calculator-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Financial Breakdown</Text>
          </View>

          {/* 22. Tuition Fee */}
          <Text style={styles.fieldLabel}>Tuition Fee (Lakhs)</Text>
          <View style={styles.inputContainer}>
             <Text style={styles.currency}>₹</Text>
             <TextInput 
               style={styles.input} 
               placeholder="e.g. 25.0" 
               keyboardType="decimal-pad"
               value={tuitionFee}
               onChangeText={setTuitionFee}
             />
          </View>

          {/* 23. Living Expenses (Fixed Display) */}
          <View style={styles.fixedExpenseBox}>
            <View>
              <Text style={styles.fixedLabel}>Living Expenses (Fixed)</Text>
              <Text style={styles.fixedSubLabel}>Based on country standards</Text>
            </View>
            <Text style={styles.fixedAmount}>₹ {livingExpenses} L</Text>
          </View>

          {/* 24. Other Expenses Slider */}
          <View style={styles.sliderHeader}>
            <Text style={styles.fieldLabel}>Other Expenses (Lakhs)</Text>
            <Text style={styles.sliderValue}>₹ {otherExpenses.toFixed(1)} L</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={3}
            maximumValue={5}
            step={0.1}
            value={otherExpenses}
            onValueChange={setOtherExpenses}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor={Colors.primary}
          />
          <View style={styles.sliderLimits}>
            <Text style={styles.limitText}>3L</Text>
            <Text style={styles.limitText}>5L</Text>
          </View>

          {/* 25. Total Expenses Display */}
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>TOTAL ESTIMATED EXPENSES</Text>
            <Text style={styles.totalAmount}>₹ {totalExpenses} L</Text>
          </View>
        </View>

        {/* 26. Requested Loan Amount */}
        <Text style={styles.label}>Requested Loan Amount (Lakhs)</Text>
        <View style={styles.inputContainer}>
           <Text style={styles.currency}>₹</Text>
           <TextInput 
             style={styles.input} 
             placeholder="e.g. 35.0" 
             keyboardType="decimal-pad"
             value={requestedLoan}
             onChangeText={setRequestedLoan}
           />
           {requestedLoan !== '' && (
             <View style={styles.coverageBadge}>
               <Text style={styles.coverageText}>{coverage}% Coverage</Text>
             </View>
           )}
        </View>
        <Text style={styles.tipText}>💡 Ideally, request 80-90% of total expenses to improve approval odds.</Text>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next: Assets & Co-applicants</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  subtitle: { fontSize: 14, color: '#666', marginTop: 8, marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '700', color: '#333', marginTop: 20, marginBottom: 10 },
  dropdown: { height: 50, backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginTop: 10, elevation: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginLeft: 10, color: Colors.primary },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#555' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, height: 55, paddingHorizontal: 15, marginTop: 8, backgroundColor: '#FAFAFA' },
  currency: { fontSize: 18, fontWeight: '700', color: '#333', marginRight: 10 },
  input: { flex: 1, fontSize: 18, fontWeight: '600' },
  fixedExpenseBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F4FF', padding: 15, borderRadius: 10, marginVertical: 20 },
  fixedLabel: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  fixedSubLabel: { fontSize: 11, color: '#666' },
  fixedAmount: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  sliderValue: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  sliderLimits: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 },
  limitText: { fontSize: 12, color: '#999' },
  totalBox: { marginTop: 25, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 20, alignItems: 'flex-end' },
  totalLabel: { fontSize: 12, fontWeight: '700', color: '#999' },
  totalAmount: { fontSize: 32, fontWeight: '900', color: '#4B2C85' },
  coverageBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  coverageText: { color: '#065F46', fontSize: 12, fontWeight: '700' },
  tipText: { fontSize: 12, color: '#0052CC', marginTop: 10, fontStyle: 'italic' },
  nextBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 10 }
});

export default FinancialsScreen;