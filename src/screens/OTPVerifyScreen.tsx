import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { Colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useApplicationStore } from '../store/useApplicationStore';
import { useLeadStore } from '../store/useLeadStore';
import { ENDPOINTS } from '../config/apiConfig';

const OTPVerifyScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets(); 
  
  // Processing States
  const [loading, setLoading] = useState(false);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const leadEmail = useLeadStore((state) => state.stepData?.email);
  const leadPhone = useLeadStore((state) => state.stepData?.phone);

  // Refs to control focus programmatically
  const emailRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];
  const phoneRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  // Handles auto-forward jumping
  const handleOtpChange = (text: string, index: number, type: 'email' | 'phone') => {
    const currentOtp = type === 'email' ? [...emailOtp] : [...phoneOtp];
    const currentRefs = type === 'email' ? emailRefs : phoneRefs;
    const setOtp = type === 'email' ? setEmailOtp : setPhoneOtp;

    const cleanText = text.slice(-1);
    currentOtp[index] = cleanText;
    setOtp(currentOtp);

    if (cleanText && index < 5) {
      currentRefs[index + 1].current?.focus();
    }
  };

  // Handles backward jumping when pressing Backspace on an empty box
  const handleKeyPress = (e: any, index: number, type: 'email' | 'phone') => {
    const currentOtp = type === 'email' ? emailOtp : phoneOtp;
    const currentRefs = type === 'email' ? emailRefs : phoneRefs;

    if (e.nativeEvent.key === 'Backspace' && !currentOtp[index] && index > 0) {
      currentRefs[index - 1].current?.focus();
    }
  };

  const handleResendEmailOtp = async () => {
    if (!leadEmail) return;
    
    try {
      await fetch(ENDPOINTS.RESEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: leadEmail })
      });
      Alert.alert("Code Sent", "A new verification code has been sent to your email.");
    } catch (e) {
      Alert.alert("Error", "Failed to resend code. Please check your internet connection.");
    }
  };

  /**
   * OPTIMIZED ROUTING GUARD PIPELINE VERIFICATION HANDLER
   */
  const handleVerification = async () => {
    const targetPhoneOtp = phoneOtp.join('');
    const targetEmailOtp = emailOtp.join('');

    if (targetPhoneOtp.length < 6 || targetEmailOtp.length < 6) {
      Alert.alert("Incomplete Entries", "Please completely populate all validation boxes before proceeding.");
      return;
    }

    const verifiedPhoneString = leadPhone || "+919999999999"; 

    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail?.toLowerCase().trim(),
          otp: targetEmailOtp // Using Email OTP for verification
        })
      });
      
      const data = await response.json();

      if (response.ok && data.leadID) {
        useApplicationStore.getState().hydrateFromBackend(data.fullProfile);
        
        navigation.replace('MainTabs');
      } else {
        Alert.alert("Verification Failed", data.error || "The code you entered is incorrect.");
      }
    } catch (error: any) {
      console.log("Routing Guard Interaction Interruption caught safely:", error.message);
      
      // READ EXISTING CLIENT STEP PERSISTENCE DATA
      const localSavedStep = useApplicationStore.getState().currentStep;

      // Safe Network Interruption Handler
      Alert.alert(
        "Network Interruption",
        `Could not connect to authentication servers. Proceeding using local progress state (Step ${localSavedStep}).`,
        [
          { text: "Retry Connection", style: "cancel", onPress: () => setLoading(false) },
          { 
            text: "Continue Offline", 
            onPress: () => {
              // FIX: Wiped out "resetStore()". We preserve all cached inputs and jump right in!
              if (!useApplicationStore.getState().basicDetails?.phones) {
                useApplicationStore.getState().updateStepData('basicDetails', { phones: [verifiedPhoneString] });
              }
              navigation.replace('MainTabs');
            } 
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Verification</Text>
          </View>

          <View style={styles.card}>
            {/* Email OTP Section */}
            <View style={styles.labelRow}>
              <Text style={styles.sectionLabel}>Email Verification</Text>
              <TouchableOpacity onPress={handleResendEmailOtp}>
                <Text style={styles.resendText}>Resend</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.otpContainer}>
              {emailOtp.map((digit, index) => (
                <TextInput 
                  key={`email-${index}`} 
                  ref={emailRefs[index]}
                  style={[styles.otpInput, digit ? styles.otpInputActive : null]} 
                  keyboardType="number-pad" 
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index, 'email')}
                  onKeyPress={(e) => handleKeyPress(e, index, 'email')}
                  selectTextOnFocus
                  editable={!loading}
                />
              ))}
            </View>

            <View style={styles.divider} />

            {/* Mobile OTP Section */}
            <View style={styles.labelRow}>
              <Text style={styles.sectionLabel}>Mobile Verification</Text>
              <TouchableOpacity><Text style={styles.resendText}>Resend</Text></TouchableOpacity>
            </View>
            
            <View style={styles.otpContainer}>
              {phoneOtp.map((digit, index) => (
                <TextInput 
                  key={`phone-${index}`} 
                  ref={phoneRefs[index]}
                  style={[styles.otpInput, digit ? styles.otpInputActive : null]} 
                  keyboardType="number-pad" 
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index, 'phone')}
                  onKeyPress={(e) => handleKeyPress(e, index, 'phone')}
                  selectTextOnFocus
                  editable={!loading}
                />
              ))}
            </View>

            {/* ACTION BUTTON WITH CONDITIONAL LOADING ANIMATION */}
            <TouchableOpacity 
              style={[styles.button, { marginBottom: 20 }, loading && styles.buttonDisabled]} 
              onPress={handleVerification}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Verify & Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Footer Badges */}
            <View style={styles.trustFooter}>
               <View style={styles.trustItem}>
                 <Ionicons name="lock-closed-outline" size={14} color="#666" />
                 <Text style={styles.trustText}>SECURE SSL</Text>
               </View>
               <View style={styles.trustItem}>
                 <Ionicons name="shield-outline" size={14} color="#666" />
                 <Text style={styles.trustText}>DATA PRIVACY</Text>
               </View>
            </View>
          </View>

          <View style={{ height: Math.max(insets.bottom, 16) + 30 }} />

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background || '#F8FAFC' },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginVertical: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary || '#4B2C85' },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 24, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  resendText: { color: '#FF8A00', fontWeight: '700', fontSize: 14 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpInput: { 
    width: '14%', 
    height: 50, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    textAlign: 'center', 
    fontSize: 20, 
    fontWeight: '700', 
    backgroundColor: '#F8FAFC',
    color: '#1A1A1A'
  },
  otpInputActive: {
    borderColor: '#FF8A00', 
    backgroundColor: '#FFF'
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  button: { 
    backgroundColor: '#FF8A00', 
    height: 58, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonDisabled: {
    backgroundColor: '#CBD5E1'
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 10 },
  trustFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  trustItem: { alignItems: 'center' },
  trustText: { fontSize: 10, color: '#94A3B8', fontWeight: '700', marginTop: 4 }
});

export default OTPVerifyScreen;