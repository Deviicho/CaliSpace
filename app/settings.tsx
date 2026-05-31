import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { useState } from 'react';
import { colors } from '@/constants/colors';
import { Toast } from '@/components/Toast';

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [name, setName] = useState(user?.username ?? 'CaliPal');
  const [editingName, setEditingName] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Notification placeholder — wire up later
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleSaveName = async () => {
  if (!name.trim()) return setToast('Name cannot be empty');
  try {
    await user?.update({ username: name.trim() });
    await user?.reload();
    setEditingName(false);
    setToast('Name updated successfully');
  } catch (e) {
    console.log('Name update error:', e);
    setToast('Failed to update name');
  }
};

  return (
    <View style={styles.container}>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      {/* Notifications — placeholder */}
      {/* TODO: wire up push notification permissions and weekly reminder logic */}
      {/* <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={20} color={colors.icons} />
            <Text style={styles.rowText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#2c2c2c', true: '#D70000' }}
            thumbColor={colors.Ptext}
          />
        </View>
      </View> */}

      {/* Change Name */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={() => setEditingName((v) => !v)}>
          <View style={styles.rowLeft}>
            <Ionicons name="person-outline" size={20} color={colors.icons} />
            <Text style={styles.rowText}>Change name</Text>
          </View>
          <Ionicons
            name={editingName ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.icons}
          />
        </TouchableOpacity>

        {editingName && (
          <View style={styles.nameInputRow}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.icons}
              autoFocus
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Instagram */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('https://www.instagram.com/michel.k.7?igsh=bjlwNW8xaDNreTEO')}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="logo-instagram" size={20} color={colors.icons} />
            <Text style={styles.rowText}>Instagram</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={colors.icons} />
        </TouchableOpacity>
      </View>

      {/* Made by */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="code-slash-outline" size={20} color={colors.icons} />
            <Text style={styles.rowText}>Made by Michel.k.7</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <Ionicons name="log-out-outline" size={20} color={colors.accent} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  section: {
    backgroundColor: '#202020',
    borderWidth: 0.5,
    borderColor: '#ffffff21',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    color: colors.Ptext,
    fontSize: 15,
    fontFamily: 'Poppins-bold',
  },
  nameInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  nameInput: {
    flex: 1,
    backgroundColor: '#151414',
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.Ptext,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#D70000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
  saveButtonText: {
    color: colors.Ptext,
    fontSize: 14,
    fontFamily: 'Poppins-bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#202020',
    borderWidth: 0.5,
    borderColor: '#ffffff21',
    borderRadius: 8,
    marginTop: 8,
  },
  logoutText: {
    color: colors.accent,
    fontSize: 15,
    fontFamily: 'Poppins-bold',
  },
});