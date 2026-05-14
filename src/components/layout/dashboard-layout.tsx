import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            <div className="container mx-auto max-w-7xl p-6">{children}</div>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
