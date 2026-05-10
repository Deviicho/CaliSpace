import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import { TouchableOpacity, View, Dimensions } from 'react-native'
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors'
import { wheights } from '@/constants/wheights'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@react-navigation/elements';

const { width, height } = Dimensions.get('window');

export default function GreetingScreen() {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const check = async () => {
      // await AsyncStorage.removeItem('onboarding_complete');  //use this for testing the onboarding
      const val = await AsyncStorage.getItem('onboarding_complete');
      if (val !== 'true') setShouldRender(true);
    };
    check();
  }, []);

  if (!shouldRender) return null;

  return (
    <View style={styles.container}>
      
      <ImageBackground 
        source={require('@/assets/images/fittness background.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          
          <Image source={require('@/assets/images/CaliSpace_logo.png')}
                 style={styles.logo} />

          <Text style={styles.name}>CaliSpace</Text>

          <Text style={styles.hookText}><Text style={{fontFamily: 'Poppins-Black', color: colors.Ptext}}>YOUR</Text> <Text style={{fontFamily: 'Poppins-Black', color: colors.accent}}>SPACE</Text>          <Text style={{fontFamily: 'Poppins-Black', color: colors.Ptext}}>TO</Text> <Text style={{fontFamily: 'Poppins-Black', color: colors.accent}}>TRAIN</Text></Text>

          <Text style={styles.sHookText}>{'The space where calisthenics athletes\ntrain, track and grow'}</Text>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.replace('/(onboarding)/feature1')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <Text style={styles.marketingSentence}>Join the CaliSpace community</Text>

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
    paddingTop: width * 0.25,
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#D70000',
    padding: 12,
    width: '80%',
    borderRadius: 14,
    alignItems: 'center',
    minWidth: width*0.25,
    borderWidth: 0.5,
    borderColor: '#d8d8d883',  
    borderStyle: 'solid',
  },
  buttonText: {
    fontFamily: 'Poppins-bold',
    color: colors.Ptext,
    fontSize: 35,
    fontWeight: '700',
  },
  logo: {
    height: 130,
    width: 150,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    color: '#D70000',
    fontSize: 40,
    letterSpacing: -1,
  },
  hookText: {
    fontFamily: 'Poppins-Black', 
    marginTop: height*0.11,
    fontSize: 45,
    letterSpacing: -1, 
    lineHeight: 50,
    textAlign: 'center',
  },
  sHookText: {
    minWidth:width*1,
    fontFamily: 'Poppins-Black',
    fontSize: 18,
    textAlign: 'center',
    color: colors.Stext,
    marginBottom:height*0.12,
  },
  marketingSentence: {
    fontFamily: 'Poppins-bold',
    marginTop: height*0.055,
    fontSize: 16,
    textAlign: 'center',
    color: colors.Ptext,
  }
});