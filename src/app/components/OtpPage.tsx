import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { Briefcase } from "lucide-react";
import imgLogo from "figma:asset/382f08e6232698109d7b6a37d63a98d9a4e0e79e.png";
import imgBg from "figma:asset/f62fd5700039ada9a47f33b07ed7f056022a434e.png";

export function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, switchRole, pendingLoginRole, updateConsultantProfile, updateProfile, consultantOwnProfile } = useAppContext();
  const [otp, setOtp] = useState("");

  const roleFromState = (location.state as { role?: string })?.role || pendingLoginRole;
  const nameFromState = (location.state as { name?: string })?.name || "";
  const emailFromState = (location.state as { email?: string })?.email || "";
  const phoneFromState = (location.state as { phone?: string })?.phone || "";
  const isConsultant = roleFromState === "consultant";

  const handleVerify = () => {
    login();
    if (isConsultant) {
      switchRole("consultant");
      // Pre-fill consultant profile from signup data
      updateConsultantProfile({
        name: nameFromState || "Dr. Farid Hasan",
        email: emailFromState || "farid@pocketguru.com",
        phone: phoneFromState || "+880 1700-000000",
      });
      updateProfile({
        name: nameFromState || "Dr. Farid Hasan",
        email: emailFromState || "farid@pocketguru.com",
        role: "consultant",
      });
      // If consultant already completed onboarding, go to dashboard
      if (consultantOwnProfile.isOnboarded) {
        navigate("/consultant-dashboard");
      } else {
        navigate("/consultant-setup");
      }
    } else {
      switchRole("user");
      updateProfile({ role: "user" });
      if (nameFromState) {
        updateProfile({ name: nameFromState, email: emailFromState });
      }
      navigate("/home");
    }
  };

  return (
    <div className="h-full relative overflow-hidden bg-black">
      <img
        src={imgBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

      <div className="relative z-10 h-full flex flex-col items-center pt-[20%] px-8">
        <motion.div
          className="w-[120px] h-[120px] flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <img src={imgLogo} alt="PocketGuru" className="w-full h-full object-contain" />
        </motion.div>

        <motion.h1
          className="text-white text-[32px] font-inter font-bold mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          OTP
        </motion.h1>

        {/* Role indicator */}
        {isConsultant && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-inter font-semibold bg-[#1E3A8A]/30 text-[#93C5FD] border border-[#1E3A8A]/40">
              <Briefcase size={10} />
              Consultant Verification
            </span>
          </motion.div>
        )}

        <motion.div
          className="w-full mt-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            placeholder="Type in one-time-password"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full h-[50px] bg-[#FFDD36]/90 rounded-2xl px-5 text-center text-black placeholder:text-black/40 font-inter font-medium text-[18px] tracking-[8px] outline-none"
          />

          <button className="self-end">
            <span className="text-white text-[14px] font-inter font-medium underline">
              Resend?
            </span>
          </button>

          <button
            onClick={handleVerify}
            className={`mt-4 h-[42px] w-[170px] rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform ${
              isConsultant ? "bg-[#1E3A8A]" : "bg-[#FFDD36]"
            }`}
          >
            {isConsultant && <Briefcase size={14} className="text-white" />}
            <span
              className={`font-inter font-semibold text-[15px] ${
                isConsultant ? "text-white" : "text-black"
              }`}
            >
              {isConsultant ? "Verify & Setup" : "Sign in"}
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}