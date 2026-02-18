"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- 1. Soft Cloud Texture (Removes the 'particle' look) ---
const getCloudTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,0.8)'); // Thick center
  grad.addColorStop(0.5, 'rgba(255,255,255,0.2)'); // Soft falloff
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
};

const MeteorComet = () => {
  const count = 4100;
  const pointsRef = useRef<THREE.Points>(null!);
  const headRef = useRef<THREE.Mesh>(null!);
  
  const texture = useMemo(() => getCloudTexture(), []);

  const [positions, lives, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const l = new Float32Array(count);
    const s = new Float32Array(count);
    for(let i=0; i<count; i++) {
      l[i] = Math.random(); 
      s[i] = Math.random() * 15 + 10; // Large particles for density
    }
    return [pos, l, s];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = 10.0;
    const x = -40 + (t * speed % 80);
    const y = 40 - (t * speed % 80);

    // Update Rough Asteroid Head
    if (headRef.current) {
      headRef.current.position.set(x, y, 0);
      headRef.current.rotation.x = t * 0.5;
      headRef.current.rotation.y = t * 0.3;
    }

    const posAttr = pointsRef.current.geometry.attributes.position;
    const lifeAttr = pointsRef.current.geometry.attributes.aLife;

    for (let i = 0; i < count; i++) {
      lives[i] -= 0.007; // Long life for long tail

      if (lives[i] <= 0) {
        lives[i] = 1.0;
        // Spawn inside the jagged head
        positions[i * 3] = x + (Math.random() - 0.5) * 1.5;
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * 1.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      } else {
        // WAVE EFFECT: Slight oscillation to the trail
        const wave = Math.sin(t * 5 + positions[i * 3]) * 0.05;
        positions[i * 3 + 1] += 0.02 + wave; // Rising and waving
      }
    }
    posAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* ROUGH ASTEROID HEAD */}
      <mesh ref={headRef}>
        <icosahedronGeometry args={[1.8, 1]} /> {/* Jagged geometry */}
        <meshStandardMaterial 
          color="#111" 
          emissive="#ffcc00" 
          emissiveIntensity={5} 
          flatShading 
        />
      </mesh>

      {/* BILLOWING WAVE TAIL */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
          <bufferAttribute attach="attributes-aLife" count={count} array={lives} itemSize={1} args={[lives, 1]} />
          <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} args={[sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            attribute float aSize;
            attribute float aLife;
            varying float vLife;
            void main() {
              vLife = aLife;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              // HUGE EXPANSION: Creates the billowing cloud wave
              float expansion = 1.0 + (1.0 - aLife) * 15.0; 
              gl_PointSize = aSize * expansion * (800.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform sampler2D uTexture;
            varying float vLife;
            void main() {
              vec4 tex = texture2D(uTexture, gl_PointCoord);
              
              // Colors based on your reference image
              vec3 core = vec3(1.0, 1.0, 0.6); // White-Yellow
              vec3 fire = vec3(1.0, 0.3, 0.0); // Orange
              vec3 smoke = vec3(0.04, 0.03, 0.03); // Dark Ash

              vec3 color;
              if(vLife > 0.8) color = mix(fire, core, (vLife - 0.8) * 5.0);
              else if(vLife > 0.4) color = mix(smoke, fire, (vLife - 0.4) * 2.5);
              else color = smoke;

              // Soften alpha for a gaseous wave look
              float alpha = tex.a * smoothstep(0.0, 0.3, vLife);
              gl_FragColor = vec4(color, alpha * 0.6);
            }
          `}
          uniforms={{ uTexture: { value: texture } }}
        />
      </points>
    </group>
  );
};

export default MeteorComet;