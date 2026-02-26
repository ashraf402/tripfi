import { cn } from "@/lib/utils";

type TIcon = {
  name: string;
  style?: "line" | "fill";
  className?: string;
};

const Icon = ({ name, style = "line", className }: TIcon) => {
  return (
    <i
      className={cn(
        `mgc_${name}_${style} text-xl flex items-center justify-center`,
        className,
      )}
    />
  );
};

export default Icon;
