import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className='bg-white shadow-md py-6'>
      <div className='container mx-auto px-6 md:px-12 flex items-center justify-between'>
        {/* Logo o Nombre de la App */}
        <Link href='/' className='flex items-center'>
          {/* Placeholder para el Logo. Reemplaza con tu imagen real. */}
          <Image
            src='/logo.png' // Ruta a tu archivo de logo en la carpeta public
            alt='Sori Logo'
            width={100} // Ajusta según el tamaño de tu logo
            height={100} // Ajusta según el tamaño de tu logo
            className='mr-2 rounded-md'
          />
        </Link>

        {/* Aquí podrías añadir navegación si la necesitas, pero para esta landing no es estrictamente necesario. */}
        {/* <nav>
          <ul className="flex space-x-4">
            <li><Link href="/features" className="text-gray-600 hover:text-blue-600">Características</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contacto</Link></li>
          </ul>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
