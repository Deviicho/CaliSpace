import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors'
import { wheights } from '@/constants/wheights'
import { Text } from '@react-navigation/elements';
import FeatureStructure from '@/components/FeatureStructure';
import Icon from '../../assets/icons/timer-fill 1.svg';

export default function Feature3Screen() {
  const router = useRouter()
  return (
    <FeatureStructure 
      title="Timing Tools" 
      description={'"Control your pace. Master your rest."\nA precise stopwatch and countdown timer built for athletes. Track hold, sets, cirtcuits, and rest periods without ever leaving your flow'} 
      Icon={Icon} 
      nextPath="/(onboarding)/feature4"
      iconStyle={{}}
      width={240}
      height={240}
    />
  );
}

const styles = StyleSheet.create({
  
});