import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type ModalProps,
} from 'react-native';
import type { PickerBodyProps } from './PickerBody';
import { PickerBody } from './PickerBody';

export interface ColorPickerModalProps extends PickerBodyProps {
  visible: boolean;
  onClose: () => void;
  modalProps?: Partial<ModalProps>;
}

export function ColorPickerModal({
  visible,
  onClose,
  modalProps,
  ...pickerProps
}: ColorPickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...modalProps}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.cardWrapper}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.card}>
            <PickerBody {...pickerProps} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardWrapper: {
    maxWidth: '100%',
  },
  card: {
    maxWidth: 340,
  },
});
