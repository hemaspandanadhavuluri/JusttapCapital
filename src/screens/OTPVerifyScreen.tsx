import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Ensure this is installed
import { Colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const OTPVerifyScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets(); // Get bottom notch/nav bar height
  const [emailOtp, setEmailOtp] = useState(['', '', '', '']);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '']);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: insets.bottom + 40 } // Adds extra space at the very bottom
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header & Progress (Keeping your existing logic) */}
          <View style={styles.header}>
            <Text style={styles.title}>Verification</Text>
          </View>

          {/* Verification Card */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Email Verification</Text>
            <View style={styles.otpContainer}>
              {emailOtp.map((digit, index) => (
                <TextInput key={index} style={styles.otpInput} keyboardType="number-pad" maxLength={1} />
              ))}
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>Mobile Verification</Text>
            <View style={styles.otpContainer}>
              {phoneOtp.map((digit, index) => (
                <TextInput key={index} style={styles.otpInput} keyboardType="number-pad" maxLength={1} />
              ))}
            </View>

            {/* ACTION BUTTON - Fixed Position */}
            <TouchableOpacity 
              style={[styles.button, { marginBottom: 20 }]} 
              onPress={() => navigation.navigate('BasicDetails')}
            >
              <Text style={styles.buttonText}>Verify & Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>

            {/* Footer Badges inside the card to keep them away from Nav Bar */}
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

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginVertical: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 24, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 15 },
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
    backgroundColor: '#F8FAFC' 
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  button: { 
    backgroundColor: Colors.secondary, 
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