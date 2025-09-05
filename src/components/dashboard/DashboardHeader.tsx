import { CheckCircle } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  showHealthBadge?: boolean;
}

export function DashboardHeader({
  title,
  description,
  showHealthBadge = false,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <div className="-ml-1" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {showHealthBadge && (
        <div className="bg-dengue-healthy text-white">
          <CheckCircle   className="w-3 h-3 mr-1" />
          Saludable
        </div>
      )}
    </header>
  );
}
