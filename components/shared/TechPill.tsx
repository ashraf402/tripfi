import { cn } from "@/lib/utils";
import Image from "next/image";

interface TechPillProps {
  name: string;
  iconName?: string;
  invertible?: boolean;
}

export function TechPill({ name, iconName, invertible }: TechPillProps) {
  return (
    <div className="px-5 py-2.5 rounded-full bg-surface border border-border flex items-center gap-2 text-foreground hover:border-primary/30 transition-colors cursor-default">
      {iconName && (
        <span className={cn("text-lg")}>
          <Image
            src={`/images/stack/${iconName}.webp`}
            alt={name}
            width={20}
            height={20}
            className={cn("rounded-md", invertible && "invert dark:invert-0")}
          />
        </span>
      )}
      <span className="font-medium text-sm">{name}</span>
    </div>
  );
}
