import type { ColorValue } from '../types/color';
import {
  colorValueFromHsv,
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from './colorConversions';

const RGB_REGEX =
  /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/i;

const HSL_REGEX =
  /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?(?:\s*,\s*([\d.]+))?\s*\)$/i;

export function parseColor(value: string): ColorValue {
  const trimmed = value.trim();

  if (trimmed.startsWith('#')) {
    const rgba = hexToRgb(trimmed);
    const hsv = rgbToHsv(rgba);
    return colorValueFromHsv(hsv);
  }

  const rgbMatch = trimmed.match(RGB_REGEX);
  if (rgbMatch) {
    const rgba = {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? Number(rgbMatch[4]) : 1,
    };
    const hsv = rgbToHsv(rgba);
    const hsl = rgbToHsl(rgba);
    return {
      hex: rgbToHex(rgba),
      rgba,
      hsl,
      hsv,
    };
  }

  const hslMatch = trimmed.match(HSL_REGEX);
  if (hslMatch) {
    const hsl = {
      h: Number(hslMatch[1]),
      s: Number(hslMatch[2]),
      l: Number(hslMatch[3]),
      a: hslMatch[4] !== undefined ? Number(hslMatch[4]) : 1,
    };
    const rgba = hslToRgb(hsl);
    const hsv = rgbToHsv(rgba);
    return {
      hex: rgbToHex(rgba),
      rgba,
      hsl,
      hsv,
    };
  }

  throw new Error(`Unsupported color format: ${value}`);
}
