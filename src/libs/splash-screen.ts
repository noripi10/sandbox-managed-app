import * as SplashScreen from 'expo-splash-screen';

export const PreventSplashScreen = () => {
  SplashScreen.preventAutoHideAsync().catch((error) => console.warn(error));
};

export const HideSplashScreen = () => {
  return SplashScreen.hideAsync();
};
