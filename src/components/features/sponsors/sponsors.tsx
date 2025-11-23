import Image from 'next/image'

const Sponsors = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden block">
        {/* Background */}
        <Image 
          src="/sponsors-assets/sponsors-bg.jpg" 
          alt="Sponsors Background"
          fill
          priority
          className='object-fill'
        />

        {/* Black tape overlay */}
        <Image 
          src="/sponsors-assets/blacktapenew (1).png" 
          alt="Black tape overlay"
          fill
          priority
          className='object-fill z-10'
        />
        
        {/* Top black tape - angled
        <div className="absolute top-[5%] left-0 w-full -rotate-2 transform">
          <Image 
            src="/sponsors-assets/blacktape1.png" 
            alt="Film strip decoration"
            className='w-full h-auto'
            width={1920}
            height={363}
          />
        </div>
        
        {/* Bottom black tape - angled opposite direction */}
        {/* <div className="absolute bottom-[-21%] left-[5%] w-full rotate-2 transform">
          <Image 
            src="/sponsors-assets/blacktape2.png" 
            alt="Film strip decoration"
            className='w-full h-auto'
            width={1920}
            height={363}
          />
        </div>

        {/* Interested in Partnering card - top right */}
        {/* <div className="absolute top-[-0.1%] right-[0%] z-10">
          <Image 
            src="/sponsors-assets/interested-in-partnering.png" 
            alt="Interested in Partnering?"
            className='w-auto h-auto'
            width={3000}
            height={1500}
          />
        </div>

        {/* Honouring our Past Sponsors card - bottom left */}
        {/* <div className="absolute bottom-[0%] left-[0%] z-10 w-[80%]">
          <Image 
            src="/sponsors-assets/honouring-our-past-sponsors.png" 
            alt="Honouring our Past Sponsors"
            className='w-full h-auto'
            width={1000}
            height={500}
          />
        </div> */}
    </section>
  )
}

export default Sponsors

