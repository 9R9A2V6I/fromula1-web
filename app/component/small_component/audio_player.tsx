"use client"

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, scale } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, Environment, GradientTexture } from "@react-three/drei";
import * as THREE from "three";
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import { div } from "framer-motion/client";
import Image from "next/image";

const BAR_COUNT = 20;


export const audioFrequencyRef = React.createRef<Uint8Array>();

const songArray=[
  "web-music.mp3",
  "hard-phonk-471075.mp3",
  "mr-prime-facts7-5-289173.mp3",
  "ethereal-escape-phonk-315117.mp3"
]

// 🎨 Convert frequency → gradient color
const getGradient = (value: number) => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + value / 2;
  const lightness1 = 40 + value / 6;
  const lightness2 = 55 + value / 5;

  return `linear-gradient(to top,
    hsl(${hue}, ${Math.min(saturation, 100)}%, ${Math.min(lightness1, 70)}%),
    hsl(${(hue + 40) % 360}, ${Math.min(saturation, 100)}%, ${Math.min(lightness2, 80)}%)
  )`;
};




// -------------------- Audio Player --------------------
export const AudioPlayer = () => {
  // --- Refs ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number>(0);

  const[showAudio,setShowAudio]=useState<boolean>(false);

  // --- State ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonScale, setButtonScale] = useState(0.8);
  const [bars, setBars] = useState(
    Array.from({ length: BAR_COUNT }, () => ({
      height: 8,
      color: getGradient(Math.random() * 120),
    }))
  );

  // 1. Initialize Audio Context (Only once on first play)
  const setupAudio = () => {
    if (!audioRef.current || analyserRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    dataRef.current = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;
  };

  // 2. Animation Loop
const animateBars = () => {
  if (!analyserRef.current || !dataRef.current) return;

  analyserRef.current.getByteFrequencyData(dataRef.current);

  
  let sum = 0;

  const updatedBars = Array.from({ length: BAR_COUNT }).map((_, i) => {
    const v = dataRef.current![i] || 0;
    sum += v;

    return {
      height: Math.max(8, v / 2.5),
      color: getGradient(v),
    };
  });

  // 🔊 Average frequency → scale
  const avg = sum / BAR_COUNT; // 0–255
  const scale = 1 + Math.min(avg / 700, 0.1); // clamp

  setBars(updatedBars);
  setButtonScale(scale);

  rafRef.current = requestAnimationFrame(animateBars);
};

  // 3. Effect: Handle Song Changes & Preserve Play State
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // When currentIndex changes, HTML <audio> updates src automatically via React.
    // We just need to handle the playback logic.
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setupAudio();
            animateBars();
          })
          .catch(() => {
            // Browsers sometimes block auto-play on first load
            setIsPlaying(false);
          });
      }
    } else {
      audio.pause();
      cancelAnimationFrame(rafRef.current);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [currentIndex,isPlaying]);

  // 4. Navigation Handlers
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      setupAudio();
      
      animateBars();
    } else {
      cancelAnimationFrame(rafRef.current);
    }
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev + 1) % songArray.length);
  };

  const prevSong = () => {
    setCurrentIndex((prev) => (prev - 1 + songArray.length) % songArray.length);
  };

  const getSongName = (file: string) =>
    file.replace(".mp3", "").replace(/-/g, " ");

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {showAudio ? (
         <motion.div
            key="audio-ui"
            initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1, x: "-30%", y: "-50%" }}
            exit={{ scale: 0, opacity: 0, x: "-10%", y: "-50%" }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="absolute left-1 top-1 z-20 w-80 rounded-3xl bg-[#0d0d15]/90 backdrop-blur-xl p-6 text-white shadow-2xl border border-white/10"
            style={{ translateX: "20%", translateY: "10%" }}
          >
      {/* Hidden Audio Element */}
     <div className="flex justify-end mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAudio(false);
                }}
                className="text-2xl font-light hover:text-red-500 transition-colors p-2"
              >
                ✕
              </button>
            </div>
      <audio
        ref={audioRef}
        src={`/audio/${songArray[currentIndex]}`}
        onEnded={nextSong}
        crossOrigin="anonymous"
      />

      <div className="mb-6 text-center">
        <h4 className="text-lg font-bold truncate capitalize">
          {getSongName(songArray[currentIndex])}
        </h4>
        <p className="text-xs text-purple-400 font-medium tracking-widest uppercase">
          Track {currentIndex + 1} / {songArray.length}
        </p>
      </div>

      {/* Visualizer */}
      <div className="mb-8 flex h-20 items-end justify-center gap-1.5">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            animate={{ height: isPlaying ? bar.height : 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-2 rounded-full"
            style={{ 
              background: bar.color, 
              boxShadow: isPlaying ? `0 0 15px ${bar.color}` : "none",
              // opacity: isPlaying ? 1 : 0.3
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4">
        <button 
          onClick={prevSong} 
          className="text-2xl opacity-60 hover:opacity-100 hover:scale-110 transition-all"
        >
          ⏮
        </button>

    <motion.button
  onClick={togglePlay}
  animate={{
    scale: isPlaying ? buttonScale : 0.8,
  }}
  transition={{
    type: "spring",
    stiffness: 250,
    damping: 15,
  }}
  className="flex h-16 w-16 items-center justify-center rounded-full
             bg-gradient-to-tr from-purple-500 to-blue-600
             shadow-[0_0_20px_rgba(168,85,247,0.4)]
             active:scale-95"
>
  <span className="text-2xl">{isPlaying ? "❚❚" : "▶"}</span>
</motion.button>

        <button 
          onClick={nextSong} 
          className="text-2xl opacity-60 hover:opacity-100 hover:scale-110 transition-all"
        >
          ⏭
        </button>
      </div>

    </motion.div>
    )
    : <motion.div
  key="rainbow-ball"
  initial={{ scale: 0, opacity: 0 }}
  animate={{ 
    scale: 1, 
    opacity: 1,
    rotate: 360 // Rotate 360 degrees
  }}
  exit={{ scale: 0, opacity: 0 }}
  whileHover={{ scale: 1.1 }}
  transition={{
   
    scale: { type: "spring", damping: 20, stiffness: 200 },
   
    rotate: {
      repeat: Infinity,
      duration: 8, 
      ease: "linear"
    }
  }}
  onClick={() => setShowAudio(true)}
  // className="cursor-pointer z-10"
  className="cursor-pointer z-10 relative w-[200px] h-[200px] rounded-full overflow-hidden "
>
  {/* The Image (Background or Overlay) */}
  <Image
    src="/images/rainbow-ball.png"
    alt="Open Audio"
    fill // Use fill to cover the parent circle
    className="rounded-full object-cover z-10 opacity-80" // Lower opacity if you want to see the video through it
  />

  {/* The Video (Siblings, not children) */}
  <video
    src="/videos/project-showcase.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-10"
  />
</motion.div>
}
    
    </AnimatePresence>
    </div>
  );
};

// -------------------- 3D Bubble Scene --------------------
export function FluidBubbleAudio() {
  return (
    <div className="absolute inset-0">
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Environment preset="city" />
        <BackgroundText />
        <BackgroundGradient />
        <BubbleMesh audioFrequencyRef={audioFrequencyRef} />
        <DottedRings />
      </Canvas>
    </div>
  );
}


// -------------------- Bubble Mesh --------------------
function BubbleMesh({
  audioFrequencyRef,
}: {
  audioFrequencyRef: { current: Uint8Array | null };
}) 

 {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const hoverPoint = useRef(new THREE.Vector3());
  const hasHover = useRef(false);
  const originalPositions = useRef<Float32Array | null>(null);
  const noise = useRef(new ImprovedNoise());

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = clock.getElapsedTime();
    const geometry = meshRef.current.geometry as THREE.SphereGeometry;
    const pos = geometry.attributes.position;

    if (!originalPositions.current) originalPositions.current = new Float32Array(pos.array);

    const freqData = audioFrequencyRef.current;

    for (let i = 0; i < pos.count; i++) {
      const i3 = i * 3;
      const ox = originalPositions.current[i3];
      const oy = originalPositions.current[i3 + 1];
      const oz = originalPositions.current[i3 + 2];

      const vertex = new THREE.Vector3(ox, oy, oz);
      const normal = vertex.clone().normalize();

      let displacement = 0;

      // 🎵 Audio-based droplet distortion (sharper & smaller amplitude)
      if (freqData) {
        const bin = Math.floor((i / pos.count) * freqData.length);
        const value = freqData[bin] / 255;
        displacement += value * 0.15 * Math.sin(time * 4 + i * 2); // faster, smaller amplitude
        displacement += noise.current.noise(vertex.x * 3, vertex.y * 3, time * 0.8) * 0.02; // reduced noise
      }

      // Hover ripple (slightly stronger & sharper)
      if (hasHover.current) {
        const worldVertex = vertex.clone().applyMatrix4(meshRef.current.matrixWorld);
        const distance = worldVertex.distanceTo(hoverPoint.current);
        const tension = Math.exp(-distance * 6);
        displacement += tension * Math.sin(distance * 18 - time * 6) * 0.08;
      }

      // Idle breathing (smaller)
      displacement += Math.sin(time * 2 + vertex.y * 6) * 0.008;

      vertex.addScaledVector(normal, displacement);

      pos.array[i3] = vertex.x;
      pos.array[i3 + 1] = vertex.y;
      pos.array[i3 + 2] = vertex.z;
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // Bubble color reacts to frequency
    if (freqData && materialRef.current) {
      const avgFreq = Array.from(freqData).reduce((a, b) => a + b, 0) / freqData.length;
      const hue1 = (time * 30) % 360;
      const hue2 = (hue1 + 40) % 360;

      materialRef.current.color = new THREE.Color(`hsl(${hue1}, 90%, ${Math.min(50 + avgFreq / 5, 80)}%)`);
      materialRef.current.emissive = new THREE.Color(`hsl(${hue2}, 90%, ${Math.min(55 + avgFreq / 4, 85)}%)`);
      materialRef.current.distortion = 0.2 + avgFreq / 255 * 0.3; // slightly reduced distortion
      materialRef.current.time = time;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={1.1}
      onPointerMove={(e) => { hoverPoint.current.copy(e.point); hasHover.current = true; }}
      onPointerOut={() => { hasHover.current = false; }}
    >
      <sphereGeometry args={[1, 160, 160]} />
      <MeshTransmissionMaterial
        ref={materialRef}
        transmission={0.8}
        thickness={0.5}
        roughness={0.05}
        ior={1.12}
        attenuationColor="#ffffff"
        attenuationDistance={3}
        chromaticAberration={0.06}
        anisotropy={0.22}
        distortion={0.15}          // slightly lower
        distortionScale={0.07}      // smaller
        temporalDistortion={0.02}  // smoother temporal change
      >
        <GradientTexture stops={[0, 0.5, 1]} colors={["#ffffff", "#dff3ff", "#b6e7ff"]} size={1024} />
      </MeshTransmissionMaterial>
    </mesh>
  );
}


// -------------------- Dotted Rings --------------------
function DottedRings() {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRingRef = useRef<THREE.LineLoop>(null!);
  const outerRingRef = useRef<THREE.LineLoop>(null!);

  const createCircleGeometry = (radius: number) => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = t * 0.05;
    innerRingRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    outerRingRef.current.rotation.y = Math.cos(t * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <lineLoop ref={innerRingRef} geometry={createCircleGeometry(1.7)}>
        <lineDashedMaterial color="#1a1a1a" dashSize={0.15} gapSize={0.5} opacity={0.5} transparent />
      </lineLoop>
      <lineLoop ref={outerRingRef} geometry={createCircleGeometry(1.4)}>
        <lineDashedMaterial color="#1a1a1a" dashSize={0.15} gapSize={0.5} opacity={0.5} transparent />
      </lineLoop>
    </group>
  );
}

// -------------------- Background --------------------
function BackgroundGradient() {
  const { viewport } = useThree();
  return (
    <mesh scale={[viewport.width * 2, viewport.height * 2, 1]} position={[0, 0, -5]}>
      <planeGeometry />
      <meshBasicMaterial>
        <GradientTexture stops={[0, 0.5, 1]} colors={['#BBCB2E', '#e1eb8a', '#ffffff']} size={1024} />
      </meshBasicMaterial>
    </mesh>
  );
}

function BackgroundText() {
  const fontUrl = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';
  const textProps = { font: fontUrl, fontSize: 0.8, color: "#1a1a1a", anchorX: "center" as const, anchorY: "middle" as const, letterSpacing: -0.05, fontWeight: 800 };
  
  return (
    <group position={[0, 0, -2]}>
      <Text {...textProps} position={[-2.5, 1.2, 0]}>A DIFFERENT</Text>
      <Text {...textProps} position={[3, 0, 0]}>CREATIVE</Text>
      <Text {...textProps} position={[-2.0, -1.5, 0]}>APPROACH</Text>
    </group>
  );
}
