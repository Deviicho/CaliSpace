import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { Text } from '@react-navigation/elements';
import StopwatchImg from '../../../assets/icons/timer-fill 1.svg';
import TimerImg from '../../../assets/icons/alarm-fill 1.svg';
import PushupCounterImg from '../../../assets/icons/pushups_counter_filled_icon.svg';
import { Ionicons } from '@expo/vector-icons';

export default function ToolsScreen() {
  return (
    <View>
      <View style={{flexDirection: 'column', paddingLeft: 20, paddingTop: 10}}>
        <Text style={styles.Ptext}>Tools</Text>
        <Text style={styles.Stext}>Extra <Text style={styles.Atext}>Focus</Text> , Extra <Text style={styles.Atext}>Build</Text></Text>
      </View>
      <View style={styles.devider}></View>
      <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 15, gap: 15}}>

        <Link href={'/(tabs)/Tools/stopWatch'} style={styles.toolLink}>
        <View style={styles.toolBlock}>
          <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}><StopwatchImg fill={colors.accent} width={90} height={90} /></View>
          <View style={{flexDirection: 'column', gap: 4,width: '50%', paddingTop: 5}}>
            <Text style={[styles.Ptext, {fontSize: 23}]}>Stopwatch</Text>
            <Text style={[styles.Stext, {fontSize: 14, maxWidth: '100%'}]}>Figure out how long can you last on an exercise.</Text>
          </View>
          <View style={{width: '20%', justifyContent: 'center', alignItems: 'center'}}><View style={{backgroundColor: '#2c2c2c',
                                                     borderColor: '#ffffff41',
                                                     borderWidth: 0.5,
                                                     borderRadius: 30,
                                                     width: '55%',
                                                     alignItems: 'center',
                                                     justifyContent: 'center',
                                                     padding: 5,
                                                     }}>
          <Ionicons name="chevron-forward" size={26} color={colors.Ptext} />
      </View></View>
        </View>
        </Link>

      <Link href={'/(tabs)/Tools/timer'} style={styles.toolLink}>
      <View style={styles.toolBlock}>
          <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}><TimerImg fill={colors.accent} width={90} height={90} /></View>
          <View style={{flexDirection: 'column', gap: 4,width: '50%', paddingTop: 5}}>
            <Text style={[styles.Ptext, {fontSize: 23}]}>Timer</Text>
            <Text style={[styles.Stext, {fontSize: 14, maxWidth: '100%'}]}>Set a timer for your sets and breaks.</Text>
          </View>
          <View style={{width: '20%', justifyContent: 'center', alignItems: 'center'}}><View style={{backgroundColor: '#2c2c2c',
                                                     borderColor: '#ffffff41',
                                                     borderWidth: 0.5,
                                                     borderRadius: 30,
                                                     width: '55%',
                                                     alignItems: 'center',
                                                     justifyContent: 'center',
                                                     padding: 5,
                                                     }}>
          <Ionicons name="chevron-forward" size={26} color={colors.Ptext} />
      </View></View>
        </View>
        </Link>

      <Link href={'/(tabs)/Tools/pushupCounter'} style={styles.toolLink}>
      <View style={styles.toolBlock}>
          <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}><PushupCounterImg fill={colors.accent} width={90} height={90} /></View>
          <View style={{flexDirection: 'column', gap: 4,width: '50%', paddingTop: 5}}>
            <Text style={[styles.Ptext, {fontSize: 20}]}>PushupCounter</Text>
            <Text style={[styles.Stext, {fontSize: 14, maxWidth: '100%'}]}>Figure out how long can you last on an exercise.</Text>
          </View>
          <View style={{width: '20%', justifyContent: 'center', alignItems: 'center'}}><View style={{backgroundColor: '#2c2c2c',
                                                     borderColor: '#ffffff41',
                                                     borderWidth: 0.5,
                                                     borderRadius: 30,
                                                     width: '55%',
                                                     alignItems: 'center',
                                                     justifyContent: 'center',
                                                     padding: 5,
                                                     }}>
          <Ionicons name="chevron-forward" size={26} color={colors.Ptext} />
      </View></View>
        </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Ptext: {
    fontFamily: 'Poppins-bold',
    color: colors.Ptext,
    fontSize: 30,
  },
  Stext: {
    fontFamily: 'Poppins-bold',
    color: colors.Stext,
    fontSize: 15
  },
  Atext: {
    fontFamily: 'Poppins-bold',
    color: '#ff0000',
    fontSize: 15
  },
  devider: {
    width: '92%',
    height: .5,
    backgroundColor: '#e2e2e254',
    marginTop: 10,
    alignSelf: 'center'
  },
  toolBlock: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    
  },
  toolLink: {
    backgroundColor: '#202020',
    borderColor: '#ffffff41',
    borderWidth: 0.5,
    borderRadius: 5,
    width: '92%',
    shadowColor: '#d70000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    gap: 5,
  }
});