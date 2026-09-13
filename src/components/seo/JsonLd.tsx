import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/site";

export function JsonLd() {
  const url = getSiteUrl();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: SITE_NAME,
        alternateName: ["Eco Bound", "Ecobound", "EcoBound", "Echo Bound", "todo game"],
        description: SITE_DESCRIPTION,
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${url}/#app`,
        name: SITE_TITLE,
        url,
        applicationCategory: "GameApplication",
        operatingSystem: "Web",
        description: SITE_DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        alternateName: ["Eco Bound", "Eco Bound todo", "EchoBound todo game"],
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        alternateName: ["Eco Bound", "Ecobound todo", "Echo Bound"],
        applicationCategory: "Game",
        applicationSubCategory: "Todo game / life RPG",
        operatingSystem: "Web browser",
        url,
        description: SITE_DESCRIPTION,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
