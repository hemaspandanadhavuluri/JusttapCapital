import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Imported safe area hook
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

// Mock Data for Cities/States (In production, fetch these from an API)
const INDIAN_STATES = [
  { label: 'Andhra Pradesh', value: 'AP' },
  { label: 'Telangana', value: 'TS' },
  { label: 'Karnataka', value: 'KA' },
  { label: 'Maharashtra', value: 'MH' },
];

const BasicDetailsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets(); // Initialize safe area insets
  const { stepData, setStepData } = useLeadStore();

  // Local State
  const [extraPhones, setExtraPhones] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [studyLocation, setStudyLocation] = useState<string | null>(null);

  const addPhoneField = () => {
    setExtraPhones([...extraPhones, '']);
  };

  const handleStudyLocation = (type: 'India' | 'Abroad') => {
    setStudyLocation(type);
    if (type === 'India') {
      Alert.alert(
        "Service Notice",
        "JusttapCapital currently only processes education loans for students studying abroad. Applications for domestic institutions are not supported at this time.",
        "Understood"
      );
    }
  };

  const handleNext = () => {
    if (!selectedState || !studyLocation) {
      Alert.alert("Missing Info", "Please fill in your location and study preference.");
      return;
    }
    
    // Save to global store
    setStepData({
      location: { state: selectedState, city: selectedCity },
      additionalPhones: extraPhones,
      studyPreference: studyLocation
    });

    navigation.navigate('FurtherEducation');
  };

  return (
    // Replaced SafeAreaView to let parent layout handle screen transitions correctly
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        // Injected the bottom safe area offset directly into the container cushion 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 95 } // 95px completely protects your next action button from your tab bar
        ]}
      >
        
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>We need a few basic details to check your loan eligibility.</Text>

        <View style={styles.card}>
          {/* Static Name & Email (Read-only from Step 1) */}
          <Text style={styles.label}>Full Name (as per Passport)</Text>
          <TextInput style={styles.disabledInput} value={stepData?.fullName} editable={false} />

          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.disabledInput} value={stepData?.email} editable={false} />

          {/* Primary Phone */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.disabledInput} value={stepData?.phone} editable={false} />

          {/* Additional Phones */}
          {extraPhones.map((phone, index) => (
            <View key={index} style={styles.inputContainer}>
               <TextInput 
                  style={styles.input} 
                  placeholder="Additional Phone Number" 
                  keyboardType="phone-pad"
                  onChangeText={(text) => {
                    let newPhones = [...extraPhones];
                    newPhones[index] = text;
                    setExtraPhones(newPhones);
                  }}
               />
            </View>
          ))}

          <TouchableOpacity style={styles.addPhoneBtn} onPress={addPhoneField}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.addPhoneText}>Add another phone number</Text>
          </TouchableOpacity>

          {/* Location Selection */}
          <Text style={styles.label}>Current Location (India)</Text>
          <Dropdown
            style={styles.dropdown}
            data={INDIAN_STATES}
            labelField="label"
            valueField="value"
            placeholder="Select State"
            value={selectedState}
            onChange={item => setSelectedState(item.value)}
          />

          <Dropdown
            style={[styles.dropdown, { marginTop: 15 }]}
            data={[{ label: 'Mumbai', value: 'mumbai' }, { label: 'Hyderabad', value: 'hyd' }]}
            labelField="label"
            valueField="value"
            placeholder="Select City"
            value={selectedCity}
            onChange={item => setSelectedCity(item.value)}
          />

          {/* Study Preference Selection */}
          <Text style={styles.label}>Where are you planning to study?</Text>
          <View style={styles.choiceRow}>
            <TouchableOpacity 
              style={[styles.choiceBox, studyLocation === 'India' && styles.choiceActive]} 
              onPress={() => handleStudyLocation('India')}
            >
              <Ionicons name="school-outline" size={30} color={studyLocation === 'India' ? '#FFF' : Colors.primary} />
              <Text style={[styles.choiceText, studyLocation === 'India' && styles.textWhite]}>India</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.choiceBox, studyLocation === 'Abroad' && styles.choiceActive]} 
              onPress={() => handleStudyLocation('Abroad')}
            >
              <Ionicons name="earth-outline" size={30} color={studyLocation === 'Abroad' ? '#FFF' : Colors.primary} />
              <Text style={[styles.choiceText, studyLocation === 'Abroad' && styles.textWhite]}>Abroad</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next: Education Details</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 15, color: '#666', marginTop: 8, marginBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, shadowOpacity: 0.05 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 20, marginBottom: 8 },
  disabledInput: { backgroundColor: '#F2F2F2', height: 50, borderRadius: 8, paddingHorizontal: 15, color: '#999', borderWidth: 1, borderColor: '#E0E0E0' },
  inputContainer: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, height: 50, paddingHorizontal: 15, marginTop: 10, justifyContent: 'center' },
  input: { fontSize: 16 },
  addPhoneBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  addPhoneText: { color: Colors.primary, marginLeft: 8, fontWeight: '600' },
  dropdown: { height: 50, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15 },
  choiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  choiceBox: { width: '48%', height: 100, borderWidth: 1, borderColor: Colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  choiceActive: { backgroundColor: Colors.primary },
  choiceText: { marginTop: 8, fontWeight: '700', color: Colors.primary },
  textWhite: { color: '#FFF' },
  nextBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 10 }
});

export default BasicDetailsScreen;