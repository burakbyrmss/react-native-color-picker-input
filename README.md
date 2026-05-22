# react-native-color-picker-input

A customizable React Native color picker input with slider, wheel-slider, and wheel-square modes. Tap the input to open a popover or modal picker; colors are emitted as formatted strings plus a structured `ColorValue` object.

## Installation

```sh
npm install react-native-color-picker-input react-native-svg
```

`react-native-svg` is a required peer dependency (used for wheel and slider controls).

## Usage

```tsx
import { useState } from 'react';
import { ColorPickerInput } from 'react-native-color-picker-input';

function MyScreen() {
  const [color, setColor] = useState('#ff3b30');

  return (
    <ColorPickerInput
      value={color}
      onChange={(formatted, colorObject) => setColor(formatted)}
    />
  );
}
```

### Picker modes

| Mode | Description |
|------|-------------|
| `wheel-square` (default) | Hue wheel + saturation/brightness square |
| `wheel-slider` | Hue wheel + saturation and brightness sliders |
| `slider` | Horizontal HSV sliders |

### Presentation

| Value | Description |
|-------|-------------|
| `popover` (default) | Anchored panel below the input |
| `modal` | Full-screen modal picker |

### Examples

**Presets and wheel-square (popover):**

```tsx
<ColorPickerInput
  value={color}
  onChange={setColor}
  mode="wheel-square"
  showPresets
  presets={['#FF3B30', '#34C759', '#007AFF', '#AF52DE', '#FF9500']}
/>
```

**Slider mode:**

```tsx
<ColorPickerInput
  value={color}
  onChange={setColor}
  mode="slider"
  displayFormat="hex"
/>
```

**Modal with RGB output:**

```tsx
<ColorPickerInput
  value={color}
  onChange={(value) => setColor(value)}
  presentation="modal"
  outputFormat="rgb"
  displayFormat="rgb"
  mode="wheel-square"
/>
```

## API

### `ColorPickerInput`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | **Required.** Current color (hex, `rgb()`, or `hsl()`). Invalid values fall back to `#000000` for display. |
| `onChange` | `(color: string, colorObject: ColorValue) => void` | — | **Required.** Called when the user changes the color. `color` uses `outputFormat`; `colorObject` includes `hex`, `rgba`, `hsl`, and `hsv`. |
| `mode` | `'slider' \| 'wheel-slider' \| 'wheel-square'` | `'wheel-square'` | Picker UI layout. |
| `presentation` | `'popover' \| 'modal'` | `'popover'` | How the picker is shown. |
| `outputFormat` | `'hex' \| 'rgb' \| 'hsl'` | `'hex'` | Format of the string passed to `onChange`. |
| `displayFormat` | `'hex' \| 'rgb' \| 'hsl'` | `'hex'` | Format shown in the input label and preview. |
| `showInputSwatch` | `boolean` | `true` | Show color swatch in the input. |
| `showInputText` | `boolean` | `true` | Show formatted color text in the input. |
| `showPresets` | `boolean` | `false` | Show preset color chips in the picker. |
| `presets` | `string[]` | `[]` | Preset colors (hex or other parseable strings). |
| `showPreview` | `boolean` | `true` | Show live preview in the picker panel. |
| `disabled` | `boolean` | `false` | Disable opening the picker. |
| `inputBackgroundColor` | `string` | `#fff` | Input field background. |
| `inputTextColor` | `string` | `#222` | Input label text color. |
| `pickerBackgroundColor` | `string` | `#fff` | Picker panel background. |
| `pickerTextColor` | `string` | `#333` | Picker preview text color. |
| `inputStyle` | `StyleProp<ViewStyle>` | — | Style for the pressable input. |
| `inputTextStyle` | `StyleProp<TextStyle>` | — | Style for the input text. |
| `pickerContainerStyle` | `StyleProp<ViewStyle>` | — | Style for the picker body container. |
| `modalProps` | `Partial<ModalProps>` | — | Extra props for the React Native `Modal` (when `presentation="modal"`). |
| `onOpen` | `() => void` | — | Called when the picker opens. |
| `onClose` | `() => void` | — | Called when the picker closes. |

### Types

Exported from the package:

- `ColorPickerInputProps` — props for `ColorPickerInput`
- `ColorPickerMode` — `'slider' | 'wheel-slider' | 'wheel-square'`
- `PickerPresentation` — `'popover' | 'modal'`
- `ColorFormat` — `'hex' | 'rgb' | 'hsl'`
- `ColorValue` — `{ hex, rgba, hsl, hsv }`
- `HSVColor`, `RGBColor`, `HSLColor`

### Utilities

Color parsing, formatting, and conversion helpers are also exported:

```ts
import {
  parseColor,
  formatColor,
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  rgbToHsl,
  hslToRgb,
  hsvToHex,
  colorValueFromHsv,
} from 'react-native-color-picker-input';
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
