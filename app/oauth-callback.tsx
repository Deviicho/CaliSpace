import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(tabs)/Home');
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#151414' }} />;
}