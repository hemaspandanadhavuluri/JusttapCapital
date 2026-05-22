import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, Alert, Switch 
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useLeadStore } from '../store/useLeadStore';

const ASSET_TYPES = [
  { label: 'Physical (House/Land/Commercial)', value: 'physical' },
  { label: 'Fixed Deposit (FD)', value: 'fd' },
  { label: 'LIC Policy', value: 'lic' },
  { label: 'Government Bonds', value: 'bonds' },
];

const PROPERTY_CATEGORIES = [
  { label: 'Independent House', value: 'house' },
  { label: 'Flat/Apartment', value: 'flat' },
  { label: 'Non-Agricultural Land', value: 'land' },
  { label: 'Commercial Property', value: 'commercial' },
];

const AssetsScreen = ({ navigation }: any) => {
  const { setStepData } = useLeadStore();
  const [hasAssets, setHasAssets] = useState(false);
  const [assetList, setAssetList] = useState<any[]>([]);

  const addAsset = () => {
    const newAsset = {
      id: Date.now(),
      type: '',
      category: '',
      ownerName: '',
      relationship: '',
      value: '',
      pendingLoan: '',
      pincode: '',
      authority: '',
      docsAvailable: false,
    };
    setAssetList([...assetList, newAsset]);
  };

  const updateAsset = (id: number, key: string, value: any) => {
    setAssetList(assetList.map(asset => asset.id === id ? { ...asset, [key]: value } : asset));
  };

  const removeAsset = (id: number) => {
    setAssetList(assetList.filter(asset => asset.id !== id));
  };

  const handleNext = () => {
    setStepData({ assets: hasAssets ? assetList : null });
    navigation.navigate('CoApplicants');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Assets & Collateral</Text>
        
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#0052CC" />
          <Text style={styles.infoText}>Adding collateral can lower interest rates by up to 1.5% and increase loan approval chances.</Text>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Do you have any acceptable assets?</Text>
          <Switch 
            value={hasAssets} 
            onValueChange={(val) => {
              setHasAssets(val);
              if(val && assetList.length === 0) addAsset();
            }}
            trackColor={{ false: '#D1D1D1', true: Colors.primary }}
          />
        </View>

        {hasAssets && assetList.map((asset, index) => (
          <View key={asset.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.assetCount}>Asset #{index + 1}</Text>
              <TouchableOpacity onPress={() => removeAsset(asset.id)}>
                <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Asset Type</Text>
            <Dropdown
              style={styles.dropdown}
              data={ASSET_TYPES}
              labelField="label" valueField="value"
              placeholder="Select Type"
              value={asset.type}
              onChange={item => updateAsset(asset.id, 'type', item.value)}
            />

            {asset.type === 'physical' && (
              <>
                <Text style={styles.fieldLabel}>Property Category</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={PROPERTY_CATEGORIES}
                  labelField="label" valueField="value"
                  placeholder="Select Category"
                  value={asset.category}
                  onChange={item => updateAsset(asset.id, 'category', item.value)}
                />
              </>
            )}

            <Text style={styles.fieldLabel}>Estimated Market Value (₹ Lakhs)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 50.0" 
              keyboardType="decimal-pad"
              onChangeText={(val) => updateAsset(asset.id, 'value', val)}
            />

            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.fieldLabel}>Property Pincode</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="6-digits" 
                  keyboardType="number-pad"
                  onChangeText={(val) => updateAsset(asset.id, 'pincode', val)}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.fieldLabel}>Docs Available?</Text>
                <TouchableOpacity 
                  style={[styles.checkBtn, asset.docsAvailable && styles.checkBtnActive]}
                  onPress={() => updateAsset(asset.id, 'docsAvailable', !asset.docsAvailable)}
                >
                  <Ionicons name={asset.docsAvailable ? "checkbox" : "square-outline"} size={24} color={asset.docsAvailable ? "#FFF" : "#DDD"} />
                  <Text style={{marginLeft: 8, color: asset.docsAvailable ? "#FFF" : "#333"}}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {hasAssets && (
          <TouchableOpacity style={styles.addMoreBtn} onPress={addAsset}>
            <Ionicons name="add-circle" size={24} color={Colors.primary} />
            <Text style={styles.addMoreText}>Add Another Asset</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next: Relationships & Co-applicants</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 10 },
  infoBox: { backgroundColor: '#EBF3FF', padding: 12, borderRadius: 8, flexDirection: 'row', marginBottom: 20 },
  infoText: { flex: 1, fontSize: 12, color: '#0052CC', marginLeft: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', color: '#333' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10, marginBottom: 10 },
  assetCount: { fontWeight: '700', color: Colors.primary },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginTop: 12, marginBottom: 6 },
  dropdown: { height: 48, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12 },
  input: { height: 48, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  row: { flexDirection: 'row', marginTop: 10 },
  checkBtn: { height: 48, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 8 },
  checkBtnActive: { backgroundColor: '#4B2C85', borderColor: '#4B2C85' },
  addMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15 },
  addMoreText: { marginLeft: 10, fontWeight: '700', color: Colors.primary },
  nextBtn: { backgroundColor: '#4B2C85', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 10 }
});

export default AssetsScreen;