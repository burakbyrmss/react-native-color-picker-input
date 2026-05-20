import type { ColorFormat, ColorValue } from '../types/color';

export function formatColor(color: ColorValue, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return color.hex;
    case 'rgb': {
      const { r, g, b } = color.rgba;
      return `rgb(${r}, ${g}, ${b})`;
    }
    case 'hsl': {
      const { h, s, l, a = 1 } = color.hsl;
      if (a < 1) {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
      }
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    default:
      return color.hex;
  }
}
