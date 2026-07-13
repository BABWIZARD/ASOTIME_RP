import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import {
  Shield,
  Users,
  Settings,
  Bell,
  Download,
  Link as LinkIcon,
  Video,
  Save,
  Trash2,
  Ban,
  UserCheck,
  Plus,
  X,
  Edit3,
  AlertCircle,
  CheckCircle,
  Server,
  Globe,
  Image,
} from "lucide-react";

type TabType = "users" | "announcements" | "downloads" | "community" | "media" | "settings";

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      window.location.href = "/dashboard";
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "announcements", label: "Announcements", icon: <Bell className="w-4 h-4" /> },
    { id: "downloads", label: "Downloads", icon: <Download className="w-4 h-4" /> },
    { id: "community", label: "Community", icon: <LinkIcon className="w-4 h-4" /> },
    { id: "media", label: "Media", icon: <Video className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050507]">
      <Navbar />

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 flex items-center gap-2 text-sm font-semibold ${
            notification.type === "success"
              ? "bg-green-500/20 border border-green-500/30 text-green-400"
              : "bg-red-500/20 border border-red-500/30 text-red-400"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {notification.message}
        </div>
      )}

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-[#A78BFA]" />
              <h1 className="text-3xl font-black text-white tracking-wider">
                ADMIN <span className="text-[#A78BFA]">PANEL</span>
              </h1>
            </div>
            <p className="text-sm text-[#A1A1AA]">
              Manage your ASOTIME RP server settings and content
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-8 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "text-[#A78BFA] border-b-2 border-[#7C3AED] bg-[#7C3AED]/10"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "users" && <UsersTab showNotification={showNotification} />}
          {activeTab === "announcements" && <AnnouncementsTab showNotification={showNotification} />}
          {activeTab === "downloads" && <DownloadsTab showNotification={showNotification} />}
          {activeTab === "community" && <CommunityTab showNotification={showNotification} />}
          {activeTab === "media" && <MediaTab showNotification={showNotification} />}
          {activeTab === "settings" && <SettingsTab showNotification={showNotification} />}
        </div>
      </div>
    </div>
  );
}

// Users Tab
function UsersTab({
  showNotification,
}: {
  showNotification: (type: "success" | "error", message: string) => void;
}) {
  const { data, refetch } = trpc.user.list.useQuery();
  const banMutation = trpc.user.ban.useMutation({
    onSuccess: () => {
      showNotification("success", "User banned successfully");
      refetch();
    },
  });
  const unbanMutation = trpc.user.unban.useMutation({
    onSuccess: () => {
      showNotification("success", "User unbanned successfully");
      refetch();
    },
  });
  const deleteMutation = trpc.user.delete.useMutation({
    onSuccess: () => {
      showNotification("success", "User deleted successfully");
      refetch();
    },
  });

  const oauthUsers = (data?.oauthUsers || []).map((u) => ({ ...u, type: "oauth" as const }));
  const localUsersList = (data?.localUsers || []).map((u) => ({ ...u, type: "local" as const }));
  const allUsers = [...oauthUsers, ...localUsersList];

  const getUserDisplayName = (u: (typeof allUsers)[number]) => {
    if (u.type === "oauth") return u.name || "Unknown";
    return u.displayName || u.username || "Unknown";
  };

  const getUserInitial = (u: (typeof allUsers)[number]) => {
    return getUserDisplayName(u).charAt(0).toUpperCase();
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 tracking-wider">
        REGISTERED <span className="text-[#A78BFA]">USERS</span>
        <span className="ml-2 text-sm text-[#A1A1AA]">({allUsers.length})</span>
      </h2>

      {allUsers.length === 0 ? (
        <div className="glass-panel p-8 text-center text-[#A1A1AA]">No users registered yet.</div>
      ) : (
        <div className="space-y-2">
          {allUsers.map((u) => (
            <div
              key={`${u.type}-${u.id}`}
              className="glass-panel p-4 flex items-center justify-between hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] text-white text-sm font-bold">
                  {getUserInitial(u)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {getUserDisplayName(u)}
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    {u.email || "No email"} | {u.type === "oauth" ? "OAuth" : "Local"} |{" "}
                    <span className={u.role === "admin" ? "text-[#A78BFA]" : "text-[#A1A1AA]"}>
                      {u.role?.toUpperCase()}
                    </span>
                    {u.isBanned && (
                      <span className="ml-2 text-red-400">[BANNED]</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {u.isBanned ? (
                  <button
                    onClick={() => unbanMutation.mutate({ userId: u.id, type: u.type })}
                    className="p-2 text-green-400 hover:bg-green-400/10 transition-colors"
                    title="Unban user"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => banMutation.mutate({ userId: u.id, type: u.type })}
                    className="p-2 text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                    title="Ban user"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this user?")) {
                      deleteMutation.mutate({ userId: u.id, type: u.type });
                    }
                  }}
                  className="p-2 text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Announcements Tab
function AnnouncementsTab({
  showNotification,
}: {
  showNotification: (type: "success" | "error", message: string) => void;
}) {
  const { data, refetch } = trpc.announcement.list.useQuery();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const createMutation = trpc.announcement.create.useMutation({
    onSuccess: () => {
      showNotification("success", "Announcement created");
      setIsCreating(false);
      setTitle("");
      setContent("");
      setIsPinned(false);
      refetch();
    },
  });

  const updateMutation = trpc.announcement.update.useMutation({
    onSuccess: () => {
      showNotification("success", "Announcement updated");
      setEditingId(null);
      setTitle("");
      setContent("");
      setIsPinned(false);
      refetch();
    },
  });

  const deleteMutation = trpc.announcement.delete.useMutation({
    onSuccess: () => {
      showNotification("success", "Announcement deleted");
      refetch();
    },
  });

  const handleSubmit = () => {
    if (!title || !content) {
      showNotification("error", "Title and content are required");
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, title, content, isPinned });
    } else {
      createMutation.mutate({ title, content, isPinned });
    }
  };

  const startEdit = (ann: { id: number; title: string; content: string; isPinned: boolean }) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setIsPinned(ann.isPinned);
    setIsCreating(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white tracking-wider">
          <span className="text-[#A78BFA]">ANNOUNCEMENTS</span>{" "}
          <span className="text-sm text-[#A1A1AA]">({data?.length || 0})</span>
        </h2>
        {!isCreating && (
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
              setTitle("");
              setContent("");
              setIsPinned(false);
            }}
            className="flex items-center gap-2 px-4 py-2 grad-purple text-white text-xs font-bold tracking-widest btn-glow"
          >
            <Plus className="w-4 h-4" />
            CREATE
          </button>
        )}
      </div>

      {isCreating && (
        <div className="glass-panel p-6 mb-6">
          <h3 className="text-sm font-bold text-white mb-4">
            {editingId ? "EDIT" : "NEW"} ANNOUNCEMENT
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#A1A1AA] tracking-wider mb-1">TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="gaming-input w-full px-4 py-2 text-sm"
                placeholder="Announcement title"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A1A1AA] tracking-wider mb-1">CONTENT</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="gaming-input w-full px-4 py-2 text-sm min-h-[100px] resize-none"
                placeholder="Announcement content"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#A1A1AA]">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 accent-[#7C3AED]"
              />
              Pin this announcement
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 grad-purple text-white text-xs font-bold tracking-widest btn-glow disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {editingId ? "UPDATE" : "SAVE"}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[#A1A1AA] text-xs font-bold tracking-widest hover:text-white"
              >
                <X className="w-4 h-4" />
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data?.map((ann) => (
          <div key={ann.id} className="glass-panel p-4 hover:bg-white/5 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">{ann.title}</h3>
                  {ann.isPinned && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#7C3AED]/20 text-[#A78BFA]">
                      PINNED
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A1A1AA] line-clamp-2">{ann.content}</p>
                <p className="text-[10px] text-[#A1A1AA] mt-1">
                  by {ann.createdBy} | {new Date(ann.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => startEdit(ann)}
                  className="p-2 text-[#A78BFA] hover:bg-[#A78BFA]/10 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this announcement?")) {
                      deleteMutation.mutate({ id: ann.id });
                    }
                  }}
                  className="p-2 text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Downloads Tab
function DownloadsTab({
  showNotification,
}: {
  showNotification: (type: "success" | "error", message: string) => void;
}) {
  const { data, refetch } = trpc.download.list.useQuery();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [url, setUrl] = useState("");

  const updateMutation = trpc.download.update.useMutation({
    onSuccess: () => {
      showNotification("success", "Download link updated");
      setEditingId(null);
      refetch();
    },
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 tracking-wider">
        <span className="text-[#A78BFA]">DOWNLOAD</span> LINKS
      </h2>

      <div className="space-y-4">
        {data?.map((dl) => (
          <div key={dl.id} className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">{dl.name}</h3>
                <p className="text-xs text-[#A1A1AA]">{dl.label}</p>
              </div>
              {editingId !== dl.id && (
                <button
                  onClick={() => {
                    setEditingId(dl.id);
                    setUrl(dl.url);
                  }}
                  className="flex items-center gap-2 px-3 py-2 border border-white/20 text-xs text-[#A1A1AA] hover:text-white hover:border-[#7C3AED] transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  EDIT
                </button>
              )}
            </div>

            {editingId === dl.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="gaming-input w-full px-4 py-2 text-sm"
                  placeholder="Enter new URL"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMutation.mutate({ id: dl.id, url })}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 grad-purple text-white text-xs font-bold tracking-widest btn-glow disabled:opacity-50"
                  >
                    <Save className="w-3 h-3" />
                    SAVE
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[#A1A1AA] text-xs font-bold hover:text-white"
                  >
                    <X className="w-3 h-3" />
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#A1A1AA] font-mono break-all">{dl.url}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Community Tab
function CommunityTab({
  showNotification,
}: {
  showNotification: (type: "success" | "error", message: string) => void;
}) {
  const { data, refetch } = trpc.community.list.useQuery();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [url, setUrl] = useState("");

  const updateMutation = trpc.community.update.useMutation({
    onSuccess: () => {
      showNotification("success", "Community link updated");
      setEditingId(null);
      refetch();
    },
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 tracking-wider">
        <span className="text-[#A78BFA]">COMMUNITY</span> LINKS
      </h2>

      <div className="space-y-4">
        {data?.map((link) => (
          <div key={link.id} className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#A78BFA]" />
                <div>
                  <h3 className="text-sm font-bold text-white">{link.platform}</h3>
                  <p className="text-xs text-[#A1A1AA]">{link.label}</p>
                </div>
              </div>
              {editingId !== link.id && (
                <button
                  onClick={() => {
                    setEditingId(link.id);
                    setUrl(link.url);
                  }}
                  className="flex items-center gap-2 px-3 py-2 border border-white/20 text-xs text-[#A1A1AA] hover:text-white hover:border-[#7C3AED] transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  EDIT
                </button>
              )}
            </div>

            {editingId === link.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="gaming-input w-full px-4 py-2 text-sm"
                  placeholder="Enter new URL"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMutation.mutate({ id: link.id, url })}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 grad-purple text-white text-xs font-bold tracking-widest btn-glow disabled:opacity-50"
                  >
                    <Save className="w-3 h-3" />
                    SAVE
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[#A1A1AA] text-xs font-bold hover:text-white"
                  >
                    <X className="w-3 h-3" />
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#A1A1AA] font-mono break-all">{link.url}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Media Tab
function MediaTab({
  showNotification,
}: {
  showNotification: (type: "success" | "error", message: string) => void;
}) {
  const { data, refetch } = trpc.media.list.useQuery();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [mediaType, setMediaType] = useState<"video" | "image" | "youtube">("youtube");
  const [thumbnail, setThumbnail] = useState("");

  const createMutation = trpc.media.create.useMutation({
    onSuccess: () => {
      showNotification("success", "Media added");
      setIsCreating(false);
      setTitle("");
      setUrl("");
      setThumbnail("");
      refetch();
    },
  });

  const deleteMutation = trpc.media.delete.useMutation({
    onSuccess: () => {
      showNotification("success", "Media deleted");
      refetch();
    },
  });

  const setActiveMutation = trpc.media.setActive.useMutation({
    onSuccess: () => {
      showNotification("success", "Media set as active");
      refetch();
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white tracking-wider">
          <span className="text-[#A78BFA]">MEDIA</span>{" "}
          <span className="text-sm text-[#A1A1AA]">({data?.length || 0})</span>
        </h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 grad-purple text-white text-xs font-bold tracking-widest btn-glow"
          >
            <Plus className="w-4 h-4" />
            ADD MEDIA
          </button>
        )}
      </div>

      {isCreating && (
        <div className="glass-panel p-6 mb-6">
          <h3 className="text-sm font-bold text-white mb-4">ADD NEW MEDIA</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#A1A1AA] tracking-wider mb-1">TYPE</label>
              <div className="flex gap-2">
                {(["youtube", "video", "image"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setMediaType(t)}
                    className={`px-4 py-2 text-xs font-bold tracking-wider ${
                      mediaType === t
                        ? "grad-purple text-white"
                        : "border border-white/20 text-[#A1A1AA] hover:text-white"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#A1A1AA] tracking-wider mb-1">TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="gaming-input w-full px-4 py-2 text-sm"
                placeholder="Media title"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A1A1AA] tracking-wider mb-1">
                {mediaType === "youtube" ? "YOUTUBE URL" : "URL"}
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="gaming-input w-full px-4 py-2 text-sm"
                placeholder={
                  mediaType === "youtube"
                    ? "https://youtube.com/watch?v=..."
                    : "https://..."
                }
              />
            </div>
            {mediaType !== "youtube" && (
              <div>
                <label className="block text-xs text-[#A1A1AA] tracking-wider mb-1">
                  THUMBNAIL URL (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="gaming-input w-full px-4 py-2 text-sm"
                  placeholder="Thumbnail image URL"
                />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!title || !url) {
                    showNotification("error", "Title and URL are required");
                    return;
                  }
                  createMutation.mutate({
                    type: mediaType,
                    title,
                    url,
                    thumbnail: thumbnail || undefined,
                  });
                }}
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 grad-purple text-white text-xs font-bold tracking-widest btn-glow disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                SAVE
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[#A1A1AA] text-xs font-bold hover:text-white"
              >
                <X className="w-4 h-4" />
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data?.map((m) => (
          <div
            key={m.id}
            className={`glass-panel p-4 ${m.isActive ? "border-l-2 border-l-green-500" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      m.type === "youtube"
                        ? "bg-red-500/20 text-red-400"
                        : m.type === "video"
                        ? "bg-[#7C3AED]/20 text-[#A78BFA]"
                        : "bg-[#22D3EE]/20 text-[#22D3EE]"
                    }`}
                  >
                    {m.type.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  {m.isActive && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-400">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A1A1AA] font-mono break-all">{m.url}</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                {!m.isActive && (
                  <button
                    onClick={() => setActiveMutation.mutate({ id: m.id })}
                    className="p-2 text-green-400 hover:bg-green-400/10 transition-colors"
                    title="Set as active"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Delete this media?")) {
                      deleteMutation.mutate({ id: m.id });
                    }
                  }}
                  className="p-2 text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings Tab
function SettingsTab({
  showNotification,
}: {
  showNotification: (type: "success" | "error", message: string) => void;
}) {
  const { data: settings } = trpc.settings.getAll.useQuery();
  const utils = trpc.useUtils();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const updateMutation = trpc.settings.updateBatch.useMutation({
    onSuccess: () => {
      showNotification("success", "Settings saved");
      utils.settings.getAll.invalidate();
    },
  });

  const handleSave = () => {
    const settingsArray = Object.entries(localSettings).map(([key, value]) => ({
      key,
      value,
    }));
    updateMutation.mutate({ settings: settingsArray });
  };

  const updateValue = (key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const settingFields = [
    { key: "serverIp", label: "Server IP", icon: <Server className="w-4 h-4 text-[#A78BFA]" /> },
    { key: "siteName", label: "Site Name", icon: <Globe className="w-4 h-4 text-[#22D3EE]" /> },
    { key: "logoUrl", label: "Logo URL", icon: <Image className="w-4 h-4 text-[#C084FC]" /> },
    { key: "bannerUrl", label: "Banner URL", icon: <Image className="w-4 h-4 text-green-400" /> },
    { key: "serverStatus", label: "Server Status", icon: <Server className="w-4 h-4 text-green-400" /> },
    { key: "onlinePlayers", label: "Online Players Count", icon: <Users className="w-4 h-4 text-[#A78BFA]" /> },
    { key: "maxPlayers", label: "Max Players", icon: <Users className="w-4 h-4 text-[#22D3EE]" /> },
    { key: "uptime", label: "Uptime", icon: <Server className="w-4 h-4 text-[#C084FC]" /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white tracking-wider">
          <span className="text-[#A78BFA]">WEBSITE</span> SETTINGS
        </h2>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 grad-purple text-white text-xs font-bold tracking-widest btn-glow disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {updateMutation.isPending ? "SAVING..." : "SAVE ALL"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {settingFields.map((field) => (
          <div key={field.key} className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              {field.icon}
              <label className="text-xs font-semibold tracking-wider text-[#A1A1AA]">
                {field.label.toUpperCase()}
              </label>
            </div>
            <input
              type="text"
              value={localSettings[field.key] || ""}
              onChange={(e) => updateValue(field.key, e.target.value)}
              className="gaming-input w-full px-4 py-2 text-sm"
              placeholder={`Enter ${field.label}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
