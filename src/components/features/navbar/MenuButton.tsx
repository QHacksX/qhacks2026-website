"use client";

import { Menu } from "lucide-react";
import { motion } from "framer-motion";

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.2,
        delay: 0 // No delay for exit animation
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-6 left-6 z-[102] rounded-lg bg-black/40 backdrop-blur-sm p-2.5 text-white/70 hover:text-white hover:bg-black/60 transition-all duration-200"
      aria-label="Open menu"
    >
      <Menu size={20} />
    </motion.button>
  );
};

export default MenuButton;
