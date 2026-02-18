"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';

interface HoverLinkProps {
  text: string;
  highlighted?: boolean;
}
const HoverLink: React.FC<HoverLinkProps> = ({ text, highlighted = false }) => {
  const letters = text.split("");

  const containerVariants: Variants = {
    initial: {},
    hover: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const letterVariants: Variants = {
    initial: { 
      y: 0, 
      rotate: 0,
      color: highlighted ? "#D9FF00" : "#ffffff"
    },
    hover: (i: number) => ({
      // Move up and down at different heights
      y: [0, -8, 0],
      // Rotate randomly: some left, some right
      rotate: i % 2 === 0 ? [0, 10, -10, 0] : [0, -10, 10, 0],
      color: "#D9FF00",
      transition: {
        // Unique duration for every letter based on index
        duration: 0.3 + (i * 0.05), 
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <motion.a
      href="#"
      initial="initial"
      whileHover="hover"
      variants={containerVariants}
      className="relative inline-flex cursor-pointer"
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          style={{ 
            display: "inline-block", 
            whiteSpace: "pre",
          }}
          className="text-3xl lg:text-5xl font-black uppercase tracking-tighter"
        >
          {char}
        </motion.span>
      ))}
    </motion.a>
  );
};
export default HoverLink;