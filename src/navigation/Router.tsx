import { FC } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { useGlobalTheme } from '@/hooks/useGlobalTheme';
// import { StackNavigator } from '@/navigation/StackNavigator';

import { BottomNavigator } from './BottomNavigator';

export const Router: FC = () => {
  const { AutoStatusBar, naviTheme } = useGlobalTheme();

  return (
    <>
      {AutoStatusBar}
      <NavigationContainer theme={naviTheme}>
        <BottomNavigator />
      </NavigationContainer>
    </>
  );
};
