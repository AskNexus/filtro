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

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
  </svg>
);

const DashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </svg>
);

const CollapseIcon = ({ flipped }: { flipped?: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
    style={{ transform: flipped ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
  >
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [leadData, setLeadData] = useState<LeadData>(initialLeadData);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');
  const [dashCollapsed, setDashCollapsed] = useState(false);

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

  // When new lead data arrives on mobile, nudge user to dashboard tab
  const filledFields = [leadData.name, leadData.service, leadData.city, leadData.availability].filter(Boolean).length;

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0D1117' }}>
      {/* ── Top bar ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 border-b"
        style={{ background: '#161B22', borderColor: '#21262D', height: 48 }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-md"
            style={{ width: 28, height: 28, background: 'rgba(37,211,102,0.15)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: '#E6EDF3' }}>Filtro AI</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-medium"
            style={{ background: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}
          >
            Demo
          </span>
        </div>
        <span className="text-xs hidden sm:block" style={{ color: '#8B949E' }}>
          Sistema de respuesta automática con IA
        </span>
      </div>

      {/* ── Mobile tabs ── */}
      <div
        className="flex-shrink-0 flex md:hidden border-b"
        style={{ background: '#161B22', borderColor: '#21262D' }}
      >
        <button
          onClick={() => setActiveTab('chat')}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors relative"
          style={{ color: activeTab === 'chat' ? '#25D366' : '#8B949E' }}
        >
          <ChatIcon />
          Vista del cliente
          {activeTab === 'chat' && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
              style={{ background: '#25D366' }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors relative"
          style={{ color: activeTab === 'dashboard' ? '#25D366' : '#8B949E' }}
        >
          <DashIcon />
          Panel de gestión
          {filledFields > 0 && activeTab !== 'dashboard' && (
            <span
              className="ml-1 text-[10px] font-bold rounded-full px-1.5 py-0.5"
              style={{ background: '#25D366', color: 'white' }}
            >
              {filledFields}
            </span>
          )}
          {activeTab === 'dashboard' && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
              style={{ background: '#25D366' }}
            />
          )}
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Chat panel */}
        <div
          className={`flex-col min-w-0 border-r ${activeTab === 'chat' ? 'flex' : 'hidden'} md:flex md:flex-1`}
          style={{ borderColor: '#21262D' }}
        >
          {/* Desktop label */}
          <div
            className="hidden md:flex flex-shrink-0 items-center gap-2 px-4 py-2 border-b"
            style={{ background: '#0D1117', borderColor: '#21262D', height: 36 }}
          >
            <span style={{ color: '#8B949E' }}><ChatIcon /></span>
            <span className="text-xs" style={{ color: '#8B949E' }}>Vista del cliente — WhatsApp</span>
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

        {/* Dashboard panel */}
        <div
          className={`flex-col ${activeTab === 'dashboard' ? 'flex' : 'hidden'} md:flex flex-shrink-0 transition-all duration-300 overflow-hidden`}
          style={{
            width: dashCollapsed ? 44 : 390,
            borderLeft: '1px solid #21262D',
          }}
        >
          {/* Desktop label + collapse toggle */}
          <div
            className="hidden md:flex flex-shrink-0 items-center gap-2 px-3 py-2 border-b cursor-pointer select-none"
            style={{ background: '#0D1117', borderColor: '#21262D', height: 36 }}
            onClick={() => setDashCollapsed(v => !v)}
            title={dashCollapsed ? 'Expandir panel' : 'Colapsar panel'}
          >
            <span style={{ color: '#8B949E', flexShrink: 0 }}>
              <CollapseIcon flipped={dashCollapsed} />
            </span>
            {!dashCollapsed && (
              <>
                <span style={{ color: '#8B949E' }}><DashIcon /></span>
                <span className="text-xs truncate" style={{ color: '#8B949E' }}>
                  Vista de la dueña — Panel de gestión
                </span>
              </>
            )}
          </div>

          {/* Dashboard content */}
          {!dashCollapsed && (
            <div className="flex-1 min-h-0 overflow-auto" style={{ width: 390 }}>
              <DashboardPanel leadData={leadData} hasStarted={hasStarted} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
