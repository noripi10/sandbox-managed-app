import { useCallback, useLayoutEffect, useMemo } from 'react';
import { Appearance } from 'react-native';

import { useColorMode } from 'native-base';

import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const useGlobalTheme = () => {
  const { colorMode, setColorMode } = useColorMode();
  const naviTheme = colorMode === 'dark' ? DarkTheme : DefaultTheme;

  const AutoStatusBar = useMemo(() => {
    return <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />;
  }, [colorMode]);

  const lisner = useCallback(
    (pref: Appearance.AppearancePreferences) => {
      setColorMode(pref.colorScheme ?? 'light');

      SystemUI.setBackgroundColorAsync(pref.colorScheme === 'dark' ? '#000' : '#fff');
    },
    [setColorMode]
  );

  useLayoutEffect(() => {
    const nativeTheme = Appearance.getColorScheme();
    SystemUI.setBackgroundColorAsync(nativeTheme === 'dark' ? '#000' : '#fff');
    setColorMode(nativeTheme);

    const unsubscribe = Appearance.addChangeListener(lisner);
    return () => unsubscribe.remove();
  }, [lisner, setColorMode]);

  return { naviTheme, nbTheme: colorMode, AutoStatusBar };
};
