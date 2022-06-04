import React, { FC } from 'react';

import { Box, Heading, Text } from 'native-base';

import { useGetUsersQuery } from '@/types/graphql/graphql';

const GraphqlScreen: FC = () => {
  const { data, error } = useGetUsersQuery();

  if (error) {
    return (
      <Box flex={1} safeArea>
        <Box px={4}>
          <Heading>GraphqlScreen</Heading>
        </Box>
        <Box flex={1}>
          <Text>error</Text>
          <Text>{error.message}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} safeArea>
      <Box px={4}>
        <Heading>GraphqlScreen</Heading>
        {/* <Button onPress={getSampleData}>getSampleData</Button> */}
      </Box>
      <Box flex={1}>
        <Text>data</Text>
        <Text>{JSON.stringify(data)}</Text>
      </Box>
    </Box>
  );
};

export default GraphqlScreen;