import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, Smartphone, Archive, ExternalLink } from "lucide-react";

export default function DownloadsPage() {
  const { data: downloads } = trpc.download.list.useQuery();

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("apk")) {
      return <Smartphone className="w-12 h-12 text-[#22D3EE]" />;
    }
    return <Archive className="w-12 h-12 text-[#A78BFA]" />;
  };

  return (
    <div className="min-h-screen bg-[#050507]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              <span className="text-[#A78BFA] neon-text">DOWNLOAD</span>CENTER
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent mb-4" />
            <p className="text-[#A1A1AA] max-w-lg mx-auto">
              Get everything you need to join ASOTIME RP. Download the APK and MODPACK to get started.
            </p>
          </div>

          {/* Download Cards */}
          {downloads && downloads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {downloads.map((dl) => (
                <div
                  key={dl.id}
                  className="glass-panel p-8 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 flex items-center justify-center bg-black/40 border border-white/10 group-hover:border-[#7C3AED]/50 transition-colors">
                      {getIcon(dl.name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white group-hover:text-[#A78BFA] transition-colors">
                        {dl.name}
                      </h2>
                      <p className="text-sm text-[#A1A1AA]">{dl.label}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#A1A1AA] mb-6 leading-relaxed">
                    Click below to download {dl.name}. Make sure you have enough storage space
                    and a stable internet connection before downloading.
                  </p>

                  <a
                    href={dl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 grad-purple text-white font-bold text-sm tracking-widest btn-glow"
                  >
                    <Download className="w-5 h-5" />
                    {dl.label.toUpperCase()}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center">
              <Download className="w-16 h-16 text-[#A1A1AA] mx-auto mb-4" />
              <p className="text-[#A1A1AA]">No downloads available yet.</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-12 glass-panel p-8">
            <h2 className="text-xl font-bold text-white mb-6 tracking-wider">
              INSTALLATION <span className="text-[#22D3EE]">GUIDE</span>
            </h2>
            <div className="space-y-4">
              {[
                "Download both the APK and MODPACK files from the links above.",
                "Install the ASOTIME APK on your Android device.",
                "Extract the MODPACK files to your device's game directory.",
                "Launch the game and connect to the server using the IP address.",
                "Create your character and start your roleplay journey!",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#7C3AED]/20 text-[#A78BFA] text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed pt-1">{step}</p>
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
