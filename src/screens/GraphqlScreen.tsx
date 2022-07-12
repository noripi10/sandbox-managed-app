import React, { FC } from 'react';

import { Box, Button, Center, Heading, ScrollView, Spinner, Text } from 'native-base';

import { useGetUsersQuery } from '@/types/graphql/graphql';

const GraphqlScreen: FC = () => {
  const { data, error, loading, refetch } = useGetUsersQuery();

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
      <Heading>GraphqlScreen</Heading>
      <Button variant={'ghost'} onPress={() => refetch()} _pressed={{ backgroundColor: 'gray.200' }}>
        Refetch
      </Button>
      <ScrollView>
        <Box px={4}>{/* <Button onPress={getSampleData}>getSampleData</Button> */}</Box>
        <Box flex={1}>
          <Text>data</Text>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </Box>
      </ScrollView>
      {loading && (
        <Center position={'absolute'} top={0} right={0} w='full' h='full'>
          <Spinner size='lg' color='green' />
        </Center>
      )}
    </Box>
  );
};

export default GraphqlScreen;
