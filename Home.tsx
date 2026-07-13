import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Gamepad2,
  Download,
  Users,
  Bell,
  Play,
  ArrowRight,
  Server,
  Circle,
  ChevronRight,
} from "lucide-react";

function HeroSection() {
  const { data: settings } = trpc.settings.getAll.useQuery();
  const serverIp = settings?.serverIp || "51.83.49.125:11940";

  const handleJoinServer = () => {
    window.location.href = `samp://${serverIp}`;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/70 via-[#050507]/50 to-[#050507]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/80 via-transparent to-[#050507]/80" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#7C3AED] rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <img
          src="/assets/logo.png"
          alt="ASOTIME RP"
          className="h-32 sm:h-48 md:h-56 w-auto mx-auto mb-6 object-contain drop-shadow-[0_0_30px_rgba(124,58,237,0.4)]"
        />

        {/* Tagline */}
        <p className="text-[#A1A1AA] text-sm sm:text-base tracking-[0.3em] uppercase mb-8">
          The Ultimate San Andreas Roleplay Experience
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={handleJoinServer}
            className="group flex items-center gap-2 px-8 py-4 grad-purple text-white font-bold text-sm tracking-widest btn-glow"
          >
            <Gamepad2 className="w-5 h-5" />
            JOIN SERVER
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            to="/downloads"
            className="group flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-widest hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            DOWNLOAD
          </Link>
          <Link
            to="/community"
            className="group flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-widest hover:border-[#22D3EE] hover:bg-[#22D3EE]/10 transition-all duration-300"
          >
            <Users className="w-5 h-5" />
            COMMUNITY
          </Link>
        </div>

        {/* Server Status Bar */}
        <div className="glass-panel px-6 py-4 max-w-2xl mx-auto scanlines relative">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-green-500 fill-green-500 status-online rounded-full" />
              <span className="text-[#A1A1AA]">Server:</span>
              <span className="text-green-400 font-semibold">ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-[#A1A1AA]">IP:</span>
              <span className="text-[#22D3EE] font-mono font-semibold">{serverIp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-[#A1A1AA]">Players:</span>
              <span className="text-white font-semibold">
                {settings?.onlinePlayers || "0"}/{settings?.maxPlayers || "500"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-[#A1A1AA] tracking-widest">SCROLL</span>
        <ChevronRight className="w-4 h-4 text-[#A78BFA] rotate-90" />
      </div>
    </section>
  );
}

function MarqueeSection() {
  const text = "ASOTIME RP • EST. 2024 • NEW UPDATE V2.0 • JOIN THE ROLEPLAY • ULTIMATE SA EXPERIENCE • ";
  const repeated = text.repeat(4);

  return (
    <section className="py-8 overflow-hidden border-y border-white/5 bg-[#050507]">
      <div className="marquee-track whitespace-nowrap">
        <span className="text-[6vw] sm:text-[4vw] font-black text-transparent tracking-tight"
          style={{
            WebkitTextStroke: "1px rgba(124, 58, 237, 0.3)",
          }}
        >
          {repeated}
        </span>
        <span className="text-[6vw] sm:text-[4vw] font-black text-transparent tracking-tight"
          style={{
            WebkitTextStroke: "1px rgba(124, 58, 237, 0.3)",
          }}
        >
          {repeated}
        </span>
      </div>
    </section>
  );
}

function UpdatesSection() {
  const updates = [
    {
      title: "New Faction System",
      desc: "Completely redesigned faction management with hierarchy, territories, and economy.",
      border: "border-l-[#22D3EE]",
      icon: <Users className="w-6 h-6 text-[#22D3EE]" />,
    },
    {
      title: "Economy Rebalance",
      desc: "Reworked money system for fair gameplay. New jobs, businesses, and banking features.",
      border: "border-l-[#7C3AED]",
      icon: <Bell className="w-6 h-6 text-[#7C3AED]" />,
    },
    {
      title: "Vehicle Customization",
      desc: "Full vehicle mod shop with paint, neon underglow, rims, and performance upgrades.",
      border: "border-l-[#C084FC]",
      icon: <Gamepad2 className="w-6 h-6 text-[#C084FC]" />,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050507] grid-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            LATEST <span className="text-[#A78BFA] neon-text">UPDATES</span>
          </h2>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {updates.map((update, i) => (
            <div
              key={i}
              className={`glass-panel p-6 border-l-4 ${update.border} hover:bg-white/5 transition-all duration-300 group`}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                {update.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{update.title}</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{update.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnnouncementsPreview() {
  const { data: announcements } = trpc.announcement.list.useQuery();
  const pinned = announcements?.filter((a) => a.isPinned) || [];
  const recent = announcements?.filter((a) => !a.isPinned).slice(0, 3) || [];
  const display = [...pinned, ...recent].slice(0, 4);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050507]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
              <span className="text-[#A78BFA] neon-text">NEWS</span> & ANNOUNCEMENTS
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-[#7C3AED] to-transparent" />
          </div>
          <Link
            to="/announcements"
            className="hidden sm:flex items-center gap-2 text-sm text-[#A78BFA] hover:text-white transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {display.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <Bell className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
            <p className="text-[#A1A1AA]">No announcements yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {display.map((ann) => (
              <div
                key={ann.id}
                className={`glass-panel p-6 hover:bg-white/5 transition-all duration-300 group ${
                  ann.isPinned ? "border-l-2 border-l-[#A78BFA]" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors">
                    {ann.title}
                  </h3>
                  {ann.isPinned && (
                    <span className="px-2 py-1 text-[10px] font-bold tracking-wider bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30">
                      PINNED
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#A1A1AA] line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#A1A1AA]">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-[#A78BFA]">by {ann.createdBy}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function VideoSection() {
  const { data: activeMedia } = trpc.media.getActive.useQuery();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050507] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            SERVER <span className="text-[#22D3EE] neon-text-cyan">SHOWCASE</span>
          </h2>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent" />
        </div>

        {activeMedia ? (
          <div className="glass-panel p-2 sm:p-4">
            <div className="relative aspect-video bg-black">
              {activeMedia.type === "youtube" ? (
                <iframe
                  src={activeMedia.url.replace("watch?v=", "embed/")}
                  title={activeMedia.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeMedia.url}
                  controls
                  className="w-full h-full"
                  poster={activeMedia.thumbnail || undefined}
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">{activeMedia.title}</h3>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 text-center">
            <Play className="w-16 h-16 text-[#A1A1AA] mx-auto mb-4" />
            <p className="text-[#A1A1AA] mb-2">No video uploaded yet.</p>
            <p className="text-sm text-[#A1A1AA]">
              Check back soon for server showcase videos!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050507]">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <UpdatesSection />
      <AnnouncementsPreview />
      <VideoSection />
      <Footer />
    </div>
  );
}
