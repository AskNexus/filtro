'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/app/page';

interface ChatPanelProps {
  messages: Message[];
  isTyping: boolean;
  onSend: (content: string) => void;
  onReset: () => void;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

const icons = {
  video: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  ),
  phone: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  ),
  dots: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  ),
  attach: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
    </svg>
  ),
  send: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  mic: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.41 13.41L6 19l1.41-1.42L1.83 12zm20.18-6.41L11 17.17l-3.59-3.58L6 15l5 5 11-11zM6 15l1.41 1.41L13 10.83l-1.41-1.42z" />
    </svg>
  ),
};

export default function ChatPanel({
  messages,
  isTyping,
  onSend,
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
    <div className="flex flex-col h-full" style={{ background: '#111B21' }}>
      {/* WhatsApp Header */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
        style={{ background: '#202C33', minHeight: 59 }}
      >
        {/* Avatar */}
        <div
          className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-semibold text-base select-none"
          style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          }}
        >
          L
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="text-[#E9EDEF] font-medium text-[15px] leading-tight truncate">
            Luna
          </div>
          <div className="text-xs leading-tight" style={{ color: '#8696A0' }}>
            {isTyping ? (
              <span style={{ color: '#25D366' }}>escribiendo...</span>
            ) : messages.length > 0 ? (
              'en línea'
            ) : (
              'asistente virtual'
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button className="transition-opacity hover:opacity-70" style={{ color: '#AEBAC1' }}>
            {icons.video}
          </button>
          <button className="transition-opacity hover:opacity-70" style={{ color: '#AEBAC1' }}>
            {icons.phone}
          </button>
          {messages.length > 0 ? (
            <button
              onClick={onReset}
              className="text-xs px-2.5 py-1 rounded transition-colors"
              style={{ color: '#8696A0', border: '1px solid #3D5462' }}
            >
              Nueva demo
            </button>
          ) : (
            <button className="transition-opacity hover:opacity-70" style={{ color: '#AEBAC1' }}>
              {icons.dots}
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto py-3 px-3 space-y-1"
        style={{ background: '#0B141A' }}
      >
        {messages.length === 0 && !isTyping ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-6 max-w-xs">
              <p className="text-sm leading-relaxed" style={{ color: '#8696A0' }}>
                Escribe como el cliente para empezar la conversación
              </p>
              <p className="text-xs mt-2" style={{ color: '#3D5462' }}>
                Ejemplo: "Hola, ¿cómo estás? Estoy interesado en tus servicios"
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Date chip */}
            <div className="flex justify-center mb-2">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: '#182229', color: '#8696A0' }}
              >
                Hoy
              </span>
            </div>

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex message-appear ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ marginBottom: 2 }}
              >
                <div
                  className="relative max-w-[78%] rounded-lg px-3 pt-1.5 pb-1"
                  style={{
                    background: msg.role === 'user' ? '#005C4B' : '#202C33',
                    borderRadius: msg.role === 'user'
                      ? '12px 12px 2px 12px'
                      : '12px 12px 12px 2px',
                    boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                    style={{ color: '#E9EDEF' }}
                  >
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[11px]" style={{ color: msg.role === 'user' ? '#8EBBB5' : '#8696A0' }}>
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.role === 'user' && (
                      <span style={{ color: '#53BDEB' }}>{icons.check}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start message-appear" style={{ marginBottom: 2 }}>
                <div
                  className="px-4 py-3"
                  style={{
                    background: '#202C33',
                    borderRadius: '12px 12px 12px 2px',
                    boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
                  }}
                >
                  <div className="flex gap-1.5 items-center" style={{ height: 16 }}>
                    <div className="w-2 h-2 rounded-full typing-dot" style={{ background: '#8696A0' }} />
                    <div className="w-2 h-2 rounded-full typing-dot" style={{ background: '#8696A0' }} />
                    <div className="w-2 h-2 rounded-full typing-dot" style={{ background: '#8696A0' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-3 py-2.5" style={{ background: '#202C33' }}>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <button
              type="button"
              className="flex-shrink-0 transition-opacity hover:opacity-70"
              style={{ color: '#8696A0' }}
            >
              {icons.attach}
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe como el cliente..."
                disabled={isTyping}
                autoFocus
                className="w-full text-sm outline-none"
                style={{
                  background: '#2A3942',
                  color: '#E9EDEF',
                  borderRadius: 24,
                  padding: '9px 16px',
                  caretColor: '#25D366',
                }}
              />
            </div>

            <button
              type={input.trim() ? 'submit' : 'button'}
              disabled={isTyping}
              className="flex-shrink-0 flex items-center justify-center rounded-full transition-colors"
              style={{
                width: 44,
                height: 44,
                background: '#25D366',
                color: 'white',
              }}
            >
              {input.trim() ? icons.send : icons.mic}
            </button>
          </form>
      </div>
    </div>
  );
}
