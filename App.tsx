import 'expo-dev-client';

import React from 'react';

import { NativeBaseProvider } from 'native-base';

import { LinearGradient } from 'expo-linear-gradient';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'https://nestjs-prisma-graphql.herokuapp.com/graphql',
  cache,
});

import { Router } from './src/navigation/Router';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider config={{ dependencies: { 'linear-gradient': LinearGradient } }}>
        <Router />
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
