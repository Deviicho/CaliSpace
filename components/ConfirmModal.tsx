import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { colors } from '@/constants/colors';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ visible, title, message, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  box: {
    backgroundColor: '#202020',
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    borderRadius: 12,
    padding: 24,
    width: '100%',
  },
  title: {
    color: colors.Ptext,
    fontSize: 17,
    fontFamily: 'Poppins-bold',
    marginBottom: 8,
  },
  message: {
    color: colors.Stext,
    fontSize: 14,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ffffff41',
    alignItems: 'center',
  },
  cancelText: {
    color: colors.Stext,
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 5,
    backgroundColor: '#D70000',
    alignItems: 'center',
  },
  deleteText: {
    color: colors.Ptext,
    fontSize: 14,
    fontFamily: 'Poppins-bold',
  },
});