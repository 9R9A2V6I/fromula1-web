"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ImageSlider() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70, // Slightly slower for a more premium feel
    damping: 30,
  });

  // PARALLAX: Text moves more distance than the image to create depth
  const leftImgX = useTransform(smoothProgress, [0, 0.45], [-200, 0]);
  const leftTextX = useTransform(smoothProgress, [0, 0.45], [-450, 120]);

  const rightImgX = useTransform(smoothProgress, [0, 0.45], [200, 0]);
  const rightTextX = useTransform(smoothProgress, [0, 0.45], [450, -120]);

  const opacity = useTransform(smoothProgress, [0, 0.2, 0.45], [0, 0.5, 1]);

  return (
    <section ref={containerRef} className=" w-full  overflow-hidden">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        
        {/* max-w-screen-2xl and gap-20 prevents the two sides from touching */}
        <div className="w-full  flex items-center justify-between  ">
          
          {/* LEFT SIDE SECTION */}
          <div className="flex items-center gap-12">
            <motion.div style={{ x: leftImgX, opacity }}>
              <Image 
                src="/images/slide-left-side.webp" 
                alt="left slide" 
                width={500} 
                height={700}
                style={{ height: '1000px', width: '100%' }} // Maintains aspect ratio (default height)
                className="rounded-lg"
              />
            </motion.div>
            
            <motion.div style={{ x: leftTextX, opacity }} className="flex flex-col items-end">
                <h1 className="font-brier relative text-[clamp(60px,10vw,120px)]  text-end leading-[0.85] font-bold uppercase italic">
                  ON <br/><span className="font-sans font-extrabold">Track</span>
                  <p className='absolute right-8 top-12 font-medium  font-indie text-[100px]  text-[#d2ff03] '>speed</p>
                </h1>
                <p className="text-right text-[20px] mt-8 font-medium opacity-70 max-w-[300px]">
                  Most recent results, career stats and photos from trackside.
                </p>
            </motion.div>
          </div>

          {/* RIGHT SIDE SECTION */}
          <div className="flex items-center gap-12">
             <motion.div style={{ x: rightTextX, opacity }} className="flex flex-col items-start">
                <h1 className="font-brier text-[clamp(60px,10vw,120px)] leading-[0.85] font-bold uppercase italic">
                  OFF<br/><span className="font-sans font-extrabold">Track</span>
                </h1>
                <p className="text-left text-[20px] mt-8 font-medium opacity-70 max-w-[300px]">
                  Campaigns, shoots and other promotional materials for fans.
                </p>
            </motion.div>

            <motion.div style={{ x: rightImgX, opacity }}>
              <Image 
                src="/images/heroSection.webp" 
                alt="right slide" 
                width={500} 
                height={700}
                style={{ height: '1000px', width: '100%' }} // Maintains aspect ratio (default height)
                className="rounded-lg object-cover"
              />
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}