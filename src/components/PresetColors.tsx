import { Pressable, StyleSheet, View } from 'react-native';
import { ColorSwatch } from './ColorSwatch';

export interface PresetColorsProps {
  presets: string[];
  onSelect: (color: string) => void;
}

export function PresetColors({ presets, onSelect }: PresetColorsProps) {
  if (presets.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {presets.map((preset) => (
        <Pressable
          key={preset}
          onPress={() => onSelect(preset)}
          style={styles.presetButton}
          accessibilityRole="button"
          accessibilityLabel={`Select color ${preset}`}
        >
          <ColorSwatch color={preset} size={32} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  presetButton: {
    borderRadius: 6,
  },
});
