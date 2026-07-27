import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { Plus, TrendingUp, TrendingDown, Target, Wallet, ArrowRight, MessageCircle, Bot, Sparkles } from "lucide-react";
import imgLogo from "figma:asset/382f08e6232698109d7b6a37d63a98d9a4e0e79e.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const weeklyData = [
  { name: "Mon", expense: 800 },
  { name: "Tue", expense: 1200 },
  { name: "Wed", expense: 600 },
  { name: "Thu", expense: 4500 },
  { name: "Fri", expense: 900 },
  { name: "Sat", expense: 3500 },
  { name: "Sun", expense: 1800 },
];

function formatCurrency(amount: number) {
  return `৳${amount.toLocaleString()}`;
}

export function HomePage() {
  const navigate = useNavigate();
  const { user, totalBalance, totalIncome, totalExpense, savingsGoals, budgetCategories, transactions } = useAppContext();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const totalSavingsTarget = savingsGoals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSavingsCurrent = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
  const savingsPercent = totalSavingsTarget > 0 ? Math.round((totalSavingsCurrent / totalSavingsTarget) * 100) : 0;

  const totalBudget = budgetCategories.reduce((s, c) => s + c.budgetAmount, 0);
  const totalSpent = budgetCategories.reduce((s, c) => s + c.spentAmount, 0);

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

  return (
    <div className="h-full bg-white overflow-y-auto pb-28">
      {/* Header */}
      <div className="px-5 pt-14 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={imgLogo} alt="PocketGuru" className="w-[50px] h-[50px] object-contain" />
          <div>
            <p className="text-[13px] text-black/50 font-inter">{greeting},</p>
            <p className="text-[18px] font-inter font-bold text-black">{user.name} 👋</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 bg-[#FFDD36]/20 rounded-xl flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-[#E6484E] rounded-full absolute translate-x-2 -translate-y-2" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>

      {/* Balance Card */}
      <motion.div
        className="mx-5 mt-2 bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] rounded-[20px] p-5 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-white/60 text-[13px] font-inter">Total Balance</p>
        <p className="text-white text-[36px] font-inter font-bold mt-1">
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-white/50 text-[12px] font-inter">BDT</p>

        <div className="flex gap-4 mt-4">
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} className="text-[#4CAF50]" />
              <span className="text-white/60 text-[11px] font-inter">Income</span>
            </div>
            <p className="text-white text-[16px] font-inter font-bold">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={14} className="text-[#E6484E]" />
              <span className="text-white/60 text-[11px] font-inter">Expense</span>
            </div>
            <p className="text-white text-[16px] font-inter font-bold">
              {formatCurrency(totalExpense)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="px-5 mt-5">
        <div className="flex gap-3">
          {[
            { label: "Add Expense", icon: TrendingDown, color: "#E6484E", path: "/add-transaction?type=expense" },
            { label: "Add Income", icon: TrendingUp, color: "#4CAF50", path: "/add-transaction?type=income" },
            { label: "Set Goal", icon: Target, color: "#1E3A8A", path: "/add-goal" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-black/5 flex flex-col items-center gap-2 active:scale-[0.97] transition-transform"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: action.color + "15" }}
              >
                <action.icon size={20} color={action.color} />
              </div>
              <span className="text-[11px] font-inter font-medium text-black/70">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Savings Goals Preview */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[16px] font-inter font-bold text-black">Saving Goals</p>
          <button onClick={() => navigate("/activity")} className="text-[12px] text-[#1E3A8A] font-inter font-medium flex items-center gap-0.5">
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="bg-white rounded-[16px] p-4 shadow-sm border border-black/5 flex items-center gap-4">
          {/* Progress circle */}
          <div className="relative w-[70px] h-[70px] shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#f0f0f0" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#E6484E"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${savingsPercent * 2.64} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[16px] font-inter font-bold">{savingsPercent}%</span>
            </div>
          </div>
          <div>
            <p className="text-[22px] font-inter font-bold">
              {formatCurrency(totalSavingsCurrent)}
            </p>
            <p className="text-[12px] text-black/50 font-inter">
              of {formatCurrency(totalSavingsTarget)} target
            </p>
          </div>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[16px] font-inter font-bold text-black">Budget</p>
          <button onClick={() => navigate("/budget")} className="text-[12px] text-[#1E3A8A] font-inter font-medium flex items-center gap-0.5">
            Details <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          <div className="bg-[#E6484E] rounded-xl p-3 min-w-[120px] shrink-0">
            <p className="text-white/80 text-[11px] font-inter">Expense:</p>
            <p className="text-white text-[18px] font-inter font-bold mt-1">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="bg-[#E6484E] rounded-xl p-3 min-w-[120px] shrink-0">
            <p className="text-white/80 text-[11px] font-inter">Budget:</p>
            <p className="text-white text-[18px] font-inter font-bold mt-1">
              {formatCurrency(totalBudget)}
            </p>
          </div>
          <div className="bg-[#E6484E] rounded-xl p-3 min-w-[120px] shrink-0">
            <p className="text-white/80 text-[11px] font-inter">Savings:</p>
            <p className="text-white text-[18px] font-inter font-bold mt-1">
              {formatCurrency(totalBudget - totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* Expense Graph */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-[16px] p-4 shadow-sm border border-black/5">
          <p className="text-[14px] font-inter font-bold text-black mb-4">Expense Graph</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFDD36" strokeOpacity={0.3} />
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: "#FFDD36" }}
                  tick={{ fontSize: 11, fill: "#949494" }}
                />
                <YAxis
                  axisLine={{ stroke: "#FFDD36" }}
                  tick={{ fontSize: 11, fill: "#949494" }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#E6484E"
                  strokeWidth={2}
                  dot={{ fill: "#E6484E", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[16px] font-inter font-bold text-black">Recent Transactions</p>
          <button onClick={() => navigate("/transactions")} className="text-[12px] text-[#1E3A8A] font-inter font-medium flex items-center gap-0.5">
            See all <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {recentTransactions.map((t) => (
            <div
              key={t.id}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                t.type === "income"
                  ? "bg-[#4CAF50]/5 border-[#4CAF50]/30"
                  : "bg-[#E6484E]/5 border-[#E6484E]/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    t.type === "income" ? "bg-[#4CAF50]/15" : "bg-[#E6484E]/15"
                  }`}
                >
                  {t.type === "income" ? (
                    <TrendingUp size={16} className="text-[#4CAF50]" />
                  ) : (
                    <TrendingDown size={16} className="text-[#E6484E]" />
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-inter font-medium text-black">{t.category}</p>
                  <p className="text-[11px] text-black/40 font-inter">{t.date}</p>
                </div>
              </div>
              <p
                className={`text-[16px] font-inter font-bold ${
                  t.type === "income" ? "text-[#4CAF50]" : "text-[#E6484E]"
                }`}
              >
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Consultant CTA */}
      <div className="px-5 mt-6">
        <motion.button
          onClick={() => navigate("/consultants")}
          className="w-full bg-gradient-to-r from-[#1E3A8A]/5 to-[#FFDD36]/10 rounded-[16px] p-4 border border-[#1E3A8A]/10 flex items-center gap-3 active:scale-[0.98] transition-transform"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] flex items-center justify-center shrink-0">
            <Sparkles size={22} className="text-[#FFDD36]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-inter font-bold text-black">
              Need Budget Advice?
            </p>
            <p className="text-[11px] font-inter text-black/40">
              Chat with AI or certified experts
            </p>
          </div>
          <ArrowRight size={16} className="text-[#1E3A8A]" />
        </motion.button>
      </div>

      <div className="h-8" />
    </div>
  );
}