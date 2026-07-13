import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Download,
  Users,
  Bell,
  User,
  MessageSquare,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

const navLinks = [
  { path: "/", label: "HOME", icon: Home },
  { path: "/dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { path: "/downloads", label: "DOWNLOADS", icon: Download },
  { path: "/community", label: "COMMUNITY", icon: Users },
  { path: "/announcements", label: "NEWS", icon: Bell },
  { path: "/contact", label: "CONTACT", icon: MessageSquare },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050507]/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/logo.png"
              alt="ASOTIME RP"
              className="h-10 w-auto object-contain group-hover:drop-shadow-[0_0_8px_rgba(124,58,237,0.6)] transition-all duration-300"
            />
            <span className="hidden sm:block text-lg font-bold tracking-wider neon-text">
              ASOTIME RP
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-xs font-semibold tracking-widest transition-all duration-300 relative group ${
                    isActive
                      ? "text-[#A78BFA]"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold tracking-widest text-[#A78BFA] hover:text-white transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    ADMIN
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold tracking-widest text-[#A1A1AA] hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user?.name?.toUpperCase()}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest border border-white/20 text-[#A1A1AA] hover:text-white hover:border-[#7C3AED] transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest border border-white/20 text-[#A1A1AA] hover:text-white hover:border-[#7C3AED] transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest grad-purple text-white btn-glow"
                >
                  <UserPlus className="w-4 h-4" />
                  REGISTER
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#050507]/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wider transition-all ${
                    isActive
                      ? "text-[#A78BFA] bg-white/5 border-l-2 border-[#7C3AED]"
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/10 space-y-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wider text-[#A78BFA] hover:bg-white/5"
                    >
                      <Shield className="w-4 h-4" />
                      ADMIN PANEL
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wider text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  >
                    <User className="w-4 h-4" />
                    PROFILE
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wider text-red-400 hover:bg-white/5 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wider text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  >
                    <LogIn className="w-4 h-4" />
                    LOGIN
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wider text-[#A78BFA] hover:bg-white/5"
                  >
                    <UserPlus className="w-4 h-4" />
                    REGISTER
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
