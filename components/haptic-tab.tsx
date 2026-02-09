import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const [pressed, setPressed] = useState(false);
  const onPressIn = useCallback(
    (ev: any) => {
      setPressed(true);
      if (process.env.EXPO_OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      props.onPressIn?.(ev);
    },
    [props]
  );
  const onPressOut = useCallback(
    (ev: any) => {
      setPressed(false);
      props.onPressOut?.(ev);
    },
    [props]
  );
  return (
    <PlatformPressable
      {...props}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[props.style, pressed && styles.pressed]}
    />
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
});
