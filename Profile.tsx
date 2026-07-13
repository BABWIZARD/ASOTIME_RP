import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User,
  Mail,
  Shield,
  Gamepad2,
  Award,
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isAdmin } = useAuth();

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

  return (
    <div className="min-h-screen bg-[#050507]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
              <User className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">{user?.name}</h1>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-[#7C3AED]/20 text-[#A78BFA] text-xs font-bold tracking-wider">
              {isAdmin ? (
                <>
                  <Shield className="w-3 h-3" /> ADMINISTRATOR
                </>
              ) : (
                <>
                  <Gamepad2 className="w-3 h-3" /> PLAYER
                </>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="glass-panel p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white tracking-wider">
                PROFILE <span className="text-[#A78BFA]">INFO</span>
              </h2>
            </div>

            <div className="space-y-5">
              {/* Username */}
              <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5">
                <User className="w-5 h-5 text-[#A78BFA]" />
                <div className="flex-1">
                  <p className="text-xs text-[#A1A1AA] tracking-wider">USERNAME</p>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5">
                <Mail className="w-5 h-5 text-[#22D3EE]" />
                <div className="flex-1">
                  <p className="text-xs text-[#A1A1AA] tracking-wider">EMAIL</p>
                  <p className="text-sm font-semibold text-white">{user?.email || "Not set"}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5">
                <Shield className="w-5 h-5 text-[#C084FC]" />
                <div className="flex-1">
                  <p className="text-xs text-[#A1A1AA] tracking-wider">ROLE</p>
                  <p className="text-sm font-semibold text-white capitalize">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>

              {/* Auth Type */}
              <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5">
                <Award className="w-5 h-5 text-green-400" />
                <div className="flex-1">
                  <p className="text-xs text-[#A1A1AA] tracking-wider">AUTH TYPE</p>
                  <p className="text-sm font-semibold text-white capitalize">
                    {user?.authType === "oauth" ? "Portal OAuth" : "Local Account"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 glass-panel p-8">
            <h2 className="text-lg font-bold text-white tracking-wider mb-6">
              ACCOUNT <span className="text-[#22D3EE]">STATS</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-white/5 text-center">
                <p className="text-2xl font-black text-[#A78BFA]">0</p>
                <p className="text-xs text-[#A1A1AA] tracking-wider">HOURS PLAYED</p>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 text-center">
                <p className="text-2xl font-black text-[#22D3EE]">0</p>
                <p className="text-xs text-[#A1A1AA] tracking-wider">SCORE</p>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 text-center">
                <p className="text-2xl font-black text-[#C084FC]">0</p>
                <p className="text-xs text-[#A1A1AA] tracking-wider">MONEY</p>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 text-center">
                <p className="text-2xl font-black text-green-400">0</p>
                <p className="text-xs text-[#A1A1AA] tracking-wider">LEVEL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
