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

  /** Input field background. Defaults to `#fff`. */
  inputBackgroundColor?: string;
  /** Input label text color. Defaults to `#222`. */
  inputTextColor?: string;
  /** Picker panel background. Defaults to `#fff`. */
  pickerBackgroundColor?: string;
  /** Picker preview text color. Defaults to `#333`. */
  pickerTextColor?: string;

  inputStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  pickerContainerStyle?: StyleProp<ViewStyle>;

  modalProps?: Partial<ModalProps>;

  onOpen?: () => void;
  onClose?: () => void;
}
