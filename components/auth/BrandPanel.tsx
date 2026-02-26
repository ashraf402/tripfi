import Image from "next/image";
import { Zap, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/landing/Logo";

export function BrandPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-background">
      {/* Radial Glow Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 209, 132, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="/images/auth/login-bg.jpg"
          alt="Airplane wing flying above white clouds at sunset"
          fill
          className="object-cover grayscale-20"
          priority
        />
      </div>

      {/* Header — Logo */}
      <div className="relative z-20">
        <Logo variant="white" />
      </div>

      {/* Center Content */}
      <div className="relative z-20 max-w-lg">
        <h2 className="text-5xl font-bold font-heading leading-tight mb-6 text-white">
          Travel the world with{" "}
          <span className="text-primary">Bitcoin Cash</span>
        </h2>

        {/* Floating Glassmorphic Transaction Card */}
        <div className="rounded-xl p-6 mb-12 shadow-2xl border-l-4 border-primary bg-white/5 backdrop-blur-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary text-lg font-bold">₿</span>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest">
                  Transaction Sent
                </p>
                <p className="font-bold text-white">Tokyo Flight Booking</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-lg">0.42 BCH</p>
              <p className="text-xs text-white/50">Confirmed</p>
            </div>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-full" />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white">
              Powered by BCH
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white">
              Secured by AES-256
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <p className="text-white/40 text-sm">
          © 2024 TripFi Protocol. All rights reserved.
        </p>
      </div>
    </div>
  );
}
