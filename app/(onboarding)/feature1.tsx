import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import FeatureStructure from '@/components/FeatureStructure';
// Ensure this path matches your folder structure exactly
import Icon from '../../assets/icons/workout_plan_builder_filled.svg';

export default function Feature1Screen() {
  const router = useRouter();
  
  return (
    <FeatureStructure 
      title="Workout Plan Builder" 
      description={'"Build your plan. Own your training."\nCreate fully custom workout plans tailored to your goals and schedule. Structure every day, every set, your way.'} 
      Icon={Icon} 
      nextPath="/(onboarding)/feature2"
      iconStyle={{marginLeft: 40}}
      width={240}
      height={240}
    />
  );
}

const styles = StyleSheet.create({}); 