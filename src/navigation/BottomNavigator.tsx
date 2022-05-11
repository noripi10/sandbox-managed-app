import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AnimationFlatListScreen } from '@/screens';
import { NestComponentScreen } from '@/screens';

type BottomNavigationParamList = {
  AnimationList: undefined;
  NestComponent: undefined;
};

const Bottom = createBottomTabNavigator<BottomNavigationParamList>();

export const BottomNavigator = () => {
  return (
    <Bottom.Navigator>
      <Bottom.Screen name='NestComponent' component={NestComponentScreen} />
      <Bottom.Screen name='AnimationList' component={AnimationFlatListScreen} />
    </Bottom.Navigator>
  );
};
