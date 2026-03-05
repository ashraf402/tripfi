import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-secondary">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm font-medium">Loading...</p>
    </div>
  );
}
