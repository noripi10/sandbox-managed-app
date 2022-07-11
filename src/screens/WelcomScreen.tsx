import React, { Suspense, useContext } from 'react';

import { Box, Heading, Text, VStack } from 'native-base';

import { FetchData } from '@/components/FechData';
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
      <Suspense fallback={<Text>loading...</Text>}>
        <FetchData />
      </Suspense>
    </Box>
  );
};

export default WelcomScreen;
