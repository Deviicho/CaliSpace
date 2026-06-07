import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGlow from '@/components/BackgorundGlow';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { colors } from '@/constants/colors';
import Icon from '@/assets/icons/cloud-check-fill 1.svg';

const { width, height } = Dimensions.get('window');
const scale = (size: number) => (width / 390) * size;
const iconSize = Math.min(width * 0.55, 220);

export default function Feature5Screen() {
  const router = useRouter();

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('onboarding_complete', 'true');
      router.replace('/(auth)/signup');
    } catch (e) {
      console.error('Failed to save onboarding state', e);
    }
  };

  return (
    <>
      <BackgroundGlow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Icon fill={'#D70000'} width={iconSize} height={iconSize} />
        <Text style={styles.title}>Cloud Sync</Text>
        <Text style={styles.description}>
          {'"Your progress, always with you."\nYour data is securely saved and synced across sessions — never lose a workout, no matter what device you\'re on.'}
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: height * 0.07,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    marginTop: Math.min(height * 0.03, 24),
    fontFamily: 'Poppins-Black',
    fontSize: scale(26),
    letterSpacing: -1,
    color: colors.Ptext,
    textAlign: 'center',
  },
  description: {
    marginTop: Math.min(height * 0.02, 16),
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: width * 0.8,
    color: colors.Stext,
    fontSize: scale(14),
  },
  buttonsContainer: {
    width: width,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
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
  buttonText: {
    fontFamily: 'Poppins-Bold',
    color: colors.Ptext,
    fontSize: scale(18),
    fontWeight: '700',
  },
});