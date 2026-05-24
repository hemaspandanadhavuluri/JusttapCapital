import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApplicationStore } from '../../store/useApplicationStore';
import { STUDY_ABROAD_COUNTRIES } from './locationData';

// Static Configuration Data
const DEGREES = ['Masters', 'Graduation', 'PhD', 'MBBS', 'UG Certificate', 'PG Certificate'];
const FIELDS = ['Computer Science', 'Data Analysis', 'Mechanical Engineering', 'Electrical Engineering', 'Arts', 'Accounting', 'Management'];
const MONTHS = ['Jan - March', 'April - June', 'July - Sept', 'Oct - Dec'];
const ADMISSION_OPTIONS = ['Received Admission', 'Applied, not admit yet', 'Not yet applied'];

const YEARS = Array.from({ length: 7 }, (_, i) => ({ label: `${2024 + i}`, value: `${2024 + i}` }));

export const Step2EducationDetails = ({ onSave, onBack }: { onSave: (data: any) => Promise<void>; onBack: () => void }) => {
  const storeData = useApplicationStore((state) => state.educationDetails);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [loanType, setLoanType] = useState(storeData.loanType || 'New Loan');
  const [courseStartYear, setCourseStartYear] = useState(storeData.courseStartYear || '');
  const [courseStartMonth, setCourseStartMonth] = useState(storeData.courseStartMonth || '');
  const [degree, setDegree] = useState(storeData.degree || '');
  const [fieldOfInterest, setFieldOfInterest] = useState(storeData.fieldOfInterest || '');
  const [admissionStatus, setAdmissionStatus] = useState(storeData.admissionStatus || '');
  const [interestedCountries, setInterestedCountries] = useState<string[]>(storeData.interestedCountries || []);
  const [expectedDate, setExpectedDate] = useState(storeData.expectedDate || '');
  const [approachedAnyBank, setApproachedAnyBank] = useState(storeData.approachedAnyBank || 'No');
  const [bankName, setBankName] = useState(storeData.bankName || '');
  const [fileLoggedIn, setFileLoggedIn] = useState(storeData.fileLoggedIn || 'No');
  const [loanSanctioned, setLoanSanctioned] = useState(storeData.loanSanctioned || 'No');
  const [pfPaid, setPfPaid] = useState(storeData.pfPaid || 'No');
  const [disbursed, setDisbursed] = useState(storeData.disbursed || 'No');
  const [universities, setUniversities] = useState(storeData.universities || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setExpectedDate(`${year}-${month}-${day}`);
    }
  };

  const handleSubmit = async () => {
    if (!fieldOfInterest || !degree || !courseStartYear || !courseStartMonth || interestedCountries.length === 0) {
      Alert.alert("Missing Information", "Please fill all mandatory education fields.");
      return;
    }

    if (approachedAnyBank === 'Yes' && !bankName) {
      Alert.alert("Missing Bank Details", "Please provide the name of the bank you approached.");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        loanType,
        courseStartYear,
        courseStartMonth,
        degree,
        fieldOfInterest,
        interestedCountries,
        admissionStatus,
        expectedDate,
        approachedAnyBank,
        bankName,
        fileLoggedIn,
        loanSanctioned,
        pfPaid,
        disbursed,
        universities
      });
    } catch (err) {
      Alert.alert("Sync Failure", "Could not complete server synchronization updates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Education & Loan Profile</Text>

      <Text style={styles.label}>Loan Class Strategy</Text>
      <View style={styles.toggleGrid}>
        {['New Loan', 'Balance Transfer'].map((type) => (
          <TouchableOpacity key={type} style={[styles.toggleBtn, loanType === type && styles.activeToggle]} onPress={() => setLoanType(type)}>
            <Text style={[styles.toggleText, loanType === type && styles.activeToggleText]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Course Intake Timing</Text>
      <Dropdown
        style={[styles.dropdown, { marginBottom: 10 }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={YEARS}
        search
        searchPlaceholder="Search year..."
        labelField="label"
        valueField="value"
        placeholder="Select Start Year"
        value={courseStartYear}
        onChange={item => setCourseStartYear(item.value)}
        disable={loading}
      />
      <View style={styles.toggleGrid}>
        {MONTHS.map((m) => (
          <TouchableOpacity key={m} style={[styles.toggleBtn, { paddingVertical: 10 }, courseStartMonth === m && styles.activeToggle]} onPress={() => setCourseStartMonth(m)}>
            <Text style={[styles.toggleText, { fontSize: 11 }, courseStartMonth === m && styles.activeToggleText]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Degree Stratification Level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
        {DEGREES.map((deg) => (
          <TouchableOpacity key={deg} style={[styles.horizontalToggleBtn, degree === deg && styles.activeToggleBright]} onPress={() => setDegree(deg)}>
            <Text style={[styles.toggleText, degree === deg && styles.activeToggleText]}>{deg}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Field of Interest</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
        {FIELDS.map((field) => (
          <TouchableOpacity key={field} style={[styles.horizontalToggleBtn, fieldOfInterest === field && styles.activeToggleBright]} onPress={() => setFieldOfInterest(field)}>
            <Text style={[styles.toggleText, fieldOfInterest === field && styles.activeToggleText]}>{field}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Interested Study Countries</Text>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={STUDY_ABROAD_COUNTRIES}
        search
        searchPlaceholder="Search countries..."
        labelField="label"
        valueField="value"
        placeholder="Select Countries (Multiple)"
        value={interestedCountries}
        onChange={item => setInterestedCountries(item)}
        selectedStyle={styles.selectedCountryBadge}
        disable={loading}
      />

      <Text style={styles.label}>Current Admission Status</Text>
      <View style={styles.toggleGrid}>
        {ADMISSION_OPTIONS.map((status) => (
          <TouchableOpacity key={status} style={[styles.toggleBtn, { paddingHorizontal: 4 }, admissionStatus === status && styles.activeToggle]} onPress={() => setAdmissionStatus(status)}>
            <Text style={[styles.toggleText, admissionStatus === status && styles.activeToggleText]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {admissionStatus !== '' && (
        <View style={styles.subCard}>
          <Text style={styles.subLabel}>
            {admissionStatus === 'Received Admission' ? 'Admitted Universities' : 
             admissionStatus === 'Applied, not admit yet' ? 'Applied Universities' : 'Universities you want to apply'}
          </Text>
          <TextInput style={styles.input} placeholder="List universities" value={universities} onChangeText={setUniversities} />
          
          {admissionStatus !== 'Received Admission' && (
            <>
              <Text style={styles.subLabel}>
                {admissionStatus === 'Not yet applied' ? 'Expected Application Date' : 'Expected Admit Date'}
              </Text>
              <TouchableOpacity 
                style={styles.datePickerButton} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={expectedDate ? styles.dateText : styles.placeholderText}>
                  {expectedDate || "Select Date"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={expectedDate ? new Date(expectedDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </>
          )}
        </View>
      )}

      <Text style={styles.label}>Have you approached any bank before?</Text>
      <View style={styles.toggleRow}>
        {['Yes', 'No'].map((ans) => (
          <TouchableOpacity key={ans} style={[styles.toggleBtn, approachedAnyBank === ans && styles.activeToggle]} onPress={() => setApproachedAnyBank(ans)}>
            <Text style={[styles.toggleText, approachedAnyBank === ans && styles.activeToggleText]}>{ans}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {approachedAnyBank === 'Yes' && (
        <View style={styles.subCard}>
          <Text style={styles.subLabel}>Prior Banking Institution Name</Text>
          <TextInput style={styles.input} placeholder="e.g. State Bank of India" value={bankName} onChangeText={setBankName} />

          <Text style={styles.subLabel}>Was the physical file logged in?</Text>
          <View style={styles.toggleRow}>
            {['Yes', 'No'].map((ans) => (
              <TouchableOpacity key={ans} style={[styles.toggleBtn, fileLoggedIn === ans && styles.activeToggle]} onPress={() => setFileLoggedIn(ans)}>
                <Text style={[styles.toggleText, fileLoggedIn === ans && styles.activeToggleText]}>{ans}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {fileLoggedIn === 'Yes' && (
            <>
              <Text style={styles.subLabel}>Was the sanction letter generated?</Text>
              <View style={styles.toggleRow}>
                {['Yes', 'No'].map((ans) => (
                  <TouchableOpacity key={ans} style={[styles.toggleBtn, loanSanctioned === ans && styles.activeToggle]} onPress={() => setLoanSanctioned(ans)}>
                    <Text style={[styles.toggleText, loanSanctioned === ans && styles.activeToggleText]}>{ans}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {loanSanctioned === 'Yes' && (
                <>
                  <Text style={styles.subLabel}>Is Processing Fee (PF) Paid?</Text>
                  <View style={styles.toggleRow}>
                    {['Yes', 'No'].map((ans) => (
                      <TouchableOpacity key={ans} style={[styles.toggleBtn, pfPaid === ans && styles.activeToggle]} onPress={() => setPfPaid(ans)}>
                        <Text style={[styles.toggleText, pfPaid === ans && styles.activeToggleText]}>{ans}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  {pfPaid === 'Yes' && (
                    <>
                      <Text style={styles.subLabel}>Is Loan Disbursed?</Text>
                      <View style={styles.toggleRow}>
                        {['Yes', 'No'].map((ans) => (
                          <TouchableOpacity key={ans} style={[styles.toggleBtn, disbursed === ans && styles.activeToggle]} onPress={() => setDisbursed(ans)}>
                            <Text style={[styles.toggleText, disbursed === ans && styles.activeToggleText]}>{ans}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
      )}

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
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginTop: 14, marginBottom: 6 },
  subLabel: { fontSize: 13, fontWeight: '700', color: '#4B2C85', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 16, color: '#1E293B' },
  dropdown: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 54 },
  placeholderStyle: { fontSize: 16, color: '#94A3B8' },
  selectedTextStyle: { fontSize: 16, color: '#1E293B' },
  selectedCountryBadge: { borderRadius: 10, backgroundColor: '#F3E8FF', borderWidth: 1, borderColor: '#7C3AED', paddingHorizontal: 10, paddingVertical: 4 },
  toggleRow: { flexDirection: 'row', gap: 12, marginTop: 4, marginBottom: 4 },
  toggleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  toggleBtn: { flex: 1, padding: 14, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', backgroundColor: '#FFF' },
  horizontalScrollPadding: { gap: 10, paddingRight: 20 },
  horizontalToggleBtn: { paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', backgroundColor: '#FFF' },
  activeToggle: { borderColor: '#4B2C85', backgroundColor: '#F3E8FF' },
  activeToggleBright: { borderColor: '#7C3AED', backgroundColor: '#F3E8FF' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeToggleText: { color: '#7C3AED', fontWeight: '800' },
  subCard: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 12, gap: 4 },
  datePickerButton: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, height: 54, justifyContent: 'center' },
  dateText: { fontSize: 16, color: '#1E293B' },
  placeholderText: { fontSize: 16, color: '#94A3B8' },
  btnWrapperRow: { flexDirection: 'row', gap: 12, marginTop: 30, marginBottom: 50 },
  backButton: { flex: 1, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: '#4B2C85', fontSize: 16, fontWeight: '700' },
  submitBtn: { flex: 2, backgroundColor: '#FF8A00', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});