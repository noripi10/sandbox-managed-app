import React from 'react';
import { RefreshControl } from 'react-native';

import { Box, ScrollView, Text } from 'native-base';

import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useGlobalTheme } from '@/hooks/useGlobalTheme';

import Wave from '../../assets/wave.svg';

type Props = unknown;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const SVGScreen: React.FC<Props> = () => {
  const { naviTheme } = useGlobalTheme();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const scrollAnimated = useAnimatedStyle(() => {
    const translateX = interpolate(scrollY.value, [0, 200], [0, 60]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <AnimatedScrollView
      flex={1}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => console.info('refresh')}
          tintColor={naviTheme.dark ? '#ddd' : '#333'}
          title='loading'
          titleColor={naviTheme.dark ? '#ddd' : '#333'}
          style={{ zIndex: 100 }}
        />
      }
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      <Box position={'relative'}>
        <Box bgColor={'#bb6060'} position='absolute' top={-400} left={0} right={0} height={500} />
        <Animated.View style={[scrollAnimated]}>
          <Wave
            fill={'#bb6060'}
            height={280}
            width={'150%'}
            viewBox={'0 0 1440 320'}
            style={{ position: 'absolute', top: 0, left: -30 }}
          />
        </Animated.View>
        <Box position={'absolute'} top={16} left={8}>
          <Text fontSize={'2xl'}>SVG Screen</Text>
        </Box>
      </Box>
    </AnimatedScrollView>
  );
};

export default SVGScreen;
