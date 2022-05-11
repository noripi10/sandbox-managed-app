import React, { ReactNode, VFC } from 'react';
import { StyleSheet, TouchableOpacity, ViewProps } from 'react-native';

import { Box, Text } from 'native-base';

type NestChildProp = {
  index?: number;
  viewProps?: ViewProps;
  onItemClick?: () => void;
  children: ReactNode;
};
export const NestItem: VFC<NestChildProp> = ({ index, viewProps, onItemClick, children }: NestChildProp) => {
  return (
    <TouchableOpacity {...viewProps} style={[styles.nestChildStyle, viewProps?.style]} onPress={onItemClick}>
      <Box borderRadius={2} p={1} justifyContent='center'>
        <Text>{index}</Text>
        {children}
      </Box>
    </TouchableOpacity>
  );
};

type NestMenuProp = {
  viewProps?: ViewProps;
  // eslint-disable-next-line no-undef
  children: JSX.Element[];
};
export const NestMenu: VFC<NestMenuProp> & { Item: VFC<NestChildProp> } = ({ viewProps, children }: NestMenuProp) => {
  return (
    <Box {...viewProps}>
      {/* NestItemを展開 */}
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, { index });
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
