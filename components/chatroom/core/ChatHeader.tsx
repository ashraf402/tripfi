import { Menu, MoreVertical, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { AgentStatusBadge } from "./AgentStatusBadge";

interface ChatHeaderProps {
  title?: string;
  status?: "online" | "thinking" | "offline";
  onOpenSidebar: () => void;
  showMapToggle?: boolean;
  isMapOpen?: boolean;
  onToggleMap?: () => void;
}

export function ChatHeader({
  title = "New Conversation",
  status = "online",
  onOpenSidebar,
  showMapToggle = false,
  isMapOpen = false,
  onToggleMap,
}: ChatHeaderProps) {
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
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showMapToggle && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleMap}
                  className={`
                    p-2 rounded-full transition-all duration-200
                    ${
                      isMapOpen
                        ? "bg-[rgba(0,208,132,0.1)] border border-primary text-primary"
                        : "bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary"
                    }
                  `}
                >
                  <MapIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMapOpen ? "Hide Map" : "Show Map"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-text-secondary hover:text-foreground"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface border-border">
            <DropdownMenuItem className="text-foreground focus:bg-surface-hover cursor-pointer">
              Rename Conversation
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
