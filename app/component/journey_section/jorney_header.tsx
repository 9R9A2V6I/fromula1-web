import React from 'react';
import { motion,Variants } from "framer-motion";

function JorneyHeader() {
  // Container variants to coordinate the children
  const containerVariants:Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3, // Delay between each line starting
      }
    }
  };

  // Curtain animation for each line
  const curtainVariants:Variants = {
    hidden: { x: "1%" },
    visible: { 
      x: "110%", // Slides from left to right to reveal
      transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] } 
    }
  };

  const textLines = [
    "Redefining limits, fighting for ,",
    "wins bringing it all in all ways.",
    "Defining a legacy in Formula 1",
    "on and off the track."
  ];

  return (
    <div className='h-[900px] w-full flex justify-center items-center'>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        className='flex flex-col items-center w-[85%]'
      >
        {textLines.map((line, index) => (
          <div key={index} className="relative overflow-hidden mb-2">
            {/* The Curtain for this specific line */}
            <motion.div
              variants={curtainVariants}
              className="absolute inset-0 z-10"
              style={{ backgroundColor: '#d2ff03' }}
            />
            
            {/* The Text for this specific line */}
            <h1 className="text-[100px] font-semibold uppercase leading-[120px] font-sans text-white">
              {line}
            </h1>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default JorneyHeader;