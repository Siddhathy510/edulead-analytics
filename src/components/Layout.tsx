import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <>{children}</>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10 px-4">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm font-medium text-muted-foreground capitalize">{user.role} Dashboard</span>
          </header>
          <div className="flex-1 p-6 animate-fade-in">
            {children}
          </div>
          <footer className="border-t border-border bg-background px-6 py-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>© 2026 EduTech Analytics — Academic Intelligence Platform</span>
              <span className="hidden sm:inline">Future Scope: Real Blockchain · ML API · Cloud Database · Multi-institution Support</span>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}
