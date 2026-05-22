import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

const IdentityScreen = ({ navigation }: any) => {
  const { setStepData } = useLeadStore();
  const [panNumber, setPanNumber] = useState('');
  const [notApplied, setNotApplied] = useState(false);

  const handleSubmit = () => {
    setStepData({ panDetails: { number: panNumber, notApplied } });
    navigation.navigate('Profile'); // Moving to the Profile/Document Vault
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>Verify your tax identification details to proceed with the loan disbursement.</Text>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="card-outline" size={30} color={Colors.primary} />
          </View>
          
          <Text style={styles.label}>PAN Number</Text>
          <TextInput 
            style={[styles.input, notApplied && styles.disabledInput]} 
            placeholder="ABCDE1234F" 
            autoCapitalize="characters"
            maxLength={10}
            value={panNumber}
            editable={!notApplied}
            onChangeText={setPanNumber}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>I haven't applied for a PAN card yet</Text>
            <Switch 
              value={notApplied} 
              onValueChange={(val) => {
                setNotApplied(val);
                if(val) setPanNumber('');
              }}
              trackColor={{ false: '#DDD', true: Colors.secondary }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Complete Profile</Text>
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  subtitle: { fontSize: 14, color: '#666', marginTop: 8, marginBottom: 30 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, elevation: 3 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F0EBFF', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10 },
  input: { height: 55, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, fontSize: 18, fontWeight: '600', letterSpacing: 2 },
  disabledInput: { backgroundColor: '#F5F5F5', color: '#AAA' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  switchLabel: { fontSize: 13, color: '#666', flex: 1, marginRight: 10 },
  submitBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 10 }
});

export default IdentityScreen;