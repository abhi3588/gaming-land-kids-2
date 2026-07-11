// ============================================
// SEO HOOKS — per-item meta + JSON-LD via Helmet
// ============================================
import { Helmet } from 'react-helmet-async';
import { getItemSEO } from './seo.js';

// Sets SEO for a single content item (game, story, quiz, rhyme, fun, educational).
// Returns null when there is no item; otherwise renders the <Helmet> tags.
export const useItemSEO = (type, item, opts = {}) => {
  if (!item) return null;
  const seo = getItemSEO(type, item, opts);
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonical} />
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:url" content={seo.ogUrl} />
      <meta property="og:type" content={seo.ogType || 'article'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.twitterTitle || seo.ogTitle} />
      <meta name="twitter:description" content={seo.twitterDescription || seo.ogDescription} />
      <meta name="twitter:image" content={seo.twitterImage || seo.ogImage} />
      {seo.hreflang?.map((h, i) => (
        <link key={i} rel="alternate" hreflang={h.lang} href={h.href} />
      ))}
      {seo.jsonLd && <script type="application/ld+json">{JSON.stringify(seo.jsonLd)}</script>}
    </Helmet>
  );
};

export default { useItemSEO };
