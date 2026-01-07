'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { isPreviewing } from '@builder.io/sdk-react-nextjs';

interface AssistantProps {
  title?: string;
  welcomeMessage?: string;
  ctaLink?: string;
  ctaText?: string;
  primaryColor?: string;
}

export const AiAssistant = ({
  title = "Drata AI Helper",
  welcomeMessage = "Hi! Ask me how we automate compliance.",
  ctaLink = "#demo",
  ctaText = "Book a Demo",
  primaryColor = "#0055FF"
}: AssistantProps) => {

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(isPreviewing());
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: welcomeMessage }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = '';

      setMessages((prev) => [...prev, { role: 'bot', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        botResponse += chunk;
        setMessages((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = botResponse;
          return newHistory;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
<div
  className={
    isEditing
      ? "relative z-50 flex justify-center p-4 font-sans border-2 border-dashed border-slate-300 rounded-2xl bg-white/60 backdrop-blur"
      : "fixed bottom-6 right-6 z-50 font-sans"
  }
>
  {!isOpen && (
    <button
      onClick={() => setIsOpen(true)}
      style={{ backgroundColor: primaryColor }}
      className="
        group relative flex items-center gap-3
        rounded-full px-4 py-3 text-white shadow-xl
        ring-1 ring-black/5
        hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0
        transition-all
      "
    >
      <span className="font-semibold tracking-tight">{title}</span>
      <span className="pointer-events-none absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
        style={{ background: `radial-gradient(circle at 30% 30%, ${primaryColor}55, transparent 60%)` }}
      />
    </button>
  )}

  {isOpen && (
    <div
      className="
        w-[360px] max-w-[92vw]
        md:w-[420px]
        rounded-2xl shadow-2xl
        border border-slate-200/70
        overflow-hidden
        flex flex-col
        h-[540px]
        bg-white
      "
    >
      {/* Header */}
      <div
        style={{ backgroundColor: primaryColor }}
        className="
          relative px-4 py-3
          text-white
          flex items-center justify-between
        "
      >
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <h3 className="font-semibold tracking-tight">{title}</h3>
            <p className="text-[11px] text-white/80">Typically replies in a moment</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="
            h-9 w-9 rounded-xl
            grid place-items-center
            hover:bg-white/15 active:bg-white/20
            transition
            ring-1 ring-white/20
          "
          aria-label="Close chat"
        >
          ✕
        </button>

        {/* subtle header shine */}
        <div className="pointer-events-none absolute inset-0 opacity-25"
          style={{ background: "linear-gradient(120deg, rgba(255,255,255,.22), transparent 45%, rgba(0,0,0,.12))" }}
        />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="
          flex-1 overflow-y-auto
          px-4 py-4
          space-y-3
          bg-gradient-to-b from-slate-50 to-white
        "
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={idx}
              className={isUser ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={[
                  "relative max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                  "shadow-sm ring-1",
                  isUser
                    ? "text-white ring-black/5"
                    : "bg-white text-slate-800 ring-slate-200",
                ].join(" ")}
                style={isUser ? { backgroundColor: primaryColor } : undefined}
              >
                {/* bubble tail */}
                <span
                  className={[
                    "absolute bottom-2 h-3 w-3 rotate-45",
                    isUser
                      ? "-right-1"
                      : "-left-1 bg-white ring-1 ring-slate-200",
                  ].join(" ")}
                  style={isUser ? { backgroundColor: primaryColor } : undefined}
                />

                <div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-a:underline prose-a:font-medium">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
            <span className="inline-flex h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:150ms]" />
            <span className="inline-flex h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:300ms]" />
            <span className="ml-1">Thinking…</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white">
        <a
          href={ctaLink}
          className="
            group block w-full
            rounded-xl px-3 py-2.5
            text-center text-xs font-semibold
            bg-slate-50 hover:bg-slate-100
            text-slate-700
            ring-1 ring-slate-200
            transition
          "
        >
          {ctaText}
          <span className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity">→</span>
        </a>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-200 bg-white"
      >
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="
                w-full rounded-xl
                bg-slate-100/80
                px-3 py-2.5
                text-sm text-slate-900
                ring-1 ring-slate-200
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-slate-400/60
                transition
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ backgroundColor: primaryColor }}
            className="
              rounded-xl px-4 py-2.5
              text-sm font-semibold text-white
              shadow-md
              hover:opacity-95 active:opacity-100
              disabled:opacity-50 disabled:cursor-not-allowed
              transition
            "
          >
            Send
          </button>
        </div>

        <p className="mt-2 text-[11px] text-slate-400">
          Press <span className="font-semibold">Enter</span> to send
        </p>
      </form>
    </div>
  )}
</div>

  );
};