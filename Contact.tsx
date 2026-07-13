import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mail,
  MessageSquare,
  Send,
  User,
  AtSign,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050507]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              CONTACT <span className="text-[#A78BFA] neon-text">US</span>
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent mb-4" />
            <p className="text-[#A1A1AA] max-w-lg mx-auto">
              Have a question or need support? Reach out to us and we will get back to you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-panel p-6">
                <div className="w-12 h-12 flex items-center justify-center bg-[#7C3AED]/20 mb-4">
                  <Mail className="w-6 h-6 text-[#A78BFA]" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wider mb-2">EMAIL</h3>
                <p className="text-sm text-[#A1A1AA]">support@asotimerp.com</p>
              </div>

              <div className="glass-panel p-6">
                <div className="w-12 h-12 flex items-center justify-center bg-[#22D3EE]/20 mb-4">
                  <MessageSquare className="w-6 h-6 text-[#22D3EE]" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wider mb-2">DISCORD</h3>
                <p className="text-sm text-[#A1A1AA]">Join our Discord server</p>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-[#A78BFA] hover:text-white transition-colors"
                >
                  Go to Community <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="glass-panel p-6">
                <div className="w-12 h-12 flex items-center justify-center bg-green-500/20 mb-4">
                  <MessageSquare className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wider mb-2">WHATSAPP</h3>
                <p className="text-sm text-[#A1A1AA]">Join our WhatsApp group</p>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-[#A78BFA] hover:text-white transition-colors"
                >
                  Go to Community <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-8">
                <h2 className="text-lg font-bold text-white tracking-wider mb-6">
                  SEND A <span className="text-[#22D3EE]">MESSAGE</span>
                </h2>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-sm text-[#A1A1AA]">
                      We will get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold tracking-widest text-[#A1A1AA] mb-2">
                          NAME
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="gaming-input w-full pl-10 pr-4 py-3 text-sm"
                            placeholder="Your name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-widest text-[#A1A1AA] mb-2">
                          EMAIL
                        </label>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="gaming-input w-full pl-10 pr-4 py-3 text-sm"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-widest text-[#A1A1AA] mb-2">
                        SUBJECT
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="gaming-input w-full px-4 py-3 text-sm"
                        placeholder="What is this about?"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-widest text-[#A1A1AA] mb-2">
                        MESSAGE
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="gaming-input w-full px-4 py-3 text-sm min-h-[150px] resize-none"
                        placeholder="Your message..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 grad-purple text-white font-bold text-sm tracking-widest btn-glow"
                    >
                      <Send className="w-4 h-4" />
                      SEND MESSAGE
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
