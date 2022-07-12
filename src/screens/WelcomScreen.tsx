import React, { useContext } from 'react';

import { Box, Heading, Text, VStack } from 'native-base';

import { FetchContainer } from '@/components/FetchData';
import { NotificationContext } from '@/providers/NotificationProvider';

type Props = unknown;

const WelcomScreen: React.FC<Props> = () => {
  const { pushToken } = useContext(NotificationContext);
  return (
    <Box flex={1} safeArea>
      <Heading>WelcomScreen</Heading>
      <VStack>
        <Text>PushToken</Text>
        <Text>{pushToken}</Text>
      </VStack>
      <Box m={'4'} />

      <FetchContainer />
    </Box>
  );
};

export default WelcomScreen;
