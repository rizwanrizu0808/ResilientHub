import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DashboardHeader = () => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">
              Emergency Resources
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
              Disaster Management System
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut} size="sm" className="shrink-0">
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
