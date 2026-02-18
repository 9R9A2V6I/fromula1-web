"use client";

import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <motion.div
        className="h-24 w-24 rounded-full border-4 border-white border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Loader;
