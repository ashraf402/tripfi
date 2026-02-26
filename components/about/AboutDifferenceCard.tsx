import { DarkCard } from "@/components/shared/DarkCard";
import Icon from "../ui/icons/Icon";

interface AboutDifferenceCardProps {
  icon: string;
  title: string;
  description: string;
}

export function AboutDifferenceCard({
  icon,
  title,
  description,
}: AboutDifferenceCardProps) {
  return (
    <DarkCard className="group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <Icon name={icon} className="text-2xl" />
      </div>
      <h3 className="text-xl font-bold font-heading text-foreground mb-3">
        {title}
      </h3>
      <p className="text-secondary leading-relaxed">{description}</p>
    </DarkCard>
  );
}
