import { Globe } from "lucide-react";

interface DashboardHeaderProps {
  url: string;
}

export default function DashboardHeader({
  url,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
        <Globe className="h-5 w-5 text-sky-600" />
      </div>

      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          Website
        </p>

        <p className="truncate font-medium text-slate-800">
          {url}
        </p>
      </div>
    </div>
  );
}