import Image from 'next/image'

const Sponsors = () => {
  return (
    <section className="relative h-full w-full overflow-hidden">
        {/* Background */}
        <Image 
          src="/carousel-background.jpg" 
          alt="Sponsors Background"
          priority
          className='object-cover'
          height={1106}
          width={1920}
        />
        
        {/* Top black tape - angled */}
        <div className="absolute top-[10%] left-0 w-full -rotate-2 transform">
          <Image 
            src="/blacktape1.png" 
            alt="Film strip decoration"
            className='w-full h-auto'
            width={1920}
            height={363}
          />
        </div>
        
        {/* Bottom black tape - angled opposite direction */}
        <div className="absolute bottom-[-21%] left-[5%] w-full rotate-2 transform">
          <Image 
            src="/blacktape2.png" 
            alt="Film strip decoration"
            className='w-full h-auto'
            width={1920}
            height={363}
          />
        </div>
    </section>
  )
}

export default Sponsors

