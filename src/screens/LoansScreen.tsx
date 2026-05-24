// screens/LoansScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoansScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.mainLayout, { paddingTop: insets.top }]}>
      <View style={styles.appHeaderBar}>
        <Text style={styles.headerTitleText}>My Loans</Text>
        <TouchableOpacity style={styles.helpIconButton}>
          <Feather name="help-circle" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBodyContainer}
      >
        {/* Profile Completion Status Top Banner */}
        <View style={styles.purpleStatusCard}>
          <View style={styles.statusTextMetaGroup}>
            <Text style={styles.statusSectionLabel}>PROFILE STATUS</Text>
            <Text style={styles.statusPercentText}>75% Complete</Text>
          </View>
          
          <View style={styles.railTrackContainer}>
            <View style={[styles.railTrackFillProgress, { width: '75%' }]} />
          </View>

          <TouchableOpacity style={styles.orangeCompleteProfileBtn} activeOpacity={0.8}>
            <Text style={styles.orangeBtnText}>Complete Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Active Loan Details Panel Card */}
        <Text style={styles.contentBlockLabelTitle}>ACTIVE APPLICATION</Text>
        <View style={styles.loanDetailCard}>
          <View style={styles.loanCardHeaderRow}>
            <View>
              <Text style={styles.loanProductTitle}>Postgraduate Abroad Loan</Text>
              <Text style={styles.loanProductIdNumber}>ID: JTC-99281</Text>
            </View>
            <View style={styles.reviewBadgeStyleBox}>
              <Text style={styles.reviewBadgeText}>In Review</Text>
            </View>
          </View>

          <Text style={styles.requestedAmountValueLabel}>
            Requested: <Text style={styles.boldAmountText}>$45,000</Text>
          </Text>

          {/* Workflow Status Line Indicator */}
          <View style={styles.workflowTimelinePipelineLine}>
            <View style={styles.pipelineDotItemActive}>
              <View style={styles.innerDotCheckActive} />
              <Text style={styles.pipelineDotItemLabelText}>Verified</Text>
            </View>
            <View style={styles.pipelineDotItemActive}>
              <View style={[styles.innerDotCheckActive, { backgroundColor: '#4B2C85' }]} />
              <Text style={[styles.pipelineDotItemLabelText, { color: '#4B2C85', fontWeight: '700' }]}>In Review</Text>
            </View>
            <View style={styles.pipelineDotItemDisabled}>
              <View style={styles.innerDotCheckDisabled} />
              <Text style={styles.pipelineDotItemLabelText}>Sanction</Text>
            </View>
          </View>
        </View>

        {/* Profile Strength Indicator Circle Panel */}
        <View style={styles.loanDetailCard}>
          <Text style={styles.profileStrengthTitleHeader}>Profile Strength</Text>
          
          <View style={styles.strengthDistributionContainerRow}>
            <View style={styles.radialCircleMockBox}>
              <Text style={styles.radialCircleCenterPercentageValue}>75%</Text>
            </View>

            <View style={styles.linearDistributionItemBarsStack}>
              <View style={styles.distributionMetricItemRow}>
                <Text style={styles.distributionMetricLabelText}>Academic Profile</Text>
                <Text style={styles.distributionMetricValueText}>100%</Text>
              </View>
              <View style={styles.distributionLineRailContainerBg}>
                <View style={[styles.distributionLineRailTrackFill, { width: '100%', backgroundColor: '#FF8A00' }]} />
              </View>

              <View style={[styles.distributionMetricItemRow, { marginTop: 10 }]}>
                <Text style={styles.distributionMetricLabelText}>Documents</Text>
                <Text style={styles.distributionMetricValueText}>50%</Text>
              </View>
              <View style={styles.distributionLineRailContainerBg}>
                <View style={[styles.distributionLineRailTrackFill, { width: '50%', backgroundColor: '#7C2D12' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Actions Pending Hard Gate Layer */}
        <View style={styles.actionHeaderRowFlex}>
          <Text style={styles.actionRequiredSectionTitleText}>Action Required</Text>
          <View style={styles.redAlertBadgeIndicatorCountCircle}>
            <Text style={styles.redAlertBadgeCountText}>2</Text>
          </View>
        </View>

        {/* Action Callout Task Rows */}
        <TouchableOpacity style={styles.actionRequiredTaskItemCard}>
          <View style={styles.fingerprintIconContainerBox}>
            <Ionicons name="finger-print" size={20} color="#4B2C85" />
          </View>
          <View style={styles.actionRequiredMetaTextBlock}>
            <Text style={styles.actionRequiredTaskTitleMainText}>Verify Identity</Text>
            <Text style={styles.actionRequiredTaskDescSubtext}>KYC verification pending</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRequiredTaskItemCard}>
          <View style={[styles.fingerprintIconContainerBox, { backgroundColor: '#EFF6FF' }]}>
            <Feather name="file-text" size={18} color="#2563EB" />
          </View>
          <View style={styles.actionRequiredMetaTextBlock}>
            <Text style={styles.actionRequiredTaskTitleMainText}>Upload Admission Letter</Text>
            <Text style={styles.actionRequiredTaskDescSubtext}>Required for disbursal</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#64748B" />
        </TouchableOpacity>

        {/* Institutional Partners Verification Section */}
        <Text style={styles.bankingPartnersSectionLabelText}>OUR LENDING PARTNERS</Text>
        <View style={styles.bankingLogosContainerGridRow}>
          <View style={styles.logoItemBoxContainer}><Text style={styles.mockLogoText}>AXIS BANK</Text></View>
          <View style={styles.logoItemBoxContainer}><Text style={styles.mockLogoText}>HDFC CREDILA</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainLayout: { flex: 1, backgroundColor: '#FDFCFF' },
  appHeaderBar: { height: 56, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerTitleText: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  helpIconButton: { padding: 4 },
  scrollBodyContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  
  purpleStatusCard: { backgroundColor: '#4B2C85', borderRadius: 20, padding: 20, marginBottom: 24 },
  statusTextMetaGroup: { marginBottom: 8 },
  statusSectionLabel: { color: '#E9D5FF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  statusPercentText: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', marginTop: 4 },
  railTrackContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginVertical: 14, overflow: 'hidden' },
  railTrackFillProgress: { height: '100%', backgroundColor: '#FF8A00', borderRadius: 3 },
  orangeCompleteProfileBtn: { backgroundColor: '#FF8A00', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  orangeBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  contentBlockLabelTitle: { fontSize: 12, fontWeight: '700', color: '#64748B', letterSpacing: 0.5, marginBottom: 12 },
  loanDetailCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.01, shadowRadius: 8, elevation: 1, marginBottom: 16 },
  loanCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  loanProductTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  loanProductIdNumber: { fontSize: 12, color: '#64748B', marginTop: 2 },
  reviewBadgeStyleBox: { backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  reviewBadgeText: { color: '#EA580C', fontSize: 12, fontWeight: '700' },
  requestedAmountValueLabel: { fontSize: 14, color: '#4B2C85', marginVertical: 16 },
  boldAmountText: { fontSize: 20, fontWeight: '800', color: '#4B2C85' },

  workflowTimelinePipelineLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, borderTopWidth: 2, borderColor: '#E2E8F0', paddingTop: 16, paddingHorizontal: 10 },
  pipelineDotItemActive: { alignItems: 'center', position: 'relative' },
  pipelineDotItemDisabled: { alignItems: 'center', opacity: 0.4 },
  innerDotCheckActive: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#22C55E', position: 'absolute', top: -22 },
  innerDotCheckDisabled: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#CBD5E1', position: 'absolute', top: -22 },
  pipelineDotItemLabelText: { fontSize: 11, fontWeight: '600', color: '#64748B' },

  profileStrengthTitleHeader: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  strengthDistributionContainerRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  radialCircleMockBox: { width: 72, height: 72, borderRadius: 36, borderWidth: 6, borderColor: '#FF8A00', justifyContent: 'center', alignItems: 'center' },
  radialCircleCenterPercentageValue: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  linearDistributionItemBarsStack: { flex: 1 },
  distributionMetricItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  distributionMetricLabelText: { fontSize: 13, fontWeight: '600', color: '#4B2C85' },
  distributionMetricValueText: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  distributionLineRailContainerBg: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
  distributionLineRailTrackFill: { height: '100%', borderRadius: 2 },

  actionHeaderRowFlex: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 14 },
  actionRequiredSectionTitleText: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  redAlertBadgeIndicatorCountCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  redAlertBadgeCountText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  actionRequiredTaskItemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 10 },
  fingerprintIconContainerBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  actionRequiredMetaTextBlock: { flex: 1, marginLeft: 14 },
  actionRequiredTaskTitleMainText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  actionRequiredTaskDescSubtext: { fontSize: 12, color: '#64748B', marginTop: 1 },

  bankingPartnersSectionLabelText: { fontSize: 11, fontWeight: '700', color: '#64748B', letterSpacing: 0.5, textAlign: 'center', marginTop: 24, marginBottom: 14 },
  bankingLogosContainerGridRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  logoItemBoxContainer: { flex: 1, height: 48, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  mockLogoText: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 }
});