import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function ProductCard() {
  const [isHovered, setIsHovered] = useState(false);

  const maskPath = "M 12 1 H 438 Q 449 1 449 12 V 465 Q 449 479 435 479 H 335 Q 325 479 318 488 L 302 512 Q 295 524 285 524 H 12 Q 1 524 1 512 V 12 Q 1 1 12 1 Z";

 const imageVariants: Variants = {
  // custom (isHovering) passed from AnimatePresence
  initial: (isHovering: boolean) => ({
    // If hovering: Image 2 enters from TOP (-105%)
    // If hover off: Image 1 enters from BOTTOM (105%)
    y: isHovering ? "-105%" : "105%", 
    opacity: 1, // Keep opacity high to see the slide clearly
    scale: 1,
    borderBottomLeftRadius: isHovering ? "140px" : "0px",
    borderBottomRightRadius: isHovering ? "140px" : "0px",
    borderTopLeftRadius: isHovering ? "0px" : "140px",
    borderTopRightRadius: isHovering ? "0px" : "140px",
  }),
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    transition: { 
      duration: 0.9, 
      ease: [0.16, 1, 0.3, 1] 
    },
  },
  exit: (isHovering: boolean) => ({
    // If hovering: Image 1 exits to BOTTOM (105%)
    // If hover off: Image 2 exits to TOP (-105%)
    y: isHovering ? "105%" : "-105%",
    opacity: 1,
    borderTopLeftRadius: isHovering ? "140px" : "0px",
    borderTopRightRadius: isHovering ? "140px" : "0px",
    borderBottomLeftRadius: isHovering ? "0px" : "140px",
    borderBottomRightRadius: isHovering ? "0px" : "140px",
    transition: { 
      duration: 0.9, // Match enter duration for parallel speed
      ease: [0.16, 1, 0.3, 1] 
    },
  }),
};

  return (
    <div
      className="relative w-[450px] h-[550px]  cursor-pointer overflow-hidden rounded-[14px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. SVG Masking Layer */}
      <div 
        className="absolute inset-0 z-10 overflow-hidden"
        style={{
          maskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 450 550'><path d='${maskPath}' fill='black'/></svg>")`,
          WebkitMaskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 450 550'><path d='${maskPath}' fill='black'/></svg>")`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat'
        }}
      >
        
        
        <AnimatePresence mode="popLayout" custom={isHovered}>
  <motion.img
    key={isHovered ? "hover" : "primary"}
    src={isHovered ? "/images/f1car1.jpg":"/images/helmet.webp"  }
    custom={isHovered}
    variants={imageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="absolute inset-0 w-full h-full object-cover"
  />
</AnimatePresence>
      </div>

      {/* 2. SVG Border (Placed on top) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        viewBox="0 0 450 550"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d={maskPath}
          stroke={isHovered ? "#eab308" : "#333"}
          strokeWidth="2"
          className="transition-colors duration-700"
        />
      </svg>

      {/* 3. Notch Text with separate slide effect */}
      <div className="absolute bottom-8 right-2 z-40 text-right overflow-hidden">
        <motion.div
           animate={{ y: isHovered ? [20, 0] : [20, 0] }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-white font-bold uppercase tracking-widest text-sm ml-5">
            Season <span className="text-[#d2ff03] ml-2 text-sm font-black">2021</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}