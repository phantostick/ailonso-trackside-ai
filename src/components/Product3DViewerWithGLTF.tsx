import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Product3DViewerProps {
  modelPath?: string;
  productType: 'tshirt' | 'hoodie' | 'cap' | 'jacket' | 'other';
  color: string;
  logoUrl?: string;
  text?: string;
  autoRotate?: boolean;
}

// Simple 3D Models for different product types (fallback when no GLTF model)
function TShirtModel({ color, logoUrl, text }: { color: string; logoUrl?: string; text?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group>
      {/* Main body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2, 2.5, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-1.3, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 1, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[1.3, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 1, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <torusGeometry args={[0.35, 0.08, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Text overlay */}
      {text && (
        <mesh position={[0, -0.6, 0.16]}>
          <planeGeometry args={[1.5, 0.25]} />
          <meshBasicMaterial color="white" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}

function HoodieModel({ color, logoUrl, text }: { color: string; logoUrl?: string; text?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group>
      {/* Main body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.6, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Hood */}
      <mesh position={[0, 1.4, -0.1]} castShadow>
        <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-1.4, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 1.1, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[1.4, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 1.1, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Kangaroo pocket */}
      <mesh position={[0, -0.3, 0.18]} castShadow>
        <boxGeometry args={[1, 0.6, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  );
}

function CapModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Crown */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Brim */}
      <mesh position={[0, -0.2, 0.4]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.1, 0.1, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Back adjustment strap */}
      <mesh position={[0, -0.3, -0.7]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

function JacketModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group>
      {/* Main body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.3, 2.8, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-1.45, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 1.3, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[1.45, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 1.3, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 1.45, 0.1]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Zipper */}
      <mesh position={[0, 0, 0.21]} castShadow>
        <boxGeometry args={[0.08, 2.5, 0.05]} />
        <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

function DefaultModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

// GLTF Model Loader with color override
function GLTFModel({ modelPath, color }: { modelPath: string; color: string }) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = scene.clone();

  // Apply color to all meshes in the loaded model
  clonedScene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const material = (mesh.material as THREE.MeshStandardMaterial).clone();
        material.color.set(color);
        mesh.material = material;
      }
    }
  });

  return <primitive object={clonedScene} />;
}

function ProductModel({ 
  modelPath, 
  productType, 
  color, 
  logoUrl, 
  text 
}: Omit<Product3DViewerProps, 'autoRotate'>) {
  // If custom GLTF model path is provided, use it
  if (modelPath) {
    return (
      <Suspense fallback={null}>
        <GLTFModel modelPath={modelPath} color={color} />
      </Suspense>
    );
  }

  // Otherwise, use procedural models
  const props = { color, logoUrl, text };

  switch (productType) {
    case 'tshirt':
      return <TShirtModel {...props} />;
    case 'hoodie':
      return <HoodieModel {...props} />;
    case 'cap':
      return <CapModel color={color} />;
    case 'jacket':
      return <JacketModel color={color} />;
    default:
      return <DefaultModel color={color} />;
  }
}

export default function Product3DViewer({ 
  modelPath,
  productType, 
  color, 
  logoUrl, 
  text, 
  autoRotate = true 
}: Product3DViewerProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#f5f5f5']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.1} />
        
        {/* Product Model */}
        <Suspense fallback={null}>
          <Center>
            <ProductModel 
              modelPath={modelPath}
              productType={productType}
              color={color}
              logoUrl={logoUrl}
              text={text}
            />
          </Center>
        </Suspense>
        
        {/* Ground plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
        
        {/* Orbit Controls */}
        <OrbitControls 
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
