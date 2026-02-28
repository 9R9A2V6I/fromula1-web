  "use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import Image from "next/image";

type ImageData = {
  src: string;
  yOffset: number;
  className: string;
};

const imagesData: ImageData[] = [
  {
    src: "/images/dewald_hero_section.jpg",
    yOffset: 0, // Floats higher
    className: "w-[200px] aspect-[3/4] md:w-[300px]", 
  },
  {
    src: "/images/dewald_hero_section.jpg",
    yOffset: 0, // Floats lower
    className: "w-[150px] aspect-square md:w-[250px]", 
  },
  {
    src: "/images/dewald_hero_section.jpg",
    yOffset: 0, 
    className: "w-[300px] aspect-[4/5] md:w-[500px] z-10", 
  },
  {
    src: "/images/dewald_hero_section.jpg",
    yOffset: 0, // Very high
    className: "w-[180px] aspect-video md:w-[280px]", 
  },
  {
    src: "/images/dewald_hero_section.jpg",
    yOffset: 0, // Lower
    className: "w-[220px] aspect-[3/4] md:w-[320px]", 
  },
  {
    src: "/images/dewald_hero_section.jpg",
    yOffset: 0, // Slightly off center
    className: "w-[160px] aspect-square md:w-[240px]", 
  },
];

const MovingImage: React.FC<{
  data: ImageData;
  index: number;
  scrollYProgress: MotionValue<number>;
  totalImages: number;
}> = ({ data, index, scrollYProgress, totalImages }) => {
  // Stagger logic: precise timing for "One by One" feel
  const stepSize = 1 / totalImages; 
  const start = stepSize * index;      
  const center = start + 0.05;          
  const end = center + 0.3;            

  
  
  const x = useTransform(
    scrollYProgress,
    [start, center, end],
    ["120vw", "2%", "-100vw"]
  );

  const y = useTransform(
    scrollYProgress,
    [start, center, end],
    ["100vh", `${data.yOffset}px`, "0px"] 
  );

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ x, y, opacity }}
      className={`absolute top-1/2 left-1/2 -translate-x-1 -translate-y-1 shadow-xl ${data.className}`}
    >
      <Image
        src={data.src}
        alt="Gallery Image"
        fill
        className="object-cover grayscale-75 hover:grayscale-0 transition-all duration-500"
      />
    </motion.div>
  );
};

function JourneyGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[200vh] ">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {imagesData.map((data, index) => (
          <MovingImage 
            key={index}
            data={data}
            index={index}
            totalImages={imagesData.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

      </div>
    </div>
  );
}

export default JourneyGallery;
