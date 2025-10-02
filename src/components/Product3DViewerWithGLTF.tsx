import { useRef, Suspense, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Decal, Center, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Product3DViewerProps {
  modelPath?: string; // Optional manual override
  productType: 'tshirt' | 'hoodie' | 'cap' | 'jacket' | 'helmet' | 'car' | 'other';
  color: string;
  logoUrl?: string;
  text?: string;
  autoRotate?: boolean;
}

// Static mapping of product types to bundled GLB assets.
// NOTE: These paths use import.meta.url resolution via Vite (files reside under src/assets/3d_models)
const MODEL_MAP: Record<string, string> = {
  tshirt: new URL('@/assets/3d_models/short_sleeve_t-_shirt.glb', import.meta.url).href,
  hoodie: new URL('@/assets/3d_models/black_loose-fitting_patched_hoodie.glb', import.meta.url).href,
  hoodie_alt: new URL('@/assets/3d_models/green_and_white_hoodie.glb', import.meta.url).href,
  cap: new URL('@/assets/3d_models/dandys_world_thinking_cap.glb', import.meta.url).href,
  car: new URL('@/assets/3d_models/mercedes_w13_concept_f1__www.vecarz.com.glb', import.meta.url).href,
};

// Enhanced realistic 3D Models for different product types (fallback when no GLTF model)
function TShirtModel({ color, logoUrl, text }: { color: string; logoUrl?: string; text?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const logoTexture = useLoader(THREE.TextureLoader, logoUrl || '/placeholder.svg');

  // More organic shirt shape with added curves for realism
  const torsoGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.95, -1.3);
    shape.bezierCurveTo(-1.1, -0.8, -1.2, 0.0, -0.85, 1.05); // Left side with more natural curve
    shape.quadraticCurveTo(-0.4, 1.45, 0, 1.45); // Left shoulder
    shape.quadraticCurveTo(0.4, 1.45, 0.85, 1.05); // Right shoulder
    shape.bezierCurveTo(1.2, 0.0, 1.1, -0.8, 0.95, -1.3); // Right side
    shape.lineTo(-0.95, -1.3);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.05, // Thinner for fabric-like
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 5,
      steps: 2,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    // Add some displacement for folds
    const positionAttribute = geo.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const y = positionAttribute.getY(i);
      positionAttribute.setZ(i, Math.sin(y * 5) * 0.02); // Subtle fabric folds
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02; // Gentle float
    }
  });

  logoTexture.colorSpace = THREE.SRGBColorSpace;
  logoTexture.anisotropy = 16; // Higher for better quality

  // Fabric texture (using a public seamless fabric normal map URL)
  const fabricNormal = useLoader(THREE.TextureLoader, 'https://static.vecteezy.com/system/resources/previews/046/445/510/large_2x/seamless-knitted-fabric-texture-normal-map-photo.jpg');
  fabricNormal.repeat.set(4, 4);
  fabricNormal.wrapS = fabricNormal.wrapT = THREE.RepeatWrapping;

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Torso with realistic material */}
      <mesh geometry={torsoGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.8} 
          metalness={0} 
          clearcoat={0.1} 
          normalMap={fabricNormal}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          sheen={0.2}
          sheenColor="#ffffff"
        />
      </mesh>
      {/* Sleeves with taper and folds */}
      <mesh position={[-0.95, 0.6, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.18, 1.2, 32, 4, false]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.8} 
          normalMap={fabricNormal}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>
      <mesh position={[0.95, 0.6, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.18, 1.2, 32, 4, false]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.8} 
          normalMap={fabricNormal}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>
      {/* Collar with V-neck shape */}
      <mesh position={[0, 1.2, 0.03]} rotation={[0.1, 0, 0]} castShadow>
        <torusGeometry args={[0.3, 0.04, 16, 32, Math.PI * 1.2]} />
        <meshPhysicalMaterial color={color} roughness={0.7} normalMap={fabricNormal} normalScale={new THREE.Vector2(0.5, 0.5)} />
      </mesh>
      {/* Hems for realism */}
      <mesh position={[0, -1.25, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Logo decal */}
      {logoUrl && (
        <mesh position={[0, 0.2, 0.03]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial map={logoTexture} transparent alphaTest={0.5} />
        </mesh>
      )}
      {/* Optional text */}
      {text && (
        <Text
          position={[0, -0.6, 0.04]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {text}
        </Text>
      )}
    </group>
  );
}

function HoodieModel({ color, logoUrl, text }: { color: string; logoUrl?: string; text?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const logoTexture = useLoader(THREE.TextureLoader, logoUrl || '/placeholder.svg');

  // Enhanced body shape for hoodie with bulkier form
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.1, -1.4);
    shape.bezierCurveTo(-1.3, -0.9, -1.4, 0.1, -1.0, 1.2);
    shape.quadraticCurveTo(-0.45, 1.7, 0, 1.65);
    shape.quadraticCurveTo(0.45, 1.7, 1.0, 1.2);
    shape.bezierCurveTo(1.4, 0.1, 1.3, -0.9, 1.1, -1.4);
    shape.lineTo(-1.1, -1.4);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 8,
      steps: 3,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    // Add folds
    const positionAttribute = geo.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const y = positionAttribute.getY(i);
      positionAttribute.setZ(i, Math.cos(y * 4) * 0.03); // Wrinkles for fabric
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  logoTexture.colorSpace = THREE.SRGBColorSpace;
  logoTexture.anisotropy = 16;

  // Fabric normal map for realism (using a public seamless fabric normal map URL)
  const fabricNormal = useLoader(THREE.TextureLoader, 'https://static.vecteezy.com/system/resources/previews/046/445/510/large_2x/seamless-knitted-fabric-texture-normal-map-photo.jpg');
  fabricNormal.repeat.set(5, 5);
  fabricNormal.wrapS = fabricNormal.wrapT = THREE.RepeatWrapping;

  return (
    <group ref={groupRef} scale={[1.1, 1.1, 1.1]}>
      {/* Body with realistic material */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.9} 
          metalness={0} 
          clearcoat={0.05} 
          normalMap={fabricNormal}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          sheen={0.3}
          sheenColor="#dddddd"
        />
      </mesh>
      {/* Hood with inner lining */}
      <mesh position={[0, 1.4, 0]} scale={[1.1, 1.0, 1.1]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshPhysicalMaterial color={color} roughness={0.85} normalMap={fabricNormal} normalScale={new THREE.Vector2(0.6, 0.6)} side={THREE.DoubleSide} />
      </mesh>
      {/* Drawstring for hood realism */}
      <mesh position={[0, 1.3, 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.02, 16, 64]} />
        <meshStandardMaterial color="#cccccc" roughness={0.5} />
      </mesh>
      {/* Sleeves with cuffs */}
      <mesh position={[-1.1, 0.4, 0]} rotation={[0, 0, -Math.PI / 7]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.25, 1.4, 32, 4]} />
        <meshPhysicalMaterial color={color} roughness={0.9} normalMap={fabricNormal} normalScale={new THREE.Vector2(0.6, 0.6)} />
      </mesh>
      <mesh position={[1.1, 0.4, 0]} rotation={[0, 0, Math.PI / 7]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.25, 1.4, 32, 4]} />
        <meshPhysicalMaterial color={color} roughness={0.9} normalMap={fabricNormal} normalScale={new THREE.Vector2(0.6, 0.6)} />
      </mesh>
      {/* Cuffs */}
      <mesh position={[-1.6, 0.4, 0]} rotation={[0, 0, -Math.PI / 7]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[1.6, 0.4, 0]} rotation={[0, 0, Math.PI / 7]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Pocket with stitching */}
      <mesh position={[0, -0.5, 0.06]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.08]} />
        <meshPhysicalMaterial color={color} roughness={0.95} normalMap={fabricNormal} normalScale={new THREE.Vector2(0.6, 0.6)} />
      </mesh>
      {/* Logo */}
      {logoUrl && (
        <mesh position={[0, 0.3, 0.06]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial map={logoTexture} transparent alphaTest={0.5} />
        </mesh>
      )}
      {/* Optional text */}
      {text && (
        <Text
          position={[0, -0.7, 0.07]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {text}
        </Text>
      )}
    </group>
  );
}

function HelmetModel({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  // Glossy material for helmet shell
  const shellMaterial = new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  });

  return (
    <group ref={groupRef} scale={[1.5, 1.5, 1.5]}>
      {/* Main shell - more aerodynamic shape */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.8, 64, 64, 0, Math.PI * 2, 0, Math.PI / 1.2]} />
        <primitive object={shellMaterial} />
      </mesh>
      {/* Visor area - transparent visor */}
      <mesh position={[0, 0.2, 0.6]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 4]} />
        <meshPhysicalMaterial 
          color="#000000" 
          transparent 
          opacity={0.4} 
          roughness={0.1} 
          metalness={0.5} 
          clearcoat={1.0}
        />
      </mesh>
      {/* Chin strap */}
      <mesh position={[0, -0.5, 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.6, 0.05, 16, 64, Math.PI]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>
      {/* Vents for realism */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 32]} />
        <meshStandardMaterial color="#222222" roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.6, 0.4]}>
        <boxGeometry args={[0.15, 0.05, 0.1]} />
        <meshStandardMaterial color="#222222" roughness={0.9} />
      </mesh>
      <mesh position={[-0.3, 0.6, 0.4]}>
        <boxGeometry args={[0.15, 0.05, 0.1]} />
        <meshStandardMaterial color="#222222" roughness={0.9} />
      </mesh>
      {/* Padding inside (partial) */}
      <mesh position={[0, -0.2, 0]} scale={[0.95, 0.95, 0.95]}>
        <sphereGeometry args={[0.75, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#444444" roughness={1.0} side={THREE.DoubleSide} />
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
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    // Apply color override and compute bounds
    const tempBox = new THREE.Box3();
    const tempVec = new THREE.Vector3();
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          // Clone to avoid mutating original
            const material = (mesh.material as THREE.MeshStandardMaterial).clone();
            // Only recolor if it's not obviously a metal or texture map heavy material
            if (!('map' in material && material.map)) {
              material.color.set(color);
            }
            material.needsUpdate = true;
            mesh.material = material;
        }
      }
    });

    // Compute bounding box of clonedScene
    tempBox.setFromObject(clonedScene);
    const size = tempBox.getSize(tempVec);
    const center = tempBox.getCenter(new THREE.Vector3());

    // Desired nominal height for clothing / cap / car
    let targetHeight = 2.8; // default
    if (modelPath.includes('cap')) targetHeight = 1.2;
    if (modelPath.includes('mercedes_w13')) targetHeight = 1.5; // keep car lower profile

    // Special handling for large hoodie model
    if (modelPath.includes('black_loose-fitting_patched_hoodie')) {
      targetHeight = 2.2; // slightly smaller so it fits frame better
    }

    if (size.y > 0.0001) {
      const scaleFactor = targetHeight / size.y;
      if (groupRef.current) {
        groupRef.current.scale.setScalar(scaleFactor);
        // Recompute center after scale for accurate positioning
        const scaledCenter = center.multiplyScalar(scaleFactor);
        // Position so bottom sits near y = -1 and centered in X/Z
        const bottomY = tempBox.min.y * scaleFactor;
        const offsetY = -1 - bottomY; // raise or lower to align bottom
        groupRef.current.position.set(-scaledCenter.x, offsetY, -scaledCenter.z);
      }
    }
  }, [clonedScene, color, modelPath]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

function ProductModel({ 
  modelPath, 
  productType, 
  color, 
  logoUrl, 
  text 
}: Omit<Product3DViewerProps, 'autoRotate'>) {
  // Determine effective model path: explicit override OR mapped asset
  let resolvedModelPath: string | undefined = modelPath;

  if (!resolvedModelPath) {
    switch (productType) {
      case 'tshirt':
        resolvedModelPath = MODEL_MAP.tshirt; break;
      case 'hoodie':
        // Randomly pick an alt hoodie variant occasionally for variety
        resolvedModelPath = Math.random() > 0.5 ? MODEL_MAP.hoodie : MODEL_MAP.hoodie_alt; break;
      case 'cap':
        resolvedModelPath = MODEL_MAP.cap; break;
      case 'car':
        resolvedModelPath = MODEL_MAP.car; break;
      default:
        resolvedModelPath = undefined;
    }
  }

  if (resolvedModelPath) {
    return (
      <Suspense fallback={null}>
        <GLTFModel modelPath={resolvedModelPath} color={color} />
      </Suspense>
    );
  }

  // Fallback procedural models if no GLB mapping found
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
    case 'helmet':
      return <HelmetModel color={color} />;
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
        
        {/* Enhanced Lighting for realism */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />
        <hemisphereLight intensity={0.4} groundColor="#dddddd" />
        
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
          <shadowMaterial opacity={0.3} />
        </mesh>
        
        {/* Orbit Controls */}
        <OrbitControls 
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}