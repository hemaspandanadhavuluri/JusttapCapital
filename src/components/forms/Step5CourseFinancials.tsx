import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useApplicationStore } from '../../store/useApplicationStore';
import { FIXED_LIVING_EXPENSES } from './locationData';
import axios from 'axios';

const EXCHANGE_RATE_API_KEY = '96f3c67b0e061f1c0ed660c0';

const DURATIONS = [
  { label: '1 Year', value: '1' },
  { label: '2 Years', value: '2' },
  { label: '3 Years', value: '3' },
  { label: '4 Years', value: '4' },
  { label: '5 Years', value: '5' },
];

const OTHER_EXPENSES_OPTIONS = [
  { label: '3 Lakhs', value: '3' },
  { label: '3.5 Lakhs', value: '3.5' },
  { label: '4 Lakhs', value: '4' },
  { label: '4.5 Lakhs', value: '4.5' },
  { label: '5 Lakhs', value: '5' },
];

const CURRENCIES = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'CAD (C$)', value: 'CAD' },
  { label: 'AUD (A$)', value: 'AUD' },
  { label: 'SGD (S$)', value: 'SGD' },
];

export const Step5CourseFinancials = ({ onSave, onBack }: { onSave: (data: any) => Promise<void>; onBack: () => void }) => {
  const rawStoreData = useApplicationStore((state: any) => state.courseFinancials);
  const storeData = rawStoreData || {};
  
  const rawEducationData = useApplicationStore((state: any) => state.educationDetails);
  const educationData = rawEducationData || {};
  
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(storeData.courseDuration || '2');
  const [tuitionFeeLakhs, setTuitionFeeLakhs] = useState(storeData.tuitionFee || '');
  
  const [activeTab, setActiveTab] = useState<'direct' | 'convert'>('direct');
  const [showGapModal, setShowGapModal] = useState(false);
  const [originalTuitionFee, setOriginalTuitionFee] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isConverting, setIsConverting] = useState(false);

  // Get the first interested country from Step 2 to determine fixed living expenses
  const primaryCountry = educationData.interestedCountries?.[0] || 'USA';
  const livingExpenses = FIXED_LIVING_EXPENSES[primaryCountry] || 10.0;
  
  const [otherExpenses, setOtherExpenses] = useState(storeData.otherExpenses || '3');
  const [requestedLoan, setRequestedLoan] = useState(storeData.requestedLoanAmount || '');

  const totalExpenses = (parseFloat(tuitionFeeLakhs || '0') + livingExpenses + parseFloat(otherExpenses)).toFixed(2);

  const handleConvert = async () => {
    if (!originalTuitionFee) return;
    setIsConverting(true);
    try {
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${selectedCurrency}`);
      const rate = response.data.conversion_rates.INR;
      if (rate) {
        const feeInINR = parseFloat(originalTuitionFee) * rate;
        const feeInLakhs = (feeInINR / 100000).toFixed(2);
        setTuitionFeeLakhs(feeInLakhs);
      }
    } catch (error) {
      console.error("Conversion error:", error);
      Alert.alert("Error", "Failed to fetch current exchange rates.");
    } finally {
      setIsConverting(false);
    }
  };

  const saveFinancials = async () => {
    setLoading(true);
    try {
      await onSave({
        courseDuration: duration,
        tuitionFee: tuitionFeeLakhs,
        livingExpenses: livingExpenses.toString(),
        otherExpenses,
        totalEstimatedExpenses: totalExpenses,
        requestedLoanAmount: requestedLoan
      });
    } catch (err) {
      Alert.alert("Sync Failure", "Could not save financial details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!tuitionFeeLakhs || !requestedLoan) {
      Alert.alert("Required Fields", "Please provide tuition fee and requested loan amount.");
      return;
    }

    const requested = parseFloat(requestedLoan);
    const estimated = parseFloat(totalExpenses);

    if (requested > estimated) {
      Alert.alert("Invalid Amount", "Your requested loan amount cannot exceed the total estimated expenses.");
      return;
    }

    if (requested < estimated) {
      setShowGapModal(true);
      return;
    }

    saveFinancials();
  };

  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      {/* Attractive Custom Gap Modal */}
      <Modal visible={showGapModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={40} color="#FF8A00" />
            </View>
            <Text style={styles.modalTitle}>Funding Recommendation</Text>
            <Text style={styles.modalMessage}>
              Your requested loan (<Text style={{fontWeight: '700'}}>₹{requestedLoan}L</Text>) is lower than your total estimated expenses (<Text style={{fontWeight: '700'}}>₹{totalExpenses}L</Text>).
              {"\n\n"}
              We recommend requesting a higher amount to ensure your journey is fully covered, but you may continue if you have other funding sources.
            </Text>
            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={styles.modalSecondaryBtn} 
                onPress={() => setShowGapModal(false)}
              >
                <Text style={styles.modalSecondaryBtnText}>Adjust Amount</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalPrimaryBtn} 
                onPress={() => {
                  setShowGapModal(false);
                  saveFinancials();
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.sectionTitle}>Course & Loan Financials</Text>

      <Text style={styles.label}>Course Duration (Years)</Text>
      <Dropdown
        style={styles.dropdown}
        data={DURATIONS}
        labelField="label"
        valueField="value"
        placeholder="Select Duration"
        value={duration}
        onChange={item => setDuration(item.value)}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tuition Fee Details</Text>
        
        <View style={styles.tabRow}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'direct' && styles.activeTab]} 
            onPress={() => setActiveTab('direct')}
          >
            <Text style={[styles.tabText, activeTab === 'direct' && styles.activeTabText]}>Direct INR</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'convert' && styles.activeTab]} 
            onPress={() => setActiveTab('convert')}
          >
            <Text style={[styles.tabText, activeTab === 'convert' && styles.activeTabText]}>Converter</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'direct' ? (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.label}>Tuition Fee (in Lakhs INR)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 25.0" 
              keyboardType="numeric" 
              value={tuitionFeeLakhs} 
              onChangeText={setTuitionFeeLakhs} 
            />
          </View>
        ) : (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.subLabel}>Select Currency</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.currencyScroll}
            >
              {CURRENCIES.map((curr) => (
                <TouchableOpacity 
                  key={curr.value} 
                  style={[styles.currencyChip, selectedCurrency === curr.value && styles.activeCurrencyChip]}
                  onPress={() => setSelectedCurrency(curr.value)}
                >
                  <Text style={[styles.currencyChipText, selectedCurrency === curr.value && styles.activeCurrencyChipText]}>
                    {curr.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.conversionRow}>
              <TextInput 
                style={[styles.input, { flex: 1, marginTop: 0 }]} 
                placeholder={`Amount in ${selectedCurrency}`} 
                keyboardType="numeric" 
                value={originalTuitionFee} 
                onChangeText={setOriginalTuitionFee} 
              />
              <TouchableOpacity style={styles.convertBtn} onPress={handleConvert} disabled={isConverting}>
                {isConverting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.convertBtnText}>Get INR</Text>}
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Converted Value (in Lakhs INR)</Text>
            <TextInput style={[styles.input, { backgroundColor: '#EEF2F6' }]} editable={false} value={tuitionFeeLakhs} />
          </View>
        )}
      </View>

      <View style={styles.expenseRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Living Expenses (Fixed)</Text>
          <View style={styles.fixedValBox}><Text style={styles.fixedValText}>₹ {livingExpenses} L</Text></View>
          <Text style={styles.hintText}>Based on {primaryCountry}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.label}>Other Expenses</Text>
          <Dropdown style={styles.dropdown} data={OTHER_EXPENSES_OPTIONS} labelField="label" valueField="value" value={otherExpenses} onChange={item => setOtherExpenses(item.value)} />
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>TOTAL ESTIMATED EXPENSES</Text>
        <Text style={styles.totalAmount}>₹ {totalExpenses} L</Text>
      </View>

      <Text style={styles.label}>How much loan do you want to take? (Lakhs)</Text>
      <TextInput style={styles.input} placeholder="e.g. 30.0" keyboardType="numeric" value={requestedLoan} onChangeText={setRequestedLoan} />

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
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#4B2C85', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginTop: 14, marginBottom: 6 },
  subLabel: { fontSize: 11, fontWeight: '600', color: '#64748B', marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 16, color: '#1E293B', marginTop: 0 },
  dropdown: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 54 },
  card: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 15 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#4B2C85', marginBottom: 12 },
  tabRow: { flexDirection: 'row', backgroundColor: '#EEF2F6', borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#4B2C85' },
  currencyScroll: { gap: 8, marginBottom: 15, paddingRight: 20 },
  currencyChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFF' },
  activeCurrencyChip: { borderColor: '#4B2C85', backgroundColor: '#F3E8FF' },
  currencyChipText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  activeCurrencyChipText: { color: '#4B2C85', fontWeight: '700' },
  conversionRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 15 },
  convertBtn: { backgroundColor: '#4B2C85', paddingHorizontal: 12, height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  convertBtnText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  expenseRow: { flexDirection: 'row', marginTop: 10 },
  fixedValBox: { height: 54, backgroundColor: '#EEF2F6', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: '#CBD5E1' },
  fixedValText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  hintText: { fontSize: 10, color: '#94A3B8', marginTop: 4 },
  totalBox: { marginTop: 25, backgroundColor: '#F3E8FF', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#C084FC' },
  totalLabel: { fontSize: 11, fontWeight: '800', color: '#7C3AED', letterSpacing: 0.5 },
  totalAmount: { fontSize: 32, fontWeight: '900', color: '#4B2C85', marginTop: 4 },
  btnWrapperRow: { flexDirection: 'row', gap: 12, marginTop: 30, marginBottom: 50 },
  backButton: { flex: 1, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: '#4B2C85', fontSize: 16, fontWeight: '700' },
  submitBtn: { flex: 2, backgroundColor: '#FF8A00', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  
  // Custom Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  modalIconContainer: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 12, textAlign: 'center' },
  modalMessage: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  modalActionRow: { flexDirection: 'row', gap: 12, width: '100%' },
  modalPrimaryBtn: { flex: 1, backgroundColor: '#4B2C85', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalPrimaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  modalSecondaryBtn: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalSecondaryBtnText: { color: '#475569', fontWeight: '700', fontSize: 15 }
});