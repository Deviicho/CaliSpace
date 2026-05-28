import { Stack } from 'expo-router';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import SettingsIcon from '../../../assets/icons/settings.svg';
import Logo from '../../../assets/images/CaliSpace_logo.png';
import { colors } from '@/constants/colors';

export default function WorkoutLayout() {
  const router = useRouter();

  const androidFormSheetStyle = Platform.select({
    android: {
      backgroundColor: 'transparent',
    },
    default: undefined,
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[day]" options={{ headerShown: false }} />
      
      <Stack.Screen
        name="exercise-form"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.98],
          headerShown: false,
          contentStyle: androidFormSheetStyle,
        }}
      />
      
      <Stack.Screen
        name="workout-form"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.7],
          headerShown: false,
          contentStyle: androidFormSheetStyle,
        }}
      />
    </Stack>
  );
}