import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <nav className="fixed bottom-2 left-0 w-full h-auto z-50 hidden sm:block ">
      <div className="flex flex-row justify-center items-center p-4 ">
        <div className="flex flex-row items-left justify-left absolute px-8 mb-10 bg-[rgb(191_159_95/0.32)] rounded-full md:text-2xl sm:text-lg">
          <motion.span
            className="hover:cursor-pointer lg:text-2xl sm:p-2 lg:p-4 font-bold text-white"
            whileHover={{ scale: 1.1, color: "#F4E4BC" }}
            whileTap={{ scale: 0.9 }}
          >
            Home
          </motion.span>
          <motion.span
            className="hover:cursor-pointer lg:text-2xl sm:p-2 lg:p-4 font-bold text-white"
            whileHover={{ scale: 1.1, color: "#F4E4BC" }}
            whileTap={{ scale: 0.9 }}
          >
            About
          </motion.span>
          <motion.span
            className="hover:cursor-pointer lg:text-2xl sm:p-2 lg:p-4 font-bold text-white"
            whileHover={{ scale: 1.1, color: "#F4E4BC" }}
            whileTap={{ scale: 0.9 }}
          >
            Sponsors
          </motion.span>
          <motion.span
            className="hover:cursor-pointer lg:text-2xl sm:p-2 lg:p-4 font-bold text-white"
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
