import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { User, Briefcase } from "lucide-react";
import type { LoginRole } from "../context/AppContext";
import imgLogo from "figma:asset/382f08e6232698109d7b6a37d63a98d9a4e0e79e.png";
import imgBg from "figma:asset/d3c7a1f8a1d998217282b08ed2e73fff977e8b60.png";

export function LoginPage() {
  const navigate = useNavigate();
  const { setPendingLoginRole, updateConsultantProfile } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<LoginRole>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setPendingLoginRole(selectedRole);
    if (selectedRole === "consultant") {
      // Pre-fill consultant data
      updateConsultantProfile({
        name: "Dr. Farid Hasan",
        email: email || "farid@pocketguru.com",
      });
    }
    // Always go through OTP verification
    navigate("/otp", {
      state: {
        role: selectedRole,
        name: selectedRole === "consultant" ? "Dr. Farid Hasan" : "",
        email: email || (selectedRole === "consultant" ? "farid@pocketguru.com" : "alex@pocketguru.com"),
        phone: "",
      },
    });
  };

  return (
    <div className="h-full relative overflow-hidden bg-black">
      <img
        src={imgBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

      <div className="relative z-10 h-full flex flex-col items-center pt-[14%] px-8">
        {/* Logo */}
        <motion.div
          className="w-[100px] h-[100px] flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <img src={imgLogo} alt="PocketGuru" className="w-full h-full object-contain" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-white text-[28px] font-inter font-bold mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Sign in
        </motion.h1>

        {/* Role Toggle */}
        <motion.div
          className="w-full mt-5 bg-white/10 backdrop-blur-md rounded-2xl p-1.5 flex gap-1.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setSelectedRole("user")}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              selectedRole === "user"
                ? "bg-[#FFDD36] shadow-lg"
                : "bg-transparent"
            }`}
          >
            <User
              size={16}
              className={selectedRole === "user" ? "text-black" : "text-white/50"}
            />
            <span
              className={`text-[13px] font-inter font-semibold ${
                selectedRole === "user" ? "text-black" : "text-white/50"
              }`}
            >
              I'm a User
            </span>
          </button>
          <button
            onClick={() => setSelectedRole("consultant")}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              selectedRole === "consultant"
                ? "bg-[#FFDD36] shadow-lg"
                : "bg-transparent"
            }`}
          >
            <Briefcase
              size={16}
              className={selectedRole === "consultant" ? "text-black" : "text-white/50"}
            />
            <span
              className={`text-[13px] font-inter font-semibold ${
                selectedRole === "consultant" ? "text-black" : "text-white/50"
              }`}
            >
              I'm a Consultant
            </span>
          </button>
        </motion.div>

        {/* Role description */}
        <motion.p
          className="text-white/40 text-[11px] font-inter mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          key={selectedRole}
        >
          {selectedRole === "user"
            ? "Track spending, set budgets, and get financial advice"
            : "Manage clients, schedule sessions, and earn as a financial expert"}
        </motion.p>

        {/* Form */}
        <motion.div
          className="w-full mt-6 flex flex-col gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="email"
            placeholder={selectedRole === "user" ? "Email" : "Consultant Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[48px] bg-[#FFDD36] rounded-2xl px-5 text-black placeholder:text-black/40 font-inter font-medium text-[15px] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[48px] bg-[#FFDD36] rounded-2xl px-5 text-black placeholder:text-black/40 font-inter font-medium text-[15px] outline-none"
          />

          {selectedRole === "consultant" && (
            <motion.div
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <p className="text-white/50 text-[10px] font-inter">
                New consultants will be guided through profile setup after signing in.
              </p>
            </motion.div>
          )}

          <button
            onClick={handleLogin}
            className={`mx-auto mt-2 h-[42px] w-[170px] rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
              selectedRole === "consultant"
                ? "bg-[#1E3A8A]"
                : "bg-[#FFDD36]"
            }`}
          >
            {selectedRole === "consultant" ? (
              <Briefcase size={15} className="text-white" />
            ) : null}
            <span
              className={`font-inter font-semibold text-[15px] ${
                selectedRole === "consultant" ? "text-white" : "text-black"
              }`}
            >
              {selectedRole === "consultant" ? "Consultant Sign in" : "Sign in"}
            </span>
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="flex items-center justify-center mt-1"
          >
            <span className="text-white/80 text-[13px] font-inter font-medium">
              Don't Have Account?{" "}
            </span>
            <span className="text-white text-[13px] font-inter font-medium underline ml-1">
              Sign up
            </span>
          </button>
        </motion.div>

        <div className="flex-1" />

        <p className="text-white/60 text-[13px] font-inter text-center pb-8">
          {selectedRole === "user"
            ? "Tip: Start small, focus on long-term growth"
            : "Join 200+ verified financial experts on PocketGuru"}
        </p>
      </div>
    </div>
  );
}