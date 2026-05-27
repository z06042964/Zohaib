import { FAQ_ITEMS } from "../constants/faq";

export const BASE_URL = "https://imgoraa.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.svg`;
const DEFAULT_ROBOTS = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

const organizationSchema = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Imgoraa",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  image: DEFAULT_OG_IMAGE,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "contact@imgoraa.ai",
      url: `${BASE_URL}/contact`,
      availableLanguage: ["en"],
    },
  ],
};

const websiteSchema = {
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Imgoraa",
  url: BASE_URL,
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  inLanguage: "en",
};

function getAbsoluteUrl(path = "/") {
  return path === "/" ? BASE_URL : `${BASE_URL}${path}`;
}

function buildWebPageSchema({ title, description, path }) {
  const url = getAbsoluteUrl(path);

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: title,
    url,
    description,
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    about: {
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: "en",
  };
}

function buildBreadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

function buildSoftwareSchema({ name, description, path, featureList }) {
  return {
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: getAbsoluteUrl(path),
    },
    description,
    url: getAbsoluteUrl(path),
    image: DEFAULT_OG_IMAGE,
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    featureList,
  };
}

function buildFaqSchema(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function createSeoEntry({
  path,
  title,
  description,
  keywords = [],
  ogType = "website",
  schema = [],
}) {
  return {
    path,
    title,
    description,
    keywords: keywords.join(", "),
    url: getAbsoluteUrl(path),
    ogType,
    robots: DEFAULT_ROBOTS,
    image: DEFAULT_OG_IMAGE,
    schema: {
      "@context": "https://schema.org",
      "@graph": [organizationSchema, websiteSchema, ...schema],
    },
  };
}

export const DEFAULT_SEO = createSeoEntry({
  path: "/",
  title: "Imgoraa - AI Image Tools for Creators",
  description:
    "Imgoraa helps you remove backgrounds, compress images, and convert files online with fast AI-powered tools.",
  keywords: [
    "AI image tools",
    "background remover",
    "image compressor",
    "png to jpg",
    "online image editor",
  ],
  schema: [
    buildWebPageSchema({
      title: "Imgoraa - AI Image Tools for Creators",
      description:
        "Imgoraa helps you remove backgrounds, compress images, and convert files online with fast AI-powered tools.",
      path: "/",
    }),
    buildFaqSchema(FAQ_ITEMS),
  ],
});

export const PAGE_SEO = {
  "/": DEFAULT_SEO,
  "/about": createSeoEntry({
    path: "/about",
    title: "About Imgoraa",
    description:
      "Learn about Imgoraa and how our online image tools help creators edit, optimize, and convert images faster.",
    keywords: ["about Imgoraa", "image tools company", "online image editing"],
    schema: [
      buildWebPageSchema({
        title: "About Imgoraa",
        description:
          "Learn about Imgoraa and how our online image tools help creators edit, optimize, and convert images faster.",
        path: "/about",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ],
  }),
  "/contact": createSeoEntry({
    path: "/contact",
    title: "Contact Imgoraa",
    description:
      "Contact Imgoraa for support, questions, or feedback about our online image editing and optimization tools.",
    keywords: ["contact Imgoraa", "image tool support", "Imgoraa help"],
    schema: [
      buildWebPageSchema({
        title: "Contact Imgoraa",
        description:
          "Contact Imgoraa for support, questions, or feedback about our online image editing and optimization tools.",
        path: "/contact",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  }),
  "/privacy": createSeoEntry({
    path: "/privacy",
    title: "Privacy Policy | Imgoraa",
    description:
      "Read the Imgoraa privacy policy to understand how uploaded images and personal information are handled.",
    keywords: ["Imgoraa privacy policy", "image upload privacy", "data policy"],
    schema: [
      buildWebPageSchema({
        title: "Privacy Policy | Imgoraa",
        description:
          "Read the Imgoraa privacy policy to understand how uploaded images and personal information are handled.",
        path: "/privacy",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: "/privacy" },
      ]),
    ],
  }),
  "/terms": createSeoEntry({
    path: "/terms",
    title: "Terms and Conditions | Imgoraa",
    description:
      "Review the Imgoraa terms and conditions for using our image tools, website, and related services.",
    keywords: ["Imgoraa terms", "website terms", "tool usage policy"],
    schema: [
      buildWebPageSchema({
        title: "Terms and Conditions | Imgoraa",
        description:
          "Review the Imgoraa terms and conditions for using our image tools, website, and related services.",
        path: "/terms",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Terms and Conditions", path: "/terms" },
      ]),
    ],
  }),
  "/background-remover": createSeoEntry({
    path: "/background-remover",
    title: "Background Remover - Remove Image Backgrounds Online | Imgoraa",
    description:
      "Remove image backgrounds online with Imgoraa's AI background remover. Upload a photo and download a clean transparent PNG in seconds.",
    keywords: [
      "background remover",
      "remove image background online",
      "transparent png maker",
    ],
    schema: [
      buildWebPageSchema({
        title: "Background Remover - Remove Image Backgrounds Online | Imgoraa",
        description:
          "Remove image backgrounds online with Imgoraa's AI background remover. Upload a photo and download a clean transparent PNG in seconds.",
        path: "/background-remover",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Background Remover", path: "/background-remover" },
      ]),
      buildSoftwareSchema({
        name: "Imgoraa Background Remover",
        description:
          "Remove backgrounds from images online and export a transparent PNG with Imgoraa.",
        path: "/background-remover",
        featureList: [
          "AI background removal",
          "Transparent PNG downloads",
          "Fast web-based workflow",
        ],
      }),
    ],
  }),
  "/image-compressor": createSeoEntry({
    path: "/image-compressor",
    title: "Image Compressor - Compress Images Online | Imgoraa",
    description:
      "Compress JPG, PNG, and WEBP images online with Imgoraa. Reduce file size fast while keeping image quality under control.",
    keywords: [
      "image compressor",
      "compress images online",
      "reduce jpg size",
      "optimize png",
    ],
    schema: [
      buildWebPageSchema({
        title: "Image Compressor - Compress Images Online | Imgoraa",
        description:
          "Compress JPG, PNG, and WEBP images online with Imgoraa. Reduce file size fast while keeping image quality under control.",
        path: "/image-compressor",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Image Compressor", path: "/image-compressor" },
      ]),
      buildSoftwareSchema({
        name: "Imgoraa Image Compressor",
        description:
          "Compress image files online with adjustable quality, resizing, and export settings.",
        path: "/image-compressor",
        featureList: [
          "Image compression",
          "Quality controls",
          "Resize before export",
          "JPG, PNG, WEBP support",
        ],
      }),
    ],
  }),
  "/png-to-jpg": createSeoEntry({
    path: "/png-to-jpg",
    title: "PNG to JPG Converter - Convert PNG Images Online | Imgoraa",
    description:
      "Convert PNG to JPG online with Imgoraa. Turn large PNG files into smaller JPG images quickly, right in your browser.",
    keywords: ["png to jpg", "convert png to jpg online", "png jpg converter"],
    schema: [
      buildWebPageSchema({
        title: "PNG to JPG Converter - Convert PNG Images Online | Imgoraa",
        description:
          "Convert PNG to JPG online with Imgoraa. Turn large PNG files into smaller JPG images quickly, right in your browser.",
        path: "/png-to-jpg",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "PNG to JPG", path: "/png-to-jpg" },
      ]),
      buildSoftwareSchema({
        name: "Imgoraa PNG to JPG Converter",
        description:
          "Convert PNG images into JPG files online for smaller, web-friendly output.",
        path: "/png-to-jpg",
        featureList: [
          "PNG to JPG conversion",
          "Browser-based processing",
          "Smaller output files",
        ],
      }),
    ],
  }),
};
