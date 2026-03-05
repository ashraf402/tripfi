import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Map as MapIcon, Menu } from "lucide-react";
import { TestnetBadge } from "@/components/shared/TestnetBadge";

interface AppHeaderProps {
  title?: string;
  status?: "online" | "thinking" | "offline";
  onOpenSidebar: () => void;
  showMapToggle?: boolean;
  isMapOpen?: boolean;
  onToggleMap?: () => void;
  rightContent?: React.ReactNode;
}

export function AppHeader({
  title = "New Conversation",
  status = "online",
  onOpenSidebar,
  showMapToggle = false,
  isMapOpen = false,
  onToggleMap,
  rightContent,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="lg:hidden text-text-secondary hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-base font-bold text-foreground truncate max-w-50 sm:max-w-md">
              {title}
            </h1>
            {/* <AgentStatusBadge status={status} /> */}
            <TestnetBadge />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showMapToggle && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleMap}
                  className={`
                    rounded-full transition-all duration-200
                    ${
                      isMapOpen
                        ? "bg-[rgba(0,208,132,0.1)] border border-primary text-primary"
                        : "bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary"
                    }
                  `}
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMapOpen ? "Hide Map" : "Show Map"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {rightContent}
      </div>
    </header>
  );
}
