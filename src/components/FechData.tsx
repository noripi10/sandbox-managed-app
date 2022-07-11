import { useState } from 'react';

import { Box, Input, Text } from 'native-base';

import { useFetch } from '@/hooks/use-fetch';

export const FetchData = () => {
  const [key, setKey] = useState('1');
  const { data } = useFetch(key);

  return (
    <Box w='full' h='100'>
      <Input defaultValue='1' onChangeText={(e) => setKey(e)} />

      <Text>{data ? JSON.stringify(data) : ''}</Text>
    </Box>
  );
};
