"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/deals", label: "Deals", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside 
      className="flex h-full w-64 flex-col border-r bg-muted/30"
      aria-label="Sidebar navigation"
    >
      <nav 
        className="flex-1 space-y-1 p-4"
        aria-label="Main navigation"
      >
        <ul role="list" className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Settings */}
      <div className="border-t p-4">
        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
