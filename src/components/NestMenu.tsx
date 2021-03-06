import React, { ReactNode, VFC } from 'react';
import { StyleSheet, TouchableOpacity, ViewProps } from 'react-native';

import { Box, HStack, Text } from 'native-base';

type NestChildProp = {
  index?: number;
  viewProps?: ViewProps;
  onItemClick?: () => void;
  children: ReactNode;
};
export const NestItem: VFC<NestChildProp> = ({ index, viewProps, onItemClick, children }: NestChildProp) => {
  return (
    <TouchableOpacity {...viewProps} style={[styles.nestChildStyle, viewProps?.style]} onPress={onItemClick}>
      <Box flex={1} borderRadius={2} p={1} justifyContent='center'>
        <HStack flex={1} px={2} alignItems='center'>
          <Text>{index}.</Text>
          {children}
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

type NestMenuProp = {
  viewProps?: ViewProps;
  onItemClick?: () => void;
  // eslint-disable-next-line no-undef
  children: JSX.Element[];
};

type NestMenuWithItemProp = VFC<NestMenuProp> & { Item: VFC<NestChildProp> };

export const NestMenu: NestMenuWithItemProp = ({ viewProps, onItemClick, children }: NestMenuProp) => {
  return (
    <Box {...viewProps}>
      {/* NestItemを展開 */}
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, { index, onItemClick });
      })}
    </Box>
  );
};
NestMenu.displayName = 'NestMenu';
NestMenu.Item = NestItem;

const styles = StyleSheet.create({
  nestChildStyle: {
    borderRadius: 4,
  },
});
