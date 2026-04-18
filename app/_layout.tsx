import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArrowLeftIcon from '../assets/icons/arrow-fat-left-fill 1.svg';
import { colors } from '@/constants/colors';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_600SemiBold, 
  Poppins_700Bold, 
  Poppins_900Black 
} from '@expo-google-fonts/poppins';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [seenOnboarding, setSeenOnboarding] = useState<boolean | null>(null);
  const [loaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-Black': Poppins_900Black, // This is your "bolder than bold" weight
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);


  useEffect(() => {
    const checkStatus = async () => {
      try {
        await AsyncStorage.clear();
        const val = await AsyncStorage.getItem('onboarding_complete');
        // We set the state based on what we find in storage
        setSeenOnboarding(val === 'true');
        if (seenOnboarding === true) console.log('onboarding is seen')
      } catch (e) {
        setSeenOnboarding(false);
      }
    };
    checkStatus();
  }, []);

  if (!loaded && !error) {
    return null;
  }
  // IMPORTANT: Do not render the Stack until we know the onboarding status
  if (seenOnboarding === null) return null;

  return (
    <>
      <Stack
        // This is the NEW logic. It chooses the "Starting Folder" 
        // based on your AsyncStorage value.
        initialRouteName={seenOnboarding ? "(tabs)" : "(onboarding)"}
        screenOptions={{ 
          contentStyle: { backgroundColor: '#151414' },
          headerShown: false 
        }}
      >
        {/* These just tell the app "these folders exist" */}
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            headerStyle: { 
              backgroundColor: '#151414',
              borderBottomWidth: 1,
              borderBottomColor: '#d9d9d97c',
            } as any,
            headerTitle: () => null,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 16 }}
              >
                <ArrowLeftIcon width={25} height={25} fill={colors.icons} />
                <Text style={{ color: colors.Ptext, fontSize: 20 }}>Settings</Text>
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <StatusBar style="light" />
    </>
  );
}