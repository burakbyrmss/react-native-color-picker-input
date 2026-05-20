import { HSVSlider } from '../controls/HSVSlider';
import type { HSVColor } from '../types/color';

export interface SliderPickerProps {
  hsv: HSVColor;
  onChange: (hsv: HSVColor) => void;
}

export function SliderPicker({ hsv, onChange }: SliderPickerProps) {
  return <HSVSlider value={hsv} onChange={onChange} />;
}
