"use client";
import React from 'react';
import { motion } from 'framer-motion';

// Define the text data to match the sponsors in your screenshot
const sponsors = [
  "MONSTER ENERGY",
  "HILTON",
  "WEAREGRIP",
  "UBER",
  "PURE ELECTRIC",
  "GOOGLE",
  "RALPH LAUREN",
  "McLAREN",
  "ANDROID"
];

const TextSlider = () => {
  // We duplicate the array to create the seamless infinite loop effect
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="w-full overflow-hidden absolute bottom-14 left-0 z-10 bg-transparent py-4">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{
          x: "-50%", // Move exactly half the width (the length of one full list)
        }}
        transition={{
          ease: "linear",
          duration: 20, // Adjust speed: higher number = slower
          repeat: Infinity,
          repeatType: "loop", 
        }}
        style={{ width: "fit-content" }}
      >
        {duplicatedSponsors.map((sponsor, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 mx-8 flex items-center justify-center"
          >
            <span className="text-[#D0FF00] font-bold text-xl uppercase tracking-wider font-sans">
              {sponsor}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TextSlider;