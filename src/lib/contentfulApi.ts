import client from './contentfulClient';
import { Entry, EntrySkeletonType, EntriesQueries, Asset } from 'contentful';

// === TÉRMINOS Y CONDICIONES (NO MODIFICADO) ===
interface TermsEntry extends Entry {
  fields: {
    title?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
  };
}

export async function fetchTerms(): Promise<TermsEntry | null> {
  try {
    const entries = await client.getEntries({
      content_type: 'terms',
      limit: 1,
    });

    // @ts-expect-error items will work fine
    return entries.items.length > 0 ? entries.items[0] : null;
  } catch (error) {
    console.error('Error fetching terms from Contentful:', error);
    return null;
  }
}

// === ARTÍCULOS - TIPADOS OPTIMIZADOS ===
export interface ContentfulArticleFields {
  title?: string;
  slug?: string;
  summary?: string;
  quote?: string;
  imageUrl?: Asset;
}

export interface ArticleEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'article';
  fields: ContentfulArticleFields;
}

export type ContentfulArticleEntry = Entry<ArticleEntrySkeleton, undefined>;

type ArticleQueries = EntriesQueries<ArticleEntrySkeleton, undefined> & {
  'fields.slug'?: string;
  'fields.slug[exists]'?: boolean;
};

// === UTILIDADES ===
const localeConverter = (locale: string): string => {
  return locale === 'es' ? 'es-CO' : 'en-US';
};

// === FUNCIONES DE ARTÍCULOS ===
export async function getAllArticlesForPathsByLocale(
  locale: string,
  limit = 1000
): Promise<ContentfulArticleEntry[]> {
  try {
    const query: ArticleQueries = {
      content_type: 'article',
      select: ['sys.id', 'fields.slug'],
      locale: localeConverter(locale),
      limit,
      'fields.slug[exists]': true,
    };

    const entries = await client.getEntries<ArticleEntrySkeleton>(query);
    return entries.items;
  } catch (error) {
    console.error(
      `Error fetching article paths for locale ${locale} from Contentful:`,
      error
    );
    return [];
  }
}

export async function getArticleBySlugAndLocale(
  slug: string,
  locale: string
): Promise<ContentfulArticleEntry | null> {
  try {
    const query: ArticleQueries = {
      content_type: 'article',
      'fields.slug': slug,
      locale: localeConverter(locale),
      limit: 1,
      include: 2,
    };

    const entries = await client.getEntries<ArticleEntrySkeleton>(query);
    return entries.items[0] ?? null;
  } catch (error) {
    console.error(
      `Error fetching article by slug (${slug}, locale: ${locale}) from Contentful:`,
      error
    );
    return null;
  }
}
