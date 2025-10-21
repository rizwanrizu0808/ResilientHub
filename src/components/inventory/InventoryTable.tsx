import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export const InventoryTable = () => {
  const { data: inventory, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select(`
          *,
          resources(name, unit_of_measure),
          locations(name)
        `)
        .order("last_updated_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Levels</CardTitle>
          <CardDescription>Loading inventory...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Levels</CardTitle>
        <CardDescription>
          Current stock levels across all locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inventory && inventory.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {inventory.map((item) => {
                const isLowStock = item.quantity_available <= item.minimum_threshold;
                return (
                  <Card 
                    key={item.id} 
                    className={`border-l-4 ${isLowStock ? 'border-l-critical bg-critical/5' : 'border-l-success bg-success/5'}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base truncate">
                            {item.resources?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.locations?.name}
                          </p>
                        </div>
                        {isLowStock ? (
                          <Badge variant="destructive" className="gap-1 shrink-0 ml-2">
                            <AlertTriangle className="h-3 w-3" />
                            Low
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 shrink-0 ml-2 bg-success/10 text-success border-success/20">
                            <CheckCircle2 className="h-3 w-3" />
                            OK
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Available</p>
                          <p className="font-medium">
                            {item.quantity_available} {item.resources?.unit_of_measure}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Min. Threshold</p>
                          <p className="font-medium">
                            {item.minimum_threshold} {item.resources?.unit_of_measure}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground text-xs">Last Updated</p>
                          <p className="font-medium">
                            {new Date(item.last_updated_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Min. Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const isLowStock = item.quantity_available <= item.minimum_threshold;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.resources?.name}
                        </TableCell>
                        <TableCell>{item.locations?.name}</TableCell>
                        <TableCell>
                          {item.quantity_available} {item.resources?.unit_of_measure}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.minimum_threshold} {item.resources?.unit_of_measure}
                        </TableCell>
                        <TableCell>
                          {isLowStock ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 bg-success/10 text-success border-success/20">
                              <CheckCircle2 className="h-3 w-3" />
                              Adequate
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(item.last_updated_date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No inventory records found. Add resources and locations first.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
