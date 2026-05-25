import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
import { useApplicationStore } from '../store/useApplicationStore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../config/apiConfig';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const details = useApplicationStore((state: any) => state.basicDetails || {});
  const academics = useApplicationStore((state: any) => state.academicHistory || {});
  const officerInfo = useApplicationStore((state: any) => state.serverData || {});

  const assignedFO = officerInfo.assignedFO;
  const assignedFOPhone = officerInfo.assignedFOPhone;
  const assignedFOProfilePic = officerInfo.assignedFOProfilePic;

  const locationString = (details.city && details.stateRegion) 
    ? `${details.city}, ${details.stateRegion}` 
    : (details.city || details.stateRegion || 'Location not provided');

  const handleCallFO = () => {
    if (!assignedFOPhone) {
      Alert.alert("Not Available", "The Field Officer's phone number is not yet updated.");
      return;
    }
    Linking.openURL(`tel:${assignedFOPhone}`);
  };

  const handleWhatsAppFO = () => {
    if (!assignedFOPhone) return;
    const cleanPhone = assignedFOPhone.replace(/\D/g, '');
    const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `whatsapp://send?phone=${waNumber}&text=Hi ${assignedFO}, I have a query regarding my JusttapCapital application.`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else Alert.alert("Error", "WhatsApp is not installed.");
    });
  };

  const getAvatarSource = (picPath?: string) => {
    if (!picPath) return null;
    const normalized = picPath.replace(/\\/g, '/');
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return { uri: `${baseUrl}${normalized.startsWith('/') ? '' : '/'}${normalized}` };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 20, alignItems: 'center', paddingBottom: 40 }}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#4B2C85" />
        </View>
        <Text style={styles.name}>{details.fullName}</Text>
        <Text style={styles.email}>{details.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Feather name="phone" size={18} color="#4B2C85" />
          <Text style={styles.infoText}>{details.phones?.[0] || 'No phone'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Feather name="map-pin" size={18} color="#4B2C85" />
          <Text style={styles.infoText}>{locationString}</Text>
        </View>
        <View style={styles.infoCard}>
          <Feather name="credit-card" size={18} color="#4B2C85" />
          <Text style={styles.infoText}>PAN: {academics.panNumber || 'Not Provided'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Feather name="globe" size={18} color="#4B2C85" />
          <Text style={styles.infoText}>Destination: {details.studyDestination}</Text>
        </View>
      </View>

      {assignedFO && (
        <View style={styles.foSection}>
          <Text style={styles.foSectionTitle}>YOUR ASSIGNED OFFICER</Text>
          <View style={styles.foCard}>
            <View style={styles.foHeader}>
              <View style={[styles.foAvatar, { backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]}>
                <Ionicons name="person" size={30} color="#4B2C85" />
              </View>
              <View style={styles.foNameBlock}>
                <Text style={styles.foName}>{assignedFO}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>DEDICATED OFFICER</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.foActionRow}>
              <TouchableOpacity style={styles.callBtn} onPress={handleCallFO}>
                <Ionicons name="call" size={18} color="#FFF" />
                <Text style={styles.btnText}>Call Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.msgBtn} onPress={handleWhatsAppFO}>
                <Ionicons name="logo-whatsapp" size={18} color="#4B2C85" />
                <Text style={styles.msgBtnText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#4B2C85' },
  name: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  email: { fontSize: 14, color: '#64748B' },
  infoSection: { width: '100%', paddingHorizontal: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 12 },
  infoText: { marginLeft: 12, fontSize: 15, color: '#334155', fontWeight: '600' },
  foSection: { width: '100%', paddingHorizontal: 20, marginTop: 24 },
  foSectionTitle: { fontSize: 12, fontWeight: '800', color: '#64748B', marginBottom: 12, letterSpacing: 0.5 },
  foCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  foHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  foAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#CBD5E1' },
  foNameBlock: { marginLeft: 16, flex: 1 },
  foName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  badge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 },
  badgeText: { color: '#065F46', fontSize: 10, fontWeight: '800' },
  foActionRow: { flexDirection: 'row', gap: 12 },
  callBtn: { flex: 1, backgroundColor: '#4B2C85', height: 48, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  msgBtn: { flex: 1, backgroundColor: '#FFF', height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: '#4B2C85', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  msgBtnText: { color: '#4B2C85', fontSize: 14, fontWeight: '700' }
});