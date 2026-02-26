import Image from "next/image";
import Icon from "../ui/icons/Icon";

interface SocialLink {
  icon: string;
  url: string;
}

interface AboutTeamCardProps {
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  socialLinks: SocialLink[];
  iconBadge: string;
}

export function AboutTeamCard({
  name,
  role,
  bio,
  imageSrc,
  socialLinks,
  iconBadge = "check",  
}: AboutTeamCardProps) {
  return (
    <div className="bg-surface/60 backdrop-blur-md border border-border p-8 md:p-12 rounded-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden group">
      <div className="absolute top-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent" />

      <div className="relative">
        <div className="w-32 h-32 rounded-full p-1 border-2 border-primary shadow-glow overflow-hidden bg-surface">
          <Image
            src={imageSrc}
            alt={`Portrait of ${name}`}
            width={128}
            height={128}
            className="w-full h-full object-cover rounded-full"
            unoptimized
          />
        </div>
        <div className="absolute bottom-0 right-0 bg-primary text-background p-1.5 rounded-full border-4 border-surface">
          <Icon name={iconBadge} className="text-lg" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold font-heading text-foreground">
          {name}
        </h3>
        <p className="text-primary font-medium">{role}</p>
      </div>

      <p className="text-secondary">{bio}</p>

      <div className="flex gap-4 mt-2">
        {socialLinks.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-foreground hover:bg-primary hover:text-background transition-colors"
          >
            <Icon name={link.icon} className="text-lg" />
          </a>
        ))}
      </div>
    </div>
  );
}
