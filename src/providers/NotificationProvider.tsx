import { createContext, FC, useEffect, useState } from 'react';

import * as Notifications from 'expo-notifications';

import { registerForPushNotificationsAsync } from '@/libs/notification';

type NotificationContextProps = {
  pushToken: string | undefined;
};
export const NotificationContext = createContext<NotificationContextProps>({ pushToken: '' });

export const NotificationProvideer: FC = ({ children }) => {
  const [pushToken, setPushToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setPushToken(token));

    const subsc1 = Notifications.addNotificationReceivedListener((notification) => {
      console.info({ notification });
    });

    const subsc2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.info({ response });
    });

    return () => {
      Notifications.removeNotificationSubscription(subsc1);
      Notifications.removeNotificationSubscription(subsc2);
    };
  }, []);

  return <NotificationContext.Provider value={{ pushToken }}>{children}</NotificationContext.Provider>;
};
