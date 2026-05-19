import { StyleSheet, View } from 'react-native';
import { HueWheel } from '../controls/HueWheel';
import { SaturationBrightnessSquare } from '../controls/SaturationBrightnessSquare';
import type { HSVColor } from '../types/color';

export interface WheelSquarePickerProps {
  hsv: HSVColor;
  onChange: (hsv: HSVColor) => void;
}

export function WheelSquarePicker({ hsv, onChange }: WheelSquarePickerProps) {
  return (
    <View style={styles.container}>
      <HueWheel hue={hsv.h} onChange={(h) => onChange({ ...hsv, h })} />
      <SaturationBrightnessSquare
        hsv={hsv}
        onChange={({ s, v }) => onChange({ ...hsv, s, v })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    alignItems: 'center',
  },
});
