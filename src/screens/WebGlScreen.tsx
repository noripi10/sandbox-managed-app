import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Box, Center, Flex, HStack, Text } from 'native-base';

import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import ExpoThree from 'expo-three';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';
import { BoxGeometry, GridHelper, PerspectiveCamera, PointLight, Scene } from 'three';
import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial';
import { Mesh } from 'three/src/objects/Mesh';

import { BottomNavigationParamList } from '@/navigation/BottomNavigator';

type Props = BottomTabScreenProps<BottomNavigationParamList, 'WebGL'>;

const STICK_RADIUS = 200;
const STICK_SIZE = 40;
const STICK_AVAILABLE_AREA = (STICK_RADIUS - STICK_SIZE) / 2;

const WebGlScreen: React.FC<Props> = () => {
  const [Camera, setCamera] = useState<PerspectiveCamera | undefined>();
  const [isMove, setMove] = useState<boolean>(false);
  const [stateX, setStateX] = useState(0);
  const [stateY, setStateY] = useState(0);

  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const move = (stickX: number, stickY: number) => {
    if (Camera) {
      if (stickX + stickY === 0) {
        setMove(false);
        return;
      }
      setMove(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let timerId: NodeJS.Timer;

    if (Camera && isMove) {
      timerId = setInterval(() => {
        if (stateX < 0) Camera.position.x -= 0.2;
        if (stateX > 0) Camera.position.x += 0.2;

        if (stateY < 0) Camera.position.z -= 0.2;
        if (stateY > 0) Camera.position.z += 0.2;
      }, 60);
    } else {
      // clearInterval(timerId);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [Camera, isMove, stateX, stateY]);

  return (
    <Flex flex={1}>
      <Box flex={1}>
        <GLView
          style={styles.gl}
          onContextCreate={(gl: ExpoWebGLRenderingContext) => {
            const { drawingBufferWidth, drawingBufferHeight } = gl;
            console.info({ drawingBufferWidth, drawingBufferHeight });
            const renderer = new ExpoThree.Renderer({
              gl,
              width: drawingBufferWidth,
              height: drawingBufferHeight,
              clearColor: 'white',
            });

            const scene = new Scene();
            scene.add(new GridHelper(100, 100));

            const geometry = new BoxGeometry(2, 2, 2);
            const material = new MeshLambertMaterial({ color: '#6954e0' });
            const cube = new Mesh(geometry, material);
            cube.position.set(0, 2, 0);
            scene.add(cube);

            const pointLight = new PointLight(0xffffff, 2, 1000, 1);
            pointLight.position.set(0, 200, 200);
            scene.add(pointLight);

            const camera = new PerspectiveCamera(75, drawingBufferWidth / drawingBufferHeight, 0.1, 1000);
            camera.position.set(0, 2, 8);
            setCamera(camera);

            const animate = () => {
              requestAnimationFrame(animate);

              cube.rotation.x += 0.01;
              cube.rotation.y += 0.01;
              // @ts-ignore
              renderer.render(scene, camera);
              gl.endFrameEXP();
            };

            animate();
          }}
        />
      </Box>

      <Stick {...{ x, y, setStateX, setStateY, move }} />
    </Flex>
  );
};

const Stick = ({
  x,
  y,
  setStateX,
  setStateY,
  move,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  setStateX: Dispatch<SetStateAction<number>>;
  setStateY: Dispatch<SetStateAction<number>>;
  move: (resultX: number, resutlY: number) => void;
}) => {
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number; startY: number }>({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      const absX = Math.abs(event.translationX);
      const absY = Math.abs(event.translationY);
      const distance = Math.sqrt(Math.pow(absX, 2) + Math.pow(absY, 2));

      if ([absX, absY, distance].every((e) => e <= STICK_AVAILABLE_AREA)) {
        x.value = ctx.startX + event.translationX;
        y.value = ctx.startY + event.translationY;
      }
    },
    onEnd: (_) => {
      x.value = 0;
      y.value = 0;
    },
  });

  const styleWithGesture = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  const recordResult = (resultX: number, resultY: number) => {
    console.info({ resultX, resultY });
    setStateX(resultX);
    setStateY(resultY);
    move(resultX, resultY);
  };

  useDerivedValue(() => {
    runOnJS(recordResult)(x.value, y.value);
  });

  return (
    <Center flex={1} m={1} bgColor='red'>
      <Text>StickPosition</Text>

      <HStack w={24} justifyContent='space-around' pb={1}>
        {/* <Text>x:{stateX}</Text> */}
        {/* <Text>y:{stateY}</Text> */}
      </HStack>
      <View style={styles.stcickContainer}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.stick, styleWithGesture]} />
        </PanGestureHandler>
      </View>
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gl: {
    flex: 1,
  },
  stcickContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: STICK_RADIUS,
    height: STICK_RADIUS,
    backgroundColor: '#515151',
    borderRadius: STICK_RADIUS / 2,
  },
  stick: {
    width: STICK_SIZE,
    height: STICK_SIZE,
    borderRadius: STICK_SIZE / 2,
    backgroundColor: '#ddd',
  },
});

export default WebGlScreen;
