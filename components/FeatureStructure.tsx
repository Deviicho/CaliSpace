import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import BackgroundGlow from './BackgorundGlow';
import { colors } from '@/constants/colors';

interface Props {
  title: string;
  description: string;
  Icon: any;
  nextPath: Href;
  iconStyle?: object;
  width: number;
  height: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = (size: number) => (screenWidth / 390) * size;
const iconSize = Math.min(screenWidth * 0.55, 220);

const FeatureStructure = ({ title, description, Icon, nextPath, iconStyle }: Props) => {
  const router = useRouter();

  return (
    <>
      <BackgroundGlow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Icon style={[styles.icon, iconStyle]} width={iconSize} height={iconSize} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={() => router.push(nextPath)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/(onboarding)/feature5')}>
            <Text style={[styles.buttonText, { color: colors.Stext }]}>Skip Features</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: screenHeight * 0.07,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  icon: {
    color: '#D70000',
  },
  title: {
    marginTop: Math.min(screenHeight * 0.03, 24),
    fontFamily: 'Poppins-Black',
    fontSize: scale(26),
    letterSpacing: -1,
    color: colors.Ptext,
    textAlign: 'center',
  },
  description: {
    marginTop: Math.min(screenHeight * 0.02, 16),
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: screenWidth * 0.8,
    color: colors.Stext,
    fontSize: scale(14),
  },
  buttonsContainer: {
    width: screenWidth,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 20,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#D70000',
    padding: 10,
    width: '90%',
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#d8d8d883',
  },
  skipButton: {
    marginTop: 12,
    width: '90%',
    backgroundColor: '#d700000e',
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#d8d8d883',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    color: colors.Ptext,
    fontSize: scale(18),
    fontWeight: '700',
  },
});

export default FeatureStructure;