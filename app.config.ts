import 'dotenv/config';
import { ConfigContext, ExpoConfig } from '@expo/config';

const context = ({ config }: ConfigContext): ExpoConfig => {
  const commonConfig = {
    ...config,
    name: 'sandbox-managed-app',
    slug: 'sandbox-managed-app',
    extra: {
      APP_ENV: process.env.APP_ENV,
    },
  };

  const apiKey = process.env.APP_ENV === 'production' ? 'production-api-key' : 'not-production-api-key';

  return {
    ...commonConfig,
    extra: {
      ...commonConfig.extra,
      API_KEY: apiKey,
    },
  };
};

export default context;
