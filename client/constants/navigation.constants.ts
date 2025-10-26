
type MoreNavItem = { name: string; href: string; authRequired?: boolean };

export const navigation = [
  { name: "Home", href: "/" },
  { name: "About Me", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Services", href: "/services" },
  { name: "Blogs", href: "/blog" },
];

export const moreNavigation: MoreNavItem[] = [
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];