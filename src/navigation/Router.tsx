import { FC, useState } from 'react';
import { Dimensions } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Animated, {
  BounceIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useGlobalTheme } from '@/hooks/useGlobalTheme';
import { HideSplashScreen } from '@/libs/splash-screen';

import { BottomNavigator } from './BottomNavigator';

const WINDOW = Dimensions.get('window');

export const Router: FC = () => {
  const { AutoStatusBar, naviTheme } = useGlobalTheme();

  const [isFirstView, setFirstView] = useState(true);

  const welcomAnimatedValue = useSharedValue(0);

  // Layout後SplashScreen.Hide + animated.value change(rotation)
  const onLayoutWelcomScreen = () => {
    HideSplashScreen().then(() => {
      welcomAnimatedValue.value = withTiming(1, { duration: 3000 });
    });
  };

  const changeWelocomeState = (val: number) => {
    setFirstView(val === 1 ? false : true);
  };

  useDerivedValue(() => {
    runOnJS(changeWelocomeState)(welcomAnimatedValue.value);
  });

  const animatedBoxStyle = useAnimatedStyle(() => {
    const opacity = interpolate(welcomAnimatedValue.value, [0, 0.5, 1], [1, 1, 0]);
    return {
      flex: 1,
      backgroundColor: '#02BCD4',
      opacity,
    };
  });

  const animatedSubBoxStyle = useAnimatedStyle(() => {
    // const translateY = interpolate(welcomAnimatedValue.value, [0, 1], [0, WINDOW.height / 2]);
    return {
      // transform: [{ translateY }],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(welcomAnimatedValue.value, [0, 1], [0, 720]);
    return {
      transform: [{ rotate: rotateValue.toString() + 'deg' }],
    };
  });

  if (isFirstView) {
    return (
      <Animated.View style={[animatedBoxStyle]}>
        <Animated.View style={[animatedSubBoxStyle]}>
          <Animated.Image
            entering={BounceIn}
            style={[
              animatedStyle,
              {
                resizeMode: 'contain',
                width: WINDOW.width,
                height: WINDOW.height,
              },
            ]}
            onLayout={onLayoutWelcomScreen}
            source={require('../../assets/splash.png')}
          />
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <>
      {AutoStatusBar}
      <NavigationContainer theme={naviTheme}>
        <BottomNavigator />
      </NavigationContainer>
    </>
  );
};
