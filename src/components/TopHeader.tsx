import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  BarChart3,
  Bell,
  Settings,
  Globe,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth.context";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Properties", url: "/properties", icon: Building2 },
  { title: "Rentals", url: "/rentals", icon: FileText },
  { title: "Sales Pipeline", url: "/sales", icon: BarChart3 },
  { title: "Publishing", url: "/publishing", icon: Globe },
  { title: "Agents", url: "/agents", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

interface TopHeaderProps {
  onLogout?: () => void;
}

export function TopHeader({ onLogout }: TopHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="w-full bg-sidebar border-b border-sidebar-border sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-sidebar-primary-foreground font-display">
                EstateFlow
              </h1>
              <p className="text-[10px] text-sidebar-foreground/60 tracking-widest uppercase">
                Elite CRM
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === "/"}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors whitespace-nowrap"
                )}
                activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.title}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Desktop Settings & Notifications */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink
                to="/notifications"
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                )}
                activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
              >
                <Bell className="w-4 h-4" />
              </NavLink>
              <NavLink
                to="/settings"
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                )}
                activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
              >
                <Settings className="w-4 h-4" />
              </NavLink>
              <button
                onClick={onLogout}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                )}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sidebar-border bg-sidebar">
            <nav className="flex flex-col gap-1 p-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  end={item.url === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
              <div className="border-t border-sidebar-border my-2 pt-2 space-y-1">
                <NavLink
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </NavLink>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="border-t border-sidebar-border bg-sidebar/50 px-4 md:px-6 py-2 text-xs text-sidebar-foreground/70">
            Logged in as: <span className="font-medium text-sidebar-foreground">{user.email}</span>
          </div>
        )}
      </header>
    </>
  );
}
