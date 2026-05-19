import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export interface ColorSwatchProps {
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function ColorSwatch({ color, size = 28, style }: ColorSwatchProps) {
  return (
    <View
      style={[
        styles.swatch,
        {
          width: size,
          height: size,
          borderRadius: size / 4,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  swatch: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.2)',
  },
});
