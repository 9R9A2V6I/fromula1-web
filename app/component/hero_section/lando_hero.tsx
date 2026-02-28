import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";

const LandoHero = () => {
  // 1. Mouse Position Setup for Parallax
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movement so it feels "heavy" and premium
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    // Calculate normalized mouse position (-1 to 1)
    const xPos = (e.clientX - left) / width - 0.5;
    const yPos = (e.clientY - top) / height - 0.5;
    
    x.set(xPos);
    y.set(yPos);
  }

  // 2. Define Movements (Parallax Strength)
  // The numbers control how many pixels it moves. Higher = Closer to camera.
  
  // Text moves slightly opposite to mouse (Background feel)
  const textX = useTransform(mouseX, [-0.5, 0.5], ["15px", "-15px"]);
  const textY = useTransform(mouseY, [-0.5, 0.5], ["15px", "-15px"]);

  // Lando moves moderately (Mid-ground)
  const landoX = useTransform(mouseX, [-0.5, 0.5], ["-30px", "30px"]);
  const landoY = useTransform(mouseY, [-0.5, 0.5], ["-30px", "30px"]);

  // Helmet moves the most (Foreground) - This creates the depth
  const helmetX = useTransform(mouseX, [-0.5, 0.5], ["-80px", "80px"]);
  const helmetY = useTransform(mouseY, [-0.5, 0.5], ["-80px", "80px"]);
  const helmetRotate = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]); // Add slight tilt

  return (
    <div 
      className="relative w-full h-screen bg-[#fdfcfc] overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
      ref={ref}
    >
      {/* --- GRID BACKGROUND (Optional Texture) --- */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#d2ff03 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>


      <motion.div 
        style={{ x: textX, y: textY }}
        className="absolute z-0 flex flex-col items-center justify-center w-full"
      >
        <h1 className="text-[15vw] leading-none font-black tracking-tighter text-[#d2ff03] opacity-90 uppercase select-none font-sans mix-blend-difference">
          Dewald
        </h1>
        <h1 className="text-[15vw] leading-none font-black tracking-tighter text-transparent stroke-text opacity-30 uppercase select-none font-sans">
Brawis
        </h1>
      </motion.div>

      <motion.div 
        style={{ x: landoX, y: landoY }}
        className="absolute z-10 bottom-0 h-[85vh] w-auto pointer-events-none"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
       
        <img 
          src="/images/dewald-hero-section.png" 
          alt="Lando Norris" 
          className="h-full w-auto object-cover  mix-blend-multiply"
          style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }} // Fade out feet
        />
      </motion.div>

     

      {/* --- UI OVERLAY (Details) --- */}
      {/* <div className="absolute top-10 left-10 z-30">
        <p className="text-white font-mono text-sm tracking-widest">LN // 04</p>
      </div> */}
      <div className="absolute bottom-10 right-10 z-30">
        <button className="px-6 py-2 border border-[#D2FF00] text-[#D2FF00] font-bold uppercase tracking-widest hover:bg-[#D2FF00] hover:text-black transition-colors">
          Enter World
        </button>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 2px #333;
        }
      `}</style>
    </div>
  );
};

export default LandoHero;
