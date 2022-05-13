import 'dotenv/config';
import { ConfigContext, ExpoConfig } from '@expo/config';

const context = ({ config }: ConfigContext): ExpoConfig => {
  if (process.env.APP_ENV === 'production') {
    return {
      ...config,
      name: 'sandbox-managed-app',
      slug: 'sandbox-managed-app',
      extra: {
        APP_ENV: 'production',
      },
    };
  } else {
    return {
      ...config,
      name: 'sandbox-managed-app',
      slug: 'sandbox-managed-app',
      extra: {
        APP_ENV: 'development',
      },
    };
  }
};

export default context;
