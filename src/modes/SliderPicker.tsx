import { StyleSheet, View } from 'react-native';
import { BrightnessSlider } from '../controls/BrightnessSlider';
import { HueSlider } from '../controls/HueSlider';
import { SaturationSlider } from '../controls/SaturationSlider';
import type { HSVColor } from '../types/color';

export interface SliderPickerProps {
  hsv: HSVColor;
  onChange: (hsv: HSVColor) => void;
}

export function SliderPicker({ hsv, onChange }: SliderPickerProps) {
  return (
    <View style={styles.container}>
      <HueSlider hue={hsv.h} onChange={(h) => onChange({ ...hsv, h })} />
      <SaturationSlider hsv={hsv} onChange={(s) => onChange({ ...hsv, s })} />
      <BrightnessSlider hsv={hsv} onChange={(v) => onChange({ ...hsv, v })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
