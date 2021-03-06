import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  AnimationFlatListScreen,
  GraphqlScreen,
  LocationScreen,
  NestComponentScreen,
  QRGenerateScreen,
  SimpleFlatListScreen,
  SVGScreen,
  WebGlScreen,
  WelcomScreen,
} from '@/screens';

export type BottomNavigationParamList = {
  AnimationFlatList: undefined;
  SimpleFlatList: undefined;
  NestComponent: undefined;
  WebGL: undefined;
  SVG: undefined;
  Location: undefined;
  Graphql: undefined;
  Welcome: undefined;
  QR: undefined;
};

const Bottom = createBottomTabNavigator<BottomNavigationParamList>();

export const BottomNavigator = () => {
  const createTabBarIcon = ({ size, color }: { focused: boolean; size: number; color: string }) => {
    return <Ionicons size={size} color={color} name='logo-react' />;
  };

  return (
    <Bottom.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTitle: route.name,
        tabBarIcon: createTabBarIcon,
      })}
      // tabBar={(props) => {
      //   return <>{console.info({ props })}</>;
      // }}
    >
      <Bottom.Screen name='Welcome' component={WelcomScreen} />
      <Bottom.Screen name='Graphql' component={GraphqlScreen} />
      <Bottom.Screen name='SVG' component={SVGScreen} />
      <Bottom.Screen name='WebGL' component={WebGlScreen} />
      <Bottom.Screen name='NestComponent' component={NestComponentScreen} />
      <Bottom.Screen name='AnimationFlatList' component={AnimationFlatListScreen} />
      <Bottom.Screen name='SimpleFlatList' component={SimpleFlatListScreen} />
      <Bottom.Screen name='Location' component={LocationScreen} />
      <Bottom.Screen name='QR' component={QRGenerateScreen} />
    </Bottom.Navigator>
  );
};
