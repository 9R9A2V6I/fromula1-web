import React, { useState, useEffect, useRef } from "react";
import { Camera, Gamepad2, CarFront, Rocket } from 'lucide-react';
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SlidingText } from '@/app/utils-component/SlidingText';


// 1. Configuration
const cards = [
  { id: 1, rotate: -16, image: "/images/f1car1.jpg" },
  { id: 2, rotate: -8,  image: "/images/f1car2.jpg" },
  { id: 3, rotate: 0,   image: "/images/f1car3.jpg" }, // Center Hero
  { id: 4, rotate: 8,   image: "/images/f1car4.jpg" },
  { id: 5, rotate: 16,  image: "/images/f1car5.jpg" },
];

const icons = [
  { component: Camera },
  { component: Gamepad2 },
  { component: CarFront },
  { component: Rocket },
];

export default function LandoSocials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [iconIndex, setIconIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // 2. Icon Cycling Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[iconIndex].component;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f4f4ed] overflow-hidden py-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col items-center mb-12 text-center select-none">
        <div className="h-20 flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={iconIndex}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentIcon size={64} strokeWidth={1} className="text-gray-800" />
            </motion.div>
          </AnimatePresence>
        </div>

       
        <div className="text-[85px] font-black uppercase leading-[0.9] tracking-tighter text-gray-900 italic mb-20">

        <SlidingText className="relative z-10 cursor-pointer">
                              What's Up
                            </SlidingText>
                                <SlidingText className="relative z-10 cursor-pointer">
                              On Socials

                            </SlidingText>
                            </div>
      </div>

      {/* CARDS SECTION */}
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-[700px]"
      >
        {cards.map((card, index) => {
          const isHovered = hoveredIndex === index;
          const centerIndex = 2; 
          
          // Spread logic: anchor everything to center card
          let xOffset = (index - centerIndex) * 165; 

          // Expansion logic on hover
          if (hoveredIndex !== null) {
            const diff = index - hoveredIndex;
            if (diff < 0) xOffset -= 120; 
            if (diff > 0) xOffset += 120; 
          }

          // Z-INDEX LOGIC: 
          // 1. Center card (index 2) is highest by default (base 30)
          // 2. Hovered card always overrides to 100
          const baseZ = index === centerIndex ? 30 : 20 - Math.abs(index - centerIndex);
          const finalZIndex = isHovered ? 100 : baseZ;

          return (
            <motion.div
              key={card.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ x: (centerIndex - index) * 100, opacity: 0, rotate: 0 }}
              animate={{
                x: isInView ? xOffset : 0,
                opacity: 1,
                rotate: isHovered ? 0 : card.rotate,
                y: isHovered ? -50 : 0,
                scale: isHovered ? 1.15 : 1,
                zIndex: finalZIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                delay: !isInView ? 0 : index * 0.05
              }}
              className="absolute w-[350px] h-[680px] cursor-pointer"
            >
              <div className="relative w-full h-full rounded-[2.8rem] overflow-hidden shadow-2xl bg-gray-300 border-2 border-white/50">
                <Image
                  src={card.image}
                  alt="Lando Post"
                  fill
                  className="object-cover"
                  priority={index === 2}
                />
                
                {/* Visual Overlay: Fades only on the hovered card */}
                <div 
                  className={`absolute inset-0 bg-black/35 transition-opacity duration-500 ${
                    isHovered ? 'opacity-0' : 'opacity-100'
                  }`} 
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER SECTION */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
        className="mt-16 text-center"
      >
        <p className="font-bold uppercase tracking-[0.4em] text-[10px] text-gray-400 mb-6">
          Follow Lando on social media
        </p>
        <div className="flex gap-10 font-black text-[11px] uppercase tracking-tighter text-gray-800">
          {['Tiktok', 'Instagram', 'Youtube', 'Twitch'].map((social) => (
            <span key={social} className="cursor-pointer hover:text-lime-500 transition-colors">
              {social}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}