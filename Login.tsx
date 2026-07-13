import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { LogIn, User, Lock, ArrowRight, Globe } from "lucide-react";

function getOAuthUrl() {
  const authUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${authUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/dashboard";
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 grid-bg">
      {/* Background glow */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="ASOTIME RP"
              className="h-20 mx-auto mb-4 object-contain"
            />
          </Link>
          <h1 className="text-2xl font-black text-white tracking-wider">
            WELCOME <span className="text-[#A78BFA]">BACK</span>
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-2">Login to your account</p>
        </div>

        {/* Login Form */}
        <div className="glass-panel p-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest text-[#A1A1AA] mb-2">
                USERNAME
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="gaming-input w-full pl-10 pr-4 py-3 text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest text-[#A1A1AA] mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="gaming-input w-full pl-10 pr-4 py-3 text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 grad-purple text-white font-bold text-sm tracking-widest btn-glow disabled:opacity-50"
            >
              {loginMutation.isPending ? (
                "LOGGING IN..."
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  LOGIN
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-[#A1A1AA]">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* OAuth Login */}
          <a
            href={getOAuthUrl()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold text-sm tracking-wider hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all"
          >
            <Globe className="w-5 h-5" />
            LOGIN WITH PORTAL
          </a>
        </div>

        {/* Register link */}
        <p className="text-center mt-6 text-sm text-[#A1A1AA]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#A78BFA] hover:text-white transition-colors font-semibold"
          >
            Register here
          </Link>
        </p>

        {/* Back link */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-xs text-[#A1A1AA] hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
