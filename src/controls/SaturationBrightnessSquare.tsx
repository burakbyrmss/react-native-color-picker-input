import { useCallback, useId, useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { HSVColor } from '../types/color';
import { clamp } from '../utils/clamp';
import { hsvToRgb } from '../utils/colorConversions';

const SQUARE_SIZE = 200;
const INDICATOR_SIZE = 18;

export interface SaturationBrightnessSquareProps {
  hsv: HSVColor;
  onChange: (hsv: Pick<HSVColor, 's' | 'v'>) => void;
}

export function SaturationBrightnessSquare({
  hsv,
  onChange,
}: SaturationBrightnessSquareProps) {
  const uid = useId().replace(/:/g, '');
  const saturationId = `saturationOverlay-${uid}`;
  const brightnessId = `brightnessOverlay-${uid}`;

  const hueColor = hsvToRgb({ h: hsv.h, s: 100, v: 100 });
  const baseColor = `rgb(${hueColor.r}, ${hueColor.g}, ${hueColor.b})`;

  const updateFromTouch = useCallback(
    (locationX: number, locationY: number) => {
      const s = clamp((locationX / SQUARE_SIZE) * 100, 0, 100);
      const v = clamp(100 - (locationY / SQUARE_SIZE) * 100, 0, 100);
      onChange({ s: Math.round(s), v: Math.round(v) });
    },
    [onChange]
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

  const indicatorX = (hsv.s / 100) * SQUARE_SIZE;
  const indicatorY = (1 - hsv.v / 100) * SQUARE_SIZE;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={SQUARE_SIZE} height={SQUARE_SIZE}>
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
        <Rect
          width={SQUARE_SIZE}
          height={SQUARE_SIZE}
          fill={baseColor}
          rx={8}
        />
        <Rect
          width={SQUARE_SIZE}
          height={SQUARE_SIZE}
          fill={`url(#${saturationId})`}
          rx={8}
        />
        <Rect
          width={SQUARE_SIZE}
          height={SQUARE_SIZE}
          fill={`url(#${brightnessId})`}
          rx={8}
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
              SQUARE_SIZE - INDICATOR_SIZE
            ),
            top: clamp(
              indicatorY - INDICATOR_SIZE / 2,
              0,
              SQUARE_SIZE - INDICATOR_SIZE
            ),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    alignSelf: 'center',
    borderRadius: 8,
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

export { SQUARE_SIZE };
