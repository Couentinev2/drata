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
  // --- FIX START: SAFE PREVIEW CHECK ---
  // We initialize as 'false' so the server never crashes.
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // We only check for Builder.io once the component is in the browser.
    setIsEditing(isPreviewing());
  }, []);
  // --- FIX END ---

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
        // If editing in Builder, use relative. If live, use fixed.
        isEditing
          ? "relative p-4 z-50 font-sans flex justify-center border-2 border-dashed border-gray-300"
          : "fixed bottom-6 right-6 z-50 font-sans"
      }
    >
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: primaryColor }}
          className="text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="font-bold">✨ Ask AI</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px]">
          <div style={{ backgroundColor: primaryColor }} className="p-4 flex justify-between items-center text-white">
            <h3 className="font-semibold">{title}</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">✕</button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-gray-200 text-gray-800 self-end ml-auto' : 'bg-white border border-gray-200 text-gray-800 shadow-sm'}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 animate-pulse">Thinking...</div>}
          </div>
          <div className="p-3 bg-blue-50 border-t border-blue-100">
            <a href={ctaLink} className="block w-full text-center py-2 text-xs font-bold text-blue-700 hover:underline">🚀 {ctaText}</a>
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a question..." className="flex-1 bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
            <button type="submit" disabled={loading} style={{ backgroundColor: primaryColor }} className="text-white px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};