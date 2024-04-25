import React from "react";
import { Helmet } from "react-helmet-async";

type Props = {
  /**
   * Short and sweet. Maximum 70 characters.
   */
  title: string;
  /**
   * Recommended Between 2 and 4 sentences.
   */
  description: string;
  /**
   * Content Type (Website Article ETC)
   */
  type: string;
};

export default function SEOHelmetTags({ title, description, type }: Props) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <meta charSet="UTF-8"></meta>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="TCI, Homes, Rent, Landlord, Property, Management, Turks and Caicos Islands"></meta>
      <meta name="author" content="TCI Homebase"></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://tcihomebase.com/static/tci-homebase-wide.jpg" />
      <meta property="og:site_name" content="TCI Homebase" />

      {/* Twitter tags */}
      <meta name="twitter:creator" content="TCI Homebase" />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://tcihomebase.com/static/tci-homebase-wide.jpg" />
    </Helmet>
  );
}
