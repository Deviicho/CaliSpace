import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { colors } from '@/constants/colors';
import { useApi } from '@/lib/api';
import { Toast } from '@/components/Toast';
import { ConfirmModal } from '@/components/ConfirmModal';

type Exercise = {
  id: string;
  name: string;
  sets: number;
  value: number;
  unit: 'reps' | 'seconds' | 'minutes';
  note?: string;
};

const formatExercise = (exercise: Exercise) => {
  const unit =
    exercise.unit === 'reps' ? 'reps' : exercise.unit === 'seconds' ? 's' : 'm';
  return `${exercise.name} : ${exercise.value}${unit}×${exercise.sets}`;
};

export default function WorkoutDayScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const router = useRouter();
  const { request } = useApi();

  const [dayName, setDayName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await request(`/api/exercises?dayId=${day}`);
      setExercises(data);
    } catch {
      setToast('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const fetchDayName = async () => {
    try {
      const data = await request('/api/workout-days');
      const found = data.find((d: any) => d.id === day);
      if (found) setDayName(found.name);
    } catch {}
  };

  useFocusEffect(
    useCallback(() => {
      fetchDayName();
      fetchExercises();
    }, [])
  );

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      await request('/api/exercises', {
        method: 'DELETE',
        body: JSON.stringify({ id: confirmDelete.id }),
      });
      setExercises((prev) => prev.filter((e) => e.id !== confirmDelete.id));
    } catch {
      setToast('Failed to delete exercise');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleAdd = () => {
    if (exercises.length >= 9) return setToast('Maximum 9 exercises per workout');
    router.push({
      pathname: '/(tabs)/Workout/exercise-form',
      params: { dayId: day, count: exercises.length.toString() },
    });
  };

  const handleEdit = (exercise: Exercise) => {
    router.push({
      pathname: '/(tabs)/Workout/exercise-form',
      params: { exercise: JSON.stringify(exercise), count: exercises.length.toString() },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      <ConfirmModal
        visible={!!confirmDelete}
        title="Delete Exercise"
        message={`Are you sure you want to delete "${confirmDelete?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />

      <View style={styles.listContainer}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/Workout')}>
              <Text style={[styles.sectionTitle, { marginBottom: 3, fontSize: 15, color: '#888' }]}>Workout</Text>
            </TouchableOpacity>
            <Text style={[styles.sectionTitle, { marginBottom: 7, color: '#888' }]}>›</Text>
            <Text style={styles.sectionTitle}>{dayName}</Text>
          </View>
          <TouchableOpacity style={{ marginRight: -8 }} onPress={handleAdd}>
            <Ionicons name="add" size={35} color={colors.Ptext} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} size="large" style={{ marginVertical: 24 }} />
        ) : (
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.exerciseRow}
                onPress={() => handleEdit(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.exerciseName}>{formatExercise(item)}</Text>
                <TouchableOpacity
                  onPress={() => setConfirmDelete({ id: item.id, name: item.name })}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.accent} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No exercises yet. Tap + to add one.</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151414',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    color: colors.Ptext,
    fontSize: 20,
    fontFamily: 'Poppins-bold',
  },
  listContainer: {
    backgroundColor: '#202020',
    borderColor: '#ffffff41',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 16,
    minHeight: '80%',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  exerciseName: {
    color: colors.Ptext,
    fontSize: 15,
    fontFamily: 'Poppins-bold',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#2E2E2E',
  },
  emptyText: {
    color: colors.icons,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
});