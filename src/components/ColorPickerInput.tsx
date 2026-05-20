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
import {
  colorValueFromHsv,
  mergeHsvFromParsedColor,
} from '../utils/colorConversions';
import type { HSVColor } from '../types/color';
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
    inputBackgroundColor,
    inputTextColor,
    pickerBackgroundColor,
    pickerTextColor,
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
  const lastEmittedRef = useRef<{ hsv: HSVColor; formatted: string } | null>(
    null
  );

  useEffect(() => {
    const pending = lastEmittedRef.current;

    if (pending !== null && pending.formatted === value.trim()) {
      lastEmittedRef.current = null;
      setHsv(pending.hsv);
      return;
    }

    lastEmittedRef.current = null;
    setHsv((previous) => mergeHsvFromParsedColor(previous, parsedValue));
  }, [value, parsedValue]);

  const displayText = useMemo(
    () => formatColor(parsedValue, displayFormat),
    [parsedValue, displayFormat]
  );

  const emitChange = useCallback(
    (nextHsv: HSVColor) => {
      const colorObject = colorValueFromHsv(nextHsv);
      const formatted = formatColor(colorObject, outputFormat);
      lastEmittedRef.current = { hsv: nextHsv, formatted };
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

    const showPicker = (layout: LayoutRectangle | null) => {
      setAnchorLayout(layout);
      setOpen(true);
      onOpen?.();
    };

    const node = inputRef.current;
    if (node?.measureInWindow) {
      // Must call on the ref — extracting measureInWindow loses `this` and the callback never runs.
      node.measureInWindow((x, y, width, height) => {
        showPicker({ x, y, width, height });
      });
      return;
    }

    const handle = findNodeHandle(node);
    if (handle != null) {
      UIManager.measureInWindow(handle, (x, y, width, height) => {
        showPicker({ x, y, width, height });
      });
      return;
    }

    showPicker(null);
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
    pickerBackgroundColor,
    pickerTextColor,
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
            inputBackgroundColor != null && {
              backgroundColor: inputBackgroundColor,
            },
            pressed && !disabled && styles.inputPressed,
            disabled && styles.inputDisabled,
            inputStyle,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open color picker"
        >
          {showInputSwatch ? <ColorSwatch color={parsedValue.hex} /> : null}
          {showInputText ? (
            <Text
              style={[
                styles.inputText,
                inputTextColor != null && { color: inputTextColor },
                inputTextStyle,
              ]}
            >
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
