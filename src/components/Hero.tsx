import React from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className='bg-[#FCF5F3] text-blue-950 pt-16 md:pt-24'>
      <div className='container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12'>
        {/* Contenido de Texto */}
        <div className='w-full md:w-1/2 text-center md:text-left'>
          <h1 className='text-4xl md:text-6xl font-bold leading-tight mb-4'>
            Aprende con Sori
          </h1>
          <p className='text-xl md:text-2xl mb-8 opacity-90'>
            Aprende sobre crianza, adquiere herramientas para resolver esas
            situaciones difíciles del día a día y fortalece el vínculo con tus
            hijos.
          </p>

          {/* Botón de Descarga (CTA) */}
          <a
            href='https://play.google.com/store/apps/details?id=com.sori.app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              alt='descarga de google play'
              src='/google-play.png'
              width={200}
              height={80}
            />
          </a>
        </div>

        <div className='w-full md:w-1/2 flex justify-center md:justify-end'>
          {/* Puedes poner un mock de un teléfono con tu screenshot dentro */}
          <Image
            src='/front-app.png' // Ruta a una screenshot o imagen promocional
            alt='Screenshot de la App'
            width={400} // Ancho de la imagen (ajusta)
            height={600} // Alto de la imagen (ajusta)
            className='object-cover' // Ajusta si necesitas cubrir o contener
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
