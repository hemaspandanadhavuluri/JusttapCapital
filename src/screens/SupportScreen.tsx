import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const SupportScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding: 20}}>
      <Text style={styles.title}>How can we help?</Text>
      <Text style={styles.subtitle}>Our support team is dedicated to helping you achieve your academic dreams.</Text>

      <View style={styles.card}>
        <View style={styles.iconCircle}><Ionicons name="call" size={24} color="#FFF" /></View>
        <Text style={styles.cardTitle}>Call Us</Text>
        <Text style={styles.cardSub}>Mon-Fri, 9am-6pm</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL('tel:1800JUSTTAP')}>
          <Text style={styles.btnText}>1-800-JUSTTAP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={[styles.iconCircle, {backgroundColor: '#4ADE80'}]}><Ionicons name="chatbubbles" size={24} color="#FFF" /></View>
        <Text style={styles.cardTitle}>Start Chat</Text>
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#057A55'}]}>
          <Text style={styles.btnText}>Chat Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={[styles.iconCircle, {backgroundColor: '#BFDBFE'}]}><Ionicons name="mail" size={24} color={Colors.primary} /></View>
        <Text style={styles.cardTitle}>Email Us</Text>
        <TouchableOpacity style={styles.emailBox} onPress={() => Linking.openURL('mailto:support@justtap.com')}>
           <Text style={styles.emailText}>justtapcapitals@justtap.com</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#666', marginTop: 10, marginBottom: 30 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 25, alignItems: 'center', marginBottom: 20, elevation: 2 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  cardSub: { fontSize: 13, color: '#666', marginBottom: 15 },
  actionBtn: { backgroundColor: Colors.primary, width: '100%', height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
  emailBox: { borderWidth: 1, borderColor: '#DDD',backgroundColor: Colors.secondary,width: '100%', height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  emailText: { color: Colors.white, fontWeight: '600' }
});

export default SupportScreen;