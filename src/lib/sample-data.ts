// Placeholder marketing and site content for the storefront.
// Catalog data (products, categories) lives in the database; see src/db/seed.ts.
// Images are from Unsplash (https://unsplash.com/license).

export function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const hero = {
  eyebrow: "Autumn – Winter",
  title: "The Quiet Season",
  body: "Long coats, soft tailoring and leather pieces made to be worn for years.",
  image: unsplash("1539109136881-3be0616acf4b", 2400),
  imageAlt: "A woman in a pale blue overcoat on a cathedral square",
};

export const editorials = [
  {
    eyebrow: "The Edit",
    title: "Knitwear, Undone",
    body: "Natural fibres in undyed tones, cut generously for layering.",
    href: "/women/knitwear",
    cta: "Discover",
    image: unsplash("1558769132-cb1aea458c5e", 1600),
    imageAlt: "Neutral knitwear hanging on a wooden rail",
  },
  {
    eyebrow: "Boutiques",
    title: "By Appointment",
    body: "Private fittings and personal styling in our boutiques.",
    href: "/stores",
    cta: "Book a Visit",
    image: unsplash("1445205170230-053b83016050", 1600),
    imageAlt: "Coats and knitwear on rails inside a softly lit boutique",
  },
];

export const feature = {
  eyebrow: "Men",
  title: "Modern Tailoring",
  body: "Unstructured jackets and fluid trousers in wool and silk blends — the suit, reconsidered for every day.",
  href: "/men/tailoring",
  cta: "Shop Tailoring",
  image: unsplash("1507679799987-c73779587ccf", 1600),
  imageAlt: "A man buttoning a navy suit jacket",
};

export const services = [
  {
    title: "Complimentary Shipping",
    body: "On every order, delivered in signature packaging.",
  },
  {
    title: "Free Returns",
    body: "Return or exchange within 30 days of delivery.",
  },
  {
    title: "Book an Appointment",
    body: "Shop in store or by video with a client advisor.",
  },
  {
    title: "Personalization",
    body: "Hot-stamped initials on selected leather goods.",
  },
];

export const navigation = [
  { label: "New In", href: "/new" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Bags", href: "/bags" },
  { label: "Jewelry", href: "/jewelry" },
  { label: "Gifts", href: "/gifts" },
];

export const footerLinks = [
  {
    title: "Client Services",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "The House",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/craft" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];
