import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Dynamic safe space inset engine
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';
import { Ionicons } from '@expo/vector-icons';
import { useApplicationStore } from '../store/useApplicationStore';
import axios from 'axios';
import { ENDPOINTS } from '../config/apiConfig';

const SignupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets(); // Grabs exact system notch/status-bar height dynamically
  const setStepData = useLeadStore((state) => state.setStepData);
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const handleSendOTP = async () => {
    if (loading) return;

    if (!form.fullName || !form.email || !form.phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Trimming and lowercasing email to ensure consistency with OTP lookup
      const payload = {
        ...form,
        email: form.email.toLowerCase().trim()
      };

      const response = await axios.post(ENDPOINTS.REGISTER, payload);
      
      if (!response.data.exists) {
        useApplicationStore.getState().updateStepData('basicDetails', { 
          fullName: form.fullName,
          email: form.email,
          phones: [form.phone]
        });
      }
      useApplicationStore.getState().setStepPointer(response.data.currentStep || 1);

      setStepData(form);
      navigation.navigate('OTPVerify'); 
    } catch (error) {
      setLoading(false);
      console.error("Registration sync failed:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message;
      Alert.alert("Registration Failed", errorMessage);
    }
  };

  return (
    // FIX: Using View + dynamic safe inset padding top to completely resolve status bar overlaps
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        {/* Support Header Link Action Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.supportHeaderButton} 
            onPress={() => navigation.navigate('Support')}
          >
            <Ionicons name="help-circle-outline" size={18} color="#4B2C85" />
            <Text style={styles.supportHeaderText}>Support</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 } // Protects footer link elements from screen navigation keys
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Header Brand Context Block */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandText}>JusttapCapital</Text>
            <Text style={styles.subText}>Start your academic journey with a reliable education financing partner.</Text>
          </View>

          {/* Progress Multi-step Tracker Indicators */}
          <View style={styles.progressContainer}>
             <View style={[styles.stepCircle, styles.activeStep]}>
               <Text style={styles.stepTextActive}>1</Text>
             </View>
             <View style={styles.progressLine} />
             <View style={styles.stepCircle}>
               <Text style={styles.stepTextInactive}>2</Text>
             </View>
          </View>

          {/* Form Processing Card Module */}
          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your full legal name"
                placeholderTextColor="#94A3B8"
                onChangeText={(val) => setForm({...form, fullName: val})}
              />
            </View>

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#94A3B8" />
              <TextInput 
                style={styles.input} 
                placeholder="example@university.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(val) => setForm({...form, email: val})}
              />
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#94A3B8" />
              <TextInput 
                style={styles.input} 
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                onChangeText={(val) => setForm({...form, phone: val})}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.7 }]} 
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Send OTP</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Legal Compliance Footer Link Block */}
          <View style={styles.legalFooter}>
            <Text style={styles.legalText}>By continuing, you agree to our </Text>
            <View style={styles.legalLinksRow}>
              <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
                <Text style={styles.legalLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.legalText}> & </Text>
              <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background || '#F8FAFC' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
    zIndex: 10,
  },
  supportHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  supportHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B2C85',
    marginLeft: 4,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  header: { alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  brandText: { fontSize: 32, fontWeight: '800', color: '#4B2C85', marginTop: 2 },
  subText: { textAlign: 'center', color: '#64748B', marginTop: 8, lineHeight: 20, fontSize: 14, paddingHorizontal: 10 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  activeStep: { backgroundColor: Colors.primary || '#4B2C85' },
  progressLine: { width: 80, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 10 },
  stepTextActive: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  stepTextInactive: { color: '#94A3B8', fontWeight: 'bold', fontSize: 13 },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 24, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 12 
  },
  label: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 8, marginTop: 14 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    height: 52,
    backgroundColor: '#F8FAFC'
  },
  input: { flex: 1, marginLeft: 8, fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  button: { 
    backgroundColor: Colors.primary || '#4B2C85', 
    height: 54, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 24 
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 8 },
  legalFooter: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  legalLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  legalLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B2C85',
    textDecorationLine: 'underline',
  }
});

export default SignupScreen;