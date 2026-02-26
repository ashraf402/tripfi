import Icon from "../ui/icons/Icon";

interface SectionHeaderProps {
  icon?: string;
  headline: string;
  subtext?: string;
  centered?: boolean;
}

export function SectionHeader({
  icon,
  headline,
  subtext,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-6 ${centered ? "items-center text-center" : ""}`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Icon name={icon} style="fill" className="text-4xl" />
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
        {headline}
      </h2>
      {subtext && (
        <p className="text-secondary text-xl leading-relaxed max-w-2xl">
          {subtext}
        </p>
      )}
    </div>
  );
}
