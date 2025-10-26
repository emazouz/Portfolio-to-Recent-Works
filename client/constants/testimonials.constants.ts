import { Testimonial } from "@/types/index.types";

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    avatar: "/client-avatar-1.jpg",
    rating: 5,
    quote:
      "Working with this developer was an absolute pleasure. They delivered our e-commerce platform ahead of schedule and exceeded all our expectations. The attention to detail and code quality is outstanding.",
    project: "E-Commerce Platform",
    date: "December 2024",
    featured: true,
    caseStudy: {
      problem:
        "Legacy shopping cart was slow, causing 60% cart abandonment rate and losing customers to competitors",
      solution:
        "Built modern Next.js e-commerce platform with optimized checkout flow, server-side rendering, and integrated Stripe payment processing",
      result:
        "Launched 3 months early, 40% increase in conversion rates, cart abandonment reduced to 25%",
    },
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateLab",
    avatar: "/client-avatar-2.jpg",
    rating: 5,
    quote:
      "The SaaS dashboard they built for us has significantly improved our team's productivity. The user interface is intuitive and the performance is exceptional. Highly recommended!",
    project: "SaaS Dashboard",
    date: "November 2024",
    featured: true,
    caseStudy: {
      problem:
        "Team struggled with fragmented tools and no centralized analytics, leading to inefficient workflows and poor data visibility",
      solution:
        "Developed unified React dashboard with real-time analytics, custom reporting, and seamless third-party integrations",
      result:
        "35% improvement in team productivity, 80% reduction in time spent on reporting tasks",
    },
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCorp",
    avatar: "/client-avatar-3.jpg",
    rating: 5,
    quote:
      "Our new landing page has increased conversions by 40%! The design is modern, responsive, and perfectly captures our brand identity. Excellent work from start to finish.",
    project: "Landing Page Redesign",
    date: "October 2024",
    featured: false,
    caseStudy: {
      problem:
        "Outdated landing page with 2% conversion rate, high bounce rate, and poor mobile experience",
      solution:
        "Redesigned with modern UI/UX principles, A/B tested components, optimized page speed to under 2 seconds, and implemented conversion-focused copywriting",
      result:
        "40% increase in conversions, bounce rate decreased from 65% to 38%, mobile traffic up 55%",
    },
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Founder",
    company: "RestaurantPro",
    avatar: "/client-avatar-4.jpg",
    rating: 5,
    quote:
      "The restaurant website and reservation system they developed has streamlined our operations completely. Our customers love the new online ordering feature.",
    project: "Restaurant Website",
    date: "September 2024",
    featured: false,
    caseStudy: {
      problem:
        "Phone-only reservations causing bottlenecks during peak hours, no online ordering system, resulting in lost revenue",
      solution:
        "Created responsive restaurant website with integrated reservation system, online ordering with real-time menu updates, and automated email confirmations",
      result:
        "70% of reservations now online, 45% increase in orders, staff time saved by 20 hours per week",
    },
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "CTO",
    company: "FinanceFlow",
    avatar: "/client-avatar-5.jpg",
    rating: 5,
    quote:
      "The crypto trading dashboard is exactly what we needed. Real-time data, beautiful charts, and rock-solid performance. They truly understand both design and functionality.",
    project: "Trading Dashboard",
    date: "August 2024",
    featured: true,
    caseStudy: {
      problem:
        "Existing trading interface had delayed data feeds, poor charting, and couldn't handle high-frequency updates without crashing",
      solution:
        "Built high-performance dashboard using WebSocket connections, optimized React rendering with virtualization, and integrated TradingView charts",
      result:
        "Real-time data with <100ms latency, 99.9% uptime, supports 10,000+ concurrent users without performance degradation",
    },
  },
  {
    id: 6,
    name: "James Miller",
    role: "Content Manager",
    company: "BlogCentral",
    avatar: "/client-avatar-6.png",
    rating: 5,
    quote:
      "Our new blog platform has made content management so much easier. The markdown editor and SEO features are fantastic. Great communication throughout the project.",
    project: "Blog Platform",
    date: "July 2024",
    featured: false,
    caseStudy: {
      problem:
        "WordPress site was slow, difficult to customize, and lacked proper SEO tools, limiting content team productivity",
      solution:
        "Developed custom headless CMS with Next.js frontend, rich markdown editor, automated SEO optimization, and image compression pipeline",
      result:
        "Page load times improved by 60%, organic traffic increased 85% in 3 months, content publishing time cut in half",
    },
  },
];

export const CLIENT = [
  "/client-avatar-1.jpg",
  "/client-avatar-3.jpg",
  "/client-avatar-4.jpg",
  "/client-avatar-5.jpg",
];
