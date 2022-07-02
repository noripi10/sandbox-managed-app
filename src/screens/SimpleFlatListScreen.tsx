import { FC } from 'react';
import { FlatList } from 'react-native';

import { Box, Center, HStack, Image, Spinner, Text } from 'native-base';

import { Ionicons } from '@expo/vector-icons';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';

const SimpleFlatListScreen: FC = () => {
  const { isLoading, data, fetchNextPage } = useInfiniteQuery('gamelist', gameFecher, {
    getNextPageParam: (lastPage) => {
      return lastPage.next;
    },
  });

  const listData =
    data?.pages.reduce(
      (total, current) => [...(total || []), ...(current.results || [])],
      [] as GamesDataResultsProps
    ) || [];

  return (
    <Box flex={1} safeArea>
      <Box flex={1} padding={2}>
        <Text>SimpleFlatListScreen</Text>
        <Box h={'56'} position='relative'>
          <Text>https://api.rawg.io/docs/#operation/games_list</Text>

          <FlatList
            horizontal
            data={listData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const starCount = Math.ceil(item.rating);
              const floarStarCount = Math.floor(item.rating);
              return (
                <Box
                  w={'56'}
                  h={'48'}
                  borderColor='gray.400'
                  borderRadius={8}
                  borderWidth={1}
                  mx={1}
                  shadow={2}
                  position='relative'
                >
                  <Image src={item.background_image} w={56} h={48} borderRadius={8} alt={item.name} />
                  <Box position={'absolute'} top={1} left={2}>
                    <Text fontSize={12} fontWeight={'bold'} color='#fff' shadow={4}>
                      {item.name}
                    </Text>
                  </Box>
                  <HStack position='absolute' bottom={1} right={2}>
                    {[...Array(starCount)].map((val, index) => (
                      <Ionicons
                        key={index.toString()}
                        name={index === starCount - 1 && starCount !== floarStarCount ? 'star-half' : 'star'}
                        color='#d4c712'
                        size={16}
                      />
                    ))}
                  </HStack>
                </Box>
              );
            }}
            onEndReached={() => fetchNextPage()}
          />
          {(isLoading || !listData) && (
            <Center
              flex={1}
              justifyContent='center'
              alignItems='center'
              position={'absolute'}
              top={0}
              bottom={0}
              left={0}
              right={0}
            >
              <Spinner size={'sm'} color='green' />
            </Center>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleFlatListScreen;

const gameFecher = async (query: QueryFunctionContext) => {
  const url =
    query.pageParam ?? `https://api.rawg.io/api/games?key=6d24143263534785859a492ff8d2ca2d&page=1&page_size=5`;
  return (await fetch(url).then((res) => res.json())) as Promise<GamesDataResponseProps>;
};
type GamesDataResponseProps = typeof sampleGamesData;
type GamesDataResultsProps = typeof sampleGamesData.results;

const sampleGamesData = {
  count: 0,
  next: 'http://example.com',
  previous: 'http://example.com',
  results: [
    {
      id: 0,
      slug: 'string',
      name: 'string',
      released: '2022-07-02',
      tba: true,
      background_image: 'http://example.com',
      rating: 0,
      rating_top: 0,
      ratings: {},
      ratings_count: 0,
      reviews_text_count: 'string',
      added: 0,
      added_by_status: {},
      metacritic: 0,
      playtime: 0,
      suggestions_count: 0,
      updated: '2022-07-02T11:55:54Z',
      esrb_rating: {
        id: 0,
        slug: 'everyone',
        name: 'Everyone',
      },
      platforms: [
        {
          platform: {
            id: 0,
            slug: 'string',
            name: 'string',
          },
          released_at: 'string',
          requirements: {
            minimum: 'string',
            recommended: 'string',
          },
        },
      ],
    },
  ],
};
