// screens/HomeScreen.tsx
import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Image, StatusBar, Dimensions, Alert, ActivityIndicator, Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useApplicationStore } from '../store/useApplicationStore';
import { PARTNER_BANKS } from '../components/forms/appConstants';
import { Colors } from '../theme/colors';
import axios from 'axios';
import { ENDPOINTS, API_BASE_URL } from '../config/apiConfig';

const { width } = Dimensions.get('window');
const DOCUMENT_TYPES = [
  "Student Aadhar", "Student PAN Card", "Student Passport Size Photo", "Student Passport",
  "Student 10th Class Certificate", "Student 12th Degree Certificate", "Student UG Marksheet",
  "Student Test Score Cards", "Student Admission Letter", "Student Work Experience Letter", "Student Visa"
];

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const [uploading, setUploading] = React.useState(false);
  // Dynamic application lifecycle hooks
  const currentStep = useApplicationStore((state) => state.currentStep);
  const isProfileComplete = useApplicationStore((state) => state.isProfileComplete);
  const leadId = useApplicationStore((state: any) => state.leadId || state.basicDetails?.leadId);
  const documents = useApplicationStore((state: any) => state.documents) || [];
  
  // Read dynamic data from store instead of hardcoded values
  const serverData = useApplicationStore((state: any) => state.serverData) || {};
  const localFullName = useApplicationStore((state: any) => state.basicDetails?.fullName);
  const studentName = serverData.fullName || localFullName || 'Applicant';
  const assignedFO = serverData.assignedFO || 'Assigning Officer...';
  const leadStatus = serverData.leadStatus || 'New Application';

  // Sync with database on mount to refresh status and FO details
  React.useEffect(() => {
    if (leadId) {
      const refreshStatus = async () => {
        try {
          const res = await axios.get(ENDPOINTS.STATUS(leadId));
          useApplicationStore.getState().updateStepData('serverData', res.data);
        } catch (e) {
          console.log("Status refresh failed", e);
        }
      };
      refreshStatus();
    }
  }, [leadId]);

  // Fallback Theme Tokens to support missing color references safely
  const PRIMARY_COLOR = Colors?.primary || '#0A2540';
  const ACCENT_GREEN = Colors?.secondary || '#00D68F';
  const BRAND_PURPLE = '#4B2C85';

  const handleDocumentPick = async (docType: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        if (!leadId) {
          Alert.alert("Session Error", "Lead ID not found. Please try logging in again.");
          return;
        }

        setUploading(true);
        
        const formData = new FormData();
        const fileUri = Platform.OS === 'android' ? file.uri : file.uri.replace('file://', '');

        formData.append('document', {
          uri: fileUri,
          name: file.name || `upload_${Date.now()}.pdf`,
          type: file.mimeType || 'application/octet-stream',
        } as any);
        formData.append('documentType', docType);

        // FIX: Ensure consistency with DocumentsScreen upload
        const response = await axios.post(ENDPOINTS.UPLOAD_DOCUMENT(leadId), formData, {
          transformRequest: (data) => data,
        });

        if (response.data) {
          useApplicationStore.getState().updateStepData('documents', response.data.documents || []);
          Alert.alert("Success", `${docType} uploaded successfully.`);
        }
      }
    } catch (error: any) {
      console.error("Home Upload Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to upload document. Please check the logs.");
    } finally {
      setUploading(false);
    }
  };

  /**
   * STATE A: Brand New Install / Fresh Profile Layout
   * Matches Image: image_bebe0c.png / image_bfa060.png
   */
  const renderFreshProfileView = () => {
    const STEP_NAMES = [
      "Basic Details",
      "Education Details",
      "Test Scores",
      "Academic History",
      "Course Financials",
      "Financial Assets",
      "Co-Applicant Details",
      "Personal References",
      "Identity & Documents"
    ];

    return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.welcomeHeading}>Welcome, {studentName}!{"\n"}To JusttapCapital</Text>
      <Text style={styles.welcomeSubheading}>
        Your journey to academic excellence starts here. Let's get your profile set up to unlock personalized loan offers.
      </Text>

      {/* Main Feature Action Module */}
      <View style={styles.actionCard}>
        <View style={styles.cardStatusBadge}>
          <Text style={styles.cardStatusBadgeText}>Action Required</Text>
        </View>
        
        <Text style={styles.cardMainTitle}>Complete Your Profile</Text>
        <Text style={styles.cardMainDesc}>
          To provide the most accurate loan estimates and university recommendations, we need a few more details about your educational background.
        </Text>

        {/* Master Entry Button - Moved to Top of Steps */}
        <TouchableOpacity 
          style={[styles.getStartedButton, { marginBottom: 20 }]}
          onPress={() => navigation.navigate('WizardFormFlow')}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedBtnText}>Get Started</Text>
          <Feather name="arrow-right" size={18} color="#FFF" />
        </TouchableOpacity>

        {/* Action Checkboxes List Stack - Showing All 9 Steps */}
        {STEP_NAMES.map((step, index) => (
          <View key={index} style={[styles.taskItemRow, index > 0 && { opacity: 0.6 }]}>
            <View style={[styles.taskIconWrapper, { backgroundColor: index === 0 ? '#EEF2F6' : '#F8FAFC' }]}>
              <Feather name={index === 0 ? "edit-3" : "lock"} size={18} color={index === 0 ? BRAND_PURPLE : "#94A3B8"} />
            </View>
            <View style={styles.taskMetaBlock}>
              <Text style={[styles.taskTitleText, index > 0 && { color: '#94A3B8' }]}>{step}</Text>
              <Text style={styles.taskSubtext}>Step {index + 1} of 9</Text>
            </View>
            {index === 0 && <Feather name="chevron-right" size={18} color="#64748B" />}
          </View>
        ))}
      </View>

      {/* Why Complete Profile Container */}
      <View style={styles.darkInfoBanner}>
        <View style={styles.sparkleTitleHeader}>
          <Ionicons name="sparkles" size={20} color="#60A5FA" />
          <Text style={styles.darkBannerTitle}>Why Complete Profile?</Text>
        </View>
        
        <View style={styles.bulletRow}>
          <Feather name="check-circle" size={16} color={ACCENT_GREEN} />
          <Text style={styles.bulletText}>Unlock loan eligibility up to $150,000</Text>
        </View>
        <View style={styles.bulletRow}>
          <Feather name="check-circle" size={16} color={ACCENT_GREEN} />
          <Text style={styles.bulletText}>Get interest rates tailored as low as 8.5%</Text>
        </View>
        <View style={styles.bulletRow}>
          <Feather name="check-circle" size={16} color={ACCENT_GREEN} />
          <Text style={styles.bulletText}>Personalized university recommendations</Text>
        </View>

        <View style={styles.innerTipBox}>
          <Text style={styles.tipBoxTitle}>Next Step Tip:</Text>
          <Text style={styles.tipBoxDesc}>Have your high school or college transcripts ready for step 2!</Text>
        </View>
      </View>

      {/* Banking Partners Section */}
      <Text style={styles.sectionDividerTitle}>Our Banking Partners</Text>
      <Text style={styles.partnersSubtext}>JusttapCapital is tied with India's leading education lenders to bring you the best rates.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnersScroll}>
        {PARTNER_BANKS.map((bank, index) => (
          <View key={index} style={styles.partnerBankCard}>
            <MaterialCommunityIcons name="bank-outline" size={24} color="#4B2C85" />
            <Text style={styles.partnerBankName}>{bank}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
    );
  };

  /**
   * STATE B: Mid-Way Progress Drop-Off Tracker Layout
   * Matches Image: image_bfa41d.png / image_bfaaac.png
   */
  const renderInProgressView = () => {
    const computedPercentage = Math.min(Math.max(Math.round(((currentStep - 1) / 9) * 100), 5), 95);

    const STEP_NAMES = [
      "Basic Details",
      "Education Details",
      "Test Scores",
      "Academic History",
      "Course Financials",
      "Financial Assets",
      "Co-Applicant Details",
      "Personal References",
      "Identity & Documents"
    ];

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.welcomeHeading}>Welcome back,{"\n"}{studentName}!</Text>
        <Text style={styles.welcomeSubheading}>
          You're just a few steps away from securing your future. Keep going!
        </Text>

        {/* Real-time Percentage Container Widget */}
        <View style={styles.actionCard}>
          <View style={styles.progressDataHeader}>
            <View>
              <Text style={styles.progressDataTitle}>Application Progress</Text>
              <Text style={styles.progressDataSub}>Targeting Fall 2026 Intake</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.progressDataPercentText}>{computedPercentage}%</Text>
              <Text style={styles.progressDataPercentSub}>Nearly there!</Text>
            </View>
          </View>

          {/* Bar Fill Track Rail */}
          <View style={styles.progressBarRailBg}>
            <View style={[styles.progressBarTrackFill, { width: `${computedPercentage}%`, backgroundColor: '#006D32' }]} />
          </View>

          {/* Dynamic Step Tracking List */}
          <View style={{ marginTop: 10 }}>
            {STEP_NAMES.map((stepName, index) => {
              const stepNum = index + 1;
              const isDone = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              
              return (
                <View key={index} style={styles.milestoneRowLine}>
                  {isDone ? (
                    <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                  ) : isCurrent ? (
                    <Ionicons name="ellipsis-horizontal-circle" size={18} color="#FF8A00" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={18} color="#EF4444" />
                  )}
                  <Text style={[styles.milestoneLineLabelText, !isDone && !isCurrent && { color: '#94A3B8' }]}>
                    {stepName} {isDone && <Text style={styles.greenMiniBadge}>DONE</Text>}
                    {isCurrent && <Text style={styles.amberMiniBadge}>ACTIVE</Text>}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Resume Interaction Pipeline */}
          <TouchableOpacity 
            style={[styles.getStartedButton, { backgroundColor: BRAND_PURPLE }]}
            onPress={() => navigation.navigate('WizardFormFlow')}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedBtnText}>Resume Application (Step {currentStep})</Text>
            <Feather name="play" size={14} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Highlight Feature Status Panel */}
        <View style={[styles.darkInfoBanner, { backgroundColor: '#0A192F' }]}>
          <View style={styles.loanStatusBadge}>
            <Text style={styles.loanStatusBadgeText}>Loan Status</Text>
          </View>
          <Text style={styles.loanStatusMainHeader}>{leadStatus}</Text>
          <Text style={styles.loanStatusBodyDesc}>
            Your application is currently being processed. You can contact your Field Officer for real-time updates regarding your file.
          </Text>
          <TouchableOpacity style={[styles.getStartedButton, { backgroundColor: ACCENT_GREEN, marginTop: 10, height: 46 }]}>
            <Text style={[styles.getStartedBtnText, { color: '#0A192F' }]}>View Details</Text>
          </TouchableOpacity>
        </View>

        {/* Assigned Consultant Metadata Block Card */}
        <Text style={styles.sectionDividerTitle}>Your Field Officer</Text>
        <View style={styles.officerProfileWidgetCard}>
          <View style={styles.officerMetaRow}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80' }} 
              style={styles.officerAvatarImage} 
            />
            <View style={styles.officerNameBlock}>
              <Text style={styles.officerNameText}>{assignedFO}</Text>
              <Text style={styles.officerTitleSubtext}>Dedicated Field Executive</Text>
              <Text style={styles.officerAvailabilityFlag}>Available to help with Step {currentStep}</Text>
            </View>
          </View>
          
          <View style={styles.officerActionRowGroup}>
            <TouchableOpacity style={styles.btnCallNow}>
              <Ionicons name="call" size={16} color="#FFF" />
              <Text style={styles.btnCallNowText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnMessage}>
              <Feather name="message-square" size={16} color="#1E293B" />
              <Text style={styles.btnMessageText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Banking Partners Section */}
        <Text style={[styles.sectionDividerTitle, { marginTop: 24 }]}>Our Banking Partners</Text>
        <Text style={styles.partnersSubtext}>JusttapCapital is tied with India's leading education lenders to bring you the best rates.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnersScroll}>
          {PARTNER_BANKS.map((bank, index) => (
            <View key={index} style={styles.partnerBankCard}>
              <MaterialCommunityIcons name="bank-outline" size={24} color="#4B2C85" />
              <Text style={styles.partnerBankName}>{bank}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    );
  };

  /**
   * STATE C: Wizard Forms Fully Finished Dashboard
   * Matches Image: image_bfaaca.png / image_bec604.png
   */
  const renderCompletedProfileView = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Hero Success Section */}
      <View style={styles.successHeroCard}>
        <View style={styles.celebratoryBadge}>
           <Ionicons name="ribbon" size={16} color="#FFF" />
           <Text style={styles.celebratoryBadgeText}>PREMIUM APPLICANT</Text>
        </View>
        <View style={styles.successOuterCheckCircleLarge}>
          <Feather name="check-circle" size={48} color="#FFF" />
        </View>
        <Text style={styles.completeScreenHeaderTitle}>All Set, {studentName}!</Text>
        <Text style={styles.completeScreenHeaderSub}>Your profile is 100% verified and submitted.</Text>
      </View>

      {/* Expanded Senior Officer Core Control Panel */}
      <Text style={styles.sectionDividerTitle}>Your Concierge Team</Text>
      <View style={styles.officerProfilePremiumCard}>
        <View style={styles.officerMetaRowLarge}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' }} 
            style={styles.officerLargeAvatarImagePremium} 
          />
          <View style={styles.officerDetailsTextGroup}>
            <Text style={styles.officerCoreFullNamePremium}>{assignedFO}</Text>
            <View style={styles.seniorBadge}>
              <Text style={styles.seniorBadgeText}>SENIOR LOAN OFFICER</Text>
            </View>
            <Text style={styles.officerRatingText}>Verified Officer • Direct Support</Text>
          </View>
        </View>
        
        <Text style={styles.officerFunctionalDescriptionPremium}>
          "I'm here to ensure your funds are disbursed directly to your university on time. Let's make your abroad dreams a reality!"
        </Text>

        <View style={styles.officerActionRowGroupLarge}>
          <TouchableOpacity style={styles.officerLargeActionCallBtnPremium}>
            <Ionicons name="call" size={18} color="#FFF" />
            <Text style={styles.officerLargeActionCallBtnText}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.officerLargeActionChatBtnPremium}>
            <Ionicons name="chatbubble-ellipses" size={18} color="#4B2C85" />
            <Text style={styles.officerLargeActionChatBtnText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Track Milestone Timeline */}
      <Text style={styles.sectionDividerTitle}>Live Journey Status</Text>
      <View style={styles.timelineListCardModern}>
        <View style={styles.timelineItemNodeRowModern}>
          <View style={styles.timelineNodeIconActive}>
             <Ionicons name="checkmark" size={14} color="#FFF" />
          </View>
          <View style={styles.timelineMetaContent}>
            <Text style={styles.timelineNodeTitle}>Profile Creation</Text>
            <Text style={styles.timelineNodeTime}>Completed successfully</Text>
          </View>
        </View>
        
        <View style={styles.timelineVerticalLink} />

        <View style={styles.timelineItemNodeRowModern}>
          <View style={[styles.timelineNodeIconActive, { backgroundColor: BRAND_PURPLE }]}>
             <Feather name="loader" size={14} color="#FFF" />
          </View>
          <View style={styles.timelineMetaContent}>
            <Text style={styles.timelineNodeTitle}>Bank Verification</Text>
            <Text style={styles.timelineNodeTime}>Currently being reviewed by HDFC Credila</Text>
          </View>
        </View>

        <View style={[styles.timelineVerticalLink, { backgroundColor: '#E2E8F0' }]} />

        <View style={styles.timelineItemNodeRowModern}>
          <View style={styles.timelineNodeIconInactive}>
             <View style={styles.innerDotInactive} />
          </View>
          <View style={styles.timelineMetaContent}>
            <Text style={[styles.timelineNodeTitle, { color: '#94A3B8' }]}>Loan Sanction</Text>
            <Text style={styles.timelineNodeTime}>Awaiting verification completion</Text>
          </View>
        </View>
      </View>

      {/* Banking Partners Section */}
      <Text style={[styles.sectionDividerTitle, { marginTop: 24 }]}>Our Banking Partners</Text>
      <Text style={styles.partnersSubtext}>JusttapCapital is tied with India's leading education lenders to bring you the best rates.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnersScroll}>
        {PARTNER_BANKS.map((bank, index) => (
          <View key={index} style={styles.partnerBankCard}>
            <MaterialCommunityIcons name="bank-outline" size={24} color="#4B2C85" />
            <Text style={styles.partnerBankName}>{bank}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );

  return (
    <View style={[styles.containerLayoutShell, { paddingTop: insets.top + 8 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Global Application Nav Header */}
      <View style={styles.globalHeaderActionBar}>
        <View style={styles.globalHeaderBrandGroup}>
          <Image 
            source={require('../../assets/logo.jpeg')} 
            style={styles.logoSmall} 
            resizeMode="contain" 
          />
        </View>

        <View style={styles.rightHeaderActions}>
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                "Reset Application",
                "This will clear all your progress and data to allow testing from the start. Are you sure?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Reset & Logout", 
                    style: "destructive", 
                    onPress: () => {
                      useApplicationStore.getState().resetStore();
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Landing' }],
                      });
                    } 
                  }
                ]
              );
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.globalHeaderHelpIconCircle}>
            <Feather name="help-circle" size={22} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditional Layout Routing Controller */}
      {isProfileComplete ? renderCompletedProfileView() : (currentStep === 1 ? renderFreshProfileView() : renderInProgressView())}
    </View>
  );
}

const styles = StyleSheet.create({
  containerLayoutShell: { flex: 1, backgroundColor: '#F8FAFC' },
  globalHeaderActionBar: { height: 64, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 },
  globalHeaderBrandGroup: { flexDirection: 'row', alignItems: 'center' },
  logoSmall: { width: 54, height: 54 },
  rightHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  globalHeaderHelpIconCircle: { padding: 4 },
  
  scrollContainer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },
  welcomeHeading: { fontSize: 32, fontWeight: '900', color: '#4B2C85', lineHeight: 38, letterSpacing: -0.8 },
  welcomeSubheading: { fontSize: 14, color: '#4B2C85', marginTop: 8, lineHeight: 22, fontWeight: '400', marginBottom: 24 },
  
  // Cards Base Style Module 
  actionCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderStyle: 'solid', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2, marginBottom: 20 },
  cardStatusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 14 },
  cardStatusBadgeText: { color: '#065F46', fontSize: 11, fontWeight: '700' },
  cardMainTitle: { fontSize: 22, fontWeight: '800', color: '#4B2C85', marginBottom: 8 },
  cardMainDesc: { fontSize: 13, color: '#4B2C85', lineHeight: 20, marginBottom: 20 },
  
  // Inner Task Items Rows
  taskItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  docItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  docMeta: { flex: 1 },
  docName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  docStatus: { fontSize: 11, marginTop: 2, fontWeight: '600' },
  docViewBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  docUploadBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#4B2C85', justifyContent: 'center', alignItems: 'center' },
  taskIconWrapper: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  taskMetaBlock: { flex: 1, marginLeft: 12 },
  taskTitleText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  taskSubtext: { fontSize: 11, color: '#64748B', marginTop: 1 },
  
  // Custom Interaction Action Elements
  getStartedButton: { backgroundColor: '#D97706', height: 48, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14 },
  getStartedBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  
  // Dark Feature Info Card
  darkInfoBanner: { backgroundColor: '#4B2C85', borderRadius: 20, padding: 20, marginBottom: 24 },
  sparkleTitleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  darkBannerTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  bulletText: { color: '#E2E8F0', fontSize: 13, fontWeight: '500' },
  innerTipBox: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, marginTop: 14 },
  tipBoxTitle: { color: '#60A5FA', fontSize: 12, fontWeight: '700' },
  tipBoxDesc: { color: '#94A3B8', fontSize: 12, marginTop: 2, lineHeight: 18 },
  
  // Journey Generic Lists
  sectionDividerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 14 },
  journeyStepCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', width: width * 0.42, marginBottom: 24 },
  journeyIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  journeyStepLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  journeyStepSublabel: { fontSize: 11, color: '#64748B', marginTop: 1 },
  
  partnersSubtext: { fontSize: 13, color: '#64748B', marginBottom: 12, lineHeight: 18 },
  partnersScroll: { marginBottom: 20 },
  partnerBankCard: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', marginRight: 12, width: 100 },
  partnerBankName: { fontSize: 11, fontWeight: '700', color: '#4B2C85', marginTop: 6, textAlign: 'center' },
  
  // Blank Canvas Block Setup
  blankCanvasCard: { borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 20, padding: 24, alignItems: 'center' },
  canvasGraphicCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  canvasPrimaryText: { fontSize: 16, fontWeight: '700', color: '#4B2C85', marginBottom: 6 },
  canvasSecondaryText: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18, paddingHorizontal: 10 },

  // Flow State Tracking Metadata Controls
  progressDataHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  progressDataTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  progressDataSub: { fontSize: 12, color: '#64748B', marginTop: 1 },
  progressDataPercentText: { fontSize: 24, fontWeight: '900', color: '#4B2C85' },
  progressDataPercentSub: { fontSize: 11, fontWeight: '700', color: '#22C55E' },
  progressBarRailBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginVertical: 16, overflow: 'hidden' },
  progressBarTrackFill: { height: '100%', borderRadius: 3 },
  milestoneRowLine: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  milestoneLineLabelText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  greenMiniBadge: { color: '#16A34A', fontSize: 10, fontWeight: '800', marginLeft: 4 },
  amberMiniBadge: { color: '#D97706', fontSize: 10, fontWeight: '800', marginLeft: 4 },

  loanStatusBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  loanStatusBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  loanStatusMainHeader: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  loanStatusBodyDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 20, marginBottom: 14 },

  // Assigned Consultant Elements
  officerProfileWidgetCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderColor: '#E2E8F0', borderWidth: 1 },
  officerMetaRow: { flexDirection: 'row', alignItems: 'center' },
  officerAvatarImage: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E2E8F0' },
  officerNameBlock: { flex: 1, marginLeft: 12 },
  officerNameText: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  officerTitleSubtext: { fontSize: 12, color: '#006D32', fontWeight: '600' },
  officerAvailabilityFlag: { fontSize: 11, color: '#64748B', marginTop: 2 },
  officerActionRowGroup: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnCallNow: { flex: 1, backgroundColor: '#0F172A', height: 38, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  btnCallNowText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  btnMessage: { flex: 1, backgroundColor: '#FFF', height: 38, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  btnMessageText: { color: '#1E293B', fontSize: 13, fontWeight: '700' },

  // Complete Screens Metrics Configurations
  successHeroCard: { backgroundColor: '#4B2C85', borderRadius: 24, padding: 30, alignItems: 'center', marginBottom: 24 },
  celebratoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
  celebratoryBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  successOuterCheckCircleLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  completeScreenHeaderTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  completeScreenHeaderSub: { fontSize: 13, color: '#E2E8F0', marginTop: 8, textAlign: 'center', opacity: 0.8 },
  
  officerProfilePremiumCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 24 },
  officerMetaRowLarge: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  officerLargeAvatarImagePremium: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#CBD5E1' },
  officerDetailsTextGroup: { flex: 1 },
  officerCoreFullNamePremium: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  seniorBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  seniorBadgeText: { color: '#065F46', fontSize: 9, fontWeight: '800' },
  officerRatingText: { fontSize: 12, color: '#64748B', marginTop: 6, fontWeight: '500' },
  officerFunctionalDescriptionPremium: { fontSize: 13, color: '#4B2C85', fontStyle: 'italic', lineHeight: 20, marginVertical: 16, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 },
  officerActionRowGroupLarge: { flexDirection: 'row', gap: 12 },
  officerLargeActionCallBtnPremium: { flex: 1, backgroundColor: '#4B2C85', height: 46, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  officerLargeActionCallBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  officerLargeActionChatBtnPremium: { flex: 1, backgroundColor: '#FFF', height: 46, borderRadius: 12, borderWidth: 1.5, borderColor: '#4B2C85', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  officerLargeActionChatBtnText: { color: '#4B2C85', fontSize: 14, fontWeight: '700' },

  timelineListCardModern: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  timelineItemNodeRowModern: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  timelineNodeIconActive: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  timelineNodeIconInactive: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  innerDotInactive: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' },
  timelineVerticalLink: { width: 2, height: 20, backgroundColor: '#22C55E', marginLeft: 13, marginVertical: -2 },

  timelineListCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  timelineItemNodeRow: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  timelineMetaContent: { flex: 1, paddingTop: 1 },
  timelineNodeTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  timelineNodeTime: { fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 18 }
});