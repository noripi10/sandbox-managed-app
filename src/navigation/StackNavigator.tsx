import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AnimationFlatListScreen } from '../screens';

export type NativeStackParamList = {
  Animated: undefined;
};

const Stack = createNativeStackNavigator<NativeStackParamList>();

export const StackNavigator: FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Animated' component={AnimationFlatListScreen} />
    </Stack.Navigator>
  );
};
