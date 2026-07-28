import { Helmet } from "react-helmet-async";

const SITE_NAME = "Jemzy";
const SITE_URL = "https://jemzy.pk";
const DEFAULT_IMAGE = `${SITE_URL}/favicon-96x96.png`;

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  structuredData,
  breadcrumbs,
  product,
  faq,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Jewelry, Makeup & Beauty, Hair Accessories`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image?.startsWith("http") ? image : image ? `${SITE_URL}${image}` : DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Organization JSON-LD (always present) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/favicon-96x96.png`,
        })}
      </script>

      {/* BreadcrumbList JSON-LD */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.name,
              item: item.url ? `${SITE_URL}${item.url}` : undefined,
            })),
          })}
        </script>
      )}

      {/* Product JSON-LD */}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.images,
            description: product.description,
            sku: product.sku,
            brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/product/${product.slug}`,
              priceCurrency: product.currency || "PKR",
              price: product.price,
              priceValidUntil: product.priceValidUntil,
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
            },
            aggregateRating: product.rating ? {
              "@type": "AggregateRating",
              ratingValue: product.rating.value,
              reviewCount: product.rating.count,
            } : undefined,
          })}
        </script>
      )}

      {/* FAQ JSON-LD */}
      {faq && faq.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          })}
        </script>
      )}

      {/* Custom structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
