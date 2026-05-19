import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  type LayoutRectangle,
} from 'react-native';
import type { PickerBodyProps } from './PickerBody';
import { PickerBody } from './PickerBody';

export interface ColorPickerPopoverProps extends PickerBodyProps {
  visible: boolean;
  onClose: () => void;
  anchorLayout: LayoutRectangle | null;
}

export function ColorPickerPopover({
  visible,
  onClose,
  anchorLayout,
  ...pickerProps
}: ColorPickerPopoverProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorLayout) {
      setPosition({
        top: anchorLayout.y + anchorLayout.height + 8,
        left: anchorLayout.x,
      });
    }
  }, [anchorLayout]);

  if (!visible) {
    return null;
  }

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.popover, { top: position.top, left: position.left }]}
          onPress={(e) => e.stopPropagation()}
        >
          <PickerBody {...pickerProps} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  popover: {
    position: 'absolute',
    maxWidth: 340,
  },
});
