import { useCallback, useId, useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { HSVColor } from '../types/color';
import { clamp } from '../utils/clamp';
import { hsvToRgb } from '../utils/colorConversions';

const DEFAULT_SIZE = 200;
const INDICATOR_SIZE = 18;

export interface SaturationBrightnessSquareProps {
  hsv: HSVColor;
  onChange: (hsv: Pick<HSVColor, 's' | 'v'>) => void;
  size?: number;
}

export function SaturationBrightnessSquare({
  hsv,
  onChange,
  size = DEFAULT_SIZE,
}: SaturationBrightnessSquareProps) {
  const uid = useId().replace(/:/g, '');
  const saturationId = `saturationOverlay-${uid}`;
  const brightnessId = `brightnessOverlay-${uid}`;

  const hueColor = hsvToRgb({ h: hsv.h, s: 100, v: 100 });
  const baseColor = `rgb(${hueColor.r}, ${hueColor.g}, ${hueColor.b})`;

  const updateFromTouch = useCallback(
    (locationX: number, locationY: number) => {
      const s = clamp((locationX / size) * 100, 0, 100);
      const v = clamp(100 - (locationY / size) * 100, 0, 100);
      onChange({ s: Math.round(s), v: Math.round(v) });
    },
    [onChange, size]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        updateFromTouch(
          event.nativeEvent.locationX,
          event.nativeEvent.locationY
        );
      },
      onPanResponderMove: (event) => {
        updateFromTouch(
          event.nativeEvent.locationX,
          event.nativeEvent.locationY
        );
      },
    })
  ).current;

  const indicatorX = (hsv.s / 100) * size;
  const indicatorY = (1 - hsv.v / 100) * size;
  const cornerRadius = Math.max(4, Math.round(size * 0.06));

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      {...panResponder.panHandlers}
    >
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={saturationId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id={brightnessId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity="0" />
            <Stop offset="1" stopColor="#000000" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width={size} height={size} fill={baseColor} rx={cornerRadius} />
        <Rect
          width={size}
          height={size}
          fill={`url(#${saturationId})`}
          rx={cornerRadius}
        />
        <Rect
          width={size}
          height={size}
          fill={`url(#${brightnessId})`}
          rx={cornerRadius}
        />
      </Svg>
      <View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            left: clamp(
              indicatorX - INDICATOR_SIZE / 2,
              0,
              size - INDICATOR_SIZE
            ),
            top: clamp(
              indicatorY - INDICATOR_SIZE / 2,
              0,
              size - INDICATOR_SIZE
            ),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 3,
  },
});

export { DEFAULT_SIZE as SQUARE_SIZE };
