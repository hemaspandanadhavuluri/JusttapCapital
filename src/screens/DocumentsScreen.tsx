import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Dimensions 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApplicationStore } from '../store/useApplicationStore';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  
  // Dynamic hooks to check onboarding status metrics
  const currentStep = useApplicationStore((state) => state.currentStep);
  const isProfileComplete = useApplicationStore((state) => state.isProfileComplete);

  const BRAND_PURPLE = '#4B2C85';
  const ACCENT_ORANGE = '#FF8A00';

  // Mock Data Mocked to align perfectly with your FinTech Document Pipeline
  const documentCategories = [
    {
      id: 'cat-1',
      title: 'Identity & KYC',
      icon: 'id-card-outline' as const,
      count: '2/2 Verified',
      progress: 1.0,
      color: '#22C55E',
      files: [
        { name: 'Passport Front & Back', status: 'VERIFIED', size: '2.4 MB' },
        { name: 'PAN Card Copy', status: 'VERIFIED', size: '1.1 MB' },
      ]
    },
    {
      id: 'cat-2',
      title: 'Academic Records',
      icon: 'school-outline' as const,
      count: '1/2 Uploaded',
      progress: 0.5,
      color: '#FF8A00',
      files: [
        { name: 'Undergraduate Transcripts', status: 'IN_REVIEW', size: '4.8 MB' },
        { name: 'GRE / TOEFL Score Card', status: 'MISSING', size: '-' },
      ]
    },
    {
      id: 'cat-3',
      title: 'Financial & Assets',
      icon: 'wallet-outline' as const,
      count: '0/3 Uploaded',
      progress: 0.0,
      color: '#EF4444',
      files: [
        { name: 'Co-Applicant 6M Bank Statement', status: 'MISSING', size: '-' },
        { name: 'ITR Filing Document (Yr-2)', status: 'MISSING', size: '-' },
        { name: 'Property Title Deed (Collateral)', status: 'MISSING', size: '-' },
      ]
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
        {documentCategories.map((category) => (
          <View key={category.id} style={styles.categoryFolderWrapperCard}>
            <View style={styles.folderHeaderMetaRow}>
              <View style={[styles.folderIconSquareContainer, { backgroundColor: `${category.color}15` }]}>
                <Ionicons name={category.icon} size={20} color={category.color} />
              </View>
              <View style={styles.folderTitleMetaBlock}>
                <Text style={styles.categoryFolderMainTitle}>{category.title}</Text>
                <Text style={styles.categoryFolderSubCount}>{category.count}</Text>
              </View>
              <View style={styles.folderMiniTrackRailBg}>
                <View style={[styles.folderMiniTrackRailFill, { width: `${category.progress * 100}%`, backgroundColor: category.color }]} />
              </View>
            </View>

            {/* Nested Individual Document Item Cells */}
            <View style={styles.nestedFilesListContainer}>
              {category.files.map((file, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.fileItemRowCell, 
                    idx === category.files.length - 1 ? { borderBottomWidth: 0 } : null
                  ]}
                >
                  <View style={styles.fileIconIndicatorPlate}>
                    <Feather 
                      name={file.status === 'MISSING' ? "file" : "file-text"} 
                      size={16} 
                      color={file.status === 'MISSING' ? "#94A3B8" : "#4B2C85"} 
                    />
                  </View>
                  
                  <View style={styles.fileNameDetailsBlock}>
                    <Text style={[styles.fileNameMainText, file.status === 'MISSING' ? { color: '#64748B' } : null]}>
                      {file.name}
                    </Text>
                    {file.size !== '-' && <Text style={styles.fileSizeSubtext}>{file.size}</Text>}
                  </View>

                  <View style={styles.fileStatusInteractionRightZone}>
                    {renderStatusBadge(file.status)}
                    <TouchableOpacity 
                      style={[
                        styles.fileUploadInteractionCircleButton,
                        file.status === 'VERIFIED' ? { backgroundColor: '#F1F5F9' } : null
                      ]}
                      disabled={file.status === 'VERIFIED'}
                    >
                      <Feather 
                        name={file.status === 'VERIFIED' ? "check" : "upload-cloud"} 
                        size={14} 
                        color={file.status === 'VERIFIED' ? "#22C55E" : BRAND_PURPLE} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

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
  
  // Storage Metrics Box Card
  storageOverviewCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderColor: '#E2E8F0', borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  storageTextInfoBlock: { flex: 1, paddingRight: 12 },
  storageOverviewTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  storageOverviewSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  storageUsageText: { fontSize: 13, color: '#334155', marginTop: 12, fontWeight: '500' },
  circularProgressContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', borderStyle: 'solid', borderWidth: 1.5, borderColor: '#E9D5FF' },
  
  // Warnings Notification Module Banner
  onboardingWarningBanner: { flexDirection: 'row', gap: 12, backgroundColor: '#FFEDD5', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#FED7AA', marginBottom: 24 },
  warningBannerTitle: { fontSize: 13, fontWeight: '700', color: '#7C2D12' },
  warningBannerDesc: { fontSize: 12, color: '#9A3412', marginTop: 2, lineHeight: 18 },
  
  sectionGroupingLabelTitle: { fontSize: 12, fontWeight: '700', color: '#64748B', letterSpacing: 0.6, marginBottom: 12 },
  
  // Main Segmented Folder Block Setup
  categoryFolderWrapperCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.01, shadowRadius: 6, elevation: 1 },
  folderHeaderMetaRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  folderIconSquareContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  folderTitleMetaBlock: { flex: 1, marginLeft: 12 },
  categoryFolderMainTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  categoryFolderSubCount: { fontSize: 12, color: '#64748B', marginTop: 1 },
  folderMiniTrackRailBg: { width: 48, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
  folderMiniTrackRailFill: { height: '100%', borderRadius: 2 },
  
  // Inner Individual Nested File Cell Components
  nestedFilesListContainer: { backgroundColor: '#FCFDFE', paddingHorizontal: 16 },
  fileItemRowCell: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  fileIconIndicatorPlate: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  fileNameDetailsBlock: { flex: 1, marginLeft: 12, paddingRight: 8 },
  fileNameMainText: { fontSize: 13, fontWeight: '600', color: '#1E293B', lineHeight: 18 },
  fileSizeSubtext: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  fileStatusInteractionRightZone: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  
  // Mini Operational Badges
  miniStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  miniStatusText: { fontSize: 11, fontWeight: '700' },
  fileUploadInteractionCircleButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  
  securityComplianceBadgeBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 24, paddingHorizontal: 20 },
  complianceFooterText: { fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 16, flex: 1 }
});