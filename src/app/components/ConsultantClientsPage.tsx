import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import {
  Search,
  Star,
  MessageCircle,
  Filter,
  ChevronRight,
} from "lucide-react";

type FilterType = "all" | "active" | "new" | "completed";

const demoClients = [
  {
    id: 1,
    name: "Tanvir Hassan",
    plan: "Premium",
    sessions: 5,
    lastSession: "Today, 10:30 AM",
    rating: 5,
    topic: "Budget Review",
    status: "active" as const,
    avatar: "T",
  },
  {
    id: 2,
    name: "Mira Sen",
    plan: "Basic",
    sessions: 3,
    lastSession: "Yesterday",
    rating: 4,
    topic: "Investment Advice",
    status: "active" as const,
    avatar: "M",
  },
  {
    id: 3,
    name: "Karim Ahmed",
    plan: "Elite",
    sessions: 8,
    lastSession: "2 days ago",
    rating: 5,
    topic: "Debt Strategy",
    status: "active" as const,
    avatar: "K",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    plan: "Premium",
    sessions: 12,
    lastSession: "3 days ago",
    rating: 5,
    topic: "Tax Planning",
    status: "completed" as const,
    avatar: "N",
  },
  {
    id: 5,
    name: "Rafi Uddin",
    plan: "Basic",
    sessions: 2,
    lastSession: "1 week ago",
    rating: 4,
    topic: "Savings Plan",
    status: "completed" as const,
    avatar: "R",
  },
  {
    id: 6,
    name: "Sabina Akhter",
    plan: "Starter",
    sessions: 0,
    lastSession: "New client",
    rating: 0,
    topic: "Budget Planning",
    status: "new" as const,
    avatar: "S",
  },
];

const planColors: Record<string, string> = {
  Starter: "#94A3B8",
  Basic: "#1E3A8A",
  Premium: "#4CAF50",
  Elite: "#FFDD36",
};

export function ConsultantClientsPage() {
  const { consultantOwnProfile } = useAppContext();
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filtered = demoClients.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const counts = {
    all: demoClients.length,
    active: demoClients.filter((c) => c.status === "active").length,
    new: demoClients.filter((c) => c.status === "new").length,
    completed: demoClients.filter((c) => c.status === "completed").length,
  };

  return (
    <div className="h-full bg-white overflow-y-auto pb-28">
      {/* Header */}
      <div className="pt-14 px-5 pb-4">
        <h1 className="text-[24px] font-inter font-bold text-black">
          My Clients
        </h1>
        <p className="text-[12px] font-inter text-black/40 mt-0.5">
          {demoClients.length} total clients
        </p>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30"
          />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] bg-gray-50 rounded-xl pl-10 pr-4 text-[13px] font-inter outline-none border border-black/5"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {(
          [
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "new", label: "New" },
            { key: "completed", label: "Done" },
          ] as { key: FilterType; label: string }[]
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-inter font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filter === f.key
                ? "bg-[#1E3A8A] text-white"
                : "bg-gray-100 text-black/40"
            }`}
          >
            {f.label}
            <span
              className={`text-[9px] ${
                filter === f.key ? "text-white/60" : "text-black/20"
              }`}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Client list */}
      <div className="px-5 flex flex-col gap-2.5">
        {filtered.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[16px] p-4 border border-black/5 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center shrink-0">
                <span className="text-[14px] font-inter font-bold text-[#1E3A8A]">
                  {client.avatar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-inter font-bold text-black truncate">
                    {client.name}
                  </p>
                  <span
                    className="text-[8px] font-inter font-bold px-1.5 py-0.5 rounded-full text-white shrink-0"
                    style={{
                      backgroundColor:
                        planColors[client.plan] || "#94A3B8",
                    }}
                  >
                    {client.plan}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-inter text-black/40">
                    {client.sessions} sessions
                  </span>
                  <span className="text-black/10 text-[10px]">|</span>
                  <span className="text-[11px] font-inter text-black/40">
                    {client.lastSession}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {client.rating > 0 && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: client.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={8}
                        className="text-[#FFDD36]"
                        fill="#FFDD36"
                      />
                    ))}
                  </div>
                )}
                <span
                  className={`text-[9px] font-inter font-semibold px-2 py-0.5 rounded-full ${
                    client.status === "active"
                      ? "bg-[#4CAF50]/10 text-[#4CAF50]"
                      : client.status === "new"
                      ? "bg-[#1E3A8A]/10 text-[#1E3A8A]"
                      : "bg-black/5 text-black/30"
                  }`}
                >
                  {client.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-black/5">
              <span className="text-[11px] font-inter text-black/30">
                Topic: {client.topic}
              </span>
              <button className="flex items-center gap-1 text-[11px] font-inter font-medium text-[#1E3A8A]">
                <MessageCircle size={12} />
                Message
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-5">
          <Search size={32} className="text-black/10 mb-3" />
          <p className="text-[14px] font-inter font-bold text-black/30">
            No clients found
          </p>
          <p className="text-[12px] font-inter text-black/20 mt-1">
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
}
