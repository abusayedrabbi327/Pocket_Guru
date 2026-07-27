import React, { createContext, useContext, useState, useCallback } from "react";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  spentAmount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  notificationsEnabled: boolean;
  darkMode: boolean;
  role: "user" | "consultant" | "admin";
  salary: number;
  subscription: SubscriptionTier | null;
}

export type SubscriptionTier = "starter" | "basic" | "premium" | "elite";

export type LoginRole = "user" | "consultant";

export interface ConsultantOwnProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  specialty: string;
  bio: string;
  certifications: string[];
  experience: number;
  hourlyRate: number;
  availability: "available" | "busy" | "offline";
  languages: string[];
  education: string;
  isOnboarded: boolean;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  salaryRange: string;
  salaryMin: number;
  salaryMax: number;
  features: string[];
  aiChats: number | "unlimited";
  humanSessions: number | "unlimited";
  color: string;
}

export interface Consultant {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  isAI: boolean;
  hourlyRate: number;
  availability: "available" | "busy" | "offline";
  bio: string;
  certifications: string[];
  experience: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAI: boolean;
}

export interface ChatSession {
  id: string;
  consultantId: string;
  consultantName: string;
  consultantAvatar: string;
  isAI: boolean;
  messages: ChatMessage[];
  status: "active" | "closed";
  lastMessage: string;
  lastMessageTime: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    tier: "starter",
    name: "Starter",
    price: 199,
    salaryRange: "Under ৳20,000",
    salaryMin: 0,
    salaryMax: 19999,
    features: ["AI Budget Advisor", "5 AI chats/month", "Basic insights"],
    aiChats: 5,
    humanSessions: 0,
    color: "#94A3B8",
  },
  {
    tier: "basic",
    name: "Basic",
    price: 499,
    salaryRange: "৳20,000 – ৳50,000",
    salaryMin: 20000,
    salaryMax: 50000,
    features: ["Unlimited AI chats", "2 human sessions/month", "Email support", "Budget templates"],
    aiChats: "unlimited",
    humanSessions: 2,
    color: "#1E3A8A",
  },
  {
    tier: "premium",
    name: "Premium",
    price: 999,
    salaryRange: "৳50,000 – ৳100,000",
    salaryMin: 50001,
    salaryMax: 100000,
    features: ["Unlimited AI chats", "5 human sessions/month", "Priority booking", "Investment advice", "Tax planning"],
    aiChats: "unlimited",
    humanSessions: 5,
    color: "#4CAF50",
  },
  {
    tier: "elite",
    name: "Elite",
    price: 1999,
    salaryRange: "Above ৳100,000",
    salaryMin: 100001,
    salaryMax: Infinity,
    features: ["Unlimited everything", "Dedicated consultant", "Portfolio review", "Tax filing help", "Priority 24/7 support"],
    aiChats: "unlimited",
    humanSessions: "unlimited",
    color: "#FFDD36",
  },
];

const defaultTransactions: Transaction[] = [
  { id: "1", type: "income", amount: 10000, category: "Salary", date: "2026-02-03", notes: "Monthly salary" },
  { id: "2", type: "income", amount: 5000, category: "Freelance", date: "2026-02-08", notes: "Consulting work" },
  { id: "3", type: "expense", amount: 500, category: "Food", date: "2026-02-09", notes: "Groceries" },
  { id: "4", type: "expense", amount: 1200, category: "Transport", date: "2026-02-05", notes: "Uber rides" },
  { id: "5", type: "expense", amount: 800, category: "Shopping", date: "2026-02-01", notes: "New headphones" },
  { id: "6", type: "expense", amount: 2500, category: "Rent", date: "2026-02-01", notes: "Monthly rent" },
  { id: "7", type: "expense", amount: 300, category: "Entertainment", date: "2026-02-12", notes: "Movie tickets" },
  { id: "8", type: "income", amount: 2000, category: "Side Hustle", date: "2026-02-15", notes: "Design project" },
];

const defaultGoals: SavingsGoal[] = [
  { id: "1", name: "Emergency Fund", targetAmount: 50000, currentAmount: 37500, deadline: "2026-06-30" },
  { id: "2", name: "New Laptop", targetAmount: 80000, currentAmount: 25000, deadline: "2026-12-31" },
  { id: "3", name: "Vacation Trip", targetAmount: 30000, currentAmount: 12000, deadline: "2026-08-15" },
];

const defaultBudgetCategories: BudgetCategory[] = [
  { id: "1", name: "Food", budgetAmount: 5000, spentAmount: 3200 },
  { id: "2", name: "Transport", budgetAmount: 3000, spentAmount: 2700 },
  { id: "3", name: "Shopping", budgetAmount: 4000, spentAmount: 1800 },
  { id: "4", name: "Rent", budgetAmount: 10000, spentAmount: 10000 },
  { id: "5", name: "Entertainment", budgetAmount: 2000, spentAmount: 800 },
  { id: "6", name: "Utilities", budgetAmount: 2000, spentAmount: 1500 },
];

const defaultConsultants: Consultant[] = [
  {
    id: "ai-1",
    name: "PocketGuru AI",
    specialty: "Budget Planning & Analysis",
    rating: 4.9,
    reviewCount: 12450,
    avatar: "",
    isAI: true,
    hourlyRate: 0,
    availability: "available",
    bio: "Your AI-powered financial companion. I analyze your spending patterns, create personalized budgets, and provide instant financial advice 24/7.",
    certifications: ["AI Financial Advisor", "Budget Optimization Engine"],
    experience: 0,
  },
  {
    id: "h-1",
    name: "Sarah Rahman",
    specialty: "Budget Planning",
    rating: 4.8,
    reviewCount: 234,
    avatar: "https://images.unsplash.com/photo-1736939666660-d4c776e0532c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBidXNpbmVzcyUyMGNvbnN1bHRhbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzE1OTQzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isAI: false,
    hourlyRate: 500,
    availability: "available",
    bio: "Certified financial planner with 8 years of experience helping young professionals manage their money wisely. Specialized in student loan management and early career budgeting.",
    certifications: ["CFP", "CFA Level II"],
    experience: 8,
  },
  {
    id: "h-2",
    name: "Ahmed Khan",
    specialty: "Investment Strategy",
    rating: 4.9,
    reviewCount: 412,
    avatar: "https://images.unsplash.com/photo-1738750908048-14200459c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmaW5hbmNpYWwlMjBhZHZpc29yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxNDkwODkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isAI: false,
    hourlyRate: 800,
    availability: "busy",
    bio: "Former investment banker turned personal finance advisor. I help millennials and Gen-Z build wealth through smart investing and portfolio diversification.",
    certifications: ["CFA", "CAIA", "FRM"],
    experience: 12,
  },
  {
    id: "h-3",
    name: "Priya Sharma",
    specialty: "Tax Planning",
    rating: 4.7,
    reviewCount: 189,
    avatar: "https://images.unsplash.com/photo-1659353220597-71b8c6a56259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBmaW5hbmNpYWwlMjBwbGFubmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxNTk0Mzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isAI: false,
    hourlyRate: 600,
    availability: "available",
    bio: "Tax consultant specializing in freelancer and gig economy workers. I make tax season stress-free and help you save more through smart deductions.",
    certifications: ["CPA", "EA"],
    experience: 6,
  },
  {
    id: "h-4",
    name: "Rafiq Uddin",
    specialty: "Debt Management",
    rating: 4.6,
    reviewCount: 156,
    avatar: "https://images.unsplash.com/photo-1697929505667-63ba3843d4b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYWxlJTIwaW52ZXN0bWVudCUyMGFkdmlzb3J8ZW58MXx8fHwxNzcxNTk0Mzc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isAI: false,
    hourlyRate: 450,
    availability: "available",
    bio: "Helped 500+ clients become debt-free. I create customized debt repayment plans using proven strategies like the snowball and avalanche methods.",
    certifications: ["AFC", "CDFA"],
    experience: 10,
  },
  {
    id: "h-5",
    name: "Nadia Islam",
    specialty: "Savings & Retirement",
    rating: 4.8,
    reviewCount: 298,
    avatar: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMG9mZmljZSUyMHNtaWxpbmd8ZW58MXx8fHwxNzcxNTk0MzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isAI: false,
    hourlyRate: 700,
    availability: "offline",
    bio: "Retirement planning specialist focused on helping young professionals start early. Even small savings today can build a secure future tomorrow.",
    certifications: ["CFP", "ChFC", "RICP"],
    experience: 9,
  },
];

const defaultChatSessions: ChatSession[] = [
  {
    id: "cs-1",
    consultantId: "ai-1",
    consultantName: "PocketGuru AI",
    consultantAvatar: "",
    isAI: true,
    messages: [
      {
        id: "m1",
        senderId: "ai-1",
        senderName: "PocketGuru AI",
        text: "Hi Alex! I've analyzed your spending patterns. Your food expenses are 36% above your budget. Would you like me to suggest ways to optimize?",
        timestamp: "2026-02-20T09:00:00",
        isAI: true,
      },
      {
        id: "m2",
        senderId: "user",
        senderName: "Alex",
        text: "Yes please! What can I do to reduce my food spending?",
        timestamp: "2026-02-20T09:01:00",
        isAI: false,
      },
      {
        id: "m3",
        senderId: "ai-1",
        senderName: "PocketGuru AI",
        text: "Great question! Here are 3 actionable tips:\n\n1. **Meal prep on Sundays** — saves ~৳800/month\n2. **Use cashback apps** for groceries — saves ~৳200/month\n3. **Set a daily food budget** of ৳150 instead of spending freely\n\nThis could save you ৳1,200/month! Shall I set up a daily food budget alert?",
        timestamp: "2026-02-20T09:01:30",
        isAI: true,
      },
    ],
    status: "active",
    lastMessage: "This could save you ৳1,200/month!",
    lastMessageTime: "2026-02-20T09:01:30",
  },
];

interface AppState {
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  user: UserProfile;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  budgetCategories: BudgetCategory[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  consultants: Consultant[];
  chatSessions: ChatSession[];
  pendingLoginRole: LoginRole;
  consultantOwnProfile: ConsultantOwnProfile;
}

interface AppContextType extends AppState {
  login: () => void;
  loginAs: (role: LoginRole) => void;
  logout: () => void;
  completeOnboarding: () => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (g: Omit<SavingsGoal, "id">) => void;
  addContribution: (goalId: string, amount: number) => void;
  updateBudget: (categoryId: string, amount: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchRole: (role: "user" | "consultant" | "admin") => void;
  subscribe: (tier: SubscriptionTier) => void;
  setSalary: (salary: number) => void;
  sendMessage: (sessionId: string, text: string) => void;
  startChatSession: (consultantId: string) => string;
  getRecommendedPlan: () => SubscriptionPlan;
  canAccessConsultant: (consultant: Consultant) => boolean;
  updateConsultantProfile: (updates: Partial<ConsultantOwnProfile>) => void;
  setPendingLoginRole: (role: LoginRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    hasSeenOnboarding: false,
    user: {
      name: "Alex",
      email: "alex@pocketguru.com",
      notificationsEnabled: true,
      darkMode: false,
      role: "user",
      salary: 35000,
      subscription: null,
    },
    transactions: defaultTransactions,
    savingsGoals: defaultGoals,
    budgetCategories: defaultBudgetCategories,
    totalBalance: 11700,
    totalIncome: 17000,
    totalExpense: 5300,
    consultants: defaultConsultants,
    chatSessions: defaultChatSessions,
    pendingLoginRole: "user",
    consultantOwnProfile: {
      name: "",
      email: "",
      phone: "",
      avatar: "",
      specialty: "",
      bio: "",
      certifications: [],
      experience: 0,
      hourlyRate: 0,
      availability: "available",
      languages: [],
      education: "",
      isOnboarded: false,
    },
  });

  const recalculate = useCallback((transactions: Transaction[]) => {
    const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { totalIncome, totalExpense, totalBalance: totalIncome - totalExpense };
  }, []);

  const login = () => setState(s => ({ ...s, isLoggedIn: true }));
  const logout = () => setState(s => ({ ...s, isLoggedIn: false }));
  const completeOnboarding = () => setState(s => ({ ...s, hasSeenOnboarding: true }));

  const addTransaction = (t: Omit<Transaction, "id">) => {
    setState(s => {
      const newT = [...s.transactions, { ...t, id: Date.now().toString() }];
      const totals = recalculate(newT);
      return { ...s, transactions: newT, ...totals };
    });
  };

  const deleteTransaction = (id: string) => {
    setState(s => {
      const newT = s.transactions.filter(t => t.id !== id);
      const totals = recalculate(newT);
      return { ...s, transactions: newT, ...totals };
    });
  };

  const addSavingsGoal = (g: Omit<SavingsGoal, "id">) => {
    setState(s => ({
      ...s,
      savingsGoals: [...s.savingsGoals, { ...g, id: Date.now().toString() }],
    }));
  };

  const addContribution = (goalId: string, amount: number) => {
    setState(s => ({
      ...s,
      savingsGoals: s.savingsGoals.map(g =>
        g.id === goalId ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) } : g
      ),
    }));
  };

  const updateBudget = (categoryId: string, amount: number) => {
    setState(s => ({
      ...s,
      budgetCategories: s.budgetCategories.map(c =>
        c.id === categoryId ? { ...c, budgetAmount: amount } : c
      ),
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState(s => ({ ...s, user: { ...s.user, ...updates } }));
  };

  const switchRole = (role: "user" | "consultant" | "admin") => {
    setState(s => ({ ...s, user: { ...s.user, role } }));
  };

  const subscribe = (tier: SubscriptionTier) => {
    setState(s => ({ ...s, user: { ...s.user, subscription: tier } }));
  };

  const setSalary = (salary: number) => {
    setState(s => ({ ...s, user: { ...s.user, salary } }));
  };

  const getRecommendedPlan = (): SubscriptionPlan => {
    const salary = state.user.salary;
    const plan = subscriptionPlans.find(p => salary >= p.salaryMin && salary <= p.salaryMax);
    return plan || subscriptionPlans[0];
  };

  const canAccessConsultant = (consultant: Consultant): boolean => {
    const sub = state.user.subscription;
    if (!sub) return false;
    if (consultant.isAI) {
      return true; // all plans have some AI access
    }
    // Human consultants need basic+ plan
    return sub !== "starter";
  };

  const startChatSession = (consultantId: string): string => {
    const consultant = state.consultants.find(c => c.id === consultantId);
    if (!consultant) return "";
    
    // Check if session already exists
    const existing = state.chatSessions.find(s => s.consultantId === consultantId && s.status === "active");
    if (existing) return existing.id;

    const sessionId = "cs-" + Date.now();
    const newSession: ChatSession = {
      id: sessionId,
      consultantId,
      consultantName: consultant.name,
      consultantAvatar: consultant.avatar,
      isAI: consultant.isAI,
      messages: [{
        id: "m-" + Date.now(),
        senderId: consultantId,
        senderName: consultant.name,
        text: consultant.isAI 
          ? `Hi ${state.user.name}! I'm PocketGuru AI, your personal finance assistant. How can I help you with your budget today?`
          : `Hello ${state.user.name}! I'm ${consultant.name}, a certified ${consultant.specialty} consultant. How can I assist you today?`,
        timestamp: new Date().toISOString(),
        isAI: consultant.isAI,
      }],
      status: "active",
      lastMessage: consultant.isAI ? "How can I help you with your budget today?" : `How can I assist you today?`,
      lastMessageTime: new Date().toISOString(),
    };

    setState(s => ({ ...s, chatSessions: [...s.chatSessions, newSession] }));
    return sessionId;
  };

  const aiResponses = [
    "Based on your spending data, I'd recommend allocating 50% to needs, 30% to wants, and 20% to savings. This is the popular 50/30/20 rule!",
    "Looking at your recent transactions, you're doing great with your savings goals! You're on track to hit your Emergency Fund target by June.",
    "I notice your transport costs have been rising. Have you considered carpooling or using public transit? You could save ৳800-1200/month.",
    "Great question! For someone with your income level, I'd suggest building a 3-6 month emergency fund first before investing.",
    "Your food budget is well-managed this month! You're 20% under budget. Keep it up!",
    "I'd recommend setting up automatic transfers to your savings goals. Even ৳500/week adds up to ৳26,000/year!",
    "Based on your profile, you could benefit from a systematic investment plan (SIP). Would you like me to explain how it works?",
  ];

  const sendMessage = (sessionId: string, text: string) => {
    setState(s => {
      const sessions = s.chatSessions.map(session => {
        if (session.id !== sessionId) return session;
        
        const userMsg: ChatMessage = {
          id: "m-" + Date.now(),
          senderId: "user",
          senderName: s.user.name,
          text,
          timestamp: new Date().toISOString(),
          isAI: false,
        };
        
        const updatedMessages = [...session.messages, userMsg];

        // Auto-reply for AI
        if (session.isAI) {
          const aiReply: ChatMessage = {
            id: "m-" + (Date.now() + 1),
            senderId: session.consultantId,
            senderName: session.consultantName,
            text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
            timestamp: new Date().toISOString(),
            isAI: true,
          };
          updatedMessages.push(aiReply);
          return {
            ...session,
            messages: updatedMessages,
            lastMessage: aiReply.text.substring(0, 50) + "...",
            lastMessageTime: aiReply.timestamp,
          };
        }

        return {
          ...session,
          messages: updatedMessages,
          lastMessage: text,
          lastMessageTime: userMsg.timestamp,
        };
      });

      return { ...s, chatSessions: sessions };
    });
  };

  const updateConsultantProfile = (updates: Partial<ConsultantOwnProfile>) => {
    setState(s => ({ ...s, consultantOwnProfile: { ...s.consultantOwnProfile, ...updates } }));
  };

  const setPendingLoginRole = (role: LoginRole) => {
    setState(s => ({ ...s, pendingLoginRole: role }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        loginAs: (role: LoginRole) => {
          setPendingLoginRole(role);
          switchRole(role);
          login();
        },
        logout,
        completeOnboarding,
        addTransaction,
        deleteTransaction,
        addSavingsGoal,
        addContribution,
        updateBudget,
        updateProfile,
        switchRole,
        subscribe,
        setSalary,
        sendMessage,
        startChatSession,
        getRecommendedPlan,
        canAccessConsultant,
        updateConsultantProfile,
        setPendingLoginRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}