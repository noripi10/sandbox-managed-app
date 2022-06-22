import React from 'react';

import { Box, Button, Heading, Text } from 'native-base';

import Constants from 'expo-constants';

import { BottomNavigationParamList } from '@/navigation/BottomNavigator';
import * as Screens from '@/screens';
import { BasePageProps } from '@/types/navigation';

type Props = BasePageProps<'Welcome'>;

const WelcomScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Box flex={1} safeAreaTop pt='4'>
      <Heading>WelcomScreen</Heading>
      <Text>API_KEY : {Constants.manifest?.extra?.API_KEY}</Text>
      <Box
        flex={1}
        p={2}
        bg={{ linearGradient: { colors: ['purple.200', 'blue.500'], start: [1, 0], end: [0, 1] } }}
        alignItems='center'
      >
        {Object.keys(Screens)
          .filter((key) => !/^Welcome*?/.test(key))
          .map((screen, idx) => (
            <Box p={1} key={screen}>
              <Button
                borderRadius='full'
                w='xs'
                shadow='2'
                bgColor={`teal.${((idx + 1) * 100).toString()}`}
                onPress={() => {
                  const navigateKey = screen.replace('Screen', '') as keyof BottomNavigationParamList;
                  navigation.navigate(navigateKey);
                }}
              >
                <Text color='gray.600'>{screen}</Text>
              </Button>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default WelcomScreen;
