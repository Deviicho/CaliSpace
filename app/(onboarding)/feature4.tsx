import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors'
import { wheights } from '@/constants/wheights'
import { Text } from '@react-navigation/elements';
import FeatureStructure from '@/components/FeatureStructure';
import Icon from '../../assets/icons/head-circuit-fill 1.svg';

export default function Feature4Screen() {
  const router = useRouter()
  return (
    <FeatureStructure 
      title={"AI Workout Generation\n(coming soon)"} 
      description={'"Your personal coach. Powered by AI."\nTell us your level, your goals, your equipment and let CaliSpace build the perfect plan for you.'} 
      Icon={Icon} 
      nextPath="/(onboarding)/feature5"
      iconStyle={{}}
      width={240}
      height={200}
    />
  );
}

const styles = StyleSheet.create({
  
});