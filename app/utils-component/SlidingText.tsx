
import {motion} from "framer-motion";
export const SlidingText = ({ children, className }: { children: string, className: string }) => {
  return (
    <motion.div
      initial="initial"
      whileHover="hovered"
      className={`relative block overflow-hidden whitespace-nowrap cursor-default ${className}`}
    >
      <motion.div
        variants={{
          initial: { y: 0 },
          hovered: { y: "-100%" }
        }}
        transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        variants={{
          initial: { y: "100%" },
          hovered: { y: 0 }
        }}
        transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};