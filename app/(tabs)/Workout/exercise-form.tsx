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

type Unit = 'reps' | 'seconds' | 'minutes';
const UNITS: Unit[] = ['reps', 'seconds', 'minutes'];

const MAX_NAME = 20;
const MAX_NOTE = 120;
const MAX_SETS = 99;
const MAX_VALUE = 999;

export default function ExerciseFormScreen() {
  const router = useRouter();
  const { request } = useApi();
  const { exercise, dayId, count } = useLocalSearchParams<{ exercise?: string; dayId?: string; count?: string }>();
  const parsed = exercise ? JSON.parse(exercise) : null;
  const isEditing = !!parsed;
  const currentCount = Number(count ?? 0);

  const [name, setName] = useState(parsed?.name ?? '');
  const [sets, setSets] = useState(parsed?.sets?.toString() ?? '');
  const [value, setValue] = useState(parsed?.value?.toString() ?? '');
  const [unit, setUnit] = useState<Unit>(parsed?.unit ?? 'reps');
  const [note, setNote] = useState(parsed?.note ?? '');
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleSetsChange = (text: string) => {
    const num = Number(text);
    if (text === '' || (num >= 1 && num <= MAX_SETS)) setSets(text);
  };

  const handleValueChange = (text: string) => {
    const num = Number(text);
    if (text === '' || (num >= 1 && num <= MAX_VALUE)) setValue(text);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return setToast('Name is required');
    if (name.length > MAX_NAME) return setToast(`Name must be ${MAX_NAME} characters or less`);
    if (!sets) return setToast('Sets is required');
    if (!value) return setToast('Value is required');
    if (note.length > MAX_NOTE) return setToast(`Note must be ${MAX_NOTE} characters or less`);
    if (!isEditing && currentCount >= 9) return setToast('Maximum 9 exercises per workout');

    try {
      if (isEditing) {
        await request('/api/exercises', {
          method: 'PUT',
          body: JSON.stringify({
            id: parsed.id,
            name,
            sets: Number(sets),
            value: Number(value),
            unit,
            note,
          }),
        });
      } else {
        await request('/api/exercises', {
          method: 'POST',
          body: JSON.stringify({
            day_id: dayId,
            name,
            sets: Number(sets),
            value: Number(value),
            unit,
            note,
          }),
        });
      }
      router.back();
    } catch {
      setToast('Failed to save exercise');
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
          <Text style={styles.title}>{isEditing ? 'Edit Exercise' : 'New Exercise'}</Text>

          <Text style={styles.label}>
            Name{' '}
            <Text style={{ color: name.length > MAX_NAME ? colors.accent : colors.icons, fontSize: 12 }}>
              {name.length}/{MAX_NAME}
            </Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Pushups"
            placeholderTextColor={colors.icons}
            maxLength={MAX_NAME}
          />

          <Text style={styles.label}>Sets <Text style={styles.hint}>(max 99)</Text></Text>
          <TextInput
            style={styles.input}
            value={sets}
            onChangeText={handleSetsChange}
            placeholder="e.g. 3"
            placeholderTextColor={colors.icons}
            keyboardType="numeric"
            maxLength={2}
          />

          <Text style={styles.label}>Value <Text style={styles.hint}>(max 999)</Text></Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={handleValueChange}
            placeholder="e.g. 30"
            placeholderTextColor={colors.icons}
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.label}>Unit</Text>
          <View style={styles.unitRow}>
            {UNITS.map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.unitButton, unit === u && styles.unitButtonActive]}
                onPress={() => setUnit(u)}
              >
                <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>
            Note <Text style={styles.optional}>(optional) </Text>
            <Text style={{ color: note.length > MAX_NOTE ? colors.accent : colors.icons, fontSize: 12 }}>
              {note.length}/{MAX_NOTE}
            </Text>
          </Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Go fully down till chest touches ground"
            placeholderTextColor={colors.icons}
            multiline
            maxLength={MAX_NOTE}
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
  hint: {
    color: colors.icons,
    fontSize: 12,
    fontFamily: 'Poppins-bold',
  },
  optional: {
    color: colors.icons,
    fontFamily: 'Poppins-bold',
    fontSize: 13,
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
  noteInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  unitRow: {
    flexDirection: 'row',
    gap: 10,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    backgroundColor: '#202020',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#D70000',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ffffff41',
  },
  unitText: {
    color: colors.Stext,
    fontSize: 14,
  },
  unitTextActive: {
    color: colors.Ptext,
    fontFamily: 'Poppins-bold',
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