import {
  hexToRgb,
  hsvToHex,
  hsvToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from '../utils/colorConversions';
import { formatColor } from '../utils/colorFormatters';
import { parseColor } from '../utils/colorParsers';

describe('color conversions', () => {
  it('converts hex to rgb', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('converts rgb to hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
  });

  it('converts rgb to hsv and back', () => {
    const hsv = rgbToHsv({ r: 255, g: 0, b: 0 });
    expect(hsv).toEqual({ h: 0, s: 100, v: 100 });

    const rgb = hsvToRgb({ h: 0, s: 100, v: 100 });
    expect(rgb).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('converts hsv to hex', () => {
    expect(hsvToHex({ h: 0, s: 100, v: 100 })).toBe('#ff0000');
  });

  it('converts rgb to hsl', () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });
});

describe('parseColor', () => {
  it('parses hex', () => {
    const color = parseColor('#00ff00');
    expect(color.hex).toBe('#00ff00');
    expect(color.hsv.s).toBe(100);
  });

  it('parses rgb()', () => {
    const color = parseColor('rgb(0, 0, 255)');
    expect(color.rgba).toEqual({ r: 0, g: 0, b: 255, a: 1 });
  });

  it('parses rgba()', () => {
    const color = parseColor('rgba(255, 0, 0, 0.5)');
    expect(color.rgba.a).toBe(0.5);
  });

  it('parses hsl()', () => {
    const color = parseColor('hsl(120, 100%, 50%)');
    expect(color.hex).toBe('#00ff00');
  });
});

describe('formatColor', () => {
  it('formats rgba and hsl', () => {
    const color = parseColor('#ff0000');
    expect(formatColor(color, 'rgba')).toBe('rgba(255, 0, 0, 1)');
    expect(formatColor(color, 'hsl')).toBe('hsl(0, 100%, 50%)');
  });
});
