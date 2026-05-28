import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

type Props = {
  message: string;
  onDismiss: () => void;
};

export function Toast({ message, onDismiss }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={18} color="#fff" />
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="close" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 0.5,
    borderColor: '#D70000',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    zIndex: 100,
  },
  text: {
    flex: 1,
    color: colors.Ptext,
    fontSize: 14,
    fontFamily: 'Poppins-bold',
  },
});