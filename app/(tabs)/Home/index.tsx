import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View, Image } from 'react-native'
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors'
import { wheights } from '@/constants/wheights'
import { Text } from '@react-navigation/elements';
import WorkoutPlanImg from '../../../assets/icons/workout_plan_builder_filled.svg';
import StopwatchImg from '../../../assets/icons/timer-fill 1.svg';
import TimerImg from '../../../assets/icons/alarm-fill 1.svg';
import { MOTIVATIONAL_QUOTES } from '@/constants/quotes';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const width = 40;
  const height = 40;
  const router = useRouter();
  const {user} = useUser();
  const [activeQuote, setActiveQuote] = useState('');
  const displayName = user?.username ? user.username : 'CaliPal';

  useEffect(() => {
    // Pick a random index from the 100 quotes
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setActiveQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);
  return (
    <>
    <View style={styles.container}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingTextP}>Good evening {displayName}</Text>
          <Text style={styles.greetingTextS}>Stay consistent, train smart</Text>
        </View>
        <Link href={'../Workout'} style={styles.workoutShortcutLink}>
        <View style={styles.workoutShortcutBlock}>
          <View style={styles.upperBlock}>
          <WorkoutPlanImg style={styles.workouticon} width={width} height={height} />
          <Text style={[styles.greetingTextP, {fontSize: 23, marginTop:5}]}>Today's workout</Text>
          </View>
          <View style={styles.dividerLine} />
          <Text style={[styles.greetingTextS, {fontSize: 15, marginTop:10, marginLeft: 15, color:colors.Ptext}]}>Check what do you have for today</Text> 
        </View>
        </Link>

        <Text style={[styles.greetingTextS, {marginLeft: 20}]}>Tools</Text>
        <View style={styles.timingShortcutsBlock}>
          <Link href={'../Tools/stopWatch'} style={styles.timerShortcutLink}>
          <View style={styles.timerShortcut}>
            <StopwatchImg fill={colors.accent} width={100} height={100} />
            <Text style={[styles.greetingTextP, {fontSize: 20}]}>StopWatch</Text>
          </View>
          </Link>
          <Link href={'/(tabs)/Tools/timer'} style={styles.timerShortcutLink}>
          <View style={styles.timerShortcut}>
            <TimerImg fill={colors.accent} width={100} height={100} />
            <Text style={[styles.greetingTextP, {fontSize: 20}]}>Timer</Text>
          </View>
          </Link>
        </View>
        <View style={styles.pushupcounterShortcutBlock}>
          <View style={styles.upperBlock}>
          <Text style={[styles.greetingTextP, {fontSize: 23, marginTop:10, marginLeft:15}]}>Pushup Counter</Text>
          </View>
          <View style={styles.dividerLine} />
          <Text style={[styles.greetingTextS, {fontSize: 15, marginTop:5, marginLeft: 15, color:colors.Ptext}]}>Place your phone under your chest to start</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(tabs)/Tools/pushupCounter')}>
                      <Text style={[styles.greetingTextP, {alignSelf: 'center', marginBottom: 2}]}>Start</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[styles.greetingTextS, {marginLeft: 20}]}>Quote of the day</Text>
          <View style={[styles.dividerLine, {width: '90%', marginBottom: 7}]} />
          <Text style={[styles.greetingTextS, {marginLeft: 20, fontStyle: 'italic', fontSize: 13, lineHeight: 22}]}>{activeQuote}</Text>
        </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 15,
    paddingTop: 10,
    width: '100%',
    height: '100%',

  },
  greetingTextP: {
    color: colors.Ptext,
    fontFamily: 'Poppins-bold',
    fontSize: 24,
    
  },
  greetingTextS: {
    color: colors.Stext,
    fontFamily: 'poppins-SemiBold',
    fontSize: 14,
  },
  greetingBlock: {
    paddingLeft: 20,
  },
  workoutShortcutLink:{
    backgroundColor:'#a0080886',
    width: '90%',
    paddingBottom: 10,  
    alignSelf: 'center', 
    borderColor: '#ffffff41',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  workoutShortcutBlock: {
    width: '100%',
    flexDirection: 'column',

  },
  pushupcounterShortcutBlock: {
    backgroundColor:'#202020',
    width: '90%',
    paddingBottom: 10,  
    alignSelf: 'center', 
    borderColor: '#ffffff41',
    borderWidth: 0.5,
    borderRadius: 5,

  },
  button: {
    backgroundColor: colors.accent,
    width: '92%',
    alignSelf: 'center',
    marginTop: 5,
    padding: 3,
    borderRadius: 5,
    borderColor: '#ffffff41',
    borderWidth: 0.5,
  },
  workouticon: {
    color: colors.icons,
    marginTop: 10,
    marginLeft: 15
  },
  upperBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  dividerLine: {
    width: '92%',
    height: .5,
    backgroundColor: '#e2e2e254',
    marginTop: 10,
    alignSelf: 'center'
    
  },
  timingShortcutsBlock: {
    flexDirection: 'row',
    gap: 14,
    width: '90%',
    marginLeft: 20
  },
  timerShortcut: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  timerShortcutLink: {
    padding: 10,
    width: '48%',
    backgroundColor: '#202020',
    borderColor: '#ffffff41',
    borderWidth: 0.5,
    borderRadius: 5,
  },
});