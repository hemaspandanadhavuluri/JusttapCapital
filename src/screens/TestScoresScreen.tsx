import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

const TestScoresScreen = ({ navigation }: any) => {
  const { setStepData } = useLeadStore();

  // Local state for scores
  const [scores, setScores] = useState({
    gre: '',
    ielts: '',
    toefl: '',
    sat: '',
    pte: '',
    act: '',
    duolingo: ''
  });

  const handleNext = () => {
    // Save scores to global state
    setStepData({ testScores: scores });
    // Proceed to Step 15-20 (Student Background)
    navigation.navigate('StudentDetails');
  };

  const ScoreInput = ({ label, placeholder, value, keyName, range }: any) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.scoreInput}
        placeholder={placeholder}
        keyboardType="decimal-pad"
        value={value}
        onChangeText={(text) => setScores({ ...scores, [keyName]: text })}
      />
      <Text style={styles.rangeText}>{range}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Academic Excellence</Text>
          <Text style={styles.subtitle}>
            Provide your standardized test scores to strengthen your loan application profile.
          </Text>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="stats-chart-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Test Scores</Text>
            </View>

            <View style={styles.grid}>
              <ScoreInput label="GRE" placeholder="0 - 340" value={scores.gre} keyName="gre" range="Target: 300+" />
              <ScoreInput label="IELTS" placeholder="0.0 - 9.0" value={scores.ielts} keyName="ielts" range="Target: 6.5+" />
              <ScoreInput label="TOEFL" placeholder="0 - 120" value={scores.toefl} keyName="toefl" range="Target: 90+" />
              <ScoreInput label="SAT" placeholder="400 - 1600" value={scores.sat} keyName="sat" range="Target: 1200+" />
              <ScoreInput label="PTE" placeholder="10 - 90" value={scores.pte} keyName="pte" range="Target: 60+" />
              <ScoreInput label="ACT" placeholder="1 - 36" value={scores.act} keyName="act" range="Target: 25+" />
            </View>
            
            <View style={{ marginTop: 10 }}>
                <ScoreInput label="Duolingo Score" placeholder="10 - 160" value={scores.duolingo} keyName="duolingo" range="Target: 110+" />
            </View>
          </View>

          <View style={styles.infoBox}>
             <Ionicons name="information-circle-outline" size={20} color="#0052CC" />
             <Text style={styles.infoText}>
                High scores in these tests can lead to lower interest rates from banks.
             </Text>
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Next: Student Details</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 8, marginBottom: 25, lineHeight: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 16, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginLeft: 10, color: Colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  inputWrapper: { width: '48%', marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  scoreInput: { height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, fontSize: 16, backgroundColor: '#FAFAFA' },
  rangeText: { fontSize: 11, color: '#999', marginTop: 4 },
  infoBox: { flexDirection: 'row', backgroundColor: '#EBF3FF', padding: 15, borderRadius: 10, marginTop: 25, alignItems: 'center' },
  infoText: { flex: 1, color: '#0052CC', fontSize: 13, marginLeft: 10 },
  nextBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 10 }
});

export default TestScoresScreen;