import React, { FC, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProps,
  Image,
  NativeScrollEvent,
  SafeAreaView,
  ScaledSize,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { faker } from '@faker-js/faker';

const WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = WIDTH * 0.95;
const ITEM_HEIGHT = 80;
const ITEM_MARGIN = 8;
const ITEM_HEIGHT_TOTAL = 80 + ITEM_MARGIN * 2;

const list = [...Array(100).keys()].map(() => {
  return {
    name: faker.name.findName(),
    avatar: faker.image.avatar(),
    address: faker.address.city(),
    phone: faker.phone.phoneNumberFormat(),
  };
});
type ItemProp = typeof list[0];

const AnimatedFlatlist = Animated.createAnimatedComponent<FlatListProps<ItemProp>>(FlatList);

const RenderItem: FC<{ item: ItemProp; index: number; y: SharedValue<number> }> = ({ item, index, y }) => {
  const [itemWidth, setItemWidth] = useState(ITEM_WIDTH);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      y.value,
      [ITEM_HEIGHT_TOTAL * index - 100, ITEM_HEIGHT_TOTAL * index, ITEM_HEIGHT_TOTAL * index + 100],
      [1, 1, 0],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      y.value,
      [ITEM_HEIGHT_TOTAL * index - 100, ITEM_HEIGHT_TOTAL * index, ITEM_HEIGHT_TOTAL * index + 100],
      [1, 1, 0.6],
      Extrapolate.CLAMP
    );

    return { opacity, transform: [{ scale }] };
  });

  const dimensionsChangeEvent = ({ window }: { window: ScaledSize; screen: ScaledSize }) => {
    setItemWidth(window.width * 0.95);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', dimensionsChangeEvent);

    return () => Dimensions.removeEventListener('change', dimensionsChangeEvent);
  }, []);

  return (
    <>
      <Animated.View
        style={[
          {
            width: itemWidth,
            height: ITEM_HEIGHT,
            backgroundColor: 'white',
            margin: ITEM_MARGIN,
            borderRadius: 8,
            justifyContent: 'center',
          },
          animatedStyle,
        ]}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingHorizontal: 16 }}>
            <Image source={{ uri: item.avatar }} style={{ width: 56, height: 56, borderRadius: 28 }} />
          </View>
          <View>
            <Text>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>{item.phone}</Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default function AnimationFlatListScreen() {
  const y = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event: NativeScrollEvent) => {
    y.value = event.contentOffset.y;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <AnimatedFlatlist
          indicatorStyle={'black'}
          contentContainerStyle={{ width: WIDTH }}
          data={list}
          keyExtractor={(item) => item.name + item.address}
          renderItem={({ item, index }) => <RenderItem item={item} index={index} y={y} />}
          onScroll={scrollHandler}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
