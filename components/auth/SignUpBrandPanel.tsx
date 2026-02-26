import Image from "next/image";
import { Logo } from "@/components/landing/Logo";

export function SignUpBrandPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/auth/signup-bg.jpg"
        alt="A breathtaking view of a lush tropical valley at sunrise"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-black/90 via-black/40 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-between h-full p-12 xl:p-20 w-full">
        {/* Logo */}
        <div>
          <Logo variant="white" />
        </div>

        {/* Hero Text */}
        <div className="max-w-xl">
          <h1 className="text-5xl xl:text-7xl font-bold font-heading text-white leading-tight mb-6">
            Explore the <span className="text-primary italic">unseen</span>{" "}
            world.
          </h1>
          <p className="text-lg xl:text-xl text-white/80 font-medium leading-relaxed">
            Join over 2 million travelers planning their next sustainable
            adventure with TripFi&apos;s intelligent itinerary builder.
          </p>
        </div>

        {/* Community Avatars */}
        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
            {/* Avatar placeholders using colored circles */}
            <div className="h-10 w-10 rounded-full border-2 border-black/50 bg-emerald-800 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-black/50 bg-teal-700 flex items-center justify-center text-white text-xs font-bold">
              B
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-black/50 bg-green-800 flex items-center justify-center text-white text-xs font-bold">
              C
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black/50 bg-primary text-xs font-bold text-black">
              +12k
            </div>
          </div>
          <p className="text-sm font-medium text-white/70">
            Recently joined the community
          </p>
        </div>
      </div>
    </div>
  );
}
