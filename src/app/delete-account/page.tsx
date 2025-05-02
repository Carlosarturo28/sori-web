import Image from 'next/image';

export default function DeleteAccountPage() {
  // Define los pasos para eliminar la cuenta
  const steps = [
    {
      step: 1,
      text: 'Abre la aplicación y navega a la sección "Perfil" o "Configuración". Esta suele encontrarse en el navegador con un icono de una persona.',
      image: '/step-1.png', // Placeholder para la imagen
      alt: 'Paso 1: Ir a Perfil/Configuración',
    },
    {
      step: 2,
      text: 'Dentro de la configuración, busca una opción relacionada con "Configuración de la Cuenta", "Privacidad" o "Seguridad".',
      image: '/step-2.png', // Placeholder para la imagen
      alt: 'Paso 2: Buscar opción de Cuenta/Privacidad',
    },
    {
      step: 3,
      text: 'Localiza y selecciona la opción "Eliminar Cuenta" o "Cerrar Cuenta". Puede que esté en un submenú.',
      image: '/step-3.png', // Si tienes más pasos con imágenes
      alt: 'Paso 3: Seleccionar Eliminar Cuenta',
    },
    {
      step: 4,
      text: 'Lee cuidadosamente la información proporcionada sobre las consecuencias de eliminar tu cuenta (pérdida de datos, etc.). Si estás seguro, confirma la acción siguiendo las instrucciones en pantalla (podría requerir tu contraseña o verificación).',
      image: '/step-4.png',
      alt: 'Paso 4: Confirmar eliminación',
    },
    // Añade más pasos según sea necesario
  ];

  return (
    <div className='container mx-auto p-6 md:p-12 min-h-screen '>
      <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b pb-4'>
        Cómo Eliminar Tu Cuenta
      </h1>

      <p className='text-gray-600 mb-8'>
        Si deseas eliminar tu cuenta de Sori, sigue los siguientes pasos dentro
        de la aplicación móvil:
      </p>

      <ol className='list-decimal list-inside space-y-8'>
        {steps.map((step) => (
          <li key={step.step} className='text-gray-700 text-lg leading-relaxed'>
            <span className='font-semibold text-blue-600 mr-2'>
              Paso {step.step}:
            </span>{' '}
            {step.text}
            {step.image && (
              <div className='mt-4 w-full flex justify-center'>
                {/* Usa un div placeholder o el componente Image con el src correcto */}
                <Image
                  src={step.image}
                  alt={step.alt}
                  width={400} // Ajusta el tamaño según necesites
                  height={300} // Ajusta el tamaño según necesites
                  className='rounded-lg shadow-md border border-gray-200 max-w-full h-auto'
                  // layout="responsive" // Considera usar layout si es apropiado
                />
              </div>
            )}
          </li>
        ))}
      </ol>

      <p className='text-gray-600 mt-8'>
        Si tienes problemas para eliminar tu cuenta, por favor contacta a
        nuestro soporte técnico a aprendeconsori@gmail.com
      </p>
    </div>
  );
}
