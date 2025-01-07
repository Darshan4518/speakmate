import React, { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

interface WaveformProps {
  isListening: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ isListening }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animation.setValue(0);
    }
  }, [isListening]);

  return (
    <Svg height="200" width={screenWidth}>
      <Path
        d={`M0,100 Q${screenWidth * 0.25},${80} ${
          screenWidth * 0.5
        },100 T${screenWidth},100`}
        fill="none"
        stroke="rgba(255,140,0,0.5)"
        strokeWidth="2"
      />
      <Path
        d={`M0,100 Q${screenWidth * 0.25},${120} ${
          screenWidth * 0.5
        },100 T${screenWidth},100`}
        fill="none"
        stroke="rgba(0,191,255,0.5)"
        strokeWidth="2"
      />
    </Svg>
  );
};
