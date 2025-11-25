import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <nav className="fixed bottom-8 left-0 w-full h-auto z-50 hidden sm:block">
      <div className="flex flex-row justify-center items-center px-4">
        <div className="flex flex-row items-center justify-center px-12 sm:px-16 md:px-24 lg:px-40 xl:px-48 py-6 bg-[rgb(191_159_95/0.32)] rounded-full backdrop-blur-sm">
          <motion.span
            className="hover:cursor-pointer px-8 py-6 sm:px-10 sm:py-6 md:px-16 md:py-8 lg:px-28 lg:py-14 xl:px-32 xl:py-16 font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-7xl xl:text-8xl"
            whileHover={{ scale: 1.1, color: "#F4E4BC" }}
            whileTap={{ scale: 0.9 }}
          >
            Home
          </motion.span>
          <motion.span
            className="hover:cursor-pointer px-8 py-6 sm:px-10 sm:py-6 md:px-16 md:py-8 lg:px-28 lg:py-14 xl:px-32 xl:py-16 font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-7xl xl:text-8xl"
            whileHover={{ scale: 1.1, color: "#F4E4BC" }}
            whileTap={{ scale: 0.9 }}
          >
            About
          </motion.span>
          <motion.span
            className="hover:cursor-pointer px-8 py-6 sm:px-10 sm:py-6 md:px-16 md:py-8 lg:px-28 lg:py-14 xl:px-32 xl:py-16 font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-7xl xl:text-8xl"
            whileHover={{ scale: 1.1, color: "#F4E4BC" }}
            whileTap={{ scale: 0.9 }}
          >
            Sponsors
          </motion.span>
          <motion.span
            className="hover:cursor-pointer px-8 py-6 sm:px-10 sm:py-6 md:px-16 md:py-8 lg:px-28 lg:py-14 xl:px-32 xl:py-16 font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-7xl xl:text-8xl"
            whileHover={{ scale: 1.1, color: "#F4E4BC" }}
            whileTap={{ scale: 0.9 }}
          >
            Contact
          </motion.span>
        </div>
      </div>
    </nav>
  );
}
