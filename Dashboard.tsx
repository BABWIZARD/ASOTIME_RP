import { useEffect } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Server,
  Users,
  Download,
  MessageSquare,
  User,
  Bell,
  Gamepad2,
  Circle,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { data: settings } = trpc.settings.getAll.useQuery();
  const { data: announcements } = trpc.announcement.list.useQuery();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          window.location.href = "/login";
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A1A1AA]">Loading...</p>
        </div>
      </div>
    );
  }

  const serverIp = settings?.serverIp || "51.83.49.125:11940";
  const recent = announcements?.slice(0, 5) || [];

  const quickLinks = [
    { path: "/downloads", label: "Downloads", icon: Download, color: "text-[#22D3EE]" },
    { path: "/community", label: "Community", icon: MessageSquare, color: "text-[#A78BFA]" },
    { path: "/profile", label: "Profile", icon: User, color: "text-[#C084FC]" },
    { path: "/announcements", label: "News", icon: Bell, color: "text-[#06B6D4]" },
  ];

  return (
    <div className="min-h-screen bg-[#050507]">
      <Navbar />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              WELCOME, <span className="text-[#A78BFA] neon-text">{user?.name?.toUpperCase()}</span>
            </h1>
            <p className="text-[#A1A1AA] mt-2">Here is your server dashboard</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Server Status Card */}
              <div className="glass-panel p-6 neon-glow">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-[#A78BFA]" />
                  <h2 className="text-lg font-bold text-white tracking-wider">SERVER STATUS</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-black/40 p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Circle className="w-3 h-3 text-green-500 fill-green-500 status-online rounded-full" />
                      <span className="text-xs text-[#A1A1AA] tracking-wider">STATUS</span>
                    </div>
                    <p className="text-xl font-bold text-green-400">
                      {settings?.serverStatus?.toUpperCase() || "ONLINE"}
                    </p>
                  </div>

                  <div className="bg-black/40 p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="w-3 h-3 text-[#22D3EE]" />
                      <span className="text-xs text-[#A1A1AA] tracking-wider">SERVER IP</span>
                    </div>
                    <p className="text-sm font-mono font-bold text-[#22D3EE]">{serverIp}</p>
                  </div>

                  <div className="bg-black/40 p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-3 h-3 text-[#A78BFA]" />
                      <span className="text-xs text-[#A1A1AA] tracking-wider">PLAYERS</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {settings?.onlinePlayers || "0"}
                      <span className="text-sm text-[#A1A1AA]">
                        /{settings?.maxPlayers || "500"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Uptime: {settings?.uptime || "24h 0m"}</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass-panel p-6">
                <h2 className="text-lg font-bold text-white tracking-wider mb-4">QUICK LINKS</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex flex-col items-center gap-2 p-4 bg-black/40 border border-white/5 hover:border-[#7C3AED]/50 hover:bg-white/5 transition-all group"
                      >
                        <Icon className={`w-6 h-6 ${link.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-xs font-semibold tracking-wider text-[#A1A1AA] group-hover:text-white">
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Latest Announcements */}
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white tracking-wider">LATEST NEWS</h2>
                  <Link
                    to="/announcements"
                    className="text-xs text-[#A78BFA] hover:text-white transition-colors flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {recent.length === 0 ? (
                  <p className="text-sm text-[#A1A1AA]">No announcements yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recent.map((ann) => (
                      <div
                        key={ann.id}
                        className={`p-4 bg-black/40 border border-white/5 hover:border-[#7C3AED]/30 transition-all ${
                          ann.isPinned ? "border-l-2 border-l-[#A78BFA]" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-bold text-white">{ann.title}</h3>
                          {ann.isPinned && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#7C3AED]/20 text-[#A78BFA]">
                              PINNED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-2">{ann.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-[#A1A1AA]">
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-[#A78BFA]">by {ann.createdBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Profile Card */}
              <div className="glass-panel p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                <p className="text-xs text-[#A1A1AA] mt-1">{user?.email}</p>
                <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-[#7C3AED]/20 text-[#A78BFA] text-xs font-bold tracking-wider">
                  {isAdmin ? (
                    <>
                      <Shield className="w-3 h-3" /> ADMIN
                    </>
                  ) : (
                    "PLAYER"
                  )}
                </div>
              </div>

              {/* Join Server */}
              <div className="glass-panel p-6">
                <h3 className="text-sm font-bold text-white tracking-wider mb-4">JOIN SERVER</h3>
                <button
                  onClick={() => window.location.href = `samp://${serverIp}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 grad-purple text-white font-bold text-sm tracking-widest btn-glow"
                >
                  <Gamepad2 className="w-5 h-5" />
                  CONNECT
                </button>
                <p className="text-xs text-[#A1A1AA] mt-3 text-center font-mono">{serverIp}</p>
              </div>

              {/* Admin Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="glass-panel p-6 flex items-center gap-4 hover:border-[#7C3AED]/50 transition-all group block"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-[#7C3AED]/20">
                    <Shield className="w-6 h-6 text-[#A78BFA]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors">
                      Admin Panel
                    </h3>
                    <p className="text-xs text-[#A1A1AA]">Manage server settings</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#A78BFA] ml-auto transition-colors" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
