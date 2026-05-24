import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApplicationStore } from '../../store/useApplicationStore';

export const Step3TestScores = ({ onSave, onBack }: { onSave: (data: any) => Promise<void>; onBack: () => void }) => {
  // Grab test scores block from state safely casting as any to allow mapping fallback keys
  const rawStoreData = useApplicationStore((state: any) => state.testScores);
  const storeData = rawStoreData || {};

  const [loading, setLoading] = useState(false);
  const [englishTestType, setEnglishTestType] = useState('IELTS');
  
  // Read initial properties using both possible schemas (lowercase or camelCase)
  const [englishScore, setEnglishScore] = useState(storeData.ielts || storeData.englishScore || '');
  const [entranceTestType, setEntranceTestType] = useState('GRE');
  const [entranceScore, setEntranceScore] = useState(storeData.gre || storeData.entranceScore || '');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Build an output payload that populates both generic and explicit schema keys for security
      const scoreKey = englishTestType.toLowerCase();
      const entranceKey = entranceTestType.toLowerCase();

      await onSave({
        englishTestType,
        englishScore,
        entranceTestType,
        entranceScore,
        [scoreKey]: englishScore,
        [entranceKey]: entranceScore
      });
    } catch (err) {
      Alert.alert("Sync Failure", "Could not synchronize test parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Standardized Test Profiles</Text>

      {/* Interactive Info Box */}
      <View style={styles.infoBox}>
        <Ionicons name="sparkles" size={20} color="#4B2C85" />
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '800' }}>Pro Tip:</Text> While these fields are optional, providing high scores can significantly <Text style={{ fontWeight: '700' }}>reduce your loan interest rates</Text> and speed up approval!
        </Text>
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.label}>English Proficiency Assessment</Text>
        <View style={styles.toggleRow}>
          {['IELTS', 'TOEFL', 'PTE', 'None'].map((test) => (
            <TouchableOpacity 
              key={test} 
              style={[styles.toggleBtn, englishTestType === test && styles.activeToggle]} 
              onPress={() => {
                setEnglishTestType(test);
                setEnglishScore(''); // Clear input when switching
              }}
            >
              <Text style={[styles.toggleText, englishTestType === test && styles.activeToggleText]}>{test}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {englishTestType !== 'None' && (
          <>
          <Text style={styles.subLabel}>{englishTestType} Score Value</Text>
          <TextInput style={styles.input} placeholder="Enter your score" keyboardType="numeric" value={englishScore} onChangeText={setEnglishScore} />
          </>
        )}
      </View>

      <Text style={styles.label}>Academic Entrance Examination</Text>
      <View style={styles.toggleRow}>
        {['GRE', 'GMAT', 'None'].map((test) => (
          <TouchableOpacity 
            key={test} 
            style={[styles.toggleBtn, entranceTestType === test && styles.activeToggle]} 
            onPress={() => {
              setEntranceTestType(test);
              setEntranceScore(''); // Clear input when switching
            }}
          >
            <Text style={[styles.toggleText, entranceTestType === test && styles.activeToggleText]}>{test}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {entranceTestType !== 'None' && (
        <View style={styles.subContainer}>
          <Text style={styles.subLabel}>{entranceTestType} Score Value</Text>
          <TextInput style={styles.input} placeholder="Enter test score" keyboardType="numeric" value={entranceScore} onChangeText={setEntranceScore} />
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
  subLabel: { fontSize: 12, fontWeight: '600', color: '#4B2C85', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 16 },
  toggleRow: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 4 },
  toggleBtn: { flex: 1, padding: 12, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', backgroundColor: '#FFF' },
  activeToggle: { borderColor: '#4B2C85', backgroundColor: '#F3E8FF' },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  activeToggleText: { color: '#4B2C85', fontWeight: '700' },
  subContainer: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1', marginTop: 10 },
  infoBox: { flexDirection: 'row', backgroundColor: '#F3E8FF', padding: 14, borderRadius: 12, marginBottom: 20, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#E9D5FF' },
  infoText: { flex: 1, fontSize: 13, color: '#4B2C85', lineHeight: 18 },
  btnWrapperRow: { flexDirection: 'row', gap: 12, marginTop: 35, marginBottom: 50 },
  backButton: { flex: 1, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: '#4B2C85', fontSize: 16, fontWeight: '700' },
  submitBtn: { flex: 2, backgroundColor: '#FF8A00', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});