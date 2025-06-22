import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Asset } from 'contentful';

import {
  ContentfulArticleEntry,
  getAllArticlesForPathsByLocale,
  getArticleBySlugAndLocale,
} from '@/lib/contentfulApi';
import OpenInAppButton from '../../../../../components/OpenInAppButton';

// === CONFIGURACIÓN ===
const APP_SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME || 'sori';
const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ||
  'https://apps.apple.com/app/tu-app-nombre/idTU_APP_STORE_ID_AQUI';
const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
  'https://play.google.com/store/apps/details?id=com.sori.app';
const WEB_DOMAIN =
  process.env.NEXT_PUBLIC_WEB_DOMAIN || 'www.aprendeconsori.com';
const WEB_APP_PATH_PREFIX = 'app';

export const revalidate = 600;

// === TIPOS ===
interface ArticlePageParams {
  slug: string;
  locale: string;
}

interface ArticlePageProps {
  params: Promise<ArticlePageParams>;
}

// === UTILIDADES ===
const getImageUrl = (imageAsset: Asset | undefined): string | undefined => {
  if (!imageAsset?.fields?.file?.url) return undefined;

  const url = imageAsset.fields.file.url;

  // Manejar tanto string como AssetFile
  let urlString: string;
  if (typeof url === 'string') {
    urlString = url;
  } else if (url && typeof url === 'object' && 'url' in url) {
    // Si es un objeto AssetFile con propiedad url
    urlString = String(url.url || url);
  } else {
    urlString = String(url);
  }

  return urlString.startsWith('http') ? urlString : `https:${urlString}`;
};

const getArticleData = (articleEntry: ContentfulArticleEntry) => {
  const { fields } = articleEntry;
  return {
    title: fields.title || 'Artículo sin Título',
    summary:
      fields.quote || fields.summary || 'Descubre más en nuestra aplicación.',
    imageUrl: getImageUrl(fields.imageUrl),
  };
};

// === METADATA ===
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const articleEntry = await getArticleBySlugAndLocale(slug, locale);

  if (!articleEntry) {
    return {
      title: 'Artículo no encontrado',
      description:
        'El artículo que buscas no existe o no está disponible en este idioma.',
      robots: { index: false, follow: false },
    };
  }

  const { title, summary, imageUrl } = getArticleData(articleEntry);
  const pageUrl = `https://${WEB_DOMAIN}/${locale}/${WEB_APP_PATH_PREFIX}/article/${slug}`;

  return {
    title: `${title} | Aprende con Sori (${locale.toUpperCase()})`,
    description: summary,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description: summary,
      url: pageUrl,
      siteName: 'Aprende con Sori',
      images: imageUrl
        ? [{ url: imageUrl, width: 800, height: 600, alt: title }]
        : [],
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description: summary,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// === STATIC PARAMS ===
export async function generateStaticParams(): Promise<ArticlePageParams[]> {
  const allParams: ArticlePageParams[] = [];
  const configuredLocales = ['es', 'en'];

  console.log('[generateStaticParams] Iniciando generación de paths...');

  for (const locale of configuredLocales) {
    console.log(
      `[generateStaticParams] Obteniendo artículos para locale: ${locale}`
    );

    const articles = await getAllArticlesForPathsByLocale(locale, 1000);
    console.log(
      `[generateStaticParams] Encontrados ${articles.length} artículos para ${locale}`
    );

    articles.forEach((article) => {
      if (article.fields.slug) {
        allParams.push({ locale, slug: article.fields.slug });
      }
    });
  }

  console.log(
    `[generateStaticParams] Total de paths generados: ${allParams.length}`
  );
  return allParams;
}

// === COMPONENTE PRINCIPAL ===
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, locale } = await params;
  console.log(
    `[ArticlePage] Renderizando para slug: "${slug}", locale: "${locale}"`
  );

  const articleEntry = await getArticleBySlugAndLocale(slug, locale);

  if (!articleEntry) {
    console.log(
      `[ArticlePage] Artículo no encontrado para slug: "${slug}", locale: "${locale}"`
    );
    notFound();
  }

  const { title, summary, imageUrl } = getArticleData(articleEntry);
  const appDeepLinkPath = `${WEB_APP_PATH_PREFIX}/article/${articleEntry.sys.id}`;
  const appDeepLink = `${APP_SCHEME}://${appDeepLinkPath}`;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header con logo/branding */}
        <div style={styles.header}>
          <div style={styles.appIcon}>📚</div>
          <h2 style={styles.appName}>Aprende con Sori</h2>
        </div>

        {/* Contenido del artículo */}
        <div style={styles.articlePreview}>
          {imageUrl && (
            <div style={styles.imageContainer}>
              <Image
                src={imageUrl}
                alt={title}
                width={700}
                height={300}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                priority
              />
              <div style={styles.imageOverlay} />
            </div>
          )}

          <div style={styles.content}>
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.summary}>{summary}</p>
          </div>
        </div>

        {/* CTA Section */}
        <div style={styles.ctaSection}>
          <div style={styles.ctaIcon}>📱</div>
          <h3 style={styles.ctaTitle}>¡Continúa leyendo en la app!</h3>
          <p style={styles.ctaMessage}>
            Accede al artículo completo y descubre miles de contenidos más en{' '}
            {locale === 'es' ? 'español' : 'inglés'}
          </p>

          <OpenInAppButton
            appDeepLink={appDeepLink}
            appStoreUrl={APP_STORE_URL}
            playStoreUrl={PLAY_STORE_URL}
          />

          <div style={styles.storeLinksContainer}>
            <a
              href={PLAY_STORE_URL}
              target='_blank'
              rel='noopener noreferrer'
              style={styles.playStoreButton}
            >
              <svg
                style={styles.playStoreIcon}
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z' />
              </svg>
              Descargar en Google Play
            </a>
          </div>
        </div>

        {/* Features highlight */}
        <div style={styles.featuresSection}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🎯</span>
            <span style={styles.featureText}>Contenido personalizado</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📖</span>
            <span style={styles.featureText}>Miles de artículos</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🌟</span>
            <span style={styles.featureText}>Experiencia premium</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// === ESTILOS ===
const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    minHeight: '87vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '420px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    padding: '24px 24px 16px',
    backgroundColor: '#f8f9fa',
  },
  appIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  appName: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#2c3e50',
    margin: 0,
  },
  articlePreview: {
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
    pointerEvents: 'none',
  },
  content: {
    padding: '24px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#2c3e50',
    lineHeight: 1.3,
    margin: '0 0 12px 0',
  },
  summary: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: 1.5,
    margin: 0,
  },
  ctaSection: {
    padding: '24px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e9ecef',
  },
  ctaIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  ctaTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#2c3e50',
    margin: '0 0 8px 0',
  },
  ctaMessage: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 24px 0',
    lineHeight: 1.4,
  },
  storeLinksContainer: {
    marginTop: '16px',
  },
  playStoreButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#01875f',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(1, 135, 95, 0.3)',
    width: '100%',
    maxWidth: '280px',
  },
  playStoreIcon: {
    width: '20px',
    height: '20px',
  },
  featuresSection: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px 24px 24px',
    backgroundColor: '#f8f9fa',
  },
  feature: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  featureText: {
    fontSize: '0.8rem',
    color: '#666',
    textAlign: 'center',
    fontWeight: 500,
  },
};
