import React from "react";
import { Helmet } from "react-helmet-async";

export const SearchSchema: React.FC = () => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: "https://www.snkrmagnet.com.br/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.snkrmagnet.com.br/buscar/{search_term_string}",
            "query-input": "required name=search_term_string",
          },
        })}
      </script>
    </Helmet>
  );
};
