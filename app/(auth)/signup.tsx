import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors'
import { wheights } from '@/constants/wheights'
import { Text } from '@react-navigation/elements';

export default function SignUpScreen() {
  const router = useRouter()
  return (
    <>
    <Text>Signup</Text>
    <TouchableOpacity onPress={() => router.replace('/(tabs)/Home')}>
        <Text>go to home for now</Text>
    </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  
});