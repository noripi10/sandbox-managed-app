import React, { FC, useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { Box, Button, Center, Heading, Input, ScrollView, Spacer, Spinner, Text } from 'native-base';

import { useCreateUserMutation, useGetUsersQuery } from '@/types/graphql/graphql';

const GraphqlScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const { data, loading, error, refetch } = useGetUsersQuery();
  const [mutation, { loading: mutationLoading, error: mutationError }] = useCreateUserMutation();

  const onRegistar = useCallback(async () => {
    if (!email || !name) {
      Alert.alert('Error');
      return;
    }
    mutation({ variables: { email, name } }).then(() => {
      setEmail('');
      setName('');
      refetch();
    });
  }, [email, name, mutation, refetch]);

  return (
    <Box flex={1} safeAreaTop>
      <Heading>GraphqlScreen</Heading>
      <Box mx={1} my={2} pt={6} px={4} borderWidth={1} borderColor={'gray.400'}>
        <Input value={email} onChangeText={(e) => setEmail(e)} keyboardType='email-address' />
        <Spacer p={1} />
        <Input value={name} onChangeText={(e) => setName(e)} keyboardType='default' />
        <Spacer p={1} />
        <Button
          size='sm'
          onPress={onRegistar}
          backgroundColor={'green.500'}
          _pressed={{ backgroundColor: 'green.800' }}
        >
          Regstar
        </Button>
        <Spacer p={1} />
        <Button
          size='sm'
          onPress={() => refetch()}
          backgroundColor={'orange.500'}
          _pressed={{ backgroundColor: 'orange.800' }}
        >
          Refetch
        </Button>
        <Center h={10}>
          {(error || mutationError) && (
            <Box flex={1}>
              <Text color='red.800'>{error?.message}</Text>
              <Text color='red.400'>{mutationError?.message}</Text>
            </Box>
          )}
        </Center>
      </Box>
      <ScrollView>
        <Box flex={1}>
          <Text fontWeight={'bold'}>Data</Text>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </Box>
      </ScrollView>
      {(loading || mutationLoading) && (
        <Center position={'absolute'} top={0} right={0} w='full' h='full'>
          <Spinner size='lg' color='green' />
        </Center>
      )}
    </Box>
  );
};

export default GraphqlScreen;
