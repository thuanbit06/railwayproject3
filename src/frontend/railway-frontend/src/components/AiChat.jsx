import React, { useState, useRef, useEffect } from "react";
import api from "../services/api"; // sửa path cho đúng với project của bạn

const AiChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý RailAdmin. Bạn có thể hỏi về PNR, trạng thái vé, quy định hủy, ghế hoặc chuyến tàu.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pnr, setPnr] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Thêm tin nhắn user
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: text,
        pnr: pnr.trim() || null,
      });

      const reply = res.data?.reply || "Xin lỗi, tôi không nhận được phản hồi.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Không thể kết nối tới trợ lý AI. Vui lòng thử lại.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errorMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Xin chào! Tôi là trợ lý RailAdmin. Bạn có thể hỏi về PNR, trạng thái vé, quy định hủy, ghế hoặc chuyến tàu.",
      },
    ]);
  };

  // ========== Nút nổi (FAB) ==========
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
        title="Mở trợ lý AI">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    );
  }

  // ========== Khung chat ==========
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            AI
          </div>
          <div>
            <div className="font-semibold text-sm">Trợ lý RailAdmin</div>
            <div className="text-xs text-blue-100">Hỗ trợ đặt vé & hủy vé</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            title="Xóa hội thoại">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            title="Đóng">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* PNR context (optional) */}
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 shrink-0">
        <input
          type="text"
          value={pnr}
          onChange={(e) => setPnr(e.target.value.toUpperCase())}
          placeholder="Nhập PNR để hỏi đúng vé (tùy chọn)"
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user" ?
                  "bg-blue-600 text-white rounded-br-md"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
              }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white shrink-0">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi..."
            rows={1}
            disabled={loading}
            className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 max-h-24"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="shrink-0 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          Enter để gửi · Shift+Enter xuống dòng
        </p>
      </div>
    </div>
  );
};

export default AiChat;
