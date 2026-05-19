import { StyleSheet, View } from 'react-native';
import { hsvToRgb } from '../utils/colorConversions';
import type { HSVColor } from '../types/color';
import { BaseSlider } from './BaseSlider';

export interface SaturationSliderProps {
  hsv: HSVColor;
  onChange: (saturation: number) => void;
}

export function SaturationSlider({ hsv, onChange }: SaturationSliderProps) {
  const fullColor = hsvToRgb({ h: hsv.h, s: 100, v: hsv.v });
  const gray = hsvToRgb({ h: hsv.h, s: 0, v: hsv.v });

  const toCss = (rgb: ReturnType<typeof hsvToRgb>) =>
    `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  return (
    <BaseSlider
      value={hsv.s}
      onChange={onChange}
      gradient={
        <View style={styles.gradient}>
          <View style={[styles.segment, { backgroundColor: toCss(gray) }]} />
          <View
            style={[styles.segment, { backgroundColor: toCss(fullColor) }]}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
  },
});
