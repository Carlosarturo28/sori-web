import { fetchTerms } from '@/lib/contentfulApi';
import ContentfulRichTextRenderer from '@/components/ContentfulRichTextRenderer';
import { Document } from '@contentful/rich-text-types';

// Esta página es un Server Component por defecto, lo que es ideal para fetching de datos

export default async function TermsPage() {
  // Fetch data on the server
  const termsEntry = await fetchTerms();

  // Extrae el contenido rich text
  const termsContent = termsEntry?.fields?.content as Document | undefined;
  const termsTitle = termsEntry?.fields?.title || 'Términos y Condiciones'; // Usa el título de Contentful si existe

  return (
    <div className='container mx-auto p-6 md:p-12 min-h-screen'>
      <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b pb-4'>
        {termsTitle}
      </h1>

      {termsContent ? (
        // Usa el componente cliente para renderizar el rich text
        <ContentfulRichTextRenderer document={termsContent} />
      ) : (
        // Mensaje si no se encuentran los términos
        <p className='text-gray-600'>
          No se pudieron cargar los términos y condiciones en este momento. Por
          favor, inténtalo de nuevo más tarde.
        </p>
      )}
    </div>
  );
}
