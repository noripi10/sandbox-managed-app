import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AnimationFlatListScreen, LocationScreen, NestComponentScreen, SVGScreen, WebGlScreen } from '@/screens';

export type BottomNavigationParamList = {
  AnimationList: undefined;
  NestComponent: undefined;
  WebGL: undefined;
  SVG: undefined;
  Location: undefined;
};

const Bottom = createBottomTabNavigator<BottomNavigationParamList>();

export const BottomNavigator = () => {
  return (
    <Bottom.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTitle: route.name,
        tabBarIcon: ({ size, color }) => {
          return <Ionicons size={size} color={color} name='logo-react' />;
        },
      })}
    >
      <Bottom.Screen name='SVG' component={SVGScreen} />
      <Bottom.Screen name='WebGL' component={WebGlScreen} />
      <Bottom.Screen name='NestComponent' component={NestComponentScreen} />
      <Bottom.Screen name='AnimationList' component={AnimationFlatListScreen} />
      <Bottom.Screen name='Location' component={LocationScreen} />
    </Bottom.Navigator>
  );
};
