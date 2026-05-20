import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { HueWheel } from '../controls/HueWheel';
import { HSVHorizontalStrip } from '../controls/HSVHorizontalStrip';
import { HSVStripStack } from '../controls/HSVStripStack';
import type { HSVColor } from '../types/color';

export interface WheelSliderPickerProps {
  hsv: HSVColor;
  onChange: (hsv: HSVColor) => void;
}

export function WheelSliderPicker({ hsv, onChange }: WheelSliderPickerProps) {
  const handlePatch = useCallback(
    (patch: Partial<HSVColor>) => {
      onChange({ ...hsv, ...patch });
    },
    [hsv, onChange]
  );

  return (
    <View style={styles.container}>
      <HueWheel hue={hsv.h} onChange={(h) => onChange({ ...hsv, h })} />
      <HSVStripStack>
        <HSVHorizontalStrip
          accessibilityLabel="Saturation"
          kind="s"
          hsv={hsv}
          onChange={handlePatch}
        />
        <HSVHorizontalStrip
          accessibilityLabel="Brightness"
          kind="v"
          hsv={hsv}
          onChange={handlePatch}
        />
      </HSVStripStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    alignItems: 'center',
  },
});
