import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native'
import SettingsIcon from '../../assets/icons/settings.svg'
import Logo from '../../assets/images/CaliSpace_logo.png'
import { Image } from 'react-native'
import { colors } from '@/constants/colors'

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

import HomeIcon from '../../assets/icons/house-fill.svg'
import WorkoutIcon from '../../assets/icons/workout_plan_builder_filled.svg'
import ToolsIcon from '../../assets/icons/toolbox-fill.svg'

export default function TabLayout() {
  const ACCENT = '#D70000'
  const MUTED =  '#d9d9d9c0'
  const router = useRouter()

  return (
        <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#151414', borderTopColor: '#d9d9d97c' },
      tabBarActiveTintColor: ACCENT,
      tabBarInactiveTintColor: MUTED,
      sceneStyle: { backgroundColor: '#151414' },

      // header
        headerStyle: { 
              backgroundColor: '#151414',
              borderBottomWidth: 0.5,
              borderBottomColor: '#d9d9d97c',
            } as any,
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 16 }}>
            <Image source={Logo} style={{ width: 57, height: 46 }} />
            <Text style={{ color: colors.Ptext, fontSize: 18, fontWeight: '600' }}>CaliSpace</Text>
          </View>
        ),
        headerTitle: () => null,
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/settings')} style={{ marginRight: 16 }}>
            <SettingsIcon width={30} height={30} fill={colors.icons} />
          </TouchableOpacity>
        ),
    }}>
      <Tabs.Screen
        name="Home/index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon width={30} height={30} fill={color} />
        }}
      />
      <Tabs.Screen
        name="Workout/index"
        options={{
          tabBarLabel: 'Plan',
          tabBarIcon: ({ color }) => <WorkoutIcon width={30} height={30} fill={color} />
        }}
      />
      <Tabs.Screen
        name="Tools/index"
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: ({ color }) => <ToolsIcon width={30} height={30} fill={color} />
        }}
      />

      <Tabs.Screen name="Tools/pushupCounter" options={{ href: null }} />
      <Tabs.Screen name="Tools/stopWatch" options={{ href: null }} />
      <Tabs.Screen name="Tools/timer" options={{ href: null }} />
      <Tabs.Screen name="Workout/[day]" options={{ href: null }} />
    </Tabs>
  );
}
