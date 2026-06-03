import { Stack, useRouter, useSegments } from 'expo-router';
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
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const determineRoute = async () => {
      try {
        const val = await AsyncStorage.getItem('onboarding_complete');
        const seenOnboarding = val === 'true';
        const inAuthGroup = segments[0] === '(auth)';
        const inOnboardingGroup = segments[0] === '(onboarding)';

        if (isSignedIn) {
          if (inAuthGroup || inOnboardingGroup) {
            router.replace('/(tabs)/Home');
          }
        } else {
          if (seenOnboarding && !inAuthGroup) {
            router.replace('/(auth)/signup');
          } else if (!seenOnboarding && !inOnboardingGroup) {
            router.replace('/(onboarding)');
          }
        }
      } catch (e) {
        console.warn('Routing validation error:', e);
      } finally {
        setNavigationReady(true);
      }
    };

    determineRoute();
  }, [isSignedIn, isLoaded, segments]);

  // Don't block rendering — show nothing briefly instead of indefinite blank
  if (!navigationReady) return null;

  return (
    <Stack
      screenOptions={{ 
        contentStyle: { backgroundColor: '#151414' },
        headerShown: false 
      }}
    >
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
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-Black': Poppins_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <InitialLayout />
        <StatusBar style="light" />
      </ClerkLoaded>
    </ClerkProvider>
  );
}