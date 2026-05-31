import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { colors } from '@/constants/colors';
import { useApi } from '@/lib/api';
import { Toast } from '@/components/Toast';
import { ConfirmModal } from '@/components/ConfirmModal';

type WorkoutDay = {
  id: string;
  name: string;
};

export default function WorkoutScreen() {
  const router = useRouter();
  const { request } = useApi();
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchDays = async () => {
    setLoading(true);
    try {
      const data = await request('/api/workout-days');
      setDays(data);
    } catch {
      setToast('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDays();
    }, [])
  );

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      await request('/api/workout-days', {
        method: 'DELETE',
        body: JSON.stringify({ id: confirmDelete.id }),
      });
      setDays((prev) => prev.filter((d) => d.id !== confirmDelete.id));
    } catch {
      setToast('Failed to delete workout');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleAdd = () => {
    if (days.length >= 9) return setToast('Maximum 9 workouts allowed');
    router.push({
      pathname: '/(tabs)/Workout/workout-form',
      params: { count: days.length.toString() },
    });
  };

  const handleEdit = (workout: WorkoutDay) => {
    router.push({
      pathname: '/(tabs)/Workout/workout-form',
      params: { workout: JSON.stringify(workout), count: days.length.toString() },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      <ConfirmModal
        visible={!!confirmDelete}
        title="Delete Workout"
        message={`Are you sure you want to delete "${confirmDelete?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My workout</Text>
        <TouchableOpacity onPress={handleAdd}>
          <Ionicons name="add" size={35} color={colors.Ptext} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <>
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40, marginBottom: 10 }} />
        <Text style={{color: '#d70000', alignSelf: 'center'}}>loading</Text>
        </>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={days}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dayRow}
                onPress={() => router.push(`/Workout/${item.id}`)}
                activeOpacity={0.7}
                onLongPress={() => handleEdit(item)}
              >
                <Text style={styles.dayName}>{item.name}</Text>
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
              <Text style={styles.emptyText}>No workouts yet. Tap + to add one.</Text>
            }
          />
        </View>
      )}
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
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.Ptext,
    fontSize: 23,
    fontFamily: 'Poppins-bold',
  },
  listContainer: {
    backgroundColor: '#202020',
    borderColor: '#ffffff41',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 16,
    minHeight: '70%',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  dayName: {
    color: colors.Ptext,
    fontSize: 16,
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