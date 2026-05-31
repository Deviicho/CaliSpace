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

export default function StopwatchScreen() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const savedElapsedRef = useRef<number>(0);

  const start = () => {
    startTimeRef.current = Date.now() - savedElapsedRef.current;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
    setIsRunning(true);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    savedElapsedRef.current = elapsed;
    setIsRunning(false);
  };

  const handleStartStop = () => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    savedElapsedRef.current = 0;
    setElapsed(0);
    setIsRunning(false);
  };

  const handleQuit = () => {
    handleReset();
    router.replace('/(tabs)/Tools');
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const milliseconds = Math.floor((elapsed % 1000) / 10);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>StopWatch</Text>
      <Text style={styles.subtitle}>test your endurance</Text>

      <View style={[styles.displayBox, isRunning && styles.displayBoxRunning]}>
        <View style={styles.timeRow}>
          <Text style={styles.timeDigit}>{pad(minutes)}</Text>
          <Text style={styles.timeSeparator}>:</Text>
          <Text style={styles.timeDigit}>{pad(seconds)}</Text>
          <Text style={styles.timeSeparator}>:</Text>
          <Text style={styles.timeDigit}>{pad(milliseconds)}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleStartStop}>
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
    marginBottom: 4,
  },
  subtitle: {
    color: colors.icons,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 48,
  },
  displayBox: {
    width: '100%',
    backgroundColor: '#1E1C1C',
    borderWidth: 0.5,
    borderColor: '#ffffff21',
    borderRadius: 12,
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 36,
  },
  displayBoxRunning: {
    borderColor: '#d70000',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeDigit: {
    color: '#D70000',
    fontSize: 56,
    fontFamily: 'Poppins-SemiBold',
    width: 76,
    textAlign: 'center',
  },
  timeSeparator: {
    color: '#D70000',
    fontSize: 56,
    fontFamily: 'Poppins-SemiBold',
    width: 16,
    textAlign: 'center',
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
  primaryButton: {
    backgroundColor: '#3a0000',
    borderColor: '#D70000',
  },
  buttonText: {
    color: colors.Ptext,
    fontSize: 16,
    fontFamily: 'Poppins-bold',
  },
});