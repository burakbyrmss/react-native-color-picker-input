import { useCallback } from 'react';
import type { HSVColor } from '../types/color';
import { HSVHorizontalStrip } from './HSVHorizontalStrip';
import { HSVStripStack } from './HSVStripStack';

export interface HSVSliderProps {
  value: HSVColor;
  onChange: (hsv: HSVColor) => void;
}

/**
 * Three pill-shaped horizontal strips: hue, saturation, brightness.
 * Saturation/brightness gradients follow current hue (and S for V).
 */
export function HSVSlider({ value, onChange }: HSVSliderProps) {
  const handlePatch = useCallback(
    (patch: Partial<HSVColor>) => {
      onChange({ ...value, ...patch });
    },
    [onChange, value]
  );

  return (
    <HSVStripStack>
      <HSVHorizontalStrip
        accessibilityLabel="Hue"
        kind="h"
        hsv={value}
        onChange={handlePatch}
      />
      <HSVHorizontalStrip
        accessibilityLabel="Saturation"
        kind="s"
        hsv={value}
        onChange={handlePatch}
      />
      <HSVHorizontalStrip
        accessibilityLabel="Brightness"
        kind="v"
        hsv={value}
        onChange={handlePatch}
      />
    </HSVStripStack>
  );
}
