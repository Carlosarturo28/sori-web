import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-800 text-white py-8'>
      <div className='container mx-auto px-6 md:px-12 text-center'>
        {/* Enlaces de Navegación del Footer */}
        <div className='flex justify-center space-x-6 mb-4'>
          <Link
            href='/terms'
            className='text-gray-300 hover:text-white transition duration-300'
          >
            Términos y Condiciones
          </Link>
          <Link
            href='/delete-account'
            className='text-gray-300 hover:text-white transition duration-300'
          >
            Eliminar Cuenta
          </Link>
        </div>

        {/* Texto de Copyright (Opcional) */}
        <p className='text-gray-500 text-sm'>
          © {new Date().getFullYear()} Sori. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
