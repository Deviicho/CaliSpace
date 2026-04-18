import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors'
import { wheights } from '@/constants/wheights'
import { Text } from '@react-navigation/elements';

export default function HomeScreen() {
  const router = useRouter()
  return (
    <>
    <Text>home</Text>
    </>
  );
}

const styles = StyleSheet.create({
  
});