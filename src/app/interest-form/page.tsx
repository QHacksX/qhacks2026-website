import AnimatedStars from "@/components/ui/3d-models/Star";
import Link from "next/link";
import { IoIosClose } from "react-icons/io";

const page = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
        {/* Close button - responsive positioning */}
        <Link href='/' className='absolute top-4 left-4 sm:top-6 sm:left-6 z-10 text-white hover:text-[#E3C676] transition-colors'>
            <IoIosClose size={40} className="sm:w-12 sm:h-12" />
        </Link>
         
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] px-4 sm:px-6 lg:px-8">
            <AnimatedStars />
            <div className="relative flex flex-col items-center font-semibold text-center min-h-screen max-w-3xl mx-auto text-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#E3C676] text-center mb-8 sm:mb-12 py-6">
                  QHacks 2026 Interest Form
              </h1>
              <p className="mt-4 max-w-2xl text-center text-gray-300">
                QHacks is your chance to learn, create, and connect with an awesome community. 
                Let us know you're interested—we'll make sure you're the first to hear when applications open!
              </p>
            </div>
            
        </div>
    </div>
  )
}

export default page