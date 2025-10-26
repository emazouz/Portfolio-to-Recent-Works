import {
  Code,
  Database,
  Cloud,
  Layers,
  Box,
  HelpCircle,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";


export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  faqs: FAQItem[];
}

export interface TechStack {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

export const FAQs_SECTION = [
  {
    question: "What's included with each template?",
    answer:
      "Each template includes the complete source code, documentation, design files (Figma), and lifetime updates. You also get email support for any questions.",
  },
  {
    question: "Can I customize the templates?",
    answer:
      "All templates are built with clean, well-documented code that's easy to customize. You can modify colors, layouts, components, and add your own features.",
  },
  {
    question: "Do you offer custom development services?",
    answer:
      "Yes, I offer custom web development services for clients who need something unique. This includes full-stack applications, API development, and UI/UX design.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "I primarily work with React, Next.js, TypeScript, Tailwind CSS, Node.js, and various databases. I stay up-to-date with the latest web technologies and best practices.",
  },
  {
    question: "How long does custom development take?",
    answer:
      "Project timelines vary based on complexity. Simple websites take 1-2 weeks, while complex applications can take 2-3 months. I provide detailed timelines during the consultation.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes, I offer maintenance packages for ongoing support, updates, and feature additions. Template purchases include 6 months of email support.",
  },
];


export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: "Frontend Development",
    icon: Code,
    gradient: "from-cyan-500 to-blue-600",
    faqs: [
      {
        question: "What frontend technologies do you use?",
        answer:
          "I specialize in Next.js 14 with App Router, React 18, TypeScript for type safety, and Tailwind CSS for rapid, professional styling. I also use shadcn/ui for pre-built components and state management solutions like Zustand or React Context API.",
      },
      {
        question: "Why do you prefer Next.js over plain React?",
        answer:
          "Next.js provides Server-Side Rendering (SSR), Static Site Generation (SSG), built-in API routes, automatic image optimization, and excellent SEO capabilities. The new App Router with React Server Components makes development faster and more efficient.",
      },
      {
        question: "Do you build responsive and mobile-friendly applications?",
        answer:
          "Absolutely! All projects follow a mobile-first approach using Tailwind CSS responsive utilities. I ensure optimal user experience across all devices, from mobile phones to large desktop screens.",
      },
      {
        question: "Can you optimize existing application performance?",
        answer:
          "Yes! I provide performance optimization including code splitting, lazy loading, image optimization, bundle size reduction, and Core Web Vitals improvements to enhance both SEO rankings and user experience.",
      },
    ],
  },
  {
    title: "Backend Development",
    icon: Layers,
    gradient: "from-green-500 to-emerald-600",
    faqs: [
      {
        question: "What backend technologies do you work with?",
        answer:
          "I specialize in Node.js with Express.js for simple, fast projects, and NestJS for large-scale enterprise applications requiring robust architecture. I build RESTful APIs with proper authentication, authorization, and comprehensive error handling.",
      },
      {
        question: "Why use NestJS over Express.js?",
        answer:
          "NestJS provides a structured, scalable architecture with built-in TypeScript support, dependency injection, modular design, and extensive decorators. It's ideal for enterprise applications, microservices, and projects requiring maintainability and testability.",
      },
      {
        question: "Do you implement authentication and authorization?",
        answer:
          "Yes! I implement secure authentication using JWT, OAuth 2.0, or NextAuth.js. I also build role-based access control (RBAC), session management, password hashing with bcrypt, and implement security best practices.",
      },
      {
        question: "Can you build real-time applications?",
        answer:
          "Definitely! I have experience with WebSockets, Socket.io, and Server-Sent Events (SSE) for building real-time features like live chat, notifications, collaborative editing, and real-time dashboards.",
      },
    ],
  },
  {
    title: "Database & ORM",
    icon: Database,
    gradient: "from-purple-500 to-pink-600",
    faqs: [
      {
        question: "Which databases do you work with?",
        answer:
          "I work with both SQL and NoSQL databases. For relational data, I use PostgreSQL with Prisma ORM for type-safe queries. For flexible, document-based data, I use MongoDB with Mongoose. I choose the database based on project requirements.",
      },
      {
        question: "What is Prisma and why do you use it?",
        answer:
          "Prisma is a modern ORM that provides type-safe database access, automatic migrations, intuitive data modeling, and excellent TypeScript integration. It simplifies database operations while preventing runtime errors and improving developer productivity.",
      },
      {
        question: "Can you design and optimize database schemas?",
        answer:
          "Yes! I design normalized database schemas, create efficient indexes, optimize queries, implement database relationships, and ensure data integrity. I also handle database migrations and versioning using Prisma Migrate.",
      },
      {
        question: "Do you implement database backup and recovery strategies?",
        answer:
          "Absolutely! I set up automated backup solutions, implement point-in-time recovery, configure replication for high availability, and ensure disaster recovery plans are in place to protect critical data.",
      },
    ],
  },
  {
    title: "DevOps & Deployment",
    icon: Cloud,
    gradient: "from-orange-500 to-red-600",
    faqs: [
      {
        question: "What DevOps tools and practices do you use?",
        answer:
          "I use Docker for containerization, AWS (EC2, S3, RDS, Lambda) for cloud infrastructure, and GitHub Actions for CI/CD pipelines. I implement automated testing, deployment workflows, and infrastructure as code for reliable releases.",
      },
      {
        question: "Can you containerize applications with Docker?",
        answer:
          "Yes! I create optimized Docker images, write docker-compose files for multi-container applications, implement multi-stage builds to reduce image size, and configure container orchestration for production environments.",
      },
      {
        question: "What AWS services do you work with?",
        answer:
          "I work with EC2 for compute, S3 for storage, RDS for managed databases, Lambda for serverless functions, CloudFront for CDN, Route 53 for DNS, and CloudWatch for monitoring. I also implement IAM policies for security.",
      },
      {
        question: "Do you set up CI/CD pipelines?",
        answer:
          "Absolutely! I create GitHub Actions workflows for automated testing, building, and deployment. This includes running tests, building Docker images, deploying to staging/production, and sending notifications on pipeline status.",
      },
    ],
  },
  {
    title: "API Development",
    icon: Zap,
    gradient: "from-yellow-500 to-amber-600",
    faqs: [
      {
        question: "What type of APIs do you build?",
        answer:
          "I primarily build RESTful APIs following industry standards with proper HTTP methods, status codes, and resource naming. I also implement GraphQL when needed, and create comprehensive API documentation using Swagger/OpenAPI.",
      },
      {
        question: "How do you ensure API security?",
        answer:
          "I implement multiple security layers including JWT authentication, rate limiting, CORS configuration, input validation, SQL injection prevention, XSS protection, HTTPS enforcement, and API key management for third-party access.",
      },
      {
        question: "Do you integrate third-party APIs?",
        answer:
          "Yes! I have experience integrating payment gateways (Stripe, PayPal), email services (SendGrid, AWS SES), cloud storage (AWS S3, Cloudinary), authentication providers (Google, GitHub), and various business APIs.",
      },
      {
        question: "Can you version and document APIs?",
        answer:
          "Definitely! I implement API versioning strategies (URL, header, or parameter-based), create interactive API documentation with Swagger/OpenAPI, and provide clear examples and error responses for all endpoints.",
      },
    ],
  },
  {
    title: "UI/UX Design",
    icon: Box,
    gradient: "from-pink-500 to-rose-600",
    faqs: [
      {
        question: "What's your approach to UI/UX design?",
        answer:
          "I follow a user-centered design approach that includes user research, wireframing, prototyping in Figma, and usability testing. I create intuitive interfaces using design systems, ensure accessibility compliance (WCAG), and focus on conversion optimization.",
      },
      {
        question: "Do you use design systems and component libraries?",
        answer:
          "Yes! I work with established design systems like Material Design and create custom design systems. I use Tailwind CSS with shadcn/ui for consistent, reusable components, and maintain design tokens for colors, typography, and spacing.",
      },
      {
        question: "Can you redesign existing applications?",
        answer:
          "Absolutely! I conduct UX audits to identify pain points, analyze user behavior, modernize visual design, improve navigation and information architecture, and enhance overall user experience while maintaining brand identity.",
      },
      {
        question: "What design tools do you use?",
        answer:
          "I primarily use Figma for UI design and prototyping, complemented by tools like Adobe XD for certain projects. For design handoff, I provide detailed specifications, component documentation, and collaborate closely with developers.",
      },
    ],
  },
  {
    title: "IT Solutions & Consulting",
    icon: Shield,
    gradient: "from-teal-500 to-cyan-600",
    faqs: [
      {
        question: "What IT consulting services do you provide?",
        answer:
          "I offer technical architecture consulting, technology stack recommendations, code audits and reviews, performance optimization strategies, security assessments, scalability planning, and digital transformation guidance for businesses.",
      },
      {
        question: "Can you help migrate legacy systems to modern technologies?",
        answer:
          "Yes! I specialize in modernizing legacy applications by assessing current systems, planning migration strategies, implementing new architectures with Next.js/NestJS, ensuring data integrity, and providing training for smooth transitions.",
      },
      {
        question: "Do you provide technical team leadership?",
        answer:
          "Absolutely! I can lead development teams, establish coding standards and best practices, implement code review processes, mentor junior developers, manage sprints using Agile methodologies, and ensure project delivery on time.",
      },
      {
        question: "What about cloud infrastructure and optimization?",
        answer:
          "I design and implement scalable cloud architectures on AWS, optimize infrastructure costs, set up auto-scaling and load balancing, implement monitoring with CloudWatch, ensure high availability, and create disaster recovery plans.",
      },
    ],
  },
  {
    title: "General Questions",
    icon: HelpCircle,
    gradient: "from-indigo-500 to-purple-600",
    faqs: [
      {
        question: "What's your development workflow?",
        answer:
          "I follow Agile methodology with: 1) Requirements gathering and technical planning, 2) Architecture design and tech stack selection, 3) Iterative development with regular commits, 4) Code review and testing, 5) Staging deployment, 6) Production release, 7) Monitoring and maintenance.",
      },
      {
        question: "How do you ensure code quality?",
        answer:
          "I use ESLint and Prettier for code formatting, write unit and integration tests with Jest, implement TypeScript for type safety, conduct code reviews, follow SOLID principles, and use Git with meaningful commit messages.",
      },
      {
        question: "Can you work with existing codebases?",
        answer:
          "Yes! I'm experienced in analyzing, refactoring, and improving existing code. I can add features, fix bugs, optimize performance, migrate to newer technologies, and improve code architecture while maintaining backward compatibility.",
      },
      {
        question: "What's your pricing model?",
        answer:
          "I offer flexible pricing including fixed-price projects, hourly rates, and monthly retainers. Pricing depends on project complexity, timeline, and scope. Contact me for a detailed quote tailored to your specific needs.",
      },
    ],
  },
];

export const TECH_STACK: TechStack[] = [
  { name: "Next.js", icon: Code, gradient: "from-cyan-400 to-blue-500" },
  { name: "NestJS", icon: Layers, gradient: "from-red-400 to-rose-500" },
  {
    name: "PostgreSQL",
    icon: Database,
    gradient: "from-blue-400 to-indigo-500",
  },
  { name: "Docker", icon: Box, gradient: "from-cyan-500 to-blue-600" },
  { name: "TypeScript", icon: Shield, gradient: "from-blue-500 to-purple-500" },
  {
    name: "Prisma ORM",
    icon: Database,
    gradient: "from-indigo-400 to-purple-500",
  },
  { name: "AWS", icon: Cloud, gradient: "from-orange-400 to-red-500" },
  {
    name: "GitHub Actions",
    icon: Zap,
    gradient: "from-yellow-400 to-orange-500",
  },
  { name: "Tailwind CSS", icon: Code, gradient: "from-teal-400 to-cyan-500" },
  {
    name: "MongoDB",
    icon: Database,
    gradient: "from-green-500 to-emerald-600",
  },
  { name: "Figma", icon: Box, gradient: "from-purple-400 to-pink-500" },
  { name: "React", icon: Code, gradient: "from-sky-400 to-blue-500" },
];
