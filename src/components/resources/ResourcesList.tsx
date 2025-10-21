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

export const ResourcesList = () => {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const getTypeVariant = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      water: "default",
      food: "secondary",
      medical: "destructive",
      shelter: "outline",
      equipment: "default",
      other: "secondary",
    };
    return variants[type] || "default";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Loading resources...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
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
        <CardTitle>Resources</CardTitle>
        <CardDescription>
          Available resource types in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {resources && resources.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-base">{resource.name}</h3>
                      <Badge variant={getTypeVariant(resource.type)}>
                        {resource.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Unit:</span> {resource.unit_of_measure}
                      </p>
                      {resource.description && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Description:</span> {resource.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeVariant(resource.type)}>
                          {resource.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {resource.unit_of_measure}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {resource.description || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No resources found. Add your first resource to get started.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
