import React, { useEffect, useRef, useState } from 'react';
import { Alert, LayoutChangeEvent, StyleSheet } from 'react-native';

import { Box, Button, Center, Text, useToast, VStack, Spinner } from 'native-base';

import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import MapView, { Circle, Marker } from 'react-native-maps';

import { BasePageProps } from '@/types/navigation';

const LOCATION_UPDATE_TASK = 'location-update-tast';

TaskManager.defineTask(LOCATION_UPDATE_TASK, ({ data, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }

  console.info({ data });
});

type Props = BasePageProps<'Location'>;

const LocationScreen: React.FC<Props> = () => {
  // const [hasUpdate, setHasUpdate] = useState(false);
  const [currentLocation, setCurrentLocaion] = useState<LocationObjectCoords | undefined>();
  const [mapBoxSize, setMapBoxSize] = useState<{ width: number; height: number }>({ height: 100, width: 100 });
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number }[]>([]);

  const toast = useToast();

  const ref = useRef<Location.LocationSubscription>();

  const onStartLocationWatch = async () => {
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
  };

  const onStopLocationWatch = async () => {
    ref.current?.remove();
    const location = await Location.getCurrentPositionAsync();
    setCurrentLocaion(location.coords);
  };

  const onStartLocationUpdateBackground = async () => {
    const isAvailable = await TaskManager.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('TaskManager not available');
      return;
    }

    const isRegister = await TaskManager.isTaskRegisteredAsync(LOCATION_UPDATE_TASK);
    if (!isRegister) {
      Alert.alert('TaskManager not register');
      return;
    }

    const status = await Location.hasStartedLocationUpdatesAsync(LOCATION_UPDATE_TASK);
    if (!status) {
      await Location.startLocationUpdatesAsync(LOCATION_UPDATE_TASK, {
        accuracy: Location.Accuracy.BestForNavigation,
      });
    }
  };

  const onStopLocationUpdateBackground = async () => {
    const status = await Location.hasStartedLocationUpdatesAsync(LOCATION_UPDATE_TASK);
    if (status) {
      await Location.stopLocationUpdatesAsync(LOCATION_UPDATE_TASK);
    }
  };

  const onLayoutMapBox = ({
    nativeEvent: {
      layout: { height, width },
    },
  }: LayoutChangeEvent) => {
    console.info({ height, width });
    setMapBoxSize({ height: height * 0.9, width: width * 0.9 });
  };

  // const onBlurEvent = () => {
  //   console.info('Blur -> Location Watching 取り消し');
  //   ref.current?.remove();
  // };

  // useEffect(() => {
  //   navigation.addListener('blur', onBlurEvent);
  //   return () => navigation.removeListener('blur', onBlurEvent);
  // }, [navigation]);

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
        {/* Permission Confirm */}
        <VStack>
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
        </VStack>

        {/* Foreground Watch Location */}
        <VStack>
          <Button onPress={onStartLocationWatch} variant='link' p={1}>
            Start Watch Location
          </Button>
          <Button onPress={onStopLocationWatch} variant='link' p={1}>
            Stop Watch Location
          </Button>
        </VStack>

        {/* Background Update Location */}
        <VStack>
          <Button onPress={onStartLocationUpdateBackground} variant='link' p={1}>
            Start Update Background Location
          </Button>
          <Button onPress={onStopLocationUpdateBackground} variant='link' p={1}>
            Stop Update Background Location
          </Button>
        </VStack>
      </Center>

      <Center flex={1} onLayout={onLayoutMapBox} w='full'>
        {currentLocation && (
          <MapView
            style={[styles.map, mapBoxSize]}
            initialRegion={{
              latitude: currentLocation?.latitude,
              longitude: currentLocation?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onLongPress={({
              nativeEvent: {
                coordinate: { latitude, longitude },
              },
            }) => {
              setMarkers((prev) => [...prev, { latitude, longitude }]);
            }}
          >
            {/* current location marker */}
            <Marker coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }} />
            {/* geofencing position */}
            {markers.map((markerData, index) => (
              <React.Fragment key={index.toString()}>
                <Marker coordinate={{ ...markerData }} />
                <Circle center={{ ...markerData }} radius={50} strokeColor='#f00' fillColor='rgba(255,0,0,0.2)' />
              </React.Fragment>
            ))}
          </MapView>
        )}
      </Center>

      <Center flexDir={'row'} height={12} justifyContent='center' alignItems={'center'}>
        <VStack>
          {!currentLocation && <Spinner />}
          <Text>緯度 : {currentLocation?.latitude || '---'}</Text>
          <Text>経度 : {currentLocation?.longitude || '---'}</Text>
        </VStack>
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
