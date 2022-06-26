import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { BottomNavigationParamList } from '@/navigation/BottomNavigator';

export type PageKey = keyof BottomNavigationParamList;
export type BasePageProps<T extends NonNullable<PageKey>> = BottomTabScreenProps<BottomNavigationParamList, T>;
