import { StyleSheet, Text, View } from 'react-native';
import type { ColorFormat, ColorValue } from '../types/color';
import { formatColor } from '../utils/colorFormatters';
import { ColorSwatch } from './ColorSwatch';

export interface ColorPreviewProps {
  color: ColorValue;
  displayFormat: ColorFormat;
  textColor?: string;
}

export function ColorPreview({
  color,
  displayFormat,
  textColor,
}: ColorPreviewProps) {
  const label = formatColor(color, displayFormat);

  return (
    <View style={styles.container}>
      <ColorSwatch color={color.hex} />
      <Text style={[styles.text, textColor != null && { color: textColor }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.12)',
  },
  text: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
});
