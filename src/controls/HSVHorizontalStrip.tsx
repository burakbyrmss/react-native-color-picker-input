import { useCallback, useId, useMemo, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { HSVColor } from '../types/color';
import { hsvToRgb } from '../utils/colorConversions';

const THUMB_SIZE = 18;
const THUMB_R = THUMB_SIZE / 2;
const STRIP_HEIGHT = 32;
const STRIP_BORDER_RADIUS = STRIP_HEIGHT / 2;

export const HUE_SPECTRUM_GRADIENT_COLORS = [
  '#FF0000',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#FF00FF',
  '#FF0000',
] as const;

export type HSVStripKind = 'h' | 's' | 'v';

function hsvToRgbString(h: number, s: number, v: number): string {
  const { r, g, b } = hsvToRgb({ h, s, v });
  return `rgb(${r}, ${g}, ${b})`;
}

export interface HSVHorizontalStripProps {
  kind: HSVStripKind;
  hsv: HSVColor;
  onChange: (patch: Partial<HSVColor>) => void;
  accessibilityLabel: string;
}

export function HSVHorizontalStrip({
  kind,
  hsv,
  onChange,
  accessibilityLabel,
}: HSVHorizontalStripProps) {
  const { h, s, v } = hsv;
  const [trackWidth, setTrackWidth] = useState(0);
  const gradientId = useId().replace(/:/g, '');

  const setFromX = useCallback(
    (x: number) => {
      if (trackWidth <= 0) {
        return;
      }
      const ratio = Math.max(0, Math.min(1, x / trackWidth));
      if (kind === 'h') {
        onChange({ h: Math.round(ratio * 360) });
      } else if (kind === 's') {
        onChange({ s: Math.round(ratio * 100) });
      } else {
        onChange({ v: Math.round(ratio * 100) });
      }
    },
    [kind, onChange, trackWidth]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          setFromX(event.nativeEvent.locationX);
        },
        onPanResponderMove: (event) => {
          setFromX(event.nativeEvent.locationX);
        },
      }),
    [setFromX]
  );

  const rawThumbX =
    kind === 'h'
      ? (h / 360) * trackWidth
      : kind === 's'
        ? (s / 100) * trackWidth
        : (v / 100) * trackWidth;
  const thumbCenterX =
    trackWidth > 0
      ? Math.max(THUMB_R, Math.min(trackWidth - THUMB_R, rawThumbX))
      : 0;

  const gradientColors = useMemo((): string[] => {
    if (kind === 'h') {
      return [...HUE_SPECTRUM_GRADIENT_COLORS];
    }
    if (kind === 's') {
      return [hsvToRgbString(h, 0, 100), hsvToRgbString(h, 100, 100)];
    }
    return [hsvToRgbString(h, s, 0), hsvToRgbString(h, s, 100)];
  }, [kind, h, s]);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="adjustable"
      style={styles.stripWrapper}
    >
      <View
        style={styles.track}
        collapsable={false}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        {trackWidth > 0 ? (
          <Svg width={trackWidth} height={STRIP_HEIGHT}>
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                {gradientColors.map((color, index) => (
                  <Stop
                    key={`${color}-${index}`}
                    offset={
                      gradientColors.length === 1
                        ? '0'
                        : `${index / (gradientColors.length - 1)}`
                    }
                    stopColor={color}
                  />
                ))}
              </LinearGradient>
            </Defs>
            <Rect
              width={trackWidth}
              height={STRIP_HEIGHT}
              rx={STRIP_BORDER_RADIUS}
              ry={STRIP_BORDER_RADIUS}
              fill={`url(#${gradientId})`}
            />
          </Svg>
        ) : null}
        {trackWidth > 0 ? (
          <View
            pointerEvents="none"
            style={[
              styles.thumb,
              {
                left: thumbCenterX - THUMB_R,
                top: (STRIP_HEIGHT - THUMB_SIZE) / 2,
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stripWrapper: {
    width: '100%',
  },
  track: {
    position: 'relative',
    width: '100%',
    height: STRIP_HEIGHT,
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: STRIP_BORDER_RADIUS,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_R,
    backgroundColor: '#222',
  },
});
