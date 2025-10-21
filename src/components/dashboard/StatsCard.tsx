import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "warning" | "critical" | "success";
}

export const StatsCard = ({ title, value, icon: Icon, description, variant = "default" }: StatsCardProps) => {
  const variantClasses = {
    default: "border-l-4 border-l-primary",
    warning: "border-l-4 border-l-warning bg-warning/5",
    critical: "border-l-4 border-l-critical bg-critical/5",
    success: "border-l-4 border-l-success bg-success/5",
  };

  return (
    <Card className={variantClasses[variant]}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
