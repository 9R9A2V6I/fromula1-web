import { useState } from "react";
import { motion } from "framer-motion";

const AnimatedMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const variant = isOpen ? "open" : "closed";

  // Adjusted paths to be centered within a 23x23 coordinate space
  // and used the viewBox to scale it up.
  const topPath = {
    closed: { d: "M 5 8 L 18 8", stroke: "#000" },
    open: { d: "M 5 18 L 18 5", stroke: "#000" }
  };

  const bottomPath = {
    closed: { d: "M 5 15 L 18 15", stroke: "#000" },
    open: { d: "M 5 5 L 18 18", stroke: "#000" }
  };

  return (
    <div className="flex justify-start items-start"> {/* Wrapper to see it centered on page */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center transition-colors duration-300"
        style={{
          width: 70, 
          height: 70, 
          borderRadius: 12,
          backgroundColor: isOpen ? "#d2ff03" : "transparent", 
          border: isOpen ? "2px solid #d2ff03" : "2px solid #000", 
          cursor: "pointer",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 23 23">
          <motion.path
            fill="transparent"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={variant}
            variants={topPath}
          />
          <motion.path
            fill="transparent"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={variant}
            variants={bottomPath}
          />
        </svg>
      </button>
    </div>
  );
};

export default AnimatedMenuButton;