import { useCallback, useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
const WHEEL_SIZE = 200;
const WHEEL_RADIUS = WHEEL_SIZE / 2 - 12;
const INNER_RADIUS = WHEEL_RADIUS - 18;
const INDICATOR_SIZE = 16;

function polarToCartesian(
  center: number,
  radius: number,
  angleDeg: number
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(angleRad),
    y: center + radius * Math.sin(angleRad),
  };
}

function describeArc(
  center: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const startOuter = polarToCartesian(center, outerRadius, endAngle);
  const endOuter = polarToCartesian(center, outerRadius, startAngle);
  const startInner = polarToCartesian(center, innerRadius, startAngle);
  const endInner = polarToCartesian(center, innerRadius, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');
}

function hueFromTouch(
  locationX: number,
  locationY: number,
  size: number
): number {
  const center = size / 2;
  const dx = locationX - center;
  const dy = locationY - center;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < INNER_RADIUS || distance > WHEEL_RADIUS + 8) {
    return -1;
  }

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  return (angle + 360) % 360;
}

export interface HueWheelProps {
  hue: number;
  onChange: (hue: number) => void;
}

export function HueWheel({ hue, onChange }: HueWheelProps) {
  const segments = useMemo(() => {
    const center = WHEEL_SIZE / 2;
    const wedgeCount = 36;

    return Array.from({ length: wedgeCount }, (_, index) => {
      const startAngle = (index * 360) / wedgeCount;
      const endAngle = ((index + 1) * 360) / wedgeCount;
      const segmentHue = (startAngle + endAngle) / 2;

      return {
        key: `wedge-${index}`,
        d: describeArc(
          center,
          WHEEL_RADIUS,
          INNER_RADIUS,
          startAngle,
          endAngle
        ),
        fill: `hsl(${segmentHue}, 100%, 50%)`,
      };
    });
  }, []);

  const indicator = polarToCartesian(WHEEL_SIZE / 2, WHEEL_RADIUS, hue);

  const updateHue = useCallback(
    (locationX: number, locationY: number) => {
      const nextHue = hueFromTouch(locationX, locationY, WHEEL_SIZE);
      if (nextHue >= 0) {
        onChange(Math.round(nextHue));
      }
    },
    [onChange]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        updateHue(event.nativeEvent.locationX, event.nativeEvent.locationY);
      },
      onPanResponderMove: (event) => {
        updateHue(event.nativeEvent.locationX, event.nativeEvent.locationY);
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
        <G>
          {segments.map((segment) => (
            <Path
              key={segment.key}
              d={segment.d}
              fill={segment.fill}
              stroke="none"
            />
          ))}
        </G>
        <Circle
          cx={indicator.x}
          cy={indicator.y}
          r={INDICATOR_SIZE / 2}
          fill="#fff"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignSelf: 'center',
  },
});

export { WHEEL_SIZE, WHEEL_RADIUS, INNER_RADIUS };
