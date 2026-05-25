import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useApplicationStore } from '../store/useApplicationStore';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const details = useApplicationStore((state: any) => state.basicDetails || {});
  const academics = useApplicationStore((state: any) => state.academicHistory || {});

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{details.fullName?.charAt(0)}</Text>
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
          <Text style={styles.infoText}>{details.city}, {details.stateRegion}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', alignItems: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#4B2C85' },
  name: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  email: { fontSize: 14, color: '#64748B' },
  infoSection: { width: '100%', paddingHorizontal: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 12 },
  infoText: { marginLeft: 12, fontSize: 15, color: '#334155', fontWeight: '600' }
});