import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Dimensions, Alert, ActivityIndicator, Linking,
  Platform // <--- CRITICAL FIX: Added missing Platform import
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useApplicationStore } from '../store/useApplicationStore';
import { ENDPOINTS, API_BASE_URL } from '../config/apiConfig';

const { width } = Dimensions.get('window');

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  
  // OPTIMIZATION: Track loading per unique document type to prevent global lockout
  const [activeUploadingType, setActiveUploadingType] = useState<string | null>(null);
  
  // Dynamic hooks to check onboarding status metrics
  const currentStep = useApplicationStore((state) => state.currentStep);
  const isProfileComplete = useApplicationStore((state) => state.isProfileComplete);
  const leadId = useApplicationStore((state: any) => state.leadId || state.basicDetails?.leadId);
  const documents = useApplicationStore((state: any) => state.documents) || [];

  const BRAND_PURPLE = '#4B2C85';

  const handleViewDocument = async (filePath: string) => {
    try {
      if (!filePath) return;
      
      // Construct absolute URL ensuring no double slashes between base and path
      const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
      const url = `${baseUrl}${normalizedPath}`;

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open document. Please ensure you have a PDF viewer or browser installed.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred while trying to open the file.");
    }
  };

  const handleDocumentPick = async (docType: string) => {
    try {
      if (!leadId) {
        Alert.alert("Error", "Session expired. Please log in again.");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Lock only this specific document type row item
        setActiveUploadingType(docType);
        
        const formData = new FormData();

        // 1. Metadata MUST be appended before the file for some parsers
        formData.append('documentType', docType);
        formData.append('leadId', leadId);

        // 2. Normalize URI
        // Most modern RN versions handle the uri from DocumentPicker directly.
        // If using iOS and a local path, the 'file://' prefix is usually required.
        const fileUri = file.uri;

        // 3. Construct File Object
        formData.append('document', {
          uri: fileUri,
          name: file.name || `upload_${Date.now()}.pdf`,
          type: file.mimeType || 'application/octet-stream',
        } as any);

        const response = await axios({
          method: 'post',
          url: ENDPOINTS.UPLOAD_DOCUMENT(leadId),
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // State hydration
        if (response.data && response.data.documents) {
          useApplicationStore.getState().updateStepData('documents', response.data.documents);
          Alert.alert("Success", `${docType} uploaded successfully.`);
        }
      }
    } catch (error: any) {
      console.error("Vault Upload Error Context:", error);
      const errDetail = error.response?.data?.error || error.message;
      Alert.alert("Upload Failed", errDetail);
    } finally {
      setActiveUploadingType(null);
    }
  };

  const getFileStatus = (docType: string) => {
    return documents.find((d: any) => d.documentType === docType);
  };

  // Grouping 11 core document layout buckets
  const categories = [
    {
      id: 'cat-1',
      title: 'Identity & KYC',
      icon: 'id-card-outline' as const,
      color: '#22C55E',
      types: ["Student Aadhar", "Student PAN Card", "Student Passport Size Photo", "Student Passport"]
    },
    {
      id: 'cat-2',
      title: 'Academic Records',
      icon: 'school-outline' as const,
      color: '#FF8A00',
      types: ["Student 10th Class Certificate", "Student 12th Degree Certificate", "Student UG Marksheet", "Student Test Score Cards"]
    },
    {
      id: 'cat-3',
      title: 'Admission & Experience',
      icon: 'briefcase-outline' as const,
      color: '#4B2C85',
      types: ["Student Admission Letter", "Student Work Experience Letter", "Student Visa"]
    }
  ];

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <View style={[styles.miniStatusBadge, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.miniStatusText, { color: '#065F46' }]}>Verified</Text>
          </View>
        );
      case 'IN_REVIEW':
        return (
          <View style={[styles.miniStatusBadge, { backgroundColor: '#FFEDD5' }]}>
            <Text style={[styles.miniStatusText, { color: '#EA580C' }]}>In Review</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.miniStatusBadge, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.miniStatusText, { color: '#EF4444' }]}>Missing</Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.mainContainerLayoutShell, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Vault Structural Header */}
      <View style={styles.vaultMainHeaderBar}>
        <View style={styles.vaultTitleWrapperRow}>
          <MaterialCommunityIcons name="shield-lock-outline" size={22} color={BRAND_PURPLE} />
          <Text style={styles.vaultHeaderText}>Document Vault</Text>
        </View>
        <TouchableOpacity style={styles.headerInfoCircleAction}>
          <Feather name="info" size={18} color="#4B2C85" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBodyContainer}
      >
        {/* Dynamic Metric Storage Card Widget Row */}
        <View style={styles.storageOverviewCard}>
          <View style={styles.storageTextInfoBlock}>
            <Text style={styles.storageOverviewTitle}>Vault Storage Metrics</Text>
            <Text style={styles.storageOverviewSub}>Secure end-to-end AES-256 cloud encryption</Text>
            <Text style={styles.storageUsageText}>
              Used <Text style={{ fontWeight: '800', color: BRAND_PURPLE }}>8.3 MB</Text> of allocated space
            </Text>
          </View>
          <View style={styles.circularProgressContainer}>
            <MaterialCommunityIcons name="cloud-upload" size={28} color={BRAND_PURPLE} />
          </View>
        </View>

        {/* Informative Step Indicator Banner */}
        {!isProfileComplete && (
          <View style={styles.onboardingWarningBanner}>
            <Feather name="alert-circle" size={18} color="#7C2D12" />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningBannerTitle}>Profile Incomplete</Text>
              <Text style={styles.warningBannerDesc}>
                Some specialized document request folders remain locked until you complete up to Step {currentStep} of your loan wizard.
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionGroupingLabelTitle}>DOCUMENT CATEGORIES</Text>

        {/* Iterating Content Folder Groups */}
        {categories.map((category) => {
          const uploadedCount = category.types.filter(type => !!getFileStatus(type)).length;
          const progress = uploadedCount / category.types.length;

          return (
            <View key={category.id} style={styles.categoryFolderWrapperCard}>
              <View style={styles.folderHeaderMetaRow}>
                <View style={[styles.folderIconSquareContainer, { backgroundColor: `${category.color}15` }]}>
                  <Ionicons name={category.icon} size={20} color={category.color} />
                </View>
                <View style={styles.folderTitleMetaBlock}>
                  <Text style={styles.categoryFolderMainTitle}>{category.title}</Text>
                  <Text style={styles.categoryFolderSubCount}>{uploadedCount}/{category.types.length} Uploaded</Text>
                </View>
                <View style={styles.folderMiniTrackRailBg}>
                  <View style={[styles.folderMiniTrackRailFill, { width: `${progress * 100}%`, backgroundColor: category.color }]} />
                </View>
              </View>

              {/* Nested Individual Document Item Cells */}
              <View style={styles.nestedFilesListContainer}>
                {category.types.map((docType, idx) => {
                  const file = getFileStatus(docType);
                  const isUploaded = !!file;
                  const isThisItemUploading = activeUploadingType === docType;

                  return (
                    <View 
                      key={idx} 
                      style={[
                        styles.fileItemRowCell, 
                        idx === category.types.length - 1 ? { borderBottomWidth: 0 } : null
                      ]}
                    >
                      <View style={styles.fileIconIndicatorPlate}>
                        <Feather 
                          name={!isUploaded ? "file" : "file-text"} 
                          size={16} 
                          color={!isUploaded ? "#94A3B8" : "#4B2C85"} 
                        />
                      </View>
                      
                      <View style={styles.fileNameDetailsBlock}>
                        <Text style={[styles.fileNameMainText, !isUploaded ? { color: '#64748B' } : null]}>
                          {docType}
                        </Text>
                        {isUploaded && <Text style={styles.fileSizeSubtext}>{file.fileName}</Text>}
                      </View>

                      <View style={styles.fileStatusInteractionRightZone}>
                        {renderStatusBadge(isUploaded ? 'VERIFIED' : 'MISSING')}

                        {isUploaded && (
                          <TouchableOpacity 
                            style={[styles.fileUploadInteractionCircleButton, { backgroundColor: '#EEF2FF' }]}
                            onPress={() => handleViewDocument(file.filePath)}
                            activeOpacity={0.7}
                          >
                            <Feather name="eye" size={16} color={BRAND_PURPLE} />
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity 
                          style={[styles.fileUploadInteractionCircleButton, isUploaded && { backgroundColor: '#F1F5F9' }]}
                          onPress={() => handleDocumentPick(docType)}
                          disabled={activeUploadingType !== null} // Disable buttons only when an upload is in progress
                        >
                          {isThisItemUploading ? (
                            <ActivityIndicator size="small" color="#4B2C85" />
                          ) : (
                            <Feather name="upload-cloud" size={14} color={BRAND_PURPLE} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Global Informative Security Footer Card */}
        <View style={styles.securityComplianceBadgeBox}>
          <Ionicons name="lock-closed" size={14} color="#64748B" />
          <Text style={styles.complianceFooterText}>
            JusttapCapital Vault meets RBI compliance and banking standard encryption requirements.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainerLayoutShell: { flex: 1, backgroundColor: '#F8FAFC' },
  vaultMainHeaderBar: { height: 56, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  vaultTitleWrapperRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vaultHeaderText: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  headerInfoCircleAction: { padding: 4 },
  
  scrollBodyContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  
  storageOverviewCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderColor: '#E2E8F0', borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  storageTextInfoBlock: { flex: 1, paddingRight: 12 },
  storageOverviewTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  storageOverviewSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  storageUsageText: { fontSize: 13, color: '#334155', marginTop: 12, fontWeight: '500' },
  circularProgressContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', borderStyle: 'solid', borderWidth: 1.5, borderColor: '#E9D5FF' },
  
  onboardingWarningBanner: { flexDirection: 'row', gap: 12, backgroundColor: '#FFEDD5', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#FED7AA', marginBottom: 24 },
  warningBannerTitle: { fontSize: 13, fontWeight: '700', color: '#7C2D12' },
  warningBannerDesc: { fontSize: 12, color: '#9A3412', marginTop: 2, lineHeight: 18 },
  
  sectionGroupingLabelTitle: { fontSize: 12, fontWeight: '700', color: '#64748B', letterSpacing: 0.6, marginBottom: 12 },
  
  categoryFolderWrapperCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.01, shadowRadius: 6, elevation: 1 },
  folderHeaderMetaRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  folderIconSquareContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  folderTitleMetaBlock: { flex: 1, marginLeft: 12 },
  categoryFolderMainTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  categoryFolderSubCount: { fontSize: 12, color: '#64748B', marginTop: 1 },
  folderMiniTrackRailBg: { width: 48, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
  folderMiniTrackRailFill: { height: '100%', borderRadius: 2 },
  
  nestedFilesListContainer: { backgroundColor: '#FCFDFE', paddingHorizontal: 16 },
  fileItemRowCell: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  fileIconIndicatorPlate: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  fileNameDetailsBlock: { flex: 1, marginLeft: 12, paddingRight: 8 },
  fileNameMainText: { fontSize: 13, fontWeight: '600', color: '#1E293B', lineHeight: 18 },
  fileSizeSubtext: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  fileStatusInteractionRightZone: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  
  miniStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  miniStatusText: { fontSize: 11, fontWeight: '700' },
  fileUploadInteractionCircleButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  
  securityComplianceBadgeBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 24, paddingHorizontal: 20 },
  complianceFooterText: { fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 16, flex: 1 }
});