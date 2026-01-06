import Link from "next/link";
import { Home, FileText, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/deals", label: "Deals", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom: Settings */}
      <div className="border-t p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}