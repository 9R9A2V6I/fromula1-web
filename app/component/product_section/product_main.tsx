import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProductCard from './product';

export default function ParallaxGrid() {
  return (
    <div className=" min-h-[100vh] py-20 px-10 mt-20 ">
      <div className="grid grid-cols-4 gap-12 items-start max-w-[1920px] mx-auto">
        
        {/* Column 1: Standard Speed */}
        <Column speed={120}>
          <ProductCard /> <ProductCard /> <ProductCard />
        </Column>

        {/* Column 2: Faster Speed + Top Margin Offset */}
        <Column speed={-350} hasOffset>
          <ProductCard /> <ProductCard /> <ProductCard />
        </Column>

        {/* Column 3: Medium Speed */}
        <Column speed={120}>
          <ProductCard /> <ProductCard /> <ProductCard />
        </Column>

        {/* Column 4: Fastest Speed + Top Margin Offset */}
        <Column speed={-350} hasOffset>
          <ProductCard /> <ProductCard /> <ProductCard />
        </Column>

      </div>
    </div>
  );
}

function Column({ children, speed, hasOffset = false }: { children: React.ReactNode, speed: number, hasOffset?: boolean }) {
  const { scrollYProgress } = useScroll();

  // 1. Map scroll to Y movement
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, speed]);
  
  // 2. UseSpring makes the scroll feel buttery smooth (no choppiness)
  const y = useSpring(yRaw, { 
    stiffness: 30, 
    damping: 40, 
    restDelta: 0.005 
  });

  return (
    <motion.div
      style={{ y }}
      // Opacity is now 100% (1) always. 
      // mt-48 creates that initial staggered "row" look from your screenshot.
      className={`flex flex-col gap-16 opacity-100 ${hasOffset ? "mt-48" : "mt-0"}`}
    >
      {children}
    </motion.div>
  );
}