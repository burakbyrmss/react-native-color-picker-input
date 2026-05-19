import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ColorPickerInput } from 'react-native-color-picker-input';

export default function App() {
  const [hexColor, setHexColor] = useState('#ff3b30');
  const [sliderColor, setSliderColor] = useState('#34c759');
  const [modalColor, setModalColor] = useState('#007aff');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Color Picker Input</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Wheel Square (popover)</Text>
        <ColorPickerInput
          value={hexColor}
          onChange={setHexColor}
          mode="wheel-square"
          showPresets
          presets={['#FF3B30', '#34C759', '#007AFF', '#AF52DE', '#FF9500']}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Wheel Slider</Text>
        <ColorPickerInput
          value={hexColor}
          onChange={setHexColor}
          mode="wheel-slider"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Slider mode</Text>
        <ColorPickerInput
          value={sliderColor}
          onChange={setSliderColor}
          mode="slider"
          displayFormat="hex"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Modal presentation (RGBA)</Text>
        <ColorPickerInput
          value={modalColor}
          onChange={(value) => setModalColor(value)}
          presentation="modal"
          outputFormat="rgba"
          displayFormat="rgba"
          mode="wheel-square"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 64,
    gap: 24,
    backgroundColor: '#f2f2f7',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
});
