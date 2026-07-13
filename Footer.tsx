import { Link } from "react-router";
import { Gamepad2, MessageCircle, Music, Heart } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function Footer() {
  const { data: communityLinks } = trpc.community.list.useQuery();
  const currentYear = new Date().getFullYear();

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "whatsapp":
        return <MessageCircle className="w-5 h-5" />;
      case "discord":
        return <Gamepad2 className="w-5 h-5" />;
      case "tiktok":
        return <Music className="w-5 h-5" />;
      default:
        return <Gamepad2 className="w-5 h-5" />;
    }
  };

  return (
    <footer className="relative bg-[#050507] border-t border-white/10">
      {/* Top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src="/assets/logo.png"
              alt="ASOTIME RP"
              className="h-12 w-auto object-contain"
            />
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              The ultimate San Andreas Roleplay experience. Join ASOTIME RP and
              immerse yourself in a world of endless possibilities.
            </p>
            <p className="text-xs text-[#A1A1AA]">
              Created by{" "}
              <span className="text-[#A78BFA] font-semibold">BABY_WIZARD</span>
              {" "}| Owner: <span className="text-[#22D3EE] font-semibold">OBA</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-widest text-white uppercase">
              Quick Links
            </h3>
            <div className="space-y-2">
              {[
                { path: "/", label: "Home" },
                { path: "/dashboard", label: "Dashboard" },
                { path: "/downloads", label: "Downloads" },
                { path: "/community", label: "Community" },
                { path: "/announcements", label: "Announcements" },
                { path: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-[#A1A1AA] hover:text-[#A78BFA] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-widest text-white uppercase">
              Join Community
            </h3>
            <div className="space-y-3">
              {communityLinks?.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 glass-panel hover:border-[#7C3AED]/50 transition-all group"
                >
                  <span className="text-[#A78BFA] group-hover:text-[#22D3EE] transition-colors">
                    {getIcon(link.platform)}
                  </span>
                  <span className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors">
                    {link.platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A1A1AA]">
            &copy; {currentYear} ASOTIME RP. All rights reserved.
          </p>
          <p className="text-xs text-[#A1A1AA] flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> by OBA
          </p>
        </div>
      </div>
    </footer>
  );
}
