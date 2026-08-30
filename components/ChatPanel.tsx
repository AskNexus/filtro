'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/app/page';

interface ChatPanelProps {
  messages: Message[];
  isTyping: boolean;
  hasStarted: boolean;
  onSend: (content: string) => void;
  onStart: () => void;
  onReset: () => void;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPanel({
  messages,
  isTyping,
  hasStarted,
  onSend,
  onStart,
  onReset,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSend(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* WhatsApp-style header */}
      <div className="bg-[#202C33] px-4 py-3 flex items-center gap-3 shadow-lg z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          L
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm">Luna ✨</div>
          <div className="text-xs">
            {isTyping ? (
              <span className="text-[#25D366]">escribiendo...</span>
            ) : hasStarted ? (
              <span className="text-[#8696A0]">asistente activa</span>
            ) : (
              <span className="text-[#8696A0]">asistente virtual</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#8696A0] text-xs px-2 py-0.5 rounded bg-[#2A3942]">DEMO</span>
          {hasStarted && (
            <button
              onClick={onReset}
              className="text-[#8696A0] hover:text-white transition-colors text-xs px-3 py-1.5 rounded-full border border-[#3D5462] hover:border-[#8696A0]"
            >
              Nueva demo
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        style={{ background: '#0B141A' }}
      >
        {!hasStarted ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-6">
              <div className="text-6xl mb-5">🤖</div>
              <h2 className="text-white text-xl font-semibold mb-2">
                Demo — Filtro IA
              </h2>
              <p className="text-[#8696A0] text-sm mb-8 leading-relaxed">
                Simula cómo el bot atiende y califica automáticamente a un cliente potencial en WhatsApp o Telegram
              </p>
              <button
                onClick={onStart}
                className="bg-[#25D366] hover:bg-[#1ebe5a] active:bg-[#18a84d] text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm shadow-lg shadow-[#25D366]/20"
              >
                Iniciar conversación de demo
              </button>
              <p className="text-[#8696A0] text-xs mt-4 opacity-70">
                Tú juegas el rol del cliente
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Date chip */}
            <div className="flex justify-center mb-2">
              <span className="bg-[#182229] text-[#8696A0] text-xs px-3 py-1 rounded-full">
                Hoy
              </span>
            </div>

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex message-appear mb-1 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[78%] rounded-xl px-3 py-2 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-[#005C4B] text-white rounded-br-sm'
                      : 'bg-[#202C33] text-[#E9EDEF] rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 ${
                      msg.role === 'user' ? 'text-[#93C6B7]' : 'text-[#8696A0]'
                    }`}
                  >
                    <span className="text-[10px]">{formatTime(msg.timestamp)}</span>
                    {msg.role === 'user' && (
                      <span className="text-[10px] text-[#53BDEB]">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start message-appear mb-1">
                <div className="bg-[#202C33] rounded-xl rounded-bl-sm px-4 py-3 shadow-md">
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-2 h-2 bg-[#8696A0] rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-[#8696A0] rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-[#8696A0] rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      {hasStarted && (
        <div className="bg-[#0B141A] px-3 py-3 border-t border-[#2A3942]">
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe como el cliente..."
              disabled={isTyping}
              autoFocus
              className="flex-1 bg-[#202C33] text-[#E9EDEF] placeholder-[#8696A0] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#25D366]/50 disabled:opacity-40 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 bg-[#25D366] hover:bg-[#1ebe5a] disabled:bg-[#2A3942] rounded-full flex items-center justify-center transition-colors flex-shrink-0 shadow-md"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
