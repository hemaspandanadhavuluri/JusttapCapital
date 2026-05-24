import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useApplicationStore } from '../../store/useApplicationStore';

const ASSET_TYPES = [
  { label: 'Physical Property', value: 'Physical Property' },
  { label: 'Fixed Deposit', value: 'Fixed Deposit' },
  { label: 'LIC Policy', value: 'LIC Policy' },
  { label: 'Government Bonds', value: 'Government Bonds' },
];

const PROPERTY_TYPES = [
  { label: 'House', value: 'House' },
  { label: 'Flat', value: 'Flat' },
  { label: 'Non Agricultural Land', value: 'Non Agricultural Land' },
  { label: 'Commercial Property', value: 'Commercial Property' },
];

const AUTHORITIES = [
  { label: 'Gram Panchayat', value: 'Gram Panchayat' },
  { label: 'Municipality', value: 'Municipality' },
];

const POLICY_TYPES = [
  { label: 'Life Insurance', value: 'Life' },
  { label: 'Term Insurance', value: 'Term' },
];

const RELATIONSHIP_OPTIONS = [
  { label: 'Father', value: 'Father' },
  { label: 'Mother', value: 'Mother' },
  { label: 'Sister', value: 'Sister' },
  { label: 'Brother', value: 'Brother' },
  { label: 'Cousin', value: 'Cousin' },
  { label: 'Aunt', value: 'Aunt' },
  { label: 'Uncle', value: 'Uncle' },
];

export const Step6FinancialAssets = ({ onSave, onBack }: { onSave: (data: any) => Promise<void>; onBack: () => void }) => {
  const rawAssetsState = useApplicationStore((state: any) => state.financialAssets || state.assetsDetails);
  const storeData = rawAssetsState || {};

  const [loading, setLoading] = useState(false);
  
  // Existing Loan States
  const [hasLoan, setHasLoan] = useState(storeData.hasLoan || 'No');
  const [loanPayer, setLoanPayer] = useState(storeData.loanPayer || '');
  const [loanAmount, setLoanAmount] = useState(storeData.loanAmount || '');
  const [loanDescription, setLoanDescription] = useState(storeData.loanDescription || '');

  // Assets States
  const [hasAssets, setHasAssets] = useState(storeData.hasAssets || 'No');
  const [assetList, setAssetList] = useState<any[]>(storeData.assetList || []);

  const addAsset = () => {
    const newAsset = {
      id: Date.now(),
      type: 'Physical Property',
      propertyType: 'House',
      ownerName: '',
      ownerRelationship: '',
      valueLakhs: '',
      hasPendingLoan: 'No',
      pendingLoanBankName: '',
      docsAvailable: 'Yes',
      locationPincode: '',
      authority: 'Municipality',
      policyType: 'Life',
      bankName: '' // Used for Fixed Deposit
    };
    setAssetList([...assetList, newAsset]);
  };

  const updateAsset = (id: number, field: string, value: string) => {
    setAssetList(assetList.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAsset = (id: number) => {
    setAssetList(assetList.filter(a => a.id !== id));
  };

  const handleSubmit = async () => {
    if (hasLoan === 'Yes' && (!loanAmount || !loanPayer)) {
      Alert.alert("Loan Info Missing", "Please provide details about who is paying your existing loan and the amount.");
      return;
    }
    
    if (hasAssets === 'Yes' && assetList.length === 0) {
      Alert.alert("Asset Required", "You selected Yes for assets, please add at least one asset detail.");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        hasLoan,
        loanPayer,
        loanAmount,
        loanDescription,
        hasAssets,
        assetList: hasAssets === 'Yes' ? assetList : []
      });
    } catch (err) {
      Alert.alert("Sync Failure", "Could not preserve asset and loan declarations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Financial Commitments & Assets</Text>

      <Text style={styles.label}>Do you have any existing active loans?</Text>
      <View style={styles.toggleRow}>
        {['Yes', 'No'].map((ans) => (
          <TouchableOpacity key={ans} style={[styles.toggleBtn, hasLoan === ans && styles.activeToggle]} onPress={() => setHasLoan(ans)}>
            <Text style={[styles.toggleText, hasLoan === ans && styles.activeToggleText]}>{ans}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {hasLoan === 'Yes' && (
        <View style={styles.subContainer}>
          <Text style={styles.subLabel}>Who is paying the current EMI?</Text>
          <TextInput style={styles.input} placeholder="e.g. Father / Self" value={loanPayer} onChangeText={setLoanPayer} />

          <Text style={styles.subLabel}>Total Outstanding Loan Amount (INR)</Text>
          <TextInput style={styles.input} placeholder="e.g. 500000" keyboardType="numeric" value={loanAmount} onChangeText={setLoanAmount} />

          <Text style={styles.subLabel}>Brief Loan Description</Text>
          <TextInput 
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
            placeholder="e.g. Home loan from HDFC or Personal loan" 
            multiline 
            value={loanDescription} 
            onChangeText={setLoanDescription} 
          />
        </View>
      )}

      <View style={styles.divider} />

      {/* Assets Note */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#0052CC" />
        <Text style={styles.infoText}>
          Students can include <Text style={{fontWeight: '700'}}>House, Flat, Non-agricultural land, Fixed Deposits, Government Bonds, or Commercial properties</Text> to strengthen their application.
        </Text>
      </View>

      <Text style={styles.label}>ASSETS AVAILABLE</Text>
      <View style={styles.toggleRow}>
        {['Yes', 'No'].map((ans) => (
          <TouchableOpacity 
            key={ans} 
            style={[styles.toggleBtn, hasAssets === ans && styles.activeToggle]} 
            onPress={() => {
              setHasAssets(ans);
              if (ans === 'Yes' && assetList.length === 0) addAsset();
            }}
          >
            <Text style={[styles.toggleText, hasAssets === ans && styles.activeToggleText]}>{ans}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {hasAssets === 'Yes' && (
        <>
          {assetList.map((asset, index) => (
            <View key={asset.id} style={styles.assetCard}>
              <View style={styles.assetCardHeader}>
                <Text style={styles.assetCardTitle}>Asset #{index + 1}</Text>
                <TouchableOpacity onPress={() => removeAsset(asset.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subLabel}>Asset Type</Text>
              <Dropdown
                style={styles.dropdown}
                data={ASSET_TYPES}
                labelField="label" valueField="value"
                value={asset.type}
                onChange={item => updateAsset(asset.id, 'type', item.value)}
              />

              {/* Common Details for All Asset Types */}
              <Text style={styles.subLabel}>Owner Name (as per documents)</Text>
              <TextInput style={styles.input} placeholder="Legal Owner Name" value={asset.ownerName} onChangeText={v => updateAsset(asset.id, 'ownerName', v)} />

              <Text style={styles.subLabel}>Owner Relationship with Student</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={RELATIONSHIP_OPTIONS}
                labelField="label" valueField="value"
                placeholder="Select Relationship"
                value={asset.ownerRelationship}
                onChange={item => updateAsset(asset.id, 'ownerRelationship', item.value)}
              />

              <Text style={styles.subLabel}>Asset Value (in Lakhs)</Text>
              <TextInput style={styles.input} placeholder="e.g. 55.0" keyboardType="numeric" value={asset.valueLakhs} onChangeText={v => updateAsset(asset.id, 'valueLakhs', v)} />

              {/* Sub-Fields: Physical Property */}
              {asset.type === 'Physical Property' && (
                <>
                  <Text style={styles.subLabel}>Property Type</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={PROPERTY_TYPES}
                    labelField="label" valueField="value"
                    value={asset.propertyType}
                    onChange={item => updateAsset(asset.id, 'propertyType', item.value)}
                  />

                  <Text style={styles.subLabel}>Is there a pending loan on this asset?</Text>
                  <View style={styles.toggleRow}>
                    {['Yes', 'No'].map((ans) => (
                      <TouchableOpacity key={ans} style={[styles.toggleBtn, asset.hasPendingLoan === ans && styles.activeToggle]} onPress={() => updateAsset(asset.id, 'hasPendingLoan', ans)}>
                        <Text style={[styles.toggleText, asset.hasPendingLoan === ans && styles.activeToggleText]}>{ans}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {asset.hasPendingLoan === 'Yes' && (
                    <>
                      <Text style={styles.subLabel}>Bank Name (Pending Loan)</Text>
                      <TextInput style={styles.input} placeholder="e.g. ICICI Bank" value={asset.pendingLoanBankName} onChangeText={v => updateAsset(asset.id, 'pendingLoanBankName', v)} />
                    </>
                  )}

                  <Text style={styles.subLabel}>Are original documents available?</Text>
                  <View style={styles.toggleRow}>
                    {['Yes', 'No'].map((ans) => (
                      <TouchableOpacity key={ans} style={[styles.toggleBtn, asset.docsAvailable === ans && styles.activeToggle]} onPress={() => updateAsset(asset.id, 'docsAvailable', ans)}>
                        <Text style={[styles.toggleText, asset.docsAvailable === ans && styles.activeToggleText]}>{ans}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.subLabel}>Property Pincode</Text>
                      <TextInput style={styles.input} placeholder="6-Digits" keyboardType="numeric" maxLength={6} value={asset.locationPincode} onChangeText={v => updateAsset(asset.id, 'locationPincode', v)} />
                    </View>
                    <View style={{ flex: 1.5 }}>
                      <Text style={styles.subLabel}>Property Authority</Text>
                      <Dropdown
                        style={styles.dropdown}
                        data={AUTHORITIES}
                        labelField="label" valueField="value"
                        value={asset.authority}
                        onChange={item => updateAsset(asset.id, 'authority', item.value)}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Sub-Fields: Fixed Deposit */}
              {asset.type === 'Fixed Deposit' && (
                <>
                  <Text style={styles.subLabel}>Bank Name (FD Issuing Bank)</Text>
                  <TextInput style={styles.input} placeholder="Bank Name" value={asset.bankName} onChangeText={v => updateAsset(asset.id, 'bankName', v)} />

                  <Text style={styles.subLabel}>Are original documents available?</Text>
                  <View style={styles.toggleRow}>
                    {['Yes', 'No'].map((ans) => (
                      <TouchableOpacity key={ans} style={[styles.toggleBtn, asset.docsAvailable === ans && styles.activeToggle]} onPress={() => updateAsset(asset.id, 'docsAvailable', ans)}>
                        <Text style={[styles.toggleText, asset.docsAvailable === ans && styles.activeToggleText]}>{ans}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Sub-Fields: LIC Policy */}
              {asset.type === 'LIC Policy' && (
                <>
                  <Text style={styles.subLabel}>Policy Type</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={POLICY_TYPES}
                    labelField="label" valueField="value"
                    value={asset.policyType}
                    onChange={item => updateAsset(asset.id, 'policyType', item.value)}
                  />
                </>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addAssetBtn} onPress={addAsset}>
            <Ionicons name="add-circle" size={24} color="#4B2C85" />
            <Text style={styles.addAssetText}>Add Another Asset Detail</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.btnWrapperRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={loading}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitBtn, loading && styles.disabledBtn]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.submitBtnText}>Continue</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#4B2C85', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginTop: 14, marginBottom: 6 },
  subLabel: { fontSize: 12, fontWeight: '600', color: '#4B2C85', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 16, color: '#1E293B', marginTop: 4 },
  dropdown: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 54, marginTop: 4 },
  placeholderStyle: { fontSize: 16, color: '#94A3B8' },
  selectedTextStyle: { fontSize: 16, color: '#1E293B' },
  toggleRow: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 4 },
  toggleBtn: { flex: 1, padding: 12, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', backgroundColor: '#FFF' },
  activeToggle: { borderColor: '#4B2C85', backgroundColor: '#F3E8FF' },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  activeToggleText: { color: '#4B2C85', fontWeight: '700' },
  subContainer: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1', marginTop: 12 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 24 },
  infoBox: { flexDirection: 'row', backgroundColor: '#EBF3FF', padding: 14, borderRadius: 12, marginBottom: 10, alignItems: 'center', gap: 10 },
  infoText: { flex: 1, fontSize: 12, color: '#0052CC', lineHeight: 18 },
  assetCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  assetCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10, marginBottom: 5 },
  assetCardTitle: { fontSize: 14, fontWeight: '800', color: '#4B2C85' },
  addAssetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, gap: 10 },
  addAssetText: { color: '#4B2C85', fontWeight: '800', fontSize: 15 },
  row: { flexDirection: 'row' },
  btnWrapperRow: { flexDirection: 'row', gap: 12, marginTop: 40, marginBottom: 50 },
  backButton: { flex: 1, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { color: '#4B2C85', fontSize: 16, fontWeight: '700' },
  submitBtn: { flex: 2, backgroundColor: '#FF8A00', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});