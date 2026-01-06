import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SkipLink } from "@/components/layout/skip-link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <SkipLink />
      
      {/* Header - full width at top */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed width */}
        <Sidebar />

        {/* Main content - fills remaining space */}
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto p-6"
          role="main"
          aria-label="Main content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
