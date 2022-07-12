import { memo, Suspense, useState } from 'react';

import { Box, Button, Input, Text } from 'native-base';

import { useFetch } from '@/hooks/use-fetch';

export const FetchContainer = memo(() => {
  const [itemIndex, setItemIndex] = useState('');

  return (
    <Box
      p={'2'}
      m={'2'}
      borderRadius={'8'}
      borderColor='gray.400'
      borderWidth={1}
      backgroundColor={'gray.200'}
      h={'56'}
    >
      <Input onChangeText={(text) => setItemIndex(text)} borderColor={'gray.400'} />
      <Suspense fallback={<Text>loading...</Text>}>
        <FetchData {...{ itemIndex }} />
      </Suspense>
    </Box>
  );
});

const FetchData = ({ itemIndex }: { itemIndex: string }) => {
  const { data, refetch } = useFetch(itemIndex);

  if (!data) {
    return <Text>key invalid</Text>;
  }

  return (
    <Box>
      <Button variant={'ghost'} onPress={refetch}>
        Refetch
      </Button>
      <Text>{JSON.stringify(data)}</Text>
    </Box>
  );
};
