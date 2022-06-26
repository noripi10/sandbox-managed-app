import 'expo-dev-client';

import React from 'react';

import { NativeBaseProvider } from 'native-base';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'https://nestjs-prisma-graphql.herokuapp.com/graphql',
  cache,
});

import { PreventSplashScreen } from '@/libs/splash-screen';
import { NotificationProvideer } from '@/providers/NotificationProvider';

import { Router } from './src/navigation/Router';

PreventSplashScreen();

export default function App() {
  return (
    <NotificationProvideer>
      <NativeBaseProvider>
        <ApolloProvider client={client}>
          <Router />
        </ApolloProvider>
      </NativeBaseProvider>
    </NotificationProvideer>
  );
}
