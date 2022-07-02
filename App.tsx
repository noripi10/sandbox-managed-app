import 'expo-dev-client';

import React from 'react';

import { NativeBaseProvider } from 'native-base';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { QueryClient, QueryClientProvider } from 'react-query';

const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
  uri: 'https://nestjs-prisma-graphql.herokuapp.com/graphql',
  cache,
});

const queryClient = new QueryClient();

import { PreventSplashScreen } from '@/libs/splash-screen';
import { NotificationProvideer } from '@/providers/NotificationProvider';

import { Router } from './src/navigation/Router';

PreventSplashScreen();

export default function App() {
  return (
    <NotificationProvideer>
      <NativeBaseProvider>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>
        </ApolloProvider>
      </NativeBaseProvider>
    </NotificationProvideer>
  );
}
