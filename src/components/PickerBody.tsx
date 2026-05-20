import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SliderPicker } from '../modes/SliderPicker';
import { WheelSliderPicker } from '../modes/WheelSliderPicker';
import { WheelSquarePicker } from '../modes/WheelSquarePicker';
import type { ColorFormat, ColorPickerMode, HSVColor } from '../types/color';
import { colorValueFromHsv } from '../utils/colorConversions';
import { parseColor } from '../utils/colorParsers';
import { ColorPreview } from './ColorPreview';
import { PresetColors } from './PresetColors';

export interface PickerBodyProps {
  mode: ColorPickerMode;
  hsv: HSVColor;
  onHsvChange: (hsv: HSVColor) => void;
  showPresets: boolean;
  presets: string[];
  showPreview: boolean;
  displayFormat: ColorFormat;
  pickerBackgroundColor?: string;
  pickerTextColor?: string;
  pickerContainerStyle?: StyleProp<ViewStyle>;
}

export function PickerBody({
  mode,
  hsv,
  onHsvChange,
  showPresets,
  presets,
  showPreview,
  displayFormat,
  pickerBackgroundColor,
  pickerTextColor,
  pickerContainerStyle,
}: PickerBodyProps) {
  const handlePresetSelect = (preset: string) => {
    const parsed = parseColor(preset);
    onHsvChange(parsed.hsv);
  };

  const colorValue = colorValueFromHsv(hsv);

  const renderMode = () => {
    switch (mode) {
      case 'slider':
        return <SliderPicker hsv={hsv} onChange={onHsvChange} />;
      case 'wheel-slider':
        return <WheelSliderPicker hsv={hsv} onChange={onHsvChange} />;
      case 'wheel-square':
      default:
        return <WheelSquarePicker hsv={hsv} onChange={onHsvChange} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        pickerBackgroundColor != null && {
          backgroundColor: pickerBackgroundColor,
        },
        pickerContainerStyle,
      ]}
    >
      {showPresets ? (
        <PresetColors presets={presets} onSelect={handlePresetSelect} />
      ) : null}
      {renderMode()}
      {showPreview ? (
        <ColorPreview
          color={colorValue}
          displayFormat={displayFormat}
          textColor={pickerTextColor}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
