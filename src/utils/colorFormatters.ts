import type { ColorFormat, ColorValue } from '../types/color';

export function formatColor(color: ColorValue, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return color.hex;
    case 'rgba': {
      const { r, g, b, a = 1 } = color.rgba;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
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
