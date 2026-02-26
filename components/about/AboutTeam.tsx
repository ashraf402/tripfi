import { AboutTeamCard } from "./AboutTeamCard";

const TeamMember = [
  {
    avatarUrl: "https://pbs.twimg.com/profile_images/1816850322280554496/vQNPwZgT_400x400.jpg",
    name: "Me",
    role: "Founder",
    bio: "",
    socialLinks: [
      { icon: "social_x", url: "https://x.com/me" },
      { icon: "mail", url: "#" },
    ],
    iconBadge: "brain"
  },
  // {
  //   avatarUrl: "",
  //   name: "Me",
  //   role: "Developer",
  //   bio: "",
  //   socialLinks: [
  //     { icon: "social_x", url: "#" },
  //     { icon: "mail", url: "#" },
  //   ],
  //   iconBadge: "code"
  // },
  // {
  //   avatarUrl: "",
  //   name: "Me",
  //   role: "Designer",
  //   bio: "",
  //   socialLinks: [
  //     { icon: "social_x", url: "#" },
  //     { icon: "mail", url: "#" },
  //   ],
  //   iconBadge: "brain"
  // },
]

export function AboutTeam() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-xl mx-auto">
        {TeamMember.map((member, index) => (
          <AboutTeamCard
            key={index}
            name={member.name}
            role={member.role}
            bio={member.bio}
            imageSrc={member.avatarUrl}
            socialLinks={member.socialLinks}
            iconBadge={member.iconBadge}
          />
        ))}
      </div>
    </section>
  );
}
