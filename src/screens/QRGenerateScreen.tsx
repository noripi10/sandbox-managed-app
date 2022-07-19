import React, { memo, useEffect, useRef, useState } from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';

import { Box, Button, Flex, Heading, Image, Input } from 'native-base';

import QRCode from 'react-native-qrcode-svg';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { captureRef } from 'react-native-view-shot';

type Props = unknown;

const QRGenerateScreen: React.FC<Props> = () => {
  const [tmpText, setTmpText] = useState('');
  const [qrText, setQRText] = useState('');

  const onGenerate = () => {
    if (!tmpText) return;
    setQRText(tmpText);
  };

  return (
    <Box flex={1} safeArea>
      <Heading>QRGenerateScreen</Heading>
      <Input onChangeText={(e) => setTmpText(e)} />
      <Button onPress={onGenerate}>Generate</Button>
      {!!qrText && <QRCodeContainer value={qrText} />}
    </Box>
  );
};

const QRCodeContainer = memo(({ value }: { value: string }) => {
  const viewRef = useRef<View>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [capureUri, setCapureUri] = useState('');

  const onCaptureQrCode = () => {
    const targetPixelCount = 1080; // If you want full HD pictures
    const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
    // pixels * pixelratio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
    const pixels = targetPixelCount / pixelRatio;

    console.info({ pixelRatio, pixels });

    // Capure保存
    // captureRef(viewRef, {
    //   result: 'tmpfile',
    //   height: pixels,
    //   width: pixels,
    //   quality: 1,
    //   format: 'png',
    // }).then((res) => {
    //   console.info(res);
    //   setCapureUri(res);
    //   res;
    // });
  };
  useEffect(() => {
    onCaptureQrCode();
  }, [value]);

  return (
    <Flex flex={1} flexDir='row'>
      <View ref={viewRef} style={styles.qrContiner}>
        <QRCode value={value} size={300} />
      </View>

      <Box flex={1} justifyContent={'center'} alignItems={'center'}>
        <Image
          key={capureUri}
          width={300}
          height={300}
          source={{
            uri: capureUri,
          }}
          alt='capture image'
          resizeMode='center'
        />
      </Box>
    </Flex>
  );
});

const styles = StyleSheet.create({
  qrContiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRGenerateScreen;
