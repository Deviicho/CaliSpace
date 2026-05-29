import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { colors } from '@/constants/colors';

const THRESHOLD_DOWN = 1.3;
const THRESHOLD_UP = 1.1;

export default function PushupCounterScreen() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const isDown = useRef(false);
  const subscription = useRef<any>(null);

  const startListening = () => {
    Accelerometer.setUpdateInterval(100);
    subscription.current = Accelerometer.addListener(({ z }) => {
      const absZ = Math.abs(z);
      if (absZ > THRESHOLD_DOWN && !isDown.current) {
        isDown.current = true;
      }
      if (absZ < THRESHOLD_UP && isDown.current) {
        isDown.current = false;
        setCount((prev) => prev + 1);
      }
    });
  };

  const stopListening = () => {
    subscription.current?.remove();
    subscription.current = null;
    isDown.current = false;
  };

  const handleStartStop = () => {
    if (isRunning) {
      stopListening();
      setIsRunning(false);
    } else {
      startListening();
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    stopListening();
    setIsRunning(false);
    setCount(0);
  };

  const handleQuit = () => {
    stopListening();
    setIsRunning(false);
    setCount(0);
    router.back();
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Pushup Counter</Text>
      <Text style={styles.subtitle}>Focus on your workout, we will count for you</Text>

      <View style={styles.circleOuter}>
        <View style={styles.circleInner}>
          <Text style={styles.count}>{count}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleQuit}>
          <Text style={styles.buttonText}>Quit</Text>
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
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#1a0000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D70000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
    marginBottom: 56,
  },
  circleInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1e0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: '#D70000',
    fontSize: 80,
    fontFamily: 'Poppins-bold',
    lineHeight: 90,
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