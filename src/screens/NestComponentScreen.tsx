import React from 'react';
import { Pressable, ScrollView } from 'react-native';

import { Menu, Box, Text } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import { NestMenu } from '@/components/NestMenu';

export default function NestComponentScreen() {
  return (
    <Box flex={1}>
      <Box flex={1} p={4}>
        <Text>CustomNestComponent</Text>
        <ScrollView>
          <NestMenu viewProps={{ style: { flex: 1, width: '100%' } }}>
            <NestMenu.Item
              viewProps={{ style: { height: 48, width: '100%', backgroundColor: '#c62727', marginVertical: 4 } }}
              onItemClick={() => console.info('1')}
            >
              <Text>test1</Text>
            </NestMenu.Item>
            <NestMenu.Item
              viewProps={{ style: { height: 48, width: '100%', backgroundColor: '#2767c6', marginVertical: 4 } }}
              onItemClick={() => console.info('2')}
            >
              <Text>test2</Text>
            </NestMenu.Item>
            <NestMenu.Item
              viewProps={{ style: { height: 48, width: '100%', backgroundColor: '#bf6c00', marginVertical: 4 } }}
              onItemClick={() => console.info('3')}
            >
              <Text>test3</Text>
            </NestMenu.Item>
            <NestMenu.Item
              viewProps={{ style: { height: 48, width: '100%', backgroundColor: '#048428e2', marginVertical: 4 } }}
              onItemClick={() => console.info('4')}
            >
              <Text>test4</Text>
            </NestMenu.Item>
          </NestMenu>
        </ScrollView>
      </Box>
      <Box flex={1} p={4}>
        <Text>NativeBaseMenuComponent</Text>

        <Menu
          w='190'
          trigger={(triggerProps) => {
            return (
              <Pressable accessibilityLabel='More options menu' {...triggerProps}>
                <Ionicons name='menu' size={40} color='#333' />
              </Pressable>
            );
          }}
        >
          <Menu.Item>Arial</Menu.Item>
          <Menu.Item>Nunito Sans</Menu.Item>
          <Menu.Item>Roboto</Menu.Item>
          <Menu.Item>Poppins</Menu.Item>
          <Menu.Item>SF Pro</Menu.Item>
          <Menu.Item>Helvetica</Menu.Item>
          <Menu.Item isDisabled>Sofia</Menu.Item>
          <Menu.Item>Cookie</Menu.Item>
        </Menu>
      </Box>
    </Box>
  );
}
