"use client"; // Required for Framer Motion in Next.js
import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import HoverLink from './hover_rotate';
import CarSlider from './fotter_slider';

function FotterMain() {
  const containerRef = useRef<HTMLDivElement>(null);

 
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

 
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

 
  const moveX = useTransform(smoothX, [0, 1], [-15, 15]);
  const moveY = useTransform(smoothY, [0, 1], [-10, 10]); 

  const handleMouseMove = (e:any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate 0 to 1 position relative to the container
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5); // Reset to center
    mouseY.set(0.5);
  };

  return (
    <div className="w-full h-[1200px] p-6 md:p-10 bg-gradient-to-t from-[#D9FF00] to-[#f5fdc9]">
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full rounded-[40px] overflow-hidden flex flex-col justify-center items-center"
      >
        
        {/* Background Layers (Static) */}
       <div className="absolute inset-0 z-0">
          <Image src="/images/bg-green-footer.svg" alt="green background" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 z-10 mix-blend-multiply opacity-50 rounded-[40px] overflow-hidden"> 
          <Image src="/images/bg-fotter.svg" alt="footer mask" fill className="object-cover" />
        </div>

        {/* Text Layer (Optional: Add a small parallax here too if you want) */}
        <div className="absolute top-40 z-20 text-white flex flex-col items-center mb-20 pointer-events-none">
            <div className='flex flex-col items-center leading-[0.8] text-center font-bold uppercase'>
              <h2 className="text-[clamp(40px,8vw,100px)]">Always <span className='text-[#D9FF00] font-brier'>Bringing</span></h2>
              <h2 className="text-[clamp(40px,8vw,100px)]">the <span className='text-[#D9FF00] font-brier'>Fight</span>.</h2>
            </div>
        </div>

        {/* 4. The Parallax Helmet */}
        <motion.div 
          style={{ x: moveX, y: moveY }}
          className='absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[100%] z-30 pointer-events-none'
        >
          <Image 
            src="/images/fotter-main-img.webp" 
            alt="Lando Helmet" 
            fill 
            className="object-contain object-bottom"
          />
        </motion.div>

        <div className="absolute top-[55%] left-[5%] lg:left-[10%] z-40 text-center transform -translate-y-1/2 hidden md:block">
          <h3 className="text-[12px] tracking-[0.3em] font-bold uppercase text-gray-400 mb-6">Pages</h3>
          <ul className="flex flex-col gap-3">
           {['HOME', 'ON TRACK', 'OFF TRACK', 'CALENDAR'].map((item) => (
       <li key={item}><HoverLink text={item} /></li>
    ))}
    <li><HoverLink text="STORE" highlighted={true} /></li>
            
          </ul>
        </div>

        {/* --- 5. Right Links Section --- */}
        <div className="absolute top-[55%] right-[5%] lg:right-[10%] z-40 text-center transform -translate-y-1/2 hidden md:block">
          <h3 className="text-[12px] tracking-[0.3em] font-bold uppercase text-gray-400 mb-6">Follow On</h3>
         <ul className="flex flex-col gap-3">
    {['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'TWITCH'].map((item) => (
       <li key={item}><HoverLink text={item} /></li>
    ))}
  </ul>
        </div>

        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-40">
          <button className="bg-[#D9FF00] text-black font-bold py-3 px-6 rounded-full text-sm flex items-center gap-2">
            BUSINESS ENQUIRIES
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="absolute bottom-10 w-full z-20">
          <CarSlider />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-[#D9FF00] text-black p-3 flex justify-between items-center text-xs font-bold z-40">
          <span className='pl-8'>© 2026 Lando Norris. All rights reserved</span>
          <div className="flex gap-6 pr-8">
            <a href="#" className="hover:underline">PRIVACY POLICY</a>
            <a href="#" className="hover:underline">TERMS</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FotterMain;