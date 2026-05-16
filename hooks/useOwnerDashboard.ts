import { useQuery } from "@tanstack/react-query";
import {
  getOwnerProperties,
  buildOwnerDashboardData,
  OwnerProperty,
} from "../services/properties";

type DashboardData = {
  totalListings: number;
  available: number;
  full: number;
  unverified: number;
  recentListings: OwnerProperty[];
};

export default function useOwnerDashboard(ownerId: string) {
  const query = useQuery<DashboardData>({
    queryKey: ["owner-dashboard", ownerId],
    queryFn: async () => {
      const properties = await getOwnerProperties(ownerId, false);
      return buildOwnerDashboardData(properties ?? []);
    },
    enabled: !!ownerId,
    retry: false,
  });

  return {
    dashboardData: query.data ?? null,
    loading: query.isLoading,
    error: !ownerId
      ? "Owner ID is missing"
      : query.error
      ? "Failed to load dashboard data"
      : null,
  };
}