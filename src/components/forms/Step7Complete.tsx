import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const Step7Complete = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🎉</Text>
      <Text style={styles.title}>Data Evaluation Pending</Text>
      <Text style={styles.subtitle}>Your loan application profiling is 100% complete. Justtap Capital is currently computing optimal bank rates for your profile.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#4B2C85', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 10, lineHeight: 22 }
});