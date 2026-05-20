import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export interface HSVStripStackProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const STRIP_GAP = 8;

export function HSVStripStack({ children, style }: HSVStripStackProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexShrink: 0,
    flexDirection: 'column',
    gap: STRIP_GAP,
    paddingHorizontal: 6,
  },
});
