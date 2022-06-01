import 'expo-dev-client';

import React from 'react';

import { NativeBaseProvider } from 'native-base';

import { Router } from './src/navigation/Router';

export default function App() {
  return (
    <NativeBaseProvider>
      <Router />
    </NativeBaseProvider>
  );
}
