import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ResourcesList } from "@/components/resources/ResourcesList";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-3 sm:px-4 py-4 md:py-8 pb-20 md:pb-8">
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Overview</h2>
            <DashboardStats />
          </section>

          <section>
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="inventory" className="text-sm md:text-base">
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="resources" className="text-sm md:text-base">
                  Resources
                </TabsTrigger>
              </TabsList>
              <TabsContent value="inventory" className="mt-4 md:mt-6">
                <InventoryTable />
              </TabsContent>
              <TabsContent value="resources" className="mt-4 md:mt-6">
                <ResourcesList />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
