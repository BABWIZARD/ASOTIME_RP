import { Link } from "react-router";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 grid-bg">
      {/* Background glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-[#A78BFA] mx-auto mb-6" />
        <h1 className="text-8xl font-black text-white mb-4">
          4<span className="text-[#A78BFA]">0</span>4
        </h1>
        <h2 className="text-xl font-bold text-white tracking-wider mb-2">
          PAGE NOT FOUND
        </h2>
        <p className="text-[#A1A1AA] mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Check the URL or go back to the homepage.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 grad-purple text-white font-bold text-sm tracking-widest btn-glow"
        >
          <Home className="w-5 h-5" />
          GO HOME
        </Link>
      </div>
    </div>
  );
}
