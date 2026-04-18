import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors'
import { wheights } from '@/constants/wheights'
import { Text } from '@react-navigation/elements';
import FeatureStructure from '@/components/FeatureStructure';
import Icon from '../../assets/icons/pushups_counter_filled_icon 1.svg';

export default function Feature2Screen() {
  const router = useRouter()
  return (
    <FeatureStructure 
      title="Push-up Counter" 
      description={'"Stay focused. We\'ll count for you."\nPlace your phone on your chest and trian without distractions. CaliSpace detects every rep automatically using your device\'s motion sensors.'} 
      Icon={Icon} 
      nextPath="/(onboarding)/feature3"
      iconStyle={{}}
      width={300}
      height={215}
    />
  );
}

const styles = StyleSheet.create({
  
});