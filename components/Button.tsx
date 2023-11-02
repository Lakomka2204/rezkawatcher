import React, { useRef } from 'react'
import { Animated, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native'

interface WrapperProps extends PressableProps {
  className?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onClick?: () => void;
}

const Button: React.FC<WrapperProps> = ({ children, style,className, ...rest }) => {
    const animatedScale = useRef(new Animated.Value(1)).current;
    const animSpeed = 80;
  
      const buttonPress = () => {
          Animated.spring(animatedScale, {
            toValue: 1,
            speed:animSpeed,
            useNativeDriver: true
          }).start(rest.onClick);
        };
        const buttonPressIn = () => {
          Animated.spring(animatedScale, {
            toValue: 0.95,
            speed:animSpeed,
            useNativeDriver: true
          }).start();
        };
        const buttonPressOut = () => {
          Animated.spring(animatedScale, {
            toValue:1,
            speed: animSpeed,
            useNativeDriver:true
          }).start();
        };
  return (
    <Animated.View style={{transform:[{scale:animatedScale}]}} className={className}>
      <Pressable {...rest} 
      onPress={buttonPress}
      onPressIn={buttonPressIn} 
      onPressOut={buttonPressOut}
      >
        {children}
    </Pressable>
    </Animated.View>
  );
};

export default Button;
