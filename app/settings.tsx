import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/signup');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151414',
    padding: 20,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#D70000',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#D70000',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});