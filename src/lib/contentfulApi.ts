import client from './contentfulClient';
import { Entry } from 'contentful'; // Importa Entry para tipado

// Define una interfaz para el tipo de contenido 'terms'
interface TermsEntry extends Entry {
  fields: {
    title?: string; // Opcional, si tienes un campo title
    //@eslint-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
  };
}

/**
 * Fetches the terms and conditions entry from Contentful.
 * Assumes you have a content type 'terms' with a rich text field 'content'.
 * It fetches one entry, you might need to adjust if you have multiple or need specific filtering.
 */
export async function fetchTerms(): Promise<TermsEntry | null> {
  try {
    // Busca entradas del tipo 'terms'
    const entries = await client.getEntries({
      content_type: 'terms',
      limit: 1, // Asumimos que solo hay una entrada de términos principal
      // Puedes añadir `order: '-sys.createdAt'` si quieres el más reciente
    });

    // Retorna la primera entrada si existe
    //@ts-expect-error items will work fine
    return entries.items.length > 0 ? entries.items[0] : null;
  } catch (error) {
    console.error('Error fetching terms from Contentful:', error);
    return null; // Retorna null en caso de error
  }
}
