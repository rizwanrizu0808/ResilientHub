import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "./StatsCard";
import { Package, MapPin, AlertTriangle, ClipboardList } from "lucide-react";

export const DashboardStats = () => {
  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: inventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*, resources(*)");
      if (error) throw error;
      return data;
    },
  });

  const { data: requests } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("status", "pending");
      if (error) throw error;
      return data;
    },
  });

  const lowStockItems = inventory?.filter(
    (item) => item.quantity_available <= item.minimum_threshold
  ).length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Resources"
        value={resources?.length || 0}
        icon={Package}
        description="Resource types tracked"
      />
      <StatsCard
        title="Storage Locations"
        value={locations?.length || 0}
        icon={MapPin}
        description="Warehouses and facilities"
      />
      <StatsCard
        title="Low Stock Items"
        value={lowStockItems}
        icon={AlertTriangle}
        description="Below minimum threshold"
        variant={lowStockItems > 0 ? "warning" : "success"}
      />
      <StatsCard
        title="Pending Requests"
        value={requests?.length || 0}
        icon={ClipboardList}
        description="Awaiting approval"
        variant={requests && requests.length > 0 ? "critical" : "default"}
      />
    </div>
  );
};
