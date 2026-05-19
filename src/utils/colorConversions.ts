import type { HSLColor, HSVColor, RGBColor } from '../types/color';
import { clamp } from './clamp';

export function hexToRgb(hex: string): RGBColor {
  let normalized = hex.trim().replace(/^#/, '');

  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (normalized.length !== 6 && normalized.length !== 8) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const a =
    normalized.length === 8 ? parseInt(normalized.slice(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
}

export function rgbToHex(rgb: RGBColor): string {
  const toHex = (value: number) =>
    clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const l = ((max + min) / 2) * 100;

  let s = 0;
  if (delta !== 0) {
    s = l > 50 ? (delta / (2 - max - min)) * 100 : (delta / (max + min)) * 100;

    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / delta + 2) * 60;
    } else {
      h = ((r - g) / delta + 4) * 60;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l),
    a: rgb.a ?? 1,
  };
}

export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray, a: hsl.a ?? 1 };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let channel = t;
    if (channel < 0) channel += 1;
    if (channel > 1) channel -= 1;
    if (channel < 1 / 6) return p + (q - p) * 6 * channel;
    if (channel < 1 / 2) return q;
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    a: hsl.a ?? 1,
  };
}

export function rgbToHsv(rgb: RGBColor): HSVColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const v = max * 100;
  const s = max === 0 ? 0 : (delta / max) * 100;

  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / delta + 2) * 60;
    } else {
      h = ((r - g) / delta + 4) * 60;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
  };
}

export function hsvToRgb(hsv: HSVColor): RGBColor {
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((hsv.h / 60) % 2) - 1));
  const m = v - c;

  let rp = 0;
  let gp = 0;
  let bp = 0;

  if (hsv.h < 60) {
    rp = c;
    gp = x;
  } else if (hsv.h < 120) {
    rp = x;
    gp = c;
  } else if (hsv.h < 180) {
    gp = c;
    bp = x;
  } else if (hsv.h < 240) {
    gp = x;
    bp = c;
  } else if (hsv.h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
    a: 1,
  };
}

export function hsvToHex(hsv: HSVColor): string {
  return rgbToHex(hsvToRgb(hsv));
}

export function colorValueFromHsv(
  hsv: HSVColor
): import('../types/color').ColorValue {
  const rgba = hsvToRgb(hsv);
  const hsl = rgbToHsl(rgba);
  const hex = rgbToHex(rgba);

  return {
    hex,
    rgba,
    hsl,
    hsv: {
      h: hsv.h,
      s: hsv.s,
      v: hsv.v,
    },
  };
}
