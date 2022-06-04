import React, { useEffect, useRef, useState } from 'react';

import { Box, Button, Center, Text, useToast } from 'native-base';

import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import * as Manager from 'expo-task-manager';

const TASK_NAME = 'location-update-tast';
Manager.defineTask(TASK_NAME, ({ data, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  console.info({ data });
});

type Props = unknown;
const LocationScreen: React.FC<Props> = () => {
  // const [hasUpdate, setHasUpdate] = useState(false);
  const [currentLocation, setCurrentLocaion] = useState<LocationObject>();

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
      (location) => setCurrentLocaion(location)
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
  const onStopWatch = () => {
    ref.current?.remove();
    setCurrentLocaion(undefined);
  };

  useEffect(() => {
    const init = async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      if (result.granted) {
        await Location.requestBackgroundPermissionsAsync();
      }
    };
    init();
  }, []);

  return (
    <Box flex={1} justifyContent={'center'} alignItems={'center'}>
      <Center flex={1}>
        <Text>LocationScreen</Text>
        <Button onPress={onStartWatch} variant='link'>
          Start Watch Location
        </Button>
        <Button onPress={onStopWatch} variant='link'>
          Stop Watch Location
        </Button>
      </Center>
      <Center flex={1}>{currentLocation && <Text>{JSON.stringify(currentLocation)}</Text>}</Center>
    </Box>
  );
};

export default LocationScreen;
