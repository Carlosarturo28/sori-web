'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {
  Physics,
  useBox,
  useConvexPolyhedron,
  usePlane,
} from '@react-three/cannon';
import styles from './DiceRoller.module.css';
import { BufferGeometry, Mesh, Group, Mesh as ThreeMesh } from 'three';
import Image from 'next/image';

type DiceProps = {
  modelPath: string;
  scale?: number;
  launchTrigger: boolean;
  initialPosition?: [number, number, number];
};

type ConvexProps = {
  vertices: [number, number, number][];
  faces: number[][];
};

const DICE_MODELS = [
  { id: 'd4', label: 'D4', path: '/assets/models/d4/d4.gltf', scale: 1 },
  { id: 'd6', label: 'D6', path: '/assets/models/d6/d6.gltf', scale: 0.5 },
  { id: 'd8', label: 'D8', path: '/assets/models/d8/d8.gltf', scale: 1 },
  { id: 'd10', label: 'D10', path: '/assets/models/d10/d10.gltf', scale: 1 },
  { id: 'd12', label: 'D12', path: '/assets/models/d12/d12.gltf', scale: 1 },
  { id: 'd20', label: 'D20', path: '/assets/models/d20/d20.gltf', scale: 1 },
];

DICE_MODELS.forEach((dice) => useGLTF.preload(dice.path));

export function toConvexProps(geometry: BufferGeometry): ConvexProps {
  const vertices: [number, number, number][] = [];
  const faces: number[][] = [];
  const positions = geometry.attributes.position.array;

  // Extraer vértices
  for (let i = 0; i < positions.length; i += 3) {
    vertices.push([positions[i], positions[i + 1], positions[i + 2]]);
  }

  // Extraer caras
  if (geometry.index) {
    const indices = geometry.index.array;
    for (let i = 0; i < indices.length; i += 3) {
      faces.push([indices[i], indices[i + 1], indices[i + 2]]);
    }
  } else {
    for (let i = 0; i < positions.length / 3; i += 3) {
      faces.push([i, i + 1, i + 2]);
    }
  }

  return { vertices, faces };
}

function useResponsiveSetup() {
  const [cameraPos, setCameraPos] = useState<[number, number, number]>([
    0, 20, 0,
  ]);
  const [fov, setFov] = useState(0);
  const [dicePos, setDicePos] = useState<[number, number, number]>([-5, 5, 5]);
  const [worldSize, setWorldSize] = useState({ width: 10, height: 10 });
  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const scale3D = 50;

      setWorldSize({
        width: width / scale3D,
        height: height / scale3D,
      });

      if (width < 600) {
        setCameraPos([0, 15, 0]); // Ajuste para móvil (Z es 0)
        setFov(50);
        setDicePos([-2, 5, 2]);
      } else {
        setCameraPos([0, 25, 0]); // Vista cenital (Z es 0)
        setFov(55);
        setDicePos([-5, 8, 5]);
      }
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return { cameraPos, fov, dicePos, worldSize };
}

// Coloca este nuevo componente justo encima de tu componente Dice

function DiceBody({
  scene,
  convexArgs,
  scale,
  launchTrigger,
  initialPosition,
  onStop,
}: {
  scene: Group;
  convexArgs: [[number, number, number][], number[][]];
  scale: number;
  launchTrigger: boolean;
  initialPosition: [number, number, number];
  onStop: () => void;
}) {
  const [ref, api] = useConvexPolyhedron(() => ({
    mass: 0.5,
    args: convexArgs,
    position: initialPosition,
    angularDamping: 0.05,
    linearDamping: 0.05,
    restitution: 0.9,
    friction: 0.1,
  }));

  const [isStopping, setIsStopping] = useState(false);
  const animationProgress = useRef(0);
  const [currentScale, setCurrentScale] = useState(scale);

  // Estado para velocidad angular y lineal
  const velocityRef = useRef([0, 0, 0]);
  const angularVelocityRef = useRef([0, 0, 0]);

  useEffect(() => {
    if (launchTrigger) {
      api.position.set(...initialPosition);
      api.rotation.set(0, 0, 0);
      api.velocity.set(Math.random() * 40, 0, Math.random() * -40);
      api.angularVelocity.set(
        Math.random() * 15,
        Math.random() * 15 - 10,
        Math.random() * 15
      );
      setIsStopping(false);
      setCurrentScale(scale);
      animationProgress.current = 0;
    }
  }, [launchTrigger, api, initialPosition, scale]);

  const stopTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!launchTrigger) return;

    const VELOCITY_THRESHOLD = 0.1;
    const ANGULAR_VELOCITY_THRESHOLD = 0.1;

    const unsubscribeVel = api.velocity.subscribe((v) => {
      velocityRef.current = v;
      checkStop();
    });

    const unsubscribeAngVel = api.angularVelocity.subscribe((v) => {
      angularVelocityRef.current = v;
      checkStop();
    });

    function checkStop() {
      const v = velocityRef.current;
      const av = angularVelocityRef.current;
      const speed = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
      const angularSpeed = Math.sqrt(av[0] ** 2 + av[1] ** 2 + av[2] ** 2);

      if (
        speed < VELOCITY_THRESHOLD &&
        angularSpeed < ANGULAR_VELOCITY_THRESHOLD
      ) {
        if (!stopTimeout.current && !isStopping) {
          stopTimeout.current = setTimeout(() => {
            setIsStopping(true);
            stopTimeout.current = null;
          }, 3000);
        }
      } else {
        if (stopTimeout.current) {
          clearTimeout(stopTimeout.current);
          stopTimeout.current = null;
        }
      }
    }

    return () => {
      unsubscribeVel();
      unsubscribeAngVel();
      if (stopTimeout.current) {
        clearTimeout(stopTimeout.current);
        stopTimeout.current = null;
      }
    };
  }, [launchTrigger, api, isStopping]);

  // Animar escala y temblor con useFrame
  useFrame((state, delta) => {
    if (isStopping && ref.current) {
      animationProgress.current += delta;
      const t = animationProgress.current;

      // Escalado rápido
      const scaleDuration = 0.2;
      const scaleProgress = Math.min(t / scaleDuration, 1);
      const newScale = scale * (1 - scaleProgress);
      setCurrentScale(newScale);
      ref.current.scale.set(newScale, newScale, newScale);

      if (scaleProgress >= 1) {
        onStop();
      }
    } else if (ref.current) {
      ref.current.rotation.set(0, 0, 0);
      ref.current.scale.set(currentScale, currentScale, currentScale);
    }
  });

  // Busca el primer mesh dentro del grupo
  const mesh = scene.children.find(
    (child): child is ThreeMesh => (child as ThreeMesh).isMesh
  );

  return mesh ? (
    <mesh ref={ref} geometry={mesh.geometry} material={mesh.material} />
  ) : null;
}

function Dice({
  modelPath,
  scale = 1,
  launchTrigger,
  initialPosition = [-5, 2, 5],
  onStop,
}: DiceProps & { onStop: () => void }) {
  const { scene } = useGLTF(modelPath);

  const { convexArgs } = useMemo(() => {
    const mesh = scene.children.find(
      (child): child is Mesh => (child as Mesh).isMesh
    );
    if (!mesh) return { geometry: null, convexArgs: null };

    const geometry = mesh.geometry;
    const { vertices, faces } = toConvexProps(geometry);
    const convexArgs = [vertices, faces] as [
      [number, number, number][],
      number[][]
    ];

    return { geometry, convexArgs };
  }, [scene]);

  if (!convexArgs) {
    return null;
  }

  return (
    <DiceBody
      scene={scene}
      convexArgs={convexArgs}
      scale={scale}
      launchTrigger={launchTrigger}
      initialPosition={initialPosition}
      onStop={onStop}
    />
  );
}

function Ground() {
  usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return null; // No renderizar nada visualmente
}

function Walls({ width, height }: { width: number; height: number }) {
  const wallHeight = 10;
  const wallThickness = 0.5;
  const restitution = 1;
  const adjustedWidth = width * 0.8; // un poco más estrecho
  const adjustedHeight = height * 0.8;

  const frontWallZ = -adjustedHeight + 18 / 2;
  const backWallZ = adjustedHeight - 20 / 2;
  const leftWallX = -adjustedWidth / 2;
  const rightWallX = adjustedWidth / 2;

  useBox(() => ({
    type: 'Static' as const,
    restitution,
    position: [0, wallHeight / 2, frontWallZ],
    args: [width, wallHeight, wallThickness],
    friction: 0.2,
  }));

  useBox(() => ({
    type: 'Static' as const,
    restitution,
    position: [0, wallHeight / 2, backWallZ],
    args: [width, wallHeight, wallThickness],
    friction: 0.2,
  }));

  useBox(() => ({
    type: 'Static' as const,
    restitution,
    position: [leftWallX, wallHeight / 2, 0],
    args: [wallThickness, wallHeight, height],
    friction: 0.2,
  }));

  useBox(() => ({
    type: 'Static' as const,
    restitution,
    position: [rightWallX, wallHeight / 2, 0],
    args: [wallThickness, wallHeight, height],
    friction: 0.2,
  }));

  return null; // No renderizar nada visual
}

export default function DiceRoller() {
  const [fabOpen, setFabOpen] = useState(false);
  const [selectedDice, setSelectedDice] = useState<string | null>(null);
  const [launch, setLaunch] = useState(false);

  const { cameraPos, fov, dicePos, worldSize } = useResponsiveSetup();

  const diceInfo = selectedDice
    ? DICE_MODELS.find((d) => d.id === selectedDice)!
    : null;

  function handleDiceStop() {
    setLaunch(false);
  }

  return (
    <div className={styles.fullscreenCanvas}>
      <Canvas
        shadows
        camera={{
          position: cameraPos,
          fov,
          up: [0, 0, -1],
          near: 0.3,
        }}
      >
        <ambientLight intensity={4} />
        <directionalLight position={[10, 20, 10]} intensity={4} />
        <Physics gravity={[0, -9.81, 0]}>
          <Ground />
          <Walls width={worldSize.width} height={worldSize.height} />

          {launch && diceInfo && (
            <Dice
              key={diceInfo.id}
              modelPath={diceInfo.path}
              scale={diceInfo.scale}
              launchTrigger={launch}
              initialPosition={dicePos}
              onStop={handleDiceStop}
            />
          )}
        </Physics>
      </Canvas>

      <div className={styles.fabWrapper}>
        {/* Main FAB Button with optimized D20 image */}
        <button
          className={`${styles.fabMain} ${fabOpen ? styles.fabMainOpen : ''}`}
          aria-label={fabOpen ? 'Close selector' : 'Open selector'}
          onClick={() => setFabOpen((open) => !open)}
          aria-expanded={fabOpen}
        >
          <div
            className={`${styles.diceIconContainer} ${
              fabOpen ? styles.rotateIcon : ''
            }`}
          >
            <Image
              src='/assets/dice/d20.svg'
              alt='D20'
              width={32}
              height={32}
              className={styles.diceIcon}
            />
          </div>
        </button>

        {/* Dice options list */}
        <div
          className={`${styles.fabOptions} ${fabOpen ? styles.open : ''}`}
          aria-hidden={!fabOpen}
        >
          <div className={styles.diceButtons}>
            {DICE_MODELS.map(({ id, label }, index) => (
              <button
                key={id}
                className={`${styles.fabOption} ${
                  id === selectedDice ? styles.fabSelected : ''
                }`}
                onClick={() => {
                  setSelectedDice(id);
                  setLaunch(true); // <-- aquí lanzamos el dado automáticamente
                  setFabOpen(false); // opcional, para cerrar el menú al elegir dado
                }}
                tabIndex={fabOpen ? 0 : -1}
                style={{
                  transitionDelay: fabOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                <div className={styles.diceTypeIcon}>
                  <Image
                    src={`/assets/dice/${id}.svg`}
                    alt={`D${id}`}
                    width={20}
                    height={20}
                  />
                </div>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
