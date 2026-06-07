import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { colors } from '@/constants/colors';
import { useProximity } from 'expo-proximity'; // Import the hook at the top level

const DEBOUNCE_MS = 600;

export default function PushupCounterScreen() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // 1. Grab the native sensor state directly using the hook
  const { proximityState } = useProximity();
  
  const isNear = useRef(false);
  const lastRepTime = useRef(0);

  // 2. Track reps inside a useEffect watching the sensor state
  useEffect(() => {
    if (!isRunning) return;

    const now = Date.now();

    // 'near' is true when the chest is close to the sensor
    if (proximityState === true && !isNear.current) {
      isNear.current = true;
      if (now - lastRepTime.current > DEBOUNCE_MS) {
        lastRepTime.current = now;
        setCount((prev) => prev + 1);
      }
    }
    
    // 'near' turns false when pushing back up
    if (proximityState === false && isNear.current) {
      isNear.current = false;
    }
  }, [proximityState, isRunning]);

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
    // Reset temporary states when toggling
    isNear.current = false;
  };

  const handleReset = () => {
    setIsRunning(false);
    setCount(0);
    isNear.current = false;
    lastRepTime.current = 0;
  };

  const handleQuit = () => {
    setIsRunning(false);
    setCount(0);
    router.replace('/(tabs)/Tools');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Pushup Counter</Text>
      <Text style={styles.subtitle}>Focus on your workout, we will count for you</Text>

      <View style={styles.circleOuter}>
        
          <Text style={styles.count}>{count}</Text>
        
      </View>

      {!isRunning && (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            (the sensor is near your phone's  front camera)
          </Text>
        </View>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#6d00002a'}]} onPress={handleStartStop}>
          <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#6b1f1f2a'}]} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {borderColor: '#ff000021', }]} onPress={handleQuit}>
          <Text style={[styles.buttonText, {color: colors.Stext}]}>Quit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151414',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 32,
  },
  title: {
    color: colors.Ptext,
    fontSize: 26,
    fontFamily: 'Poppins-bold',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.icons,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 48,
  },
  circleOuter: {
    width: 240,
    height: 240,
    borderRadius: 170,
    backgroundColor: '#181818',
    borderColor: '#ffffff41',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D70000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 40,
    marginBottom: 32,
  },
  count: {
    color: '#D70000',
    fontSize: 115,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 90,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1C1C',
    borderWidth: 0.5,
    borderColor: '#ffffff21',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  warningText: {
    flex: 1,
    color: colors.icons,
    fontSize: 13,
    fontFamily: 'Poppins-bold',
    textAlign: 'center'

  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#1E1C1C',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ffffff21',
  },
  buttonText: {
    color: colors.Ptext,
    fontSize: 16,
    fontFamily: 'Poppins-bold',
  },
});