export interface DashboardStat {
  id: string;
  title: string;
  value: number;
  subtitle?: string;
  highlighted?: boolean;
}

export interface DashboardAlert {
  id: string;
  title: string;
  color: string;
}

export interface QuickAction {
  id: string;
  title: string;
  route: string;
  filled?: boolean;
}

export interface RecentListing {
  id: string;
  title: string;
  location: string;
  price: string;
  views: number;
  likes: number;
  imageUrl: string;
}

export interface EarningsData {
  month: string;
  amount: string;
  change: string;
}

export interface OwnerDashboardData {
  stats: DashboardStat[];
  alerts: DashboardAlert[];
  quickActions: QuickAction[];
  recentListings: RecentListing[];
  earnings: EarningsData;
}