import { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@react-navigation/elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const scale = (size: number) => (width / 390) * size;

export default function GreetingScreen() {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const check = async () => {
      const val = await AsyncStorage.getItem('onboarding_complete');
      if (val !== 'true') setShouldRender(true);
    };
    check();
  }, []);

  if (!shouldRender) return null;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/greetingBackground.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Image source={require('@/assets/images/CaliSpace_logo.png')} style={styles.logo} />
            <Text style={styles.name}>CaliSpace</Text>
            
            <View style={styles.hookContainer}>
            
                <Text style={styles.hookText}>
                  <Text style={{ fontFamily: 'Poppins-Black', color: colors.Ptext }}>YOUR</Text>{'  '}
                  <Text style={{ fontFamily: 'Poppins-Black', color: colors.accent }}>SPACE</Text>
                </Text>
              
              
                <Text style={styles.hookText}>
              <Text style={{ fontFamily: 'Poppins-Black', color: colors.Ptext }}>TO</Text>{'  '}
              <Text style={{ fontFamily: 'Poppins-Black', color: colors.accent }}>TRAIN</Text>
              </Text>

              <Text style={styles.sHookText}>{'The space where calisthenics athletes\ntrain, track and grow'}</Text>
            </View>
            
            <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/(onboarding)/feature1')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            <Text style={styles.marketingSentence}>Join the CaliSpace community</Text>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151414',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  hookContainer: {
    flexDirection: 'column',
    marginTop: Math.min(height * 0.07, 60),
    gap: 5,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#D70000',
    paddingVertical: 12,
    width: '80%',
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#d8d8d883',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    color: colors.Ptext,
    fontSize: scale(22),
    fontWeight: '700',
  },
  logo: {
    height: scale(110),
    width: scale(130),
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    color: '#D70000',
    fontSize: scale(36),
    letterSpacing: -1,
    marginTop: 8,
  },
  hookText: {
    fontFamily: 'Poppins-Black',
    fontSize: scale(40),
    letterSpacing: -1,
    lineHeight: scale(42),
    textAlign: 'center',
  },
  sHookText: {
    maxWidth: width * 0.85,
    fontFamily: 'Poppins-Black',
    fontSize: scale(15),
    textAlign: 'center',
    color: colors.Stext,
    marginTop: 16,
  },
  marketingSentence: {
    fontFamily: 'Poppins-Bold',
    marginTop: 10,
    fontSize: scale(14),
    textAlign: 'center',
    color: colors.Ptext,
  },
  bottomSection: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 60,

  }
});