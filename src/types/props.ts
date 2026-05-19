import type { ModalProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type {
  ColorFormat,
  ColorPickerMode,
  ColorValue,
  PickerPresentation,
} from './color';

export interface ColorPickerInputProps {
  value: string;
  onChange: (color: string, colorObject: ColorValue) => void;

  mode?: ColorPickerMode;
  presentation?: PickerPresentation;

  outputFormat?: ColorFormat;
  displayFormat?: ColorFormat;

  showInputSwatch?: boolean;
  showInputText?: boolean;

  showPresets?: boolean;
  presets?: string[];

  showPreview?: boolean;

  disabled?: boolean;

  inputStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  pickerContainerStyle?: StyleProp<ViewStyle>;

  modalProps?: Partial<ModalProps>;

  onOpen?: () => void;
  onClose?: () => void;
}
