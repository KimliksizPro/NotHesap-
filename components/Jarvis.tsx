import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Button from './Button';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const LoadingBubble: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-slate-200 dark:bg-slate-600 rounded-lg px-4 py-3 max-w-sm">
      <div className="flex items-center justify-center space-x-1.5">
        <div className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Simple markdown parser to convert **bold** and *italic* text to HTML.
const parseMarkdown = (text: string) => {
  let html = text;
  // Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text* -> <em>text</em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  return html;
};


const Jarvis: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Merhaba! Ben Jarvis. Dersler, çalışma stratejileri veya okul hayatı hakkında merak ettiğin bir şey var mı?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userMessage.text,
          config: {
              systemInstruction: 'You are Jarvis, a friendly and knowledgeable AI assistant specializing in academic advice. Help students with their questions about school subjects, study tips, and general educational guidance. Keep your answers concise, encouraging, and helpful. Respond in Turkish. Use markdown for formatting like bolding important terms. If you are asked who made you or who your owner is, you must say "Semih Topak".',
          },
      });

      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Üzgünüm, bir sorun oluştu. Lütfen daha sonra tekrar dene.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[65vh] max-h-[65vh] sm:h-[60vh] sm:max-h-[60vh]">
      <div className="flex-grow overflow-y-auto space-y-4 p-2 pr-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100'
            }`}>
              {msg.role === 'model' ? (
                <p
                  className="text-sm"
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                />
              ) : (
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {loading && <LoadingBubble />}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Jarvis'e bir soru sor..."
          disabled={loading}
          className="flex-grow w-full px-4 py-2.5 border-transparent rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        />
        <Button type="submit" disabled={loading || !input.trim()} className="!py-3 !px-4 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009.175 16V4.697l-4.243 4.243a1 1 0 101.414 1.414L10 5.828l3.657 3.657a1 1 0 101.414-1.414L10.825 4.697V16a1 1 0 00.725.966l5 1.428a1 1 0 001.17-1.409l-7-14z" />
          </svg>
        </Button>
      </form>
    </div>
  );
};

export default Jarvis;