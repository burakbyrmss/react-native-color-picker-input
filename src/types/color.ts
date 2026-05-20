export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface ColorValue {
  hex: string;
  rgba: RGBColor;
  hsl: HSLColor;
  hsv: HSVColor;
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export type ColorPickerMode = 'slider' | 'wheel-slider' | 'wheel-square';

export type PickerPresentation = 'popover' | 'modal';
