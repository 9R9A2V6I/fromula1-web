"use client"; // <--- 1. REQUIRED for Next.js App Router

import React from 'react';
import HelmetReveal from './helmet_reveal';
import Navbar from '../navabar/nav_bar';
import FluidBubble from '../animated_small_compo/fluidBubble';
import { Canvas } from "@react-three/fiber";
import FluidBubble2 from '../animated_small_compo/bubble2';
import Blob from '../animated_small_compo/blob';
import { FluidBubbleAudio } from '../small_component/audio_player';

function HeroSection() {
  return (
    // 2. CHANGED: Added 'h-screen' and 'relative' so the Canvas has space to render
    <div className="w-full h-screen relative flex flex-col bg-[#EBEAE5]"> 
        
        <div className='w-full absolute top-0 z-30'>
          <Navbar/>
        </div>

        {/* <HelmetReveal/> */}

        {/* 3. Added className to Canvas to ensure it fills the container */}
        {/* <Canvas 
            className="w-full h-full"
            camera={{ position: [0, 0, 5], fov: 45 }} 
        >
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} />
           
            
          
            <FluidBubble />
            

        </Canvas> */}
        {/* <div className="w-full h-full bg-black" >
          <FluidBubble2 />
        </div> */}
        <FluidBubbleAudio/>
    </div>
  )
}

export default HeroSection;