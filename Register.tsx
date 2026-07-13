import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { UserPlus, User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const registerMutation = trpc.localAuth.register.useMutation({
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

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    registerMutation.mutate({
      username,
      email,
      password,
      displayName: username,
    });
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-8 grid-bg">
      {/* Background glow */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-[120px] pointer-events-none" />

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
            CREATE <span className="text-[#A78BFA]">ACCOUNT</span>
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-2">Join the ASOTIME RP community</p>
        </div>

        {/* Register Form */}
        <div className="glass-panel p-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest text-[#A1A1AA] mb-2">
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="gaming-input w-full pl-10 pr-4 py-3 text-sm"
                  placeholder="Enter your email"
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
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest text-[#A1A1AA] mb-2">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="gaming-input w-full pl-10 pr-4 py-3 text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 grad-purple text-white font-bold text-sm tracking-widest btn-glow disabled:opacity-50"
            >
              {registerMutation.isPending ? (
                "CREATING ACCOUNT..."
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  REGISTER
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-sm text-[#A1A1AA]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#A78BFA] hover:text-white transition-colors font-semibold"
          >
            Login here
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
