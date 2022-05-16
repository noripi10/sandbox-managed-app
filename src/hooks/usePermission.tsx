import { useEffect, useState } from 'react';

import * as Camera from 'expo-camera';

export type UsePermissionProps = ReturnType<typeof usePermission>;

export const usePermission = () => {
  const [cameraPermission, setCameraPermission] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { status: getStatus } = await Camera.Camera.getCameraPermissionsAsync();
      if (getStatus === Camera.PermissionStatus.GRANTED) {
        setCameraPermission(true);
      } else {
        const { status: requestStatus } = await Camera.requestCameraPermissionsAsync();
        const result = requestStatus === Camera.PermissionStatus.GRANTED;
        setCameraPermission(result);
      }
    };

    init();
  }, []);

  return { cameraPermission };
};
