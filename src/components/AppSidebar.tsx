import { useAuth, Role } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, BarChart3, Shield, BookOpen, 
  UserCircle, LogOut, GraduationCap
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const menuByRole: Record<Role, { title: string; url: string; icon: React.ElementType }[]> = {
  admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/students", icon: Users },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Blockchain Ledger", url: "/blockchain", icon: Shield },
  ],
  faculty: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Students", url: "/students", icon: Users },
    { title: "Predictions", url: "/predictions", icon: BarChart3 },
  ],
  student: [
    { title: "My Profile", url: "/dashboard", icon: UserCircle },
    { title: "Academics", url: "/academics", icon: BookOpen },
    { title: "Verification", url: "/verification", icon: Shield },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  if (!user) return null;
  const items = menuByRole[user.role];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <GraduationCap className="h-7 w-7 text-primary shrink-0" />
        {!collapsed && (
          <div className="animate-fade-in">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">EduTech Analytics</h2>
            <p className="text-xs text-muted-foreground capitalize">{user.role} Portal</p>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      activeClassName="bg-primary/8 text-primary font-medium"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <button onClick={logout} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
