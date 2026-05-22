import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Linking, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

const ProfileScreen = () => {
  const { stepData } = useLeadStore();
  
  // Mock FO data (In reality, this comes from stepData.assignedFO after Step 13)
  const fo = stepData.assignedFO || { name: 'Vikram Singh', phone: '+919876543210', role: 'Specialist: Overseas Education' };

  const docs = [
    { id: 'aadhar', label: 'Aadhar Card', sub: 'Front and back copy', status: 'UPLOADED' },
    { id: 'pan', label: 'PAN Card', sub: 'Self-attested copy', status: 'UPLOADED' },
    { id: 'photo', label: 'Passport Photo', sub: 'White background', status: 'REQUIRED' },
    { id: 'marks', label: '10th/12th/UG Marks', sub: 'All semesters required', status: 'REQUIRED' },
    { id: 'admission', label: 'Admission Letter', sub: 'Official university offer', status: 'ACTION NEEDED' },
  ];

  const uploadFile = async (docId: string) => {
    const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!res.canceled) {
      console.log(`Uploading ${docId}:`, res.assets[0].uri);
      // Trigger your PATCH API call here to update the lead with the file
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* User Header */}
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
             <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.avatar} />
             <View style={styles.verifyBadge}><Ionicons name="checkmark" size={12} color="#FFF" /></View>
          </View>
          <Text style={styles.userName}>{stepData.fullName || 'Arjun Malhotra'}</Text>
          <Text style={styles.userSub}>{stepData.location?.city || 'Mumbai'}, India</Text>
        </View>

        {/* Assigned FO Card */}
        <View style={styles.foCard}>
          <View style={styles.foInfo}>
            <View>
              <Text style={styles.foLabel}>ASSIGNED FIELD OFFICER</Text>
              <Text style={styles.foName}>{fo.name}</Text>
              <Text style={styles.foRole}>{fo.role}</Text>
            </View>
            <View style={styles.foIcon}><Ionicons name="headset" size={24} color="#FFF" /></View>
          </View>
          <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${fo.phone}`)}>
            <Ionicons name="call" size={20} color="#FFF" />
            <Text style={styles.callBtnText}>Call Field Officer</Text>
          </TouchableOpacity>
        </View>

        {/* Document Vault */}
        <View style={styles.vaultHeader}>
          <Text style={styles.vaultTitle}>Document Vault</Text>
          <Text style={styles.vaultSub}>Complete your profile to speed up disbursement</Text>
        </View>

        {docs.map((doc) => (
          <View key={doc.id} style={styles.docRow}>
            <View style={styles.docIcon}><Ionicons name="document-text-outline" size={24} color={Colors.primary} /></View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.docLabel}>{doc.label}</Text>
              <Text style={styles.docSub}>{doc.sub}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, doc.status === 'UPLOADED' && styles.uploadedBtn]} 
              onPress={() => uploadFile(doc.id)}
            >
              <Text style={[styles.uploadText, doc.status === 'UPLOADED' && styles.uploadedText]}>
                {doc.status === 'UPLOADED' ? 'View File' : 'Upload'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  userHeader: { alignItems: 'center', padding: 30, backgroundColor: '#FFF' },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  verifyBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#4B2C85', padding: 4, borderRadius: 12, borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: 22, fontWeight: '800', marginTop: 15, color: '#1A1A1A' },
  userSub: { fontSize: 14, color: '#666' },
  foCard: { margin: 20, backgroundColor: '#1A2B4C', borderRadius: 15, padding: 20 },
  foLabel: { color: '#8A99B3', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  foName: { color: '#FFF', fontSize: 18, fontWeight: '700', marginTop: 4 },
  foRole: { color: '#8A99B3', fontSize: 13, marginTop: 2 },
  foInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foIcon: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#334466', justifyContent: 'center', alignItems: 'center' },
  callBtn: { backgroundColor: '#4B2C85', height: 45, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  callBtnText: { color: '#FFF', fontWeight: '700', marginLeft: 10 },
  vaultHeader: { paddingHorizontal: 20, marginTop: 10 },
  vaultTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  vaultSub: { fontSize: 13, color: '#666', marginTop: 4 },
  docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 15, padding: 15, borderRadius: 12, elevation: 1 },
  docIcon: { width: 45, height: 45, borderRadius: 8, backgroundColor: '#F0EBFF', justifyContent: 'center', alignItems: 'center' },
  docLabel: { fontSize: 14, fontWeight: '700', color: '#333' },
  docSub: { fontSize: 12, color: '#999', marginTop: 2 },
  uploadBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6, backgroundColor: '#1A2B4C' },
  uploadText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  uploadedBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#DDD' },
  uploadedText: { color: '#4B2C85' }
});

export default ProfileScreen;