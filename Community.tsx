import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  MessageCircle,
  Gamepad2,
  Music,
  ExternalLink,
} from "lucide-react";

const platformConfig: Record<
  string,
  { icon: React.ReactNode; gradient: string; glow: string }
> = {
  WhatsApp: {
    icon: <MessageCircle className="w-10 h-10" />,
    gradient: "from-green-600 to-green-500",
    glow: "shadow-green-500/30",
  },
  Discord: {
    icon: <Gamepad2 className="w-10 h-10" />,
    gradient: "from-[#5865F2] to-[#7289DA]",
    glow: "shadow-[#5865F2]/30",
  },
  TikTok: {
    icon: <Music className="w-10 h-10" />,
    gradient: "from-pink-600 to-cyan-500",
    glow: "shadow-pink-500/30",
  },
};

export default function Community() {
  const { data: communityLinks } = trpc.community.list.useQuery();

  return (
    <div className="min-h-screen bg-[#050507]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              JOIN OUR <span className="text-[#A78BFA] neon-text">COMMUNITY</span>
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent mb-4" />
            <p className="text-[#A1A1AA] max-w-lg mx-auto">
              Connect with fellow players, get updates, and be part of the ASOTIME RP family.
            </p>
          </div>

          {/* Community Cards */}
          {communityLinks && communityLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {communityLinks.map((link) => {
                const config = platformConfig[link.platform] || {
                  icon: <Users className="w-10 h-10" />,
                  gradient: "from-[#7C3AED] to-[#A78BFA]",
                  glow: "shadow-[#7C3AED]/30",
                };

                return (
                  <div
                    key={link.id}
                    className={`glass-panel p-8 text-center hover:bg-white/5 transition-all duration-300 group relative overflow-hidden`}
                  >
                    {/* Glow effect */}
                    <div
                      className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${config.gradient} opacity-10 blur-[60px] group-hover:opacity-20 transition-opacity`}
                    />

                    <div
                      className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br ${config.gradient} text-white rounded-sm shadow-lg ${config.glow}`}
                    >
                      {config.icon}
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">
                      {link.platform}
                    </h2>
                    <p className="text-sm text-[#A1A1AA] mb-6">{link.label}</p>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${config.gradient} text-white font-bold text-sm tracking-widest btn-glow`}
                    >
                      {link.buttonText.toUpperCase()}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center">
              <Users className="w-16 h-16 text-[#A1A1AA] mx-auto mb-4" />
              <p className="text-[#A1A1AA]">No community links available yet.</p>
            </div>
          )}

          {/* Why Join */}
          <div className="mt-12 glass-panel p-8">
            <h2 className="text-xl font-bold text-white mb-6 tracking-wider text-center">
              WHY JOIN <span className="text-[#22D3EE]">OUR COMMUNITY?</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Stay Updated",
                  desc: "Get the latest news, updates, and patch notes directly from the dev team.",
                  icon: <MessageCircle className="w-6 h-6 text-[#22D3EE]" />,
                },
                {
                  title: "Find Players",
                  desc: "Connect with other roleplayers, form factions, and build alliances.",
                  icon: <Users className="w-6 h-6 text-[#A78BFA]" />,
                },
                {
                  title: "Get Support",
                  desc: "Our friendly staff and community are always ready to help you out.",
                  icon: <Gamepad2 className="w-6 h-6 text-[#C084FC]" />,
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-black/40 border border-white/10">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
