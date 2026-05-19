import { useCallback, useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { clamp } from '../utils/clamp';

const THUMB_SIZE = 22;

export interface BaseSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  trackStyle?: StyleProp<ViewStyle>;
  gradient?: React.ReactNode;
  accessibilityLabel?: string;
}

export function BaseSlider({
  value,
  min = 0,
  max = 100,
  onChange,
  trackStyle,
  gradient,
}: BaseSliderProps) {
  const [trackWidth, setTrackWidth] = useState(1);

  const updateFromX = useCallback(
    (locationX: number) => {
      const ratio = clamp(locationX / trackWidth, 0, 1);
      const next = min + ratio * (max - min);
      onChange(Math.round(next));
    },
    [max, min, onChange, trackWidth]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        updateFromX(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => {
        updateFromX(event.nativeEvent.locationX);
      },
    })
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width || 1);
  };

  const ratio = (clamp(value, min, max) - min) / (max - min);
  const thumbLeft = ratio * trackWidth - THUMB_SIZE / 2;

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <View style={[styles.track, trackStyle]}>
        {gradient}
        <View
          style={[
            styles.thumb,
            {
              left: Math.max(0, Math.min(trackWidth - THUMB_SIZE, thumbLeft)),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: THUMB_SIZE + 8,
    justifyContent: 'center',
  },
  track: {
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  thumb: {
    position: 'absolute',
    top: -4,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
