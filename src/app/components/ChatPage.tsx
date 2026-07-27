import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Send,
  Bot,
  Sparkles,
  MoreVertical,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ChatPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { chatSessions, sendMessage, user } = useAppContext();
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const session = chatSessions.find((s) => s.id === sessionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  if (!session) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <p className="text-black/40 font-inter">Chat not found</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    const msgText = text.trim();
    setText("");

    if (session.isAI) {
      setIsTyping(true);
      sendMessage(session.id, msgText);
      setTimeout(() => setIsTyping(false), 500);
    } else {
      sendMessage(session.id, msgText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatMarkdown = (text: string) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const quickPrompts = session.isAI
    ? [
        "Analyze my spending",
        "Budget tips",
        "How to save more?",
        "Investment advice",
      ]
    : [];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-black/5 pt-14 px-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-black" />
            </button>

            <div className="relative">
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] flex items-center justify-center">
                {session.isAI ? (
                  <Sparkles size={18} className="text-[#FFDD36]" />
                ) : session.consultantAvatar ? (
                  <ImageWithFallback
                    src={session.consultantAvatar}
                    alt={session.consultantName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-[16px] font-inter font-bold">
                    {session.consultantName[0]}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[15px] font-inter font-bold text-black">
                  {session.consultantName}
                </p>
                {session.isAI && (
                  <div className="bg-[#FFDD36]/20 px-1.5 py-0.5 rounded">
                    <span className="text-[8px] font-inter font-bold text-[#1E3A8A]">
                      AI
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[11px] font-inter text-[#4CAF50]">
                {session.isAI ? "Always online" : "Online"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!session.isAI && (
              <>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center">
                  <Phone size={18} className="text-black/40" />
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center">
                  <Video size={18} className="text-black/40" />
                </button>
              </>
            )}
            <button className="w-9 h-9 rounded-xl flex items-center justify-center">
              <MoreVertical size={18} className="text-black/40" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Date separator */}
        <div className="flex items-center justify-center mb-4">
          <span className="bg-black/5 text-black/30 text-[11px] font-inter px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {/* Encryption notice for AI */}
        {session.isAI && (
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#FFDD36]/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Info size={12} className="text-[#1E3A8A]" />
              <span className="text-[10px] font-inter text-[#1E3A8A]">
                AI responses are generated based on your financial data
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {session.messages.map((msg, index) => {
            const isUser = msg.senderId === "user";
            return (
              <motion.div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] flex items-center justify-center mr-2 mt-1 shrink-0">
                    {session.isAI ? (
                      <Bot size={14} className="text-[#FFDD36]" />
                    ) : (
                      <span className="text-white text-[10px] font-inter font-bold">
                        {session.consultantName[0]}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[75%] ${
                    isUser
                      ? "bg-[#1E3A8A] rounded-[16px] rounded-br-[4px]"
                      : "bg-white rounded-[16px] rounded-bl-[4px] shadow-sm border border-black/5"
                  } px-4 py-3`}
                >
                  <p
                    className={`text-[13px] font-inter leading-relaxed ${
                      isUser ? "text-white" : "text-black/80"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(msg.text),
                    }}
                  />
                  <p
                    className={`text-[10px] font-inter mt-1.5 ${
                      isUser ? "text-white/40 text-right" : "text-black/25"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] flex items-center justify-center mr-2 mt-1 shrink-0">
                <Bot size={14} className="text-[#FFDD36]" />
              </div>
              <div className="bg-white rounded-[16px] rounded-bl-[4px] shadow-sm border border-black/5 px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts for AI */}
      {session.isAI && quickPrompts.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setText(prompt);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1.5 bg-[#1E3A8A]/5 rounded-full text-[11px] font-inter font-medium text-[#1E3A8A] whitespace-nowrap shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-black/5 px-4 py-3 pb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={
                session.isAI
                  ? "Ask anything about your finances..."
                  : "Type a message..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-[44px] pl-4 pr-4 bg-gray-50 rounded-2xl text-[14px] font-inter outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 border border-black/5"
            />
          </div>
          <motion.button
            onClick={handleSend}
            className={`w-[44px] h-[44px] rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              text.trim()
                ? "bg-[#1E3A8A]"
                : "bg-gray-200"
            }`}
            whileTap={{ scale: 0.9 }}
            disabled={!text.trim()}
          >
            <Send
              size={18}
              className={text.trim() ? "text-white" : "text-black/30"}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
