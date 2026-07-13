import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bell, Pin, Calendar, User } from "lucide-react";

export default function Announcements() {
  const { data: announcements } = trpc.announcement.list.useQuery();

  const pinned = announcements?.filter((a) => a.isPinned) || [];
  const regular = announcements?.filter((a) => !a.isPinned) || [];

  return (
    <div className="min-h-screen bg-[#050507]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              NEWS & <span className="text-[#A78BFA] neon-text">ANNOUNCEMENTS</span>
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent mb-4" />
            <p className="text-[#A1A1AA] max-w-lg mx-auto">
              Stay up to date with the latest news, updates, and events from ASOTIME RP.
            </p>
          </div>

          {/* Pinned Announcements */}
          {pinned.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Pin className="w-4 h-4 text-[#A78BFA]" />
                <h2 className="text-sm font-bold tracking-widest text-[#A78BFA]">
                  PINNED
                </h2>
              </div>
              <div className="space-y-4">
                {pinned.map((ann) => (
                  <AnnouncementCard key={ann.id} announcement={ann} pinned />
                ))}
              </div>
            </div>
          )}

          {/* Regular Announcements */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-[#22D3EE]" />
              <h2 className="text-sm font-bold tracking-widest text-[#22D3EE]">
                ALL ANNOUNCEMENTS
              </h2>
            </div>

            {regular.length === 0 && pinned.length === 0 ? (
              <div className="glass-panel p-12 text-center">
                <Bell className="w-16 h-16 text-[#A1A1AA] mx-auto mb-4" />
                <p className="text-[#A1A1AA]">No announcements yet.</p>
                <p className="text-sm text-[#A1A1AA] mt-2">
                  Check back later for updates!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {regular.map((ann) => (
                  <AnnouncementCard key={ann.id} announcement={ann} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function AnnouncementCard({
  announcement: ann,
  pinned = false,
}: {
  announcement: {
    id: number;
    title: string;
    content: string;
    isPinned: boolean;
    createdBy: string | null;
    createdAt: Date;
  };
  pinned?: boolean;
}) {
  return (
    <div
      className={`glass-panel p-6 hover:bg-white/5 transition-all duration-300 ${
        pinned ? "border-l-2 border-l-[#A78BFA]" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{ann.title}</h3>
        {pinned && (
          <span className="flex-shrink-0 px-2 py-1 text-[10px] font-bold tracking-wider bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30">
            PINNED
          </span>
        )}
      </div>

      <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4 whitespace-pre-line">
        {ann.content}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <User className="w-3 h-3" />
            <span>{ann.createdBy || "Admin"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <Calendar className="w-3 h-3" />
            <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
