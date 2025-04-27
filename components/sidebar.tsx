// components/sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BarChart2, HomeIcon, TrendingUp, Calculator } from "lucide-react";

const routes = [
  {
    name: "Home",
    path: "/",
    icon: HomeIcon,
    exact: true
  },
  {
    name: "Stocks",
    path: "/stock",
    icon: TrendingUp,
  },
  {
    name: "ETFs",
    path: "/etf",
    icon: BarChart2,
  },
  {
    name: "Calculator",
    path: "/calculator",
    icon: Calculator,
  }
];

// Removed the unused 'isMobile' prop
export function Sidebar({ closeMobileMenu }: { closeMobileMenu?: () => void }) {
  const pathname = usePathname();

  // Check if route is active
  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return pathname === path;
    }
    // Check if the current path *is* the route path or *starts with* the route path followed by a '/'
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Handle navigation with optional menu closing
  const handleNavigation = () => {
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <div className="h-full">
      <div className="space-y-1 p-2">
        {routes.map((route) => {
          const active = isActive(route.path, route.exact);

          return (
            <Link
              key={route.path}
              href={route.path}
              onClick={handleNavigation} // Call handler on click
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent hover:text-foreground"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}