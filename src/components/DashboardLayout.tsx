import { TopHeader } from "@/components/TopHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth.context";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <TopHeader onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
}
