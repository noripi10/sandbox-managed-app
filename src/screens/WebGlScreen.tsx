import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
} from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { Box, Button, Center, Flex, HStack, Text } from 'native-base';

// import { Camera as ExCamera } from 'expo-camera';
import { ExpoWebGLRenderingContext, GLSnapshot, GLView } from 'expo-gl';
import ExpoThree from 'expo-three';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
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
  const navigation = useNavigation();

  const [active, setActive] = useState(false);

  const [Camera, setCamera] = useState<PerspectiveCamera | undefined>();
  const [isMove, setMove] = useState<boolean>(false);
  const [stateX, setStateX] = useState(0);
  const [stateY, setStateY] = useState(0);
  const [snapshot, setSnapshot] = useState<GLSnapshot>();

  const glRef = useRef<GLView>(null);
  const sitckRef = useRef<StickRef>();

  const move = useCallback(
    (stickX: number, stickY: number) => {
      if (Camera) {
        if (stickX + stickY === 0) {
          setMove(false);
          return;
        }
        setStateX(stickX);
        setStateY(stickY);
        setMove(true);
      }
    },
    [Camera]
  );

  const contextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
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

    const pointLight = new PointLight('#fff', 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const camera = new PerspectiveCamera(75, drawingBufferWidth / drawingBufferHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    setCamera(camera);

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      // @ts-ignore
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const animateWithStickRef = useRef<number | null>(null);
  const animateWithStick = useCallback(() => {
    animateWithStickRef.current = requestAnimationFrame(animateWithStick);
    if (Camera && isMove) {
      if (stateX < 0) Camera.position.x -= 0.1;
      if (stateX > 0) Camera.position.x += 0.1;

      if (stateY < 0) Camera.position.z -= 0.1;
      if (stateY > 0) Camera.position.z += 0.1;
    }
  }, [Camera, isMove, stateX, stateY]);

  useEffect(() => {
    animateWithStick();

    // Stickを動かすとstateX, stateYが変動するたびに生成されるのでクリアしておく
    return () => {
      cancelAnimationFrame(animateWithStickRef.current ?? -1);
    };
  }, [animateWithStick]);

  useEffect(() => {
    navigation.addListener('blur', () => setActive(false));
    navigation.addListener('focus', () => setActive(true));
  }, [navigation]);

  if (!active) {
    return null;
  }

  return (
    <Flex flex={1}>
      <Box flex={1} position='relative'>
        <GLView style={styles.gl} ref={glRef} onContextCreate={contextCreate} />
        <Button
          position={'absolute'}
          top={8}
          right={4}
          onPress={async () => {
            if (glRef.current) {
              const res = await glRef.current.takeSnapshotAsync();
              setSnapshot(res);
            }
          }}
        >
          SnapShot
        </Button>
        {snapshot && (
          <Box position={'absolute'} bottom={0} right={0}>
            <Image
              source={{ uri: snapshot.uri as string }}
              style={{ width: 100, height: 100 }}
              resizeMethod='auto'
              resizeMode='cover'
            />
          </Box>
        )}
      </Box>

      <Center>
        <Button
          onPress={() => {
            console.info({
              x: sitckRef.current?.getX(),
              y: sitckRef.current?.getY(),
            });
          }}
        >
          Get X/Y
        </Button>
      </Center>

      <Stick {...{ setStateX, setStateY, move }} />
    </Flex>
  );
};

type StickRef =
  | {
      getX: () => number;
      getY: () => number;
    }
  | undefined;

type StickProps = {
  setStateX: Dispatch<SetStateAction<number>>;
  setStateY: Dispatch<SetStateAction<number>>;
  move: (resultX: number, resutlY: number) => void;
};

const Stick = forwardRef<StickRef, StickProps>((props, ref) => {
  const { move } = props;

  const x = useSharedValue(0);
  const y = useSharedValue(0);

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
    move(resultX, resultY);
  };

  useDerivedValue(() => {
    runOnJS(recordResult)(x.value, y.value);
  });

  useImperativeHandle(ref, () => ({
    getX: () => x.value,
    getY: () => y.value,
  }));

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
});

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
