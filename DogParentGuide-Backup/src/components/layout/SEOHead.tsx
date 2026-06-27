// ============================================================
// DogParentGuide - SEO Head Component
// Uses react-helmet-async for dynamic meta tags
// ============================================================

import { Helmet } from 'react-helmet-async';
import { siteSettings } from '../../data/settings';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  canonical?: string;
}

export function SEOHead({
  title,
  description,
  image = siteSettings.og_image,
  url = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  schema,
  noindex = false,
  canonical,
}: SEOHeadProps) {
  const fullTitle = title.includes(siteSettings.name)
    ? title
    : `${title} | ${siteSettings.name}`;

  const fullUrl = `${siteSettings.url}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteSettings.url}${image}`;
  const canonicalUrl = canonical
    ? `${siteSettings.url}${canonical}`
    : fullUrl;

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* OpenGraph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteSettings.name} />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific OG */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteSettings.twitter_handle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content={siteSettings.twitter_handle} />

      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : schema)}
        </script>
      )}

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteSettings.name,
          url: siteSettings.url,
          logo: `${siteSettings.url}/images/logo.png`,
          sameAs: [
            siteSettings.facebook_url,
            siteSettings.instagram_url,
            siteSettings.pinterest_url,
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            email: siteSettings.email,
            contactType: 'customer service',
          },
        })}
      </script>
    </Helmet>
  );
}
