import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }: any) => {
  const setStepData = useLeadStore((state) => state.setStepData);
  
  // Local state for inputs
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const handleSendOTP = () => {
    // 1. Validate inputs
    if (!form.fullName || !form.email || !form.phone) {
      alert("Please fill all fields");
      return;
    }
    
    // 2. Save to Global Store
    setStepData(form);
    
    // 3. Navigate to Verify (or show OTP fields)
    // For this flow, we will navigate to a verification screen 
    // or toggle visibility as seen in your first screenshot.
    console.log("Sending OTP to:", form.phone);
    navigation.navigate('OTPVerify'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandText}>JusttapCapital</Text>
            <Text style={styles.subText}>Start your academic journey with a reliable education financing partner.</Text>
          </View>

          {/* Progress Indicator (Step 1 of 2) */}
          <View style={styles.progressContainer}>
             <View style={[styles.stepCircle, styles.activeStep]}>
               <Text style={styles.stepTextActive}>1</Text>
             </View>
             <View style={styles.progressLine} />
             <View style={styles.stepCircle}>
               <Text style={styles.stepTextInactive}>2</Text>
             </View>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your full legal name"
                onChangeText={(val) => setForm({...form, fullName: val})}
              />
            </View>

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" />
              <TextInput 
                style={styles.input} 
                placeholder="example@university.com"
                keyboardType="email-address"
                onChangeText={(val) => setForm({...form, email: val})}
              />
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#999" />
              <TextInput 
                style={styles.input} 
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                onChangeText={(val) => setForm({...form, phone: val})}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
              <Text style={styles.buttonText}>Send OTP</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginVertical: 30 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  brandText: { fontSize: 32, fontWeight: '800', color: '#4B2C85', marginTop: 5 },
  subText: { textAlign: 'center', color: '#666', marginTop: 10, lineHeight: 20 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  stepCircle: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  activeStep: { backgroundColor: Colors.primary },
  progressLine: { width: 100, height: 2, backgroundColor: '#E0E0E0' },
  stepTextActive: { color: '#FFF', fontWeight: 'bold' },
  stepTextInactive: { color: '#999' },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 12, height: 50 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  button: { backgroundColor: Colors.primary, height: 55, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 10 }
});

export default SignupScreen;