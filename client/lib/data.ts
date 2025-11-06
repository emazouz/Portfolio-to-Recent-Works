export const projects = [
  [
    {
      id: 1,
      title_en: "Stripe Payment Integration Platform",
      title_ar: "منصة دمج الدفع عبر Stripe",
      description_en:
        "Enterprise-grade payment processing system handling $50M+ in annual transactions. Features real-time fraud detection, multi-currency support, and automated reconciliation across 45+ countries.",
      description_ar:
        "نظام معالجة دفع على مستوى المؤسسات يتعامل مع 50+ مليون دولار في المعاملات السنوية. يتميز باكتشاف الاحتيال في الوقت الفعلي، دعم العملات المتعددة، والمصالحة الآلية عبر 45+ دولة.",
      imageUrl:
        "https://images.unsplash.com/photo-1614114888286-f8fcda546c1c?w=1200&q=80",
      category: "WEB_DEVELOPMENT",
      status: "COMPLETED",
      liveUrl: "https://payments.enterprise.example.com",
      githubUrl: "https://github.com/enterprise/payment-platform",
      technologies: [
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "Stripe API",
        "WebSockets",
        "Docker",
      ],
      featured: true,
      sortOrder: 1,
      rating: 4.95,
      ratingsCount: 420,
      slug_en: "stripe-payment-integration",
      slug_ar: "منصة-دمج-الدفع",
      metaTitle_en: "Enterprise Payment Processing with Stripe",
      metaTitle_ar: "معالجة الدفع على مستوى المؤسسات",
      metaDesc_en: `## Enterprise Payment Processing System

### Overview
A robust, scalable payment infrastructure built for high-volume enterprises, processing over **$50 million** in annual transactions with industry-leading security and reliability standards.

### Key Features
- **Transaction Volume**: Handles **$50M+** in annual transactions securely
- **Fraud Detection**: Real-time ML-powered fraud detection with <10ms latency
- **Multi-Currency**: Support for 150+ currencies with automatic conversion
- **Global Reach**: Operating across 45+ countries with localized payment methods
- **Compliance**: PCI-DSS Level 1, SOC 2 Type II, and GDPR certified
- **Automated Reconciliation**: Smart matching and dispute resolution system

### Architecture Highlights
\`\`\`
- 45+ countries supported
- 99.99% uptime SLA guaranteed
- Distributed across 5 cloud regions (AWS)
- Real-time reconciliation system
- Horizontal scaling capability
- Webhook-driven event architecture
\`\`\`

### Performance Metrics
| Metric | Value |
|--------|-------|
| Transactions/sec | 50K+ |
| Processing Time | <500ms |
| Success Rate | 99.8% |
| Fraud Detection | <10ms |
| Resolution Time | <24hrs |
| API Response Time | <100ms |

### Security Features
- End-to-end encryption (AES-256)
- Two-factor authentication (2FA)
- Tokenization for sensitive data
- Real-time anomaly detection
- Automated security audits
- IP whitelisting and rate limiting

### Integration Capabilities
- **Payment Methods**: Credit/Debit cards, ACH, SEPA, Local payment methods
- **Webhooks**: Real-time event notifications
- **API Access**: RESTful APIs with comprehensive documentation
- **SDKs**: Available for JavaScript, Python, Ruby, PHP
- **Mobile**: iOS and Android SDK support

### Implementation Stack
- **Backend**: TypeScript + Node.js cluster with PM2
- **Database**: PostgreSQL 14 with read replicas and sharding
- **Caching**: Redis for transaction states and session management
- **Message Queue**: RabbitMQ for asynchronous processing
- **APIs**: Stripe Connect, Payment Intents, Webhook handlers, REST endpoints
- **Monitoring**: Datadog, Sentry for error tracking
- **Deployment**: Docker + Kubernetes on AWS EKS
- **CI/CD**: GitHub Actions with automated testing

### Business Impact
- Reduced payment processing time by 60%
- Decreased fraud losses by 85%
- Increased successful transaction rate from 94% to 99.8%
- Saved $2M+ annually in manual reconciliation costs
- Enabled expansion to 30 new markets`,

      metaDesc_ar: `## نظام معالجة الدفع على مستوى المؤسسات

### نظرة عامة
بنية تحتية قوية وقابلة للتطوير للدفع مصممة للمؤسسات ذات الحجم الكبير، تعالج أكثر من **50 مليون دولار** من المعاملات السنوية مع معايير أمان وموثوقية رائدة في الصناعة.

### الميزات الرئيسية
- **حجم المعاملات**: معالجة **50+ مليون دولار** من المعاملات السنوية بأمان
- **كشف الاحتيال**: كشف احتيال مدعوم بالذكاء الاصطناعي في الوقت الفعلي بزمن وصول <10 مللي ثانية
- **العملات المتعددة**: دعم أكثر من 150 عملة مع التحويل التلقائي
- **الوصول العالمي**: العمل في أكثر من 45 دولة مع طرق دفع محلية
- **الامتثال**: معتمد PCI-DSS المستوى 1، SOC 2 النوع II، و GDPR
- **المصالحة الآلية**: نظام مطابقة ذكي وحل النزاعات

### أبرز معالم البنية
\`\`\`
- دعم أكثر من 45 دولة
- ضمان وقت تشغيل 99.99%
- موزع عبر 5 مناطق سحابية (AWS)
- نظام مصالحة في الوقت الفعلي
- قدرة التوسع الأفقي
- بنية الأحداث المدفوعة بـ Webhook
\`\`\`

### مقاييس الأداء
| المقياس | القيمة |
|--------|-------|
| المعاملات/الثانية | 50K+ |
| وقت المعالجة | <500 مللي ثانية |
| معدل النجاح | 99.8% |
| كشف الاحتيال | <10 مللي ثانية |
| وقت الحل | <24 ساعة |
| وقت استجابة API | <100 مللي ثانية |

### ميزات الأمان
- التشفير من طرف إلى طرف (AES-256)
- المصادقة الثنائية (2FA)
- ترميز البيانات الحساسة
- كشف الشذوذ في الوقت الفعلي
- تدقيقات أمنية تلقائية
- القائمة البيضاء لعناوين IP وتحديد المعدل

### قدرات التكامل
- **طرق الدفع**: بطاقات الائتمان/الخصم، ACH، SEPA، طرق الدفع المحلية
- **Webhooks**: إشعارات الأحداث في الوقت الفعلي
- **الوصول إلى API**: واجهات برمجة تطبيقات RESTful مع توثيق شامل
- **SDKs**: متاح لـ JavaScript، Python، Ruby، PHP
- **الهاتف المحمول**: دعم SDK لنظامي iOS و Android

### مجموعة التطبيق
- **الخلفية**: TypeScript + مجموعة Node.js مع PM2
- **قاعدة البيانات**: PostgreSQL 14 مع نسخ القراءة والتجزئة
- **التخزين المؤقت**: Redis لحالات المعاملات وإدارة الجلسات
- **قائمة انتظار الرسائل**: RabbitMQ للمعالجة غير المتزامنة
- **واجهات برمجة التطبيقات**: Stripe Connect، Payment Intents، معالجات Webhook، نقاط نهاية REST
- **المراقبة**: Datadog، Sentry لتتبع الأخطاء
- **النشر**: Docker + Kubernetes على AWS EKS
- **CI/CD**: GitHub Actions مع الاختبار التلقائي

### التأثير على الأعمال
- تقليل وقت معالجة الدفع بنسبة 60%
- انخفاض خسائر الاحتيال بنسبة 85%
- زيادة معدل المعاملات الناجحة من 94% إلى 99.8%
- توفير أكثر من 2 مليون دولار سنويًا في تكاليف المصالحة اليدوية
- تمكين التوسع في 30 سوقًا جديدًا`,

      createdAt: new Date("2025-08-01"),
      updatedAt: new Date("2025-10-31"),
    },
    {
      id: 2,
      title_en: "Aura Fashion - Headless E-commerce Platform",
      title_ar: "أورا فاشن - منصة تجارة إلكترونية رأسية",
      description_en:
        "High-performance headless e-commerce site for a global fashion brand. Features 5,000+ SKUs, AI-powered recommendations, and 100K+ monthly visitors.",
      description_ar:
        "موقع تجارة إلكترونية رأسي عالي الأداء لعلامة تجارية عالمية للأزياء. يعرض 5,000+ منتج، توصيات مدعومة بالذكاء الاصطناعي، ويستقبل 100 ألف+ زائر شهريًا.",
      imageUrl:
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&q=80",
      category: "WEB_DEVELOPMENT",
      status: "COMPLETED",
      liveUrl: "https://www.aura-fashion-demo.com",
      githubUrl: "https://github.com/dev/aura-headless-commerce",
      technologies: [
        "Next.js",
        "TypeScript",
        "Shopify API",
        "PostgreSQL",
        "Tailwind CSS",
        "Vercel",
        "GraphQL",
      ],
      featured: true,
      sortOrder: 2,
      rating: 4.9,
      ratingsCount: 310,
      slug_en: "aura-fashion-headless-ecommerce",
      slug_ar: "أورا-فاشن-تجارة-إلكترونية",
      metaTitle_en: "Aura Fashion Headless E-commerce Build",
      metaTitle_ar: "تطوير منصة أورا فاشن للتجارة الإلكترونية الرأسية",
      metaDesc_en:
        "## Headless E-commerce Platform for Aura Fashion\n### Overview\nA blazing-fast, scalable, and visually stunning headless e-commerce platform for the global fashion brand, Aura. Built using Next.js for SSG/ISR and Shopify's API for backend management, this platform supports over **5,000 SKUs** and **100K+** monthly visitors.\n### Key Features\n- **Static Site Generation (SSG)**: Sub-500ms page loads globally.\n- **AI-Powered Recommendations**: Personalized product suggestions.\n- **Headless CMS**: Decoupled backend (Shopify API) for easy content updates.\n- **Global CDN**: Deployed on Vercel for instant-loading user experience.\n- **Responsive Design**: Flawless experience on all devices.\n### Architecture Highlights\n```\n- Frontend: Next.js 14 (App Router) + TypeScript\n- Styling: Tailwind CSS\n- State Management: Zustand\n- Backend: Shopify Storefront API (GraphQL)\n- User Data: PostgreSQL (via Supabase)\n- Deployment: Vercel\n```\n### Performance Metrics\n| Metric | Value |\n|--------|-------|\n| Page Load Time | < 500ms |\n| Lighthouse Score | 98 (Perf) |\n| Uptime | 99.99% |\n| Conversion Rate | +40% |\n| AOV | +30% |\n### Tech Stack\n- **Frontend**: Next.js, TypeScript, React\n- **Styling**: Tailwind CSS, Framer Motion\n- **API**: GraphQL (Shopify Storefront API)\n- **Database**: PostgreSQL (Supabase for user auth/data)\n- **Deployment**: Vercel\n### Business Impact\n- Increased conversion rate by **40%** year-over-year.\n- Improved Average Order Value (AOV) by **30%** through AI recommendations.\n- Reduced page load time by **70%**, boosting SEO rankings.",
      metaDesc_ar:
        "## منصة تجارة إلكترونية رأسية لـ Aura Fashion\n### نظرة عامة\nمنصة تجارة إلكترونية سريعة للغاية، قابلة للتطوير، ومذهلة بصريًا لعلامة الأزياء العالمية Aura. تم بناؤها باستخدام Next.js لـ SSG/ISR وواجهة برمجة تطبيقات Shopify للإدارة الخلفية، وتدعم هذه المنصة أكثر من **5,000 منتج** و**100 ألف+** زائر شهريًا.\n### الميزات الرئيسية\n- **توليد المواقع الثابتة (SSG)**: تحميل صفحات في أقل من 500 مللي ثانية عالميًا.\n- **توصيات مدعومة بالذكاء الاصطناعي**: اقتراحات منتجات مخصصة.\n- **نظام إدارة محتوى رأسي**: خلفية مفصولة (Shopify API) لتحديثات سهلة للمحتوى.\n- **شبكة توصيل محتوى عالمية (CDN)**: منشورة على Vercel لتجربة مستخدم سريعة التحميل.\n- **تصميم مستجيب**: تجربة خالية من العيوب على جميع الأجهزة.\n### أبرز ميزات البنية\n```\n- الواجهة الأمامية: Next.js 14 (App Router) + TypeScript\n- التصميم: Tailwind CSS\n- إدارة الحالة: Zustand\n- الواجهة الخلفية: Shopify Storefront API (GraphQL)\n- بيانات المستخدم: PostgreSQL (عبر Supabase)\n- النشر: Vercel\n```\n### مؤشرات الأداء\n| المؤشر | القيمة |\n|--------|-------|\n| وقت تحميل الصفحة | < 500ms |\n| درجة Lighthouse | 98 (أداء) |\n| وقت التشغيل | 99.99% |\n| معدل التحويل | +40% |\n| متوسط قيمة الطلب | +30% |\n### التقنيات المستخدمة\n- **الواجهة الأمامية**: Next.js, TypeScript, React\n- **التصميم**: Tailwind CSS, Framer Motion\n- **واجهة برمجة التطبيقات**: GraphQL (Shopify Storefront API)\n- **قاعدة البيانات**: PostgreSQL (Supabase لتوثيق/بيانات المستخدم)\n- **النشر**: Vercel\n### التأثير على الأعمال\n- زيادة معدل التحويل بنسبة **40%** على أساس سنوي.\n- تحسين متوسط قيمة الطلب (AOV) بنسبة **30%** من خلال توصيات الذكاء الاصطناعي.\n- تقليل وقت تحميل الصفحة بنسبة **70%**، مما عزز تصنيفات SEO.",
      createdAt: "2025-09-15",
      updatedAt: "2025-09-20",
    },
    {
      id: 3,
      title_en: "SyncTask - Real-Time Collaborative Tool",
      title_ar: "SyncTask - أداة تعاونية في الوقت الفعلي",
      description_en:
        "A SaaS task management app enabling real-time team collaboration. Features include Kanban boards, task assignments, and live chat, supporting 500+ active teams.",
      description_ar:
        "تطبيق لإدارة المهام كخدمة (SaaS) يتيح التعاون الفوري بين الفرق. يتضمن لوحات كانبان، تعيين المهام، ودردشة حية، ويدعم 500+ فريق نشط.",
      imageUrl:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
      category: "WEB_DEVELOPMENT",
      status: "COMPLETED",
      liveUrl: "https://app.synctask.example.com",
      githubUrl: "https://github.com/dev/synctask-app",
      technologies: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Socket.IO",
        "JWT",
        "Redis",
      ],
      featured: false,
      sortOrder: 3,
      rating: 4.8,
      ratingsCount: 255,
      slug_en: "synctask-real-time-collaboration",
      slug_ar: "synctask-أداة-تعاونية",
      metaTitle_en: "SyncTask: Real-Time Task Management App",
      metaTitle_ar: "SyncTask: تطبيق إدارة مهام في الوقت الفعلي",
      metaDesc_en:
        "## SyncTask: Collaborative Task Manager\n### Overview\nA real-time, web-based task management application inspired by Trello and Asana. Built with the MERN stack and WebSockets, SyncTask allows teams to collaborate seamlessly with instant updates on boards, tasks, and comments. Currently supports over **500 active teams** and **5,000+ users**.\n### Key Features\n- **Real-time Updates**: Changes propagated to all connected clients in **< 100ms** via Socket.IO.\n- **Drag-and-Drop Kanban**: Intuitive interface for managing task workflows.\n- **User Authentication**: Secure JWT (JSON Web Token) authentication and authorization.\n- **In-app Notifications**: Real-time alerts for @mentions, task assignments, and deadlines.\n- **MongoDB Atlas**: Scalable, cloud-native database for flexible data schemas.\n### Architecture Highlights\n```\n- Stack: MERN (MongoDB, Express, React, Node.js)\n- Real-time Engine: Socket.IO\n- Caching: Redis for session management and fast-access data\n- Database: MongoDB Atlas (M10 Cluster)\n- Authentication: JWT + bcrypt\n- Deployment: Docker Compose on DigitalOcean\n```\n### Performance Metrics\n| Metric | Value |\n|--------|-------|\n| WebSocket Latency | < 100ms |\n| DB Query Time | < 50ms (avg) |\n| Active Connections | 2,000+ (peak) |\n| API Response Time | < 80ms |\n### Tech Stack\n- **Frontend**: React (Context API), React-Router, Styled-Components\n- **Backend**: Node.js, Express.js\n- **Database**: MongoDB (Mongoose)\n- **Real-time**: Socket.IO\n- **Authentication**: JSON Web Token (JWT), bcrypt.js\n- **Caching**: Redis\n- **Deployment**: Docker, DigitalOcean Droplet\n### Project Challenges\n- **Scaling WebSockets**: Managing thousands of persistent connections efficiently.\n- **Data Consistency**: Ensuring data integrity across multiple clients viewing the same data in real-time.\n- **Optimistic UI**: Implementing UI updates that feel instantaneous while data is confirmed by the server.",
      metaDesc_ar:
        "## SyncTask: مدير مهام تعاوني\n### نظرة عامة\nتطبيق إدارة مهام قائم على الويب في الوقت الفعلي مستوحى من Trello و Asana. تم بناؤه باستخدام MERN stack و WebSockets، ويتيح SyncTask للفرق التعاون بسلاسة مع تحديثات فورية على اللوحات والمهام والتعليقات. يدعم حاليًا أكثر من **500 فريق نشط** و**5,000+ مستخدم**.\n### الميزات الرئيسية\n- **تحديثات في الوقت الفعلي**: نشر التغييرات لجميع العملاء المتصلين في **< 100 مللي ثانية** عبر Socket.IO.\n- **لوحات كانبان بالسحب والإفلات**: واجهة بديهية لإدارة تدفقات العمل للمهام.\n- **توثيق المستخدم**: توثيق وتفويض آمن باستخدام JWT (JSON Web Token).\n- **إشعارات داخل التطبيق**: تنبيهات فورية للإشارات (@mentions)، تعيينات المهام، والمواعيد النهائية.\n- **MongoDB Atlas**: قاعدة بيانات سحابية قابلة للتطوير لمخططات بيانات مرنة.\n### أبرز ميزات البنية\n```\n- الحزمة: MERN (MongoDB, Express, React, Node.js)\n- محرك الوقت الفعلي: Socket.IO\n- التخزين المؤقت: Redis لإدارة الجلسات والبيانات سريعة الوصول\n- قاعدة البيانات: MongoDB Atlas (M10 Cluster)\n- التوثيق: JWT + bcrypt\n- النشر: Docker Compose على DigitalOcean\n```\n### مؤشرات الأداء\n| المؤشر | القيمة |\n|--------|-------|\n| زمن استجابة WebSocket | < 100ms |\n| وقت استعلام قاعدة البيانات | < 50ms (متوسط) |\n| الاتصالات النشطة | 2,000+ (ذروة) |\n| وقت استجابة API | < 80ms |\n### التقنيات المستخدمة\n- **الواجهة الأمامية**: React (Context API), React-Router, Styled-Components\n- **الواجهة الخلفية**: Node.js, Express.js\n- **قاعدة البيانات**: MongoDB (Mongoose)\n- **الوقت الفعلي**: Socket.IO\n- **التوثيق**: JSON Web Token (JWT), bcrypt.js\n- **التخزين المؤقت**: Redis\n- **النشر**: Docker, DigitalOcean Droplet\n### تحديات المشروع\n- **توسيع نطاق WebSockets**: إدارة آلاف الاتصالات المستمرة بكفاءة.\n- **اتساق البيانات**: ضمان سلامة البيانات عبر عملاء متعددين يشاهدون نفس البيانات في الوقت الفعلي.\n- **واجهة مستخدم متفائلة**: تنفيذ تحديثات واجهة المستخدم التي تبدو فورية بينما يتم تأكيد البيانات من قبل الخادم.",
      createdAt: "2025-06-10",
      updatedAt: "2025-06-12",
    },
    {
      id: 4,
      title_en: "Momentum - B2B Sales Analytics Dashboard",
      title_ar: "Momentum - لوحة تحكم تحليلات المبيعات B2B",
      description_en:
        "An interactive B2B analytics dashboard aggregating 10+ data sources (Salesforce, Google Analytics, etc.). Provides real-time KPIs and trend analysis for executive decision-making.",
      description_ar:
        "لوحة تحكم تحليلية تفاعلية B2B تجمع 10+ مصادر بيانات (مثل Salesforce و Google Analytics). توفر مؤشرات أداء رئيسية وتحليلات اتجاهات فورية لدعم اتخاذ القرار التنفيذي.",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      category: "WEB_DEVELOPMENT",
      status: "COMPLETED",
      liveUrl: "https://dash.momentum-analytics.example.com",
      githubUrl: "https://github.com/dev/momentum-dashboard",
      technologies: [
        "Vue.js",
        "D3.js",
        "Python",
        "Flask",
        "MySQL",
        "Chart.js",
        "REST API",
      ],
      featured: true,
      sortOrder: 4,
      rating: 4.85,
      ratingsCount: 190,
      slug_en: "momentum-b2b-analytics-dashboard",
      slug_ar: "momentum-لوحة-تحكم-تحليلات",
      metaTitle_en: "Momentum: B2B Sales Data Visualization",
      metaTitle_ar: "Momentum: عرض مرئي لبيانات المبيعات B2B",
      metaDesc_en:
        "## Momentum: B2B Sales Analytics Dashboard\n### Overview\nA comprehensive B2B data visualization tool designed for C-suite executives. Momentum aggregates data from over **10 disparate sources** (including Salesforce, Google Analytics, and internal databases) into a single, unified dashboard. It processes over **1M data points** daily to provide actionable insights.\n### Key Features\n- **Unified Dashboard**: Single source of truth for sales, marketing, and support KPIs.\n- **10+ API Integrations**: Connects to Salesforce, HubSpot, GA, Stripe, and more.\n- **Custom Interactive Charts**: Built with D3.js for complex, drill-down visualizations.\n- **Data Export**: PDF/CSV report generation for meetings.\n- **Role-Based Access Control (RBAC)**: Securely limits data visibility by user role.\n### Data Pipeline\n```\n- Data Ingestion: Python (Flask) API endpoints\n- ETL Process: Nightly Python scripts (Pandas) for data cleaning\n- Data Warehouse: MySQL 8\n- API Layer: REST API (Flask) serving aggregated data to frontend\n- Frontend: Vue.js\n```\n### Performance Metrics\n| Metric | Value |\n|--------|-------|\n| Data Refresh Rate | 5 minutes (real-time sources) |\n| Chart Load Time | < 1 second |\n| Data Points Processed | 1M+ daily |\n| Data Accuracy | 99.9% |\n### Tech Stack\n- **Frontend**: Vue.js (Vue 3), Vuex, Vue Router\n- **Data Visualization**: D3.js (for custom SVGs), Chart.js (for standard charts)\n- **Backend**: Python, Flask (REST API)\n- **Database**: MySQL 8\n- **ETL**: Pandas, NumPy\n- **Deployment**: Docker + Nginx on AWS EC2\n### Business Impact\n- Reduced manual reporting time for the sales team from 10 hours/week to **0**.\n- Identified **$1.2M** in new cross-sell opportunities by correlating data sources.\n- Increased executive data-driven decision-making speed by **75%**.",
      metaDesc_ar:
        "## Momentum: لوحة تحكم تحليلات المبيعات B2B\n### نظرة عامة\nأداة عرض بيانات B2B شاملة مصممة للمديرين التنفيذيين. تقوم Momentum بتجميع البيانات من أكثر من **10 مصادر متباينة** (بما في ذلك Salesforce و Google Analytics وقواعد البيانات الداخلية) في لوحة تحكم واحدة موحدة. تعالج أكثر من **مليون نقطة بيانات** يوميًا لتقديم رؤى قابلة للتنفيذ.\n### الميزات الرئيسية\n- **لوحة تحكم موحدة**: مصدر واحد للحقيقة لمؤشرات الأداء الرئيسية للمبيعات والتسويق والدعم.\n- **10+ تكاملات API**: يتصل بـ Salesforce, HubSpot, GA, Stripe، والمزيد.\n- **مخططات تفاعلية مخصصة**: مبنية باستخدام D3.js لتصورات معقدة قابلة للتفصيل.\n- **تصدير البيانات**: إنشاء تقارير PDF/CSV للاجتماعات.\n- **التحكم في الوصول المستند إلى الأدوار (RBAC)**: يحد بشكل آمن من رؤية البيانات حسب دور المستخدم.\n### خط أنابيب البيانات\n```\n- استيعاب البيانات: نقاط نهاية API بلغة Python (Flask)\n- عملية ETL: نصوص Python ليلية (Pandas) لتنظيف البيانات\n- مستودع البيانات: MySQL 8\n- طبقة API: REST API (Flask) تخدم البيانات المجمعة للواجهة الأمامية\n- الواجهة الأمامية: Vue.js\n```\n### مؤشرات الأداء\n| المؤشر | القيمة |\n|--------|-------|\n| معدل تحديث البيانات | 5 دقائق (مصادر الوقت الفعلي) |\n| وقت تحميل المخطط | < 1 ثانية |\n| نقاط البيانات المعالجة | 1 مليون+ يوميًا |\n| دقة البيانات | 99.9% |\n### التقنيات المستخدمة\n- **الواجهة الأمامية**: Vue.js (Vue 3), Vuex, Vue Router\n- **عرض البيانات**: D3.js (لرسومات SVG المخصصة), Chart.js (للمخططات القياسية)\n- **الواجهة الخلفية**: Python, Flask (REST API)\n- **قاعدة البيانات**: MySQL 8\n- **ETL**: Pandas, NumPy\n- **النشر**: Docker + Nginx على AWS EC2\n### التأثير على الأعمال\n- تقليل وقت إعداد التقارير اليدوية لفريق المبيعات من 10 ساعات/أسبوع إلى **0**.\n- تحديد **1.2 مليون دولار** من فرص البيع المتقاطع الجديدة عن طريق ربط مصادر البيانات.\n- زيادة سرعة اتخاذ القرارات التنفيذية المستندة إلى البيانات بنسبة **75%**.",
      createdAt: "2025-03-01",
      updatedAt: "2025-03-05",
    },
  ],
];

export const blogs = [
  {
    id: 1,
    title_en: "Building Scalable Systems: From Monolith to Microservices",
    title_ar: "بناء الأنظمة القابلة للتوسع: من المونولث إلى الخدمات الدقيقة",
    content_en:
      "A comprehensive guide on transitioning legacy monolithic applications to microservices architecture. Covers domain-driven design, API versioning strategies, distributed transactions, and observability. Includes real case studies from companies handling 100M+ daily requests.",
    content_ar:
      "دليل شامل حول الانتقال من تطبيقات المونولث القديمة إلى معمارية الخدمات الدقيقة. يغطي تصميم موجه بالمجال، استراتيجيات إصدار API، المعاملات الموزعة، والقابلية للمراقبة.",
    slug: "scalable-systems-microservices-transition",
    excerpt_en:
      "Learn how to transition from monolithic to microservices architecture with real-world case studies and best practices.",
    excerpt_ar:
      "تعلم كيفية الانتقال من المونولث إلى الخدمات الدقيقة مع دراسات حالة واقعية.",
    category: "WEB_DEVELOPMENT",
    status: "COMPLETED",
    authorId: "author_enterprise_001",
    published: true,
    featured: true,
    metaTitle_en: "Microservices Architecture Guide",
    metaTitle_ar: "دليل معمارية الخدمات الدقيقة",
    metaDesc_en:
      "Master the transition to microservices with DDD, API versioning, distributed transactions, and observability practices.",
    metaDesc_ar: "إتقان الانتقال إلى الخدمات الدقيقة مع أفضل الممارسات.",
    tags: ["Microservices", "Architecture", "Scalability", "DDD", "API Design"],
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    ],
    readTime: 35,
    views: 45230,
    likes: 3240,
    keywords: [
      "microservices",
      "architecture",
      "scalability",
      "ddd",
      "api",
      "distributed systems",
    ],
    publishDate: new Date("2025-09-10"),
    createdAt: new Date("2025-09-08"),
    updatedAt: new Date("2025-10-31"),
    author: {
      id: "author_enterprise_001",
      name: "Dr. Alex Chen",
      email: "alex.chen@enterprise.dev",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    comments: [
      {
        id: 1001,
        blogId: 1,
        userId: "user_123",
        name: "Sarah Mitchell",
        email: "sarah@tech.com",
        content:
          "Outstanding breakdown of DDD principles. This article saved our team months of architectural confusion.",
        approved: true,
        parentId: null,
        createdAt: new Date("2025-09-12"),
        updatedAt: new Date("2025-09-12"),
        replies: [],
      },
    ],
    userLiked: true,
  },
  {
    id: 2,
    title_en: "Zero-Trust Security: Implementing Defense in Depth",
    title_ar: "أمان بدون ثقة: تنفيذ الدفاع متعدد الطبقات",
    content_en:
      "Modern security requires a zero-trust approach. This deep dive covers identity verification, network segmentation, encryption protocols, and incident response. Features implementation patterns for OAuth 2.0, mTLS, and RBAC across cloud-native environments.",
    content_ar:
      "يتطلب الأمان الحديث نهج بدون ثقة. يغطي التحقق من الهوية، تقسيم الشبكة، بروتوكولات التشفير، والاستجابة للحوادث.",
    slug: "zero-trust-security-defense-depth",
    excerpt_en:
      "Master zero-trust security architecture with OAuth 2.0, mTLS, RBAC, and incident response strategies.",
    excerpt_ar: "إتقان معمارية الأمان بدون ثقة مع OAuth و mTLS و RBAC.",
    category: "UI_UX_DESIGN",
    status: "COMPLETED",
    authorId: "author_enterprise_002",
    published: true,
    featured: true,
    metaTitle_en: "Zero-Trust Security Implementation",
    metaTitle_ar: "تنفيذ أمان بدون ثقة",
    metaDesc_en:
      "Comprehensive guide to zero-trust security with OAuth 2.0, mTLS, RBAC, and defense-in-depth strategies.",
    metaDesc_ar:
      "دليل شامل لأمان بدون ثقة مع استراتيجيات الدفاع متعدد الطبقات.",
    tags: ["Security", "Zero-Trust", "OAuth", "mTLS", "RBAC", "Cloud"],
    imageUrl:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
    ],
    readTime: 28,
    views: 38450,
    likes: 2890,
    keywords: ["security", "zero-trust", "oauth", "mtls", "rbac", "encryption"],
    publishDate: new Date("2025-08-25"),
    createdAt: new Date("2025-08-22"),
    updatedAt: new Date("2025-10-28"),
    author: {
      id: "author_enterprise_002",
      name: "Dr. Rebecca Torres",
      email: "rebecca@security-lab.io",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
    comments: [],
    userLiked: false,
  },
  {
    id: 3,
    title_en: "High-Performance Databases: PostgreSQL Optimization at Scale",
    title_ar: "قواعد البيانات عالية الأداء: تحسين PostgreSQL على نطاق واسع",
    content_en:
      "PostgreSQL powers millions of applications but requires careful tuning for scale. This guide covers query optimization, indexing strategies, replication configurations, and connection pooling. Real-world benchmarks handling 500K+ TPS (transactions per second).",
    content_ar:
      "يستخدم PostgreSQL ملايين التطبيقات ولكن يتطلب ضبط دقيق للمقياس. يغطي تحسين الاستعلام، استراتيجيات الفهرسة، وتكوينات النسخ المتماثل.",
    slug: "postgresql-optimization-scale",
    excerpt_en:
      "Master PostgreSQL optimization for handling 500K+ TPS with query tuning, indexing, and replication strategies.",
    excerpt_ar: "إتقان تحسين PostgreSQL للتعامل مع 500000+ معاملة في الثانية.",
    category: "DESKTOP_APP",
    status: "PLANNING",
    authorId: "author_enterprise_003",
    published: true,
    featured: false,
    metaTitle_en: "PostgreSQL Performance at Scale",
    metaTitle_ar: "أداء PostgreSQL على نطاق واسع",
    metaDesc_en:
      "Optimize PostgreSQL for high-performance applications handling 500K+ transactions per second.",
    metaDesc_ar: "تحسين PostgreSQL للتطبيقات عالية الأداء.",
    tags: [
      "PostgreSQL",
      "Databases",
      "Performance",
      "Query Optimization",
      "Replication",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=80",
    ],
    readTime: 32,
    views: 52120,
    likes: 3560,
    keywords: [
      "postgresql",
      "database",
      "performance",
      "optimization",
      "scaling",
      "tps",
    ],
    publishDate: new Date("2025-07-30"),
    createdAt: new Date("2025-07-28"),
    updatedAt: new Date("2025-10-20"),
    author: {
      id: "author_enterprise_003",
      name: "James Wilson",
      email: "james.wilson@db-experts.com",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    comments: [],
    userLiked: false,
  },
  {
    id: 4,
    title_en: "Advanced TypeScript: Building Type-Safe Applications",
    title_ar: "TypeScript المتقدم: بناء تطبيقات آمنة من حيث النوع",
    content_en:
      "Move beyond basic TypeScript into advanced patterns including generics, conditional types, mapped types, and utility types. Build type-safe API clients, form validation, and state management with zero runtime overhead.",
    content_ar:
      "تجاوز TypeScript الأساسي نحو الأنماط المتقدمة بما في ذلك العامات والأنواع الشرطية. بناء عملاء API آمنة من حيث النوع.",
    slug: "advanced-typescript-patterns",
    excerpt_en:
      "Master advanced TypeScript patterns including generics, conditional types, and utility types for type-safe applications.",
    excerpt_ar:
      "إتقان أنماط TypeScript المتقدمة للتطبيقات الآمنة من حيث النوع.",
    category: "WEB_DEVELOPMENT",
    status: "COMPLETED",
    authorId: "author_enterprise_004",
    published: true,
    featured: true,
    metaTitle_en: "Advanced TypeScript Patterns",
    metaTitle_ar: "أنماط TypeScript المتقدمة",
    metaDesc_en:
      "Learn advanced TypeScript with generics, conditional types, mapped types for building type-safe applications.",
    metaDesc_ar: "تعلم TypeScript المتقدم مع أنماط متقدمة لتطبيقات آمنة.",
    tags: ["TypeScript", "Type Safety", "Generics", "Advanced Patterns"],
    imageUrl:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80",
    ],
    readTime: 24,
    views: 67340,
    likes: 4120,
    keywords: ["typescript", "advanced", "generics", "type-safe", "patterns"],
    publishDate: new Date("2025-06-15"),
    createdAt: new Date("2025-06-12"),
    updatedAt: new Date("2025-10-15"),
    author: {
      id: "author_enterprise_004",
      name: "Emma Rodriguez",
      email: "emma@typescript-masters.dev",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    comments: [],
    userLiked: true,
  },
  {
    id: 5,
    title_en: "Observability & Distributed Tracing: Seeing Your System",
    title_ar: "الرصد والتتبع الموزع: رؤية نظامك",
    content_en:
      "True observability goes beyond metrics. Learn to implement comprehensive monitoring using Prometheus, Grafana, and distributed tracing with OpenTelemetry and Jaeger. Debug production issues with confidence.",
    content_ar:
      "يتجاوز الرصد الحقيقي المقاييس البسيطة. تعلم تنفيذ المراقبة الشاملة باستخدام Prometheus و Grafana والتتبع الموزع مع OpenTelemetry.",
    slug: "observability-distributed-tracing",
    excerpt_en:
      "Implement comprehensive observability with Prometheus, Grafana, OpenTelemetry, and distributed tracing.",
    excerpt_ar: "تنفيذ رصد شامل مع Prometheus و Grafana والتتبع الموزع.",
    category: "OTHER",
    status: "ON_HOLD",
    authorId: "author_enterprise_005",
    published: true,
    featured: true,
    metaTitle_en: "Observability & Distributed Tracing",
    metaTitle_ar: "الرصد والتتبع الموزع",
    metaDesc_en:
      "Build production-grade observability with metrics, logs, traces using Prometheus, Grafana, and OpenTelemetry.",
    metaDesc_ar: "بناء رصد على مستوى الإنتاج مع Prometheus و Grafana.",
    tags: ["Observability", "Monitoring", "Tracing", "Prometheus", "DevOps"],
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
    ],
    readTime: 30,
    views: 41250,
    likes: 2980,
    keywords: [
      "observability",
      "tracing",
      "prometheus",
      "grafana",
      "monitoring",
      "otel",
    ],
    publishDate: new Date("2025-05-20"),
    createdAt: new Date("2025-05-18"),
    updatedAt: new Date("2025-10-10"),
    author: {
      id: "author_enterprise_005",
      name: "Michael Park",
      email: "michael.park@observability.pro",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    comments: [],
    userLiked: false,
  },
  {
    id: 6,
    title_en: "GraphQL at Scale: Performance Optimization & Best Practices",
    title_ar: "GraphQL على نطاق واسع: تحسين الأداء وأفضل الممارسات",
    content_en:
      "GraphQL enables flexible APIs but requires careful optimization. Learn query batching, caching strategies, subscription handling, and server-side filtering. Real-world patterns from systems handling 50K+ concurrent GraphQL connections.",
    content_ar:
      "يتيح GraphQL واجهات برمجية مرنة لكن يتطلب تحسين دقيق. تعلم تجميع الاستعلامات واستراتيجيات التخزين المؤقت والتصفية من جانب الخادم.",
    slug: "graphql-scale-optimization",
    excerpt_en:
      "Optimize GraphQL APIs handling 50K+ concurrent connections with batching, caching, and subscriptions.",
    excerpt_ar:
      "تحسين GraphQL مع تجميع الاستعلامات والتخزين المؤقت والاشتراكات.",
    category: "API_DEVELOPMENT",
    status: "COMPLETED",
    authorId: "author_enterprise_006",
    published: true,
    featured: false,
    metaTitle_en: "GraphQL Performance & Optimization",
    metaTitle_ar: "أداء GraphQL والتحسين",
    metaDesc_en:
      "Master GraphQL optimization for 50K+ concurrent connections with advanced patterns.",
    metaDesc_ar: "إتقان تحسين GraphQL مع 50000+ اتصال متزامن.",
    tags: ["GraphQL", "API", "Performance", "Optimization", "Caching"],
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
    ],
    readTime: 26,
    views: 38920,
    likes: 2650,
    keywords: [
      "graphql",
      "api",
      "performance",
      "optimization",
      "caching",
      "subscriptions",
    ],
    publishDate: new Date("2025-04-10"),
    createdAt: new Date("2025-04-08"),
    updatedAt: new Date("2025-10-25"),
    author: {
      id: "author_enterprise_006",
      name: "Lisa Chen",
      email: "lisa.chen@graphql-experts.dev",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    comments: [],
    userLiked: false,
  },
];
