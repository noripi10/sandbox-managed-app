import React from 'react';
import { Router } from './src/navigation/Router';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <NativeBaseProvider>
      <Router />
    </NativeBaseProvider>
  );
}
