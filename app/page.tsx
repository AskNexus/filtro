'use client';

import { useState, useCallback } from 'react';
import ChatPanel from '@/components/ChatPanel';
import DashboardPanel from '@/components/DashboardPanel';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface LeadData {
  name: string | null;
  service: string | null;
  city: string | null;
  availability: string | null;
  stage: 'greeting' | 'service' | 'city' | 'availability' | 'closing' | 'done';
  score: 'cold' | 'warm' | 'hot';
  notes: string;
}

const initialLeadData: LeadData = {
  name: null,
  service: null,
  city: null,
  availability: null,
  stage: 'greeting',
  score: 'cold',
  notes: '',
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [leadData, setLeadData] = useState<LeadData>(initialLeadData);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startConversation = useCallback(async () => {
    setHasStarted(true);
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], init: true }),
      });
      const data = await res.json();
      setMessages([{ role: 'assistant', content: data.message, timestamp: new Date() }]);
      if (data.leadData) setLeadData(data.leadData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = { role: 'user', content, timestamp: new Date() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsTyping(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          }),
        });
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.message, timestamp: new Date() },
        ]);
        if (data.leadData) setLeadData(data.leadData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTyping(false);
      }
    },
    [messages]
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setLeadData(initialLeadData);
    setHasStarted(false);
  }, []);

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0D1117' }}>
      {/* Top bar */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 border-b"
        style={{ background: '#161B22', borderColor: '#21262D', height: 48 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-md"
            style={{ width: 28, height: 28, background: 'rgba(37,211,102,0.15)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: '#E6EDF3' }}>
            Filtro AI
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}
          >
            Demo
          </span>
        </div>
        <div className="text-xs" style={{ color: '#8B949E' }}>
          Sistema de respuesta automática con IA
        </div>
      </div>

      {/* Panel labels + content */}
      <div className="flex flex-1 min-h-0">
        {/* Chat column */}
        <div className="flex flex-col flex-1 min-w-0 border-r" style={{ borderColor: '#21262D' }}>
          <div
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b"
            style={{ background: '#0D1117', borderColor: '#21262D', height: 36 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#8B949E">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
            <span className="text-xs" style={{ color: '#8B949E' }}>
              Vista del cliente — WhatsApp
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ChatPanel
              messages={messages}
              isTyping={isTyping}
              hasStarted={hasStarted}
              onSend={sendMessage}
              onStart={startConversation}
              onReset={resetConversation}
            />
          </div>
        </div>

        {/* Dashboard column */}
        <div className="flex flex-col flex-shrink-0" style={{ width: 390 }}>
          <div
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b"
            style={{ background: '#0D1117', borderColor: '#21262D', height: 36 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#8B949E">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            <span className="text-xs" style={{ color: '#8B949E' }}>
              Vista de la dueña — Panel de gestión
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            <DashboardPanel leadData={leadData} hasStarted={hasStarted} />
          </div>
        </div>
      </div>
    </div>
  );
}
