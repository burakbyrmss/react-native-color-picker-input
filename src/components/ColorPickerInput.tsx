import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  findNodeHandle,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
  type LayoutRectangle,
} from 'react-native';
import type { ColorPickerInputProps } from '../types/props';
import { colorValueFromHsv } from '../utils/colorConversions';
import { formatColor } from '../utils/colorFormatters';
import { parseColor } from '../utils/colorParsers';
import { ColorPickerModal } from './ColorPickerModal';
import { ColorPickerPopover } from './ColorPickerPopover';
import { ColorSwatch } from './ColorSwatch';

const DEFAULT_PROPS = {
  mode: 'wheel-square' as const,
  presentation: 'popover' as const,
  outputFormat: 'hex' as const,
  displayFormat: 'hex' as const,
  showInputSwatch: true,
  showInputText: true,
  showPresets: false,
  presets: [] as string[],
  showPreview: true,
};

export function ColorPickerInput(props: ColorPickerInputProps) {
  const {
    value,
    onChange,
    mode = DEFAULT_PROPS.mode,
    presentation = DEFAULT_PROPS.presentation,
    outputFormat = DEFAULT_PROPS.outputFormat,
    displayFormat = DEFAULT_PROPS.displayFormat,
    showInputSwatch = DEFAULT_PROPS.showInputSwatch,
    showInputText = DEFAULT_PROPS.showInputText,
    showPresets = DEFAULT_PROPS.showPresets,
    presets = DEFAULT_PROPS.presets,
    showPreview = DEFAULT_PROPS.showPreview,
    disabled = false,
    inputStyle,
    inputTextStyle,
    pickerContainerStyle,
    modalProps,
    onOpen,
    onClose,
  } = props;

  const [open, setOpen] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<LayoutRectangle | null>(
    null
  );
  const inputRef = useRef<{
    measureInWindow?: (
      callback: (x: number, y: number, width: number, height: number) => void
    ) => void;
  } | null>(null);

  const parsedValue = useMemo(() => {
    try {
      return parseColor(value);
    } catch {
      return parseColor('#000000');
    }
  }, [value]);

  const [hsv, setHsv] = useState(parsedValue.hsv);

  useEffect(() => {
    setHsv(parsedValue.hsv);
  }, [value, parsedValue.hsv]);

  const displayText = useMemo(
    () => formatColor(parsedValue, displayFormat),
    [parsedValue, displayFormat]
  );

  const emitChange = useCallback(
    (nextHsv: typeof hsv) => {
      const colorObject = colorValueFromHsv(nextHsv);
      const formatted = formatColor(colorObject, outputFormat);
      onChange(formatted, colorObject);
    },
    [onChange, outputFormat]
  );

  const handleHsvChange = useCallback(
    (nextHsv: typeof hsv) => {
      setHsv(nextHsv);
      emitChange(nextHsv);
    },
    [emitChange]
  );

  const openPicker = useCallback(() => {
    if (disabled) {
      return;
    }

    const measure = inputRef.current?.measureInWindow;
    if (measure) {
      measure((x, y, width, height) => {
        setAnchorLayout({ x, y, width, height });
        setOpen(true);
        onOpen?.();
      });
      return;
    }

    const node = findNodeHandle(inputRef.current);
    if (node != null) {
      UIManager.measureInWindow(node, (x, y, width, height) => {
        setAnchorLayout({ x, y, width, height });
        setOpen(true);
        onOpen?.();
      });
      return;
    }

    setOpen(true);
    onOpen?.();
  }, [disabled, onOpen]);

  const closePicker = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const pickerBodyProps = {
    mode,
    hsv,
    onHsvChange: handleHsvChange,
    showPresets,
    presets,
    showPreview,
    displayFormat,
    pickerContainerStyle,
  };

  return (
    <>
      <View
        ref={(node) => {
          inputRef.current = node;
        }}
        collapsable={false}
      >
        <Pressable
          onPress={openPicker}
          disabled={disabled}
          style={({ pressed }) => [
            styles.input,
            pressed && !disabled && styles.inputPressed,
            disabled && styles.inputDisabled,
            inputStyle,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open color picker"
        >
          {showInputSwatch ? <ColorSwatch color={parsedValue.hex} /> : null}
          {showInputText ? (
            <Text style={[styles.inputText, inputTextStyle]}>
              {displayText}
            </Text>
          ) : null}
        </Pressable>
      </View>

      {presentation === 'modal' ? (
        <ColorPickerModal
          visible={open}
          onClose={closePicker}
          modalProps={modalProps}
          {...pickerBodyProps}
        />
      ) : (
        <ColorPickerPopover
          visible={open}
          onClose={closePicker}
          anchorLayout={anchorLayout}
          {...pickerBodyProps}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    backgroundColor: '#fff',
    minHeight: 44,
  },
  inputPressed: {
    opacity: 0.85,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  inputText: {
    fontSize: 14,
    color: '#222',
    fontFamily: 'monospace',
  },
});
