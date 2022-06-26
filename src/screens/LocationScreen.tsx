import React, { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';

import { Box, Button, Center, Text, useToast, Spacer, HStack } from 'native-base';

import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';
import * as Manager from 'expo-task-manager';

import MapView, { Marker } from 'react-native-maps';

import { BasePageProps } from '@/types/navigation';

const TASK_NAME = 'location-update-tast';
Manager.defineTask(TASK_NAME, ({ data, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  console.info({ data });
});

type Props = BasePageProps<'Location'>;

const LocationScreen: React.FC<Props> = ({ navigation }) => {
  // const [hasUpdate, setHasUpdate] = useState(false);
  const [currentLocation, setCurrentLocaion] = useState<LocationObjectCoords | undefined>();
  const [mapBoxSize, setMapBoxSize] = useState<{ width: number; height: number }>({ height: 100, width: 100 });

  const toast = useToast();

  const ref = useRef<Location.LocationSubscription>();
  const onStartWatch = async () => {
    const permission = await Location.getForegroundPermissionsAsync();
    if (!permission) {
      toast.show({
        title: 'Permission Error',
      });
      return;
    }

    ref.current?.remove();
    ref.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
      },
      (location) => {
        setCurrentLocaion(location.coords);
      }
    );
    /*
     if (hasUpdate) {
        setHasUpdate(false);
        await Location.stopLocationUpdatesAsync(TASK_NAME);
        return;
      }

      setHasUpdate(true);
      await Location.startLocationUpdatesAsync(TASK_NAME, {
        activityType: Location.ActivityType.Fitness,
      });
     */
  };
  const onStopWatch = async () => {
    ref.current?.remove();
    const location = await Location.getCurrentPositionAsync();
    setCurrentLocaion(location.coords);
  };

  const onLayoutMapBox = ({
    nativeEvent: {
      layout: { height, width },
    },
  }: LayoutChangeEvent) => {
    console.info({ height, width });
    setMapBoxSize({ height, width });
  };

  const onBlurEvent = () => {
    console.info('blur locationscreen');
    ref.current?.remove();
  };

  useEffect(() => {
    navigation.addListener('blur', onBlurEvent);
    return () => navigation.removeListener('blur', onBlurEvent);
  }, [navigation]);

  useEffect(() => {
    const init = async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      if (result.granted) {
        try {
          const location = await Location.getCurrentPositionAsync();
          setCurrentLocaion(location.coords);

          await Location.requestBackgroundPermissionsAsync();
        } catch (error: unknown) {
          console.error(error);
        }
      }
    };
    init();
  }, []);

  return (
    <Box flex={1} justifyContent={'center'} alignItems={'center'} safeAreaTop>
      <Text fontSize={16}>LocationScreen</Text>
      <Center p={3}>
        <HStack>
          <Button
            onPress={async () => {
              const result = await Location.getForegroundPermissionsAsync();
              console.info({ result });
            }}
            variant='link'
            p={1}
          >
            Get Foreground Permission
          </Button>
          <Button
            onPress={async () => {
              const result = await Location.getBackgroundPermissionsAsync();
              console.info({ result });
            }}
            variant='link'
            p={1}
          >
            Get Background Permission
          </Button>
        </HStack>
        <HStack>
          <Button onPress={onStartWatch} variant='link' p={1}>
            Start Watch Location
          </Button>
          <Button onPress={onStopWatch} variant='link' p={1}>
            Stop Watch Location
          </Button>
        </HStack>
      </Center>
      <Box flex={1} onLayout={onLayoutMapBox} w='full'>
        {currentLocation && (
          <MapView
            style={[styles.map, mapBoxSize]}
            initialRegion={{
              latitude: currentLocation?.latitude,
              longitude: currentLocation?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }} />
          </MapView>
        )}
      </Box>

      <Center flexDir={'row'} height={12} justifyContent='center' alignItems={'center'}>
        {currentLocation && (
          <>
            <Spacer />
            <Text>緯度{currentLocation.latitude}</Text>
            <Spacer />
            <Text>経度{currentLocation.longitude}</Text>
            <Spacer />
          </>
        )}
      </Center>
    </Box>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default LocationScreen;
