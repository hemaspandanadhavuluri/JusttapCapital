import React from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ScrollView, StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const LandingScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: insets.bottom + 20 } // Protects bottom links on Android nav-bar overlays
        ]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Brand Header */}
        <View style={styles.header}>
           <Image 
             source={require('../../assets/logo.jpeg')} 
             style={styles.logoSmall} 
             resizeMode="contain" 
           />
           <TouchableOpacity onPress={() => navigation.navigate('Support')}>
              <Ionicons name="help-circle-outline" size={26} color={Colors.primary || '#4B2C85'} />
           </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Global Academic Success</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Welcome to{"\n"}
            <Text style={{color: Colors.secondary || '#FF8A00'}}>JusttapCapital</Text>{"\n"}
            Education Loans
          </Text>
          
          <Text style={styles.heroSub}>
            Empower your academic journey with a fast, reliable way to fund your education abroad.
          </Text>
          
          <View style={styles.quoteBar}>
            <Text style={styles.quoteText}>
              Manage your entire application and document vault in one secure, unified dashboard.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity 
            style={[styles.btn, styles.signupBtn]} 
            onPress={() => navigation.navigate('Signup')}
          >
            {/* Capitalized label for clean UI design */}
            <Text style={styles.btnTextWhite}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.btn, styles.registerBtn]}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.btnTextPurple}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={18} color="#006D32" />
            <Text style={styles.trustText}>Secure Funding</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="speedometer" size={18} color="#006D32" />
            <Text style={styles.trustText}>Fast Approval</Text>
          </View>
        </View>

        {/* Footer Links - MATCHED TO APPNAVIGATOR DEAFULTS */}
        <View style={styles.footer}>
          <View style={styles.footerLinksRow}>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Support')}>
              <Text style={styles.footerLink}>Support</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.copyright}>© 2024 JusttapCapital Education Loans</Text>
        </View>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white || '#FFF' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: 60,
    marginBottom: 10
  },
  logoSmall: { width: 120, height: 40 },
  heroSection: { marginTop: 20 },
  badge: { 
    backgroundColor: Colors.accentGreen || '#D1FAE5', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    alignSelf: 'flex-start', 
    marginBottom: 15 
  },
  badgeText: { color: '#065F46', fontSize: 12, fontWeight: '700' },
  heroTitle: { 
    fontSize: 34, 
    fontWeight: '900', 
    color: '#4B2C85', 
    lineHeight: 42,
    letterSpacing: -0.5
  },
  heroSub: { 
    fontSize: 16, 
    color: '#4B2C85', 
    marginTop: 20, 
    lineHeight: 26,
    fontWeight: '400'
  },
  quoteBar: { 
    borderLeftWidth: 4, 
    borderLeftColor: Colors.primary || '#4B2C85', 
    paddingLeft: 16, 
    marginVertical: 30 
  },
  quoteText: { fontSize: 15, color: '#64748B', fontStyle: 'italic', lineHeight: 22 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { 
    width: '48%', 
    height: 56, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupBtn: { backgroundColor: Colors.secondary || '#FF8A00' },
  registerBtn: { 
    backgroundColor: Colors.primary || '#4B2C85', 
    borderWidth: 1.5, 
    borderColor: Colors.primary || '#4B2C85' 
  },
  btnTextWhite: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  btnTextPurple: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  trustRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 30,
    marginVertical: 40 
  },
  trustItem: { flexDirection: 'row', alignItems: 'center' },
  trustText: { fontSize: 14, color: '#475569', fontWeight: '600', marginLeft: 8 },
  footer: { 
    marginTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    paddingTop: 30,
    alignItems: 'center'
  },
  footerLinksRow: { flexDirection: 'row', gap: 20, marginBottom: 15 },
  footerLink: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  copyright: { fontSize: 11, color: '#94A3B8' }
});

export default LandingScreen;