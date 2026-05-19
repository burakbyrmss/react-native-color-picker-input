import { StyleSheet, View } from 'react-native';
import { BaseSlider } from './BaseSlider';

const HUE_STOPS = [
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#ff0000',
];

export interface HueSliderProps {
  hue: number;
  onChange: (hue: number) => void;
}

export function HueSlider({ hue, onChange }: HueSliderProps) {
  return (
    <BaseSlider
      value={hue}
      min={0}
      max={360}
      onChange={onChange}
      gradient={
        <View style={styles.gradient}>
          {HUE_STOPS.slice(0, -1).map((color, index) => (
            <View
              key={color + index}
              style={[styles.segment, { backgroundColor: color }]}
            />
          ))}
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
