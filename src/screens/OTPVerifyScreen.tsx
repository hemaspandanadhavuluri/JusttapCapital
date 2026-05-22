import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { Colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const OTPVerifyScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets(); 
  
  // States for OTP strings
  const [emailOtp, setEmailOtp] = useState(['', '', '', '']);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '']);

  // Refs to control focus programmatically
  const emailRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];
  const phoneRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  // Handles auto-forward jumping
  const handleOtpChange = (
    text: string, 
    index: number, 
    type: 'email' | 'phone'
  ) => {
    const currentOtp = type === 'email' ? [...emailOtp] : [...phoneOtp];
    const currentRefs = type === 'email' ? emailRefs : phoneRefs;
    const setOtp = type === 'email' ? setEmailOtp : setPhoneOtp;

    // Take only the last character entered (prevents multi-character bugs)
    const cleanText = text.slice(-1);
    currentOtp[index] = cleanText;
    setOtp(currentOtp);

    // If user typed a number, move to the next box immediately
    if (cleanText && index < 3) {
      currentRefs[index + 1].current?.focus();
    }
  };

  // Handles backward jumping when pressing Backspace on an empty box
  const handleKeyPress = (
    e: any, 
    index: number, 
    type: 'email' | 'phone'
  ) => {
    const currentOtp = type === 'email' ? emailOtp : phoneOtp;
    const currentRefs = type === 'email' ? emailRefs : phoneRefs;

    if (e.nativeEvent.key === 'Backspace' && !currentOtp[index] && index > 0) {
      currentRefs[index - 1].current?.focus();
    }
  };

  const handleVerification = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
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
              <TouchableOpacity><Text style={styles.resendText}>Resend</Text></TouchableOpacity>
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
                />
              ))}
            </View>

            {/* ACTION BUTTON */}
            <TouchableOpacity 
              style={[styles.button, { marginBottom: 20 }]} 
              onPress={handleVerification}
            >
              <Text style={styles.buttonText}>Verify & Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
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

          {/* Spacer to protect from hardware keys overlap */}
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
    width: '22%', 
    height: 55, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    textAlign: 'center', 
    fontSize: 22, 
    fontWeight: '700', 
    backgroundColor: '#F8FAFC',
    color: '#1A1A1A'
  },
  otpInputActive: {
    borderColor: '#FF8A00', // Highlights orange when filled out matching UI mockup
    backgroundColor: '#FFF'
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  button: { 
    backgroundColor: '#FF8A00', // Styled orange matching your confirmation screen
    height: 58, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10 
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