/*
|--------------------------------------------------------------------------
| TYPE DEFINITIONS
|--------------------------------------------------------------------------
| TypeScript interfaces for testimonial data and statistics.
*/


export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  testimonial: string;
  project: string;
  date: string;
  featured: boolean;
}

/*
|--------------------------------------------------------------------------
| DATA - TESTIMONIALS
|--------------------------------------------------------------------------
| Client testimonials with ratings, project details, and featured status.
*/

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    avatar: "/client-avatar-1.jpg",
    rating: 5,
    testimonial:
      "Working with this developer was an absolute pleasure. They delivered our e-commerce platform ahead of schedule and exceeded all our expectations. The attention to detail and code quality is outstanding.",
    project: "E-Commerce Platform",
    date: "December 2024",
    featured: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateLab",
    avatar: "/client-avatar-2.jpg",
    rating: 5,
    testimonial:
      "The SaaS dashboard they built for us has significantly improved our team's productivity. The user interface is intuitive and the performance is exceptional. Highly recommended!",
    project: "SaaS Dashboard",
    date: "November 2024",
    featured: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCorp",
    avatar: "/client-avatar-3.jpg",
    rating: 5,
    testimonial:
      "Our new landing page has increased conversions by 40%! The design is modern, responsive, and perfectly captures our brand identity. Excellent work from start to finish.",
    project: "Landing Page Redesign",
    date: "October 2024",
    featured: false,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Founder",
    company: "RestaurantPro",
    avatar: "/client-avatar-4.jpg",
    rating: 5,
    testimonial:
      "The restaurant website and reservation system they developed has streamlined our operations completely. Our customers love the new online ordering feature.",
    project: "Restaurant Website",
    date: "September 2024",
    featured: false,
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "CTO",
    company: "FinanceFlow",
    avatar: "/client-avatar-5.jpg",
    rating: 5,
    testimonial:
      "The crypto trading dashboard is exactly what we needed. Real-time data, beautiful charts, and rock-solid performance. They truly understand both design and functionality.",
    project: "Trading Dashboard",
    date: "August 2024",
    featured: true,
  },
  {
    id: 6,
    name: "James Miller",
    role: "Content Manager",
    company: "BlogCentral",
    avatar: "/client-avatar-6.png",
    rating: 5,
    testimonial:
      "Our new blog platform has made content management so much easier. The markdown editor and SEO features are fantastic. Great communication throughout the project.",
    project: "Blog Platform",
    date: "July 2024",
    featured: false,
  },
];
