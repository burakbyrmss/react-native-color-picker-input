import { StyleSheet, View } from 'react-native';
import { hsvToRgb } from '../utils/colorConversions';
import type { HSVColor } from '../types/color';
import { BaseSlider } from './BaseSlider';

export interface BrightnessSliderProps {
  hsv: HSVColor;
  onChange: (brightness: number) => void;
}

export function BrightnessSlider({ hsv, onChange }: BrightnessSliderProps) {
  const fullColor = hsvToRgb({ h: hsv.h, s: hsv.s, v: 100 });
  const black = hsvToRgb({ h: hsv.h, s: hsv.s, v: 0 });

  const toCss = (rgb: ReturnType<typeof hsvToRgb>) =>
    `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  return (
    <BaseSlider
      value={hsv.v}
      onChange={onChange}
      gradient={
        <View style={styles.gradient}>
          <View style={[styles.segment, { backgroundColor: toCss(black) }]} />
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
