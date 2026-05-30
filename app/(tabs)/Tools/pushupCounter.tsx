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

const DEBOUNCE_MS = 600;

export default function PushupCounterScreen() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const isNear = useRef(false);
  const lastRepTime = useRef(0);
  const subscription = useRef<any>(null);

  const startListening = async () => {
    const ExpoProximity = require('expo-proximity');
    const isAvailable = await ExpoProximity.isAvailableAsync();
    if (!isAvailable) {
      alert('Proximity sensor is not available on this device.');
      return;
    }

    ExpoProximity.setUpdateInterval(100);
    subscription.current = ExpoProximity.addListener(({ near }: { near: boolean }) => {
      const now = Date.now();
      if (near && !isNear.current) {
        isNear.current = true;
        if (now - lastRepTime.current > DEBOUNCE_MS) {
          lastRepTime.current = now;
          setCount((prev) => prev + 1);
        }
      }
      if (!near && isNear.current) {
        isNear.current = false;
      }
    });
  };

  const stopListening = () => {
    subscription.current?.remove();
    subscription.current = null;
    isNear.current = false;
    lastRepTime.current = 0;
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

      {!isRunning && (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            📱 Place your phone flat on the floor under your chest, screen facing up, then press Start.
          </Text>
        </View>
      )}

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
    marginBottom: 32,
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
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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