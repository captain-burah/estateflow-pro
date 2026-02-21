import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Properties", url: "/properties", icon: Building2 },
  { title: "Rentals", url: "/rentals", icon: FileText },
  { title: "Sales Pipeline", url: "/sales", icon: BarChart3 },
  { title: "Publishing", url: "/publishing", icon: Globe },
  { title: "Agents", url: "/agents", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 min-h-screen",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-primary-foreground font-display">
                EstateFlow
              </h1>
              <p className="text-[10px] text-sidebar-foreground/60 tracking-widest uppercase">
                Elite CRM
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-2 mx-2 mt-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        <ChevronLeft
          className={cn(
            "w-4 h-4 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              collapsed && "justify-center px-0"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-sidebar-border space-y-1">
        <NavLink
          to="/notifications"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center px-0"
          )}
          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
        >
          <Bell className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Notifications</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center px-0"
          )}
          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
