import { useEffect, useState } from "react";
import { getOwnerProperties, buildOwnerDashboardData, OwnerProperty,} from "../services/properties";

type DashboardData = {
  totalListings: number;
  available: number;
  full: number;
  unverified: number;
  recentListings: OwnerProperty[];
};

export default function useOwnerDashboard(ownerId: string) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!ownerId) {
        setDashboardData(null);
        setError("Owner ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const properties = await getOwnerProperties(ownerId);
        const result = buildOwnerDashboardData(properties);
        setDashboardData(result);
      } catch (err) {
        console.log("Dashboard error:", err);
        setError("Failed to load dashboard data");
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [ownerId]);

  return { dashboardData, loading, error };
}