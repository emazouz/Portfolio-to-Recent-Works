// Enums للفئات (اختياري)
enum TemplateCategory {
  ADMIN_DASHBOARDS = "ADMIN_DASHBOARDS",
  ECOMMERCE = "ECOMMERCE",
  PORTFOLIO = "PORTFOLIO",
  BLOG = "BLOG",
  LANDING_PAGE = "LANDING_PAGE",
}

// Main Interfaces
interface OverviewStats {
  totalTemplates: number;
  activeTemplates: number;
  inactiveTemplates: number;
  featuredTemplates: number;
  totalRevenue: string;
  totalDownloads: number;
  totalViews: number;
}

interface CategoryBreakdown {
  category: TemplateCategory | string;
  count: number;
  downloads: number;
}

interface TemplatePerformance {
  id: number;
  title_en: string;
  downloads: number;
  views: number;
  rating: number;
  _count: {
    orders: number;
  };
}

interface RecentTemplate {
  id: number;
  title_en: string;
  createdAt: string;
  isActive: boolean;
  featured: boolean;
}

export interface TemplateAnalyticsType {
  overview: OverviewStats;
  categoryBreakdown: CategoryBreakdown[];
  topPerformingTemplates: TemplatePerformance[];
  recentlyAdded: RecentTemplate[];
}
