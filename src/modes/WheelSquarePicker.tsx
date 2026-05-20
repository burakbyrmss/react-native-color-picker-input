import { StyleSheet, View } from 'react-native';
import { HueWheel, INNER_RADIUS, WHEEL_SIZE } from '../controls/HueWheel';
import { SaturationBrightnessSquare } from '../controls/SaturationBrightnessSquare';
import type { HSVColor } from '../types/color';

/** Largest square that fits inside the hue wheel's inner circle. */
const INNER_SQUARE_SIZE = Math.floor((INNER_RADIUS * 2) / Math.SQRT2) - 2;

export interface WheelSquarePickerProps {
  hsv: HSVColor;
  onChange: (hsv: HSVColor) => void;
}

export function WheelSquarePicker({ hsv, onChange }: WheelSquarePickerProps) {
  const squareOffset = (WHEEL_SIZE - INNER_SQUARE_SIZE) / 2;

  return (
    <View style={styles.container}>
      <View style={styles.wheelWrapper}>
        <HueWheel hue={hsv.h} onChange={(h) => onChange({ ...hsv, h })} />
        <View
          style={[
            styles.squareOverlay,
            {
              left: squareOffset,
              top: squareOffset,
              width: INNER_SQUARE_SIZE,
              height: INNER_SQUARE_SIZE,
            },
          ]}
        >
          <SaturationBrightnessSquare
            size={INNER_SQUARE_SIZE}
            hsv={hsv}
            onChange={({ s, v }) => onChange({ ...hsv, s, v })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    position: 'relative',
  },
  squareOverlay: {
    position: 'absolute',
    zIndex: 1,
  },
});
