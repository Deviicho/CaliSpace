import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useRef, useState } from 'react';
import { useApi } from '@/lib/api';
import { Toast } from '@/components/Toast';

const MAX_NAME = 165;

export default function WorkoutFormScreen() {
  const router = useRouter();
  const { request } = useApi();
  const { workout, count } = useLocalSearchParams<{ workout?: string; count?: string }>();
  const parsed = workout ? JSON.parse(workout) : null;
  const isEditing = !!parsed;
  const currentCount = Number(count ?? 0);

  const [name, setName] = useState(parsed?.name ?? '');
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleSubmit = async () => {
    if (!name.trim()) return setToast('Title is required');
    if (name.length > MAX_NAME) return setToast(`Title must be ${MAX_NAME} characters or less`);
    if (!isEditing && currentCount >= 9) return setToast('Maximum 9 workouts allowed');

    try {
      if (isEditing) {
        await request('/api/workout-days', {
          method: 'PUT',
          body: JSON.stringify({ id: parsed.id, name }),
        });
      } else {
        await request('/api/workout-days', {
          method: 'POST',
          body: JSON.stringify({ name }),
        });
      }
      router.back();
    } catch {
      setToast('Failed to save workout');
    }
  };

  return (
    <View style={styles.screenWrapper}>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
        keyboardVerticalOffset={110}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" ref={scrollRef}>
          <Text style={styles.title}>{isEditing ? 'Edit Workout' : 'New Workout'}</Text>

          <Text style={styles.label}>
            Title{' '}
            <Text style={{ color: name.length > MAX_NAME ? colors.accent : colors.icons, fontSize: 12 }}>
              {name.length}/{MAX_NAME}
            </Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Monday"
            placeholderTextColor={colors.icons}
            maxLength={MAX_NAME}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>{isEditing ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#151414',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    backgroundColor: '#151414',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    color: colors.Ptext,
    fontSize: 20,
    fontFamily: 'Poppins-bold',
    marginBottom: 24,
  },
  label: {
    color: colors.Ptext,
    fontSize: 14,
    fontFamily: 'Poppins-bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#202020',
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.Ptext,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    alignItems: 'center',
  },
  cancelText: {
    color: colors.Stext,
    fontSize: 15,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    backgroundColor: '#D70000',
    alignItems: 'center',
  },
  submitText: {
    color: colors.Ptext,
    fontSize: 15,
    fontFamily: 'Poppins-bold',
  },
});