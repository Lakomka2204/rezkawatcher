import { ReactNode } from 'react';
import { StyleSheet, Animated, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

interface TouchableCardProps {
  children: ReactNode
  onClick?: () => void
  onLongClick?: () => void
  className?: string
  style?: StyleProp<ViewStyle>
}

const TouchableCard = (props: TouchableCardProps) => {
  const scale = new Animated.Value(1);
  function pressIn() {
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }
  function pressOut() {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }
  return (
      <TouchableOpacity
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={props.onClick}
        onLongPress={props.onLongClick}
        style={StyleSheet.compose({
          transform: [{ scale }],
        },props.style)}
        className={props.className}
        children={props.children}
        activeOpacity={.6}>
        </TouchableOpacity>
  );
};

export default TouchableCard;

