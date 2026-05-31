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
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const PRESETS = [
  { label: '30s', minutes: 0, seconds: 30 },
  { label: '1m', minutes: 1, seconds: 0 },
  { label: '5m', minutes: 5, seconds: 0 },
  { label: '10m', minutes: 10, seconds: 0 },
];

export default function TimerScreen() {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isAlarming, setIsAlarming] = useState(false);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<any>(null);
  const alarmRef = useRef<any>(null);

  const currentPreset = PRESETS[selectedPreset];

  const startAlarm = () => {
    setIsAlarming(true);
    if (!muted) {
      alarmRef.current = setInterval(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }, 800);
    }
  };

  const stopAlarm = () => {
    setIsAlarming(false);
    clearInterval(alarmRef.current);
    alarmRef.current = null;
  };

  const stopTimer = () => {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
  stopAlarm();
  setIsRunning(false);
};

  const handleStartStop = () => {
  if (isAlarming || isRunning) {
    stopTimer();
    return;
  }
  setIsRunning(true);
};

  const handleReset = () => {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
  stopAlarm();
  setIsRunning(false);
  setTimeLeft(currentPreset.minutes * 60 + currentPreset.seconds);
};

  const handleQuit = () => {
    stopTimer();
    router.replace('/(tabs)/Tools');
  };

  const handlePreset = (index: number) => {
    if (isRunning || isAlarming) return;
    setSelectedPreset(index);
    const p = PRESETS[index];
    setTimeLeft(p.minutes * 60 + p.seconds);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            startAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (muted && alarmRef.current) {
      clearInterval(alarmRef.current);
      alarmRef.current = null;
    } else if (!muted && isAlarming) {
      alarmRef.current = setInterval(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }, 800);
    }
  }, [muted]);

  const displayMinutes = Math.floor(timeLeft / 60);
  const displaySeconds = timeLeft % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Timer</Text>
      <Text style={styles.subtitle}>set a timer for your breaks and sets</Text>

      {/* Presets */}
      <View style={styles.presets}>
        {PRESETS.map((p, i) => (
          <TouchableOpacity
            key={p.label}
            style={[styles.presetButton, selectedPreset === i && styles.presetButtonActive]}
            onPress={() => handlePreset(i)}
          >
            <Text style={[styles.presetText, selectedPreset === i && styles.presetTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Display */}
      <View style={[styles.displayBox, isAlarming && styles.displayBoxAlarming]}>
        <View style={styles.timeRow}>
          <Text style={styles.timeDigit}>{pad(displayMinutes)}</Text>
          <Text style={styles.timeSeparator}>:</Text>
          <Text style={styles.timeDigit}>{pad(displaySeconds)}</Text>
        </View>
        <View style={styles.labels}>
          <Text style={styles.labelText}>MIN</Text>
          <Text style={styles.labelDivider}>|</Text>
          <Text style={styles.labelText}>SEC</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleStartStop}>
          <Text style={styles.buttonText}>{isRunning || isAlarming ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleQuit}>
          <Text style={styles.buttonText}>Quit</Text>
        </TouchableOpacity>
      </View>

      {/* Mute */}
      <TouchableOpacity style={styles.muteButton} onPress={() => setMuted((m) => !m)}>
        <Ionicons
          name={muted ? 'volume-mute-outline' : 'volume-high-outline'}
          size={22}
          color={muted ? colors.accent : colors.icons}
        />
        <Text style={[styles.muteText, muted && { color: colors.accent }]}>
          {muted ? 'Unmute' : 'Mute'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151414',
    alignItems: 'center',
    paddingTop: 30,
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
    marginBottom: 20,
  },
  presets: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    backgroundColor: '#1E1C1C',

  },
  presetButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    backgroundColor: '#1E1C1C',
  },
  presetButtonActive: {
    backgroundColor: '#7203037e',
    
  },
  presetText: {
    color: colors.icons,
    fontSize: 13,
    fontFamily: 'Poppins-bold',
  },
  presetTextActive: {
    color: colors.Ptext,
  },
  displayBox: {
    width: '100%',
    backgroundColor: '#1E1C1C',
    borderWidth: 0.5,
    borderColor: '#ffffff21',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 28,
  },
  displayBoxAlarming: {
    borderColor: '#D70000',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeDigit: {
    color: '#D70000',
    fontSize: 64,
    fontFamily: 'Poppins-SemiBold',
    width: 90,
    textAlign: 'center',
  },
  timeSeparator: {
    color: '#D70000',
    fontSize: 64,
    fontFamily: 'Poppins-SemiBold',
    width: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  labels: {
    flexDirection: 'row',
    gap: 10,
  },
  labelText: {
    color: colors.icons,
    fontSize: 12,
    fontFamily: 'Poppins-bold',
    letterSpacing: 2,
    width: 90,
    textAlign: 'center',
  },
  labelDivider: {
    color: colors.icons,
    fontSize: 12,
    width: 20,
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
  muteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  muteText: {
    color: colors.icons,
    fontSize: 14,
    fontFamily: 'Poppins-bold',
  },
});