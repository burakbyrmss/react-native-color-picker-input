# react-native-color-picker Package Coding Document

## 1. Package Goal

Create a reusable **React Native color picker package** written fully in **React Native + TypeScript**, without Swift or Kotlin implementation.

The package exposes a clickable color input component. When pressed, it opens a color picker as either a **popover** or **modal**, depending on developer configuration.

The picker supports multiple color selection modes, optional presets, optional color previews, and configurable output formats such as `hex`, `rgba`, and `hsl`.

---

## 2. Package Name

Recommended package name:

```txt
react-native-color-picker-input
```

Alternative names:

```txt
react-native-flex-color-picker
react-native-pop-color-picker
react-native-simple-color-picker
```

For now, use:

```txt
react-native-color-picker-input
```

---

## 3. Core Component

Main exported component:

```tsx
<ColorPickerInput />
```

This component renders a pressable input. The input can show:

- selected color swatch
- selected color text
- both color swatch and text
- only custom children, if developer wants full control later

When the input is pressed, the picker opens as:

- `popover`
- `modal`

---

## 4. Picker Modes

The package supports three picker modes selected by the developer.

### 4.1 `slider`

Full name:

```txt
Slider Picker
```

Internal mode value:

```ts
'slider'
```

Controls:

- hue slider
- saturation slider
- brightness slider

Use case:

Simple, compact, beginner-friendly color picking.

---

### 4.2 `wheel-slider`

Full name:

```txt
Wheel Slider Picker
```

Internal mode value:

```ts
'wheel-slider'
```

Controls:

- circular hue wheel
- saturation slider
- brightness slider

Use case:

More visual hue selection while keeping saturation and brightness simple.

---

### 4.3 `wheel-square`

Full name:

```txt
Wheel Square Picker
```

Internal mode value:

```ts
'wheel-square'
```

Controls:

- circular hue wheel
- square saturation/brightness area

Use case:

Classic advanced color picker experience, similar to design tools.

---

## 5. Public API

### 5.1 Basic Usage

```tsx
import { ColorPickerInput } from 'react-native-color-picker-input';

export function Example() {
  const [color, setColor] = useState('#ff0000');

  return (
    <ColorPickerInput
      value={color}
      onChange={setColor}
      mode="wheel-square"
    />
  );
}
```

---

## 6. Props

```ts
export type ColorPickerMode = 'slider' | 'wheel-slider' | 'wheel-square';

export type ColorFormat = 'hex' | 'rgba' | 'hsl';

export type PickerPresentation = 'popover' | 'modal';

export interface ColorPickerInputProps {
  value: string;
  onChange: (color: string, colorObject: ColorValue) => void;

  mode?: ColorPickerMode;
  presentation?: PickerPresentation;

  outputFormat?: ColorFormat;
  displayFormat?: ColorFormat;

  showInputSwatch?: boolean;
  showInputText?: boolean;

  showPresets?: boolean;
  presets?: string[];

  showPreview?: boolean;

  disabled?: boolean;

  inputStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  pickerContainerStyle?: StyleProp<ViewStyle>;

  modalProps?: Partial<ModalProps>;

  onOpen?: () => void;
  onClose?: () => void;
}
```

---

## 7. Internal Color Object

Internally, the picker should work with HSV because all three modes naturally map to:

- hue
- saturation
- brightness/value

```ts
export interface HSVColor {
  h: number; // 0 - 360
  s: number; // 0 - 100
  v: number; // 0 - 100
}

export interface RGBColor {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  a?: number; // 0 - 1
}

export interface HSLColor {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
  a?: number; // 0 - 1
}

export interface ColorValue {
  hex: string;
  rgba: RGBColor;
  hsl: HSLColor;
  hsv: HSVColor;
}
```

The public `onChange` should return both:

1. formatted string according to `outputFormat`
2. full `ColorValue` object

Example:

```ts
onChange('#ff0000', {
  hex: '#ff0000',
  rgba: { r: 255, g: 0, b: 0, a: 1 },
  hsl: { h: 0, s: 100, l: 50, a: 1 },
  hsv: { h: 0, s: 100, v: 100 },
});
```

---

## 8. Default Props

```ts
const defaultProps = {
  mode: 'wheel-square',
  presentation: 'popover',
  outputFormat: 'hex',
  displayFormat: 'hex',
  showInputSwatch: true,
  showInputText: true,
  showPresets: false,
  presets: [],
  showPreview: true,
};
```

---

## 9. Component Structure

Recommended folder structure:

```txt
src/
  components/
    ColorPickerInput.tsx
    ColorPickerPopover.tsx
    ColorPickerModal.tsx
    ColorPreview.tsx
    ColorSwatch.tsx
    PresetColors.tsx

  modes/
    SliderPicker.tsx
    WheelSliderPicker.tsx
    WheelSquarePicker.tsx

  controls/
    HueSlider.tsx
    SaturationSlider.tsx
    BrightnessSlider.tsx
    HueWheel.tsx
    SaturationBrightnessSquare.tsx

  utils/
    colorConversions.ts
    colorFormatters.ts
    colorParsers.ts
    clamp.ts

  types/
    color.ts
    props.ts

  index.ts
```

---

## 10. Main Component Responsibility

`ColorPickerInput` should handle:

- controlled value
- opening picker
- closing picker
- rendering input state
- selecting modal or popover presentation
- passing current HSV value to picker modes
- converting picker changes into requested output format

It should not contain low-level color math directly.

---

## 11. Picker Presentation

### 11.1 Popover

`presentation="popover"`

Behavior:

- Opens near the input
- Should feel like a tooltip/popover
- Best for forms and compact UI

Implementation note:

React Native does not have a native DOM-style popover. First version can implement this using an absolutely positioned view rendered near the input.

Later versions can improve positioning using layout measurement.

---

### 11.2 Modal

`presentation="modal"`

Behavior:

- Opens inside React Native `Modal`
- Can use centered card layout
- Better for mobile-first full attention color picking

Recommended default modal behavior:

- transparent backdrop
- centered picker card
- tap backdrop to close

---

## 12. Optional Presets

Preset colors appear at the top of the picker.

Controlled by:

```tsx
showPresets={true}
presets={['#ff0000', '#00ff00', '#0000ff']}
```

Rules:

- If `showPresets` is false, do not render presets.
- If `showPresets` is true but `presets` is empty, either render nothing or use default presets.
- Recommended: no default presets unless developer passes them.

Preset click behavior:

- parse preset color
- update HSV internal state
- call `onChange`

---

## 13. Optional Bottom Preview

A non-clickable preview can appear at the bottom of the picker.

Controlled by:

```tsx
showPreview={true}
```

The preview should look similar to the input design:

- color swatch
- color text
- selected format text

But it should not open anything when pressed.

---

## 14. Input Display Options

Input rendering should be configurable.

```tsx
<ColorPickerInput
  showInputSwatch={true}
  showInputText={true}
  displayFormat="hex"
/>
```

Examples:

Only color:

```tsx
<ColorPickerInput
  showInputSwatch={true}
  showInputText={false}
/>
```

Only text:

```tsx
<ColorPickerInput
  showInputSwatch={false}
  showInputText={true}
/>
```

RGBA text:

```tsx
<ColorPickerInput
  displayFormat="rgba"
/>
```

---

## 15. Color Conversion Utilities

Required utility functions:

```ts
hexToRgb(hex: string): RGBColor;
rgbToHex(rgb: RGBColor): string;
rgbToHsl(rgb: RGBColor): HSLColor;
hslToRgb(hsl: HSLColor): RGBColor;
rgbToHsv(rgb: RGBColor): HSVColor;
hsvToRgb(hsv: HSVColor): RGBColor;
hsvToHex(hsv: HSVColor): string;
parseColor(value: string): ColorValue;
formatColor(color: ColorValue, format: ColorFormat): string;
```

Initial supported input strings:

```txt
#rgb
#rrggbb
rgb(r, g, b)
rgba(r, g, b, a)
hsl(h, s%, l%)
hsla(h, s%, l%, a)
```

---

## 16. Touch and Gesture Strategy

Use pure React Native touch handling first.

Recommended first implementation:

- `Pressable` for input and presets
- `PanResponder` or `react-native-gesture-handler` for sliders, hue wheel, and square picker

For package simplicity, first version should avoid heavy dependencies unless needed.

Preferred first version:

```txt
No native code
No mandatory gesture-handler dependency
Use PanResponder
```

Possible future improvement:

```txt
react-native-gesture-handler support
reanimated support
```

---

## 17. Styling Strategy

The package should use plain React Native styles internally.

Do not use NativeWind inside the package because package consumers may not use Tailwind/NativeWind.

Use:

```ts
StyleSheet.create(...)
```

Allow developer overrides through style props.

---

## 18. Exports

```ts
export { ColorPickerInput } from './components/ColorPickerInput';

export type {
  ColorPickerInputProps,
  ColorPickerMode,
  ColorFormat,
  PickerPresentation,
  ColorValue,
  HSVColor,
  RGBColor,
  HSLColor,
} from './types';

export {
  parseColor,
  formatColor,
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  rgbToHsl,
  hslToRgb,
} from './utils/colorConversions';
```

---

## 19. Example API Scenarios

### 19.1 Minimal

```tsx
<ColorPickerInput
  value={color}
  onChange={setColor}
/>
```

---

### 19.2 Slider Mode

```tsx
<ColorPickerInput
  value={color}
  onChange={setColor}
  mode="slider"
/>
```

---

### 19.3 Wheel + Sliders

```tsx
<ColorPickerInput
  value={color}
  onChange={setColor}
  mode="wheel-slider"
/>
```

---

### 19.4 Wheel + Square

```tsx
<ColorPickerInput
  value={color}
  onChange={setColor}
  mode="wheel-square"
/>
```

---

### 19.5 Modal Presentation

```tsx
<ColorPickerInput
  value={color}
  onChange={setColor}
  presentation="modal"
/>
```

---

### 19.6 With Presets

```tsx
<ColorPickerInput
  value={color}
  onChange={setColor}
  showPresets
  presets={['#FF3B30', '#34C759', '#007AFF', '#AF52DE']}
/>
```

---

### 19.7 RGBA Output

```tsx
<ColorPickerInput
  value={color}
  onChange={(value, colorObject) => {
    setColor(value);
    console.log(colorObject);
  }}
  outputFormat="rgba"
  displayFormat="rgba"
/>
```

---

## 20. Implementation Phases

### Phase 1: Foundation

- Create package structure
- Add TypeScript config
- Add build setup
- Add exports
- Add color type definitions
- Add color conversion utilities
- Add tests for color conversions

### Phase 2: Input + Modal

- Implement `ColorPickerInput`
- Implement input swatch/text display
- Implement modal presentation
- Implement preview component
- Implement preset component

### Phase 3: Slider Picker

- Implement hue slider
- Implement saturation slider
- Implement brightness slider
- Implement `SliderPicker`

### Phase 4: Wheel Slider Picker

- Implement hue wheel
- Reuse saturation slider
- Reuse brightness slider
- Implement `WheelSliderPicker`

### Phase 5: Wheel Square Picker

- Implement saturation/brightness square
- Reuse hue wheel
- Implement `WheelSquarePicker`

### Phase 6: Popover

- Implement popover presentation
- Measure input position
- Render picker near input
- Handle screen boundaries if possible

### Phase 7: Package Polish

- Add README
- Add usage examples
- Add prop documentation
- Add screenshots or GIFs
- Add peer dependency documentation
- Prepare npm publishing

---

## 21. Recommended Package Tooling

Recommended setup:

```txt
TypeScript
React Native Builder Bob
Jest
ESLint
Prettier
Example app
```

Recommended package builder:

```txt
react-native-builder-bob
```

Reason:

It is commonly used for React Native library packages and supports generating CommonJS, ES modules, and TypeScript declarations.

---

## 22. Dependencies

Initial required peer dependencies:

```json
{
  "react": ">=18",
  "react-native": ">=0.72"
}
```

Avoid required native dependencies in v1.

Do not require:

```txt
react-native-reanimated
react-native-gesture-handler
react-native-svg
```

Unless implementation becomes too painful without them.

Important note:

A true smooth circular hue wheel may be difficult without SVG or canvas-like rendering. For v1, the hue wheel can be approximated using React Native views or later implemented with an optional `react-native-svg` dependency.

Recommended practical decision:

- v1 can use `react-native-svg` if the hue wheel quality matters.
- If zero native dependencies is more important, start with slider mode and modal first.

Since the package is still fully React Native and not Swift/Kotlin, using `react-native-svg` is acceptable if documented as a peer dependency.

---

## 23. Important Technical Decisions

### 23.1 Use HSV internally

Reason:

The picker controls map naturally to hue, saturation, and brightness.

### 23.2 Keep component controlled

The selected color is controlled by developer through `value` and `onChange`.

### 23.3 Output string + full object

This gives simple usage and advanced usage at the same time.

### 23.4 Avoid native code

The package should not include custom Swift, Objective-C, Java, or Kotlin code.

### 23.5 Keep styling customizable

Expose style props instead of enforcing a specific design system.

---

## 24. Finalized v1 Decisions

These decisions are locked for v1.

### 24.1 Alpha / Opacity

Do not support alpha selection in v1.

The picker can parse and output `rgba` / `hsla` formats, but the UI will not include a dedicated alpha slider yet.

Default alpha value:

```ts
a: 1
```

Alpha support can be added later as:

```tsx
showAlphaSlider={true}
```

---

### 24.2 Preset Click Behavior

Preset selection should update the selected color immediately.

It should not close the picker automatically.

Reason:

Developers and users may want to select a preset and then fine-tune it with sliders, wheel, or square controls.

---

### 24.3 Confirm / Cancel Buttons

Do not use confirm/cancel buttons by default in v1.

The picker updates immediately on every change.

Possible future option:

```tsx
applyMode="instant" | "confirm"
```

v1 default:

```tsx
applyMode="instant"
```

---

### 24.4 Default Presets

Do not provide default presets.

If the developer wants presets, they must pass them manually:

```tsx
<ColorPickerInput
  showPresets
  presets={['#FF3B30', '#34C759', '#007AFF']}
/>
```

Reason:

The package should not force a design palette on consumers.

---

### 24.5 `react-native-svg`

`react-native-svg` is allowed in v1 if needed.

It is free to use and acceptable for this package.

Recommended decision:

Use `react-native-svg` for high-quality hue wheel and square picker visuals if plain React Native views are not enough.

Package rule:

- no custom Swift/Kotlin/Java code written by this package
- `react-native-svg` may be used as a peer dependency
- document installation clearly in README

Recommended peer dependency:

```json
{
  "react-native-svg": ">=15"
}
```

---

## 25. Final v1 Scope

Version 1 should include:

- `ColorPickerInput`
- controlled value
- `hex`, `rgba`, `hsl` display/output formats
- `slider` mode
- `wheel-slider` mode
- `wheel-square` mode
- modal presentation
- popover presentation
- optional presets
- optional bottom preview
- pure TypeScript utility functions
- no custom native Swift/Kotlin/Java code

---

## 26. Suggested README Summary

```txt
A customizable React Native color picker input with slider, wheel-slider, and wheel-square modes. Supports modal or popover presentation, presets, previews, and hex/rgba/hsl color formats. Built with React Native and TypeScript, without custom native code.
```

