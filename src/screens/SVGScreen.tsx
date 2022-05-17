import React from 'react';

import { Box, ScrollView, Text } from 'native-base';

import Wave from '../../assets/wave.svg';

type Props = unknown;

const SVGScreen: React.FC<Props> = () => {
  return (
    <ScrollView flex={1}>
      <Box position={'relative'}>
        <Box bgColor={'#bb6060'} position='absolute' top={0} left={0} right={0} height={120} />
        <Wave
          fill={'#bb6060'}
          height={280}
          width={'100%'}
          viewBox={'0 0 1440 320'}
          style={{ position: 'absolute', top: 0 }}
        />
        <Box position={'absolute'} top={16} left={8}>
          <Text fontSize={'2xl'}>SVG Screen</Text>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default SVGScreen;
