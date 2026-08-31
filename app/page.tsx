'use client';

import { useState, useCallback } from 'react';
import ChatPanel from '@/components/ChatPanel';
import DashboardPanel from '@/components/DashboardPanel';
import ConfigPanel from '@/components/ConfigPanel';

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
  stage: 'greeting' | 'presentation' | 'availability' | 'needs_confirmation' | 'confirmed' | 'done';
  score: 'cold' | 'warm' | 'hot';
  notes: string;
  red_flag: boolean;
  flag_reason: string | null;
}

export interface Profile {
  name: string;
  location: string;
  price1h: number;
  price30min: number;
}

const DEFAULT_PROFILE: Profile = {
  name: 'Luna',
  location: 'La Guindalera, Madrid',
  price1h: 180,
  price30min: 100,
};

const initialLeadData: LeadData = {
  name: null,
  service: null,
  city: null,
  availability: null,
  stage: 'greeting',
  score: 'cold',
  notes: '',
  red_flag: false,
  flag_reason: null,
};

// Base stats (sample history to make demo look populated)
const BASE = { total: 24, hot: 8, warm: 14, confirmed: 3, blocked: 1 };

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

const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
  </svg>
);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [leadData, setLeadData] = useState<LeadData>(initialLeadData);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');
  const [dashCollapsed, setDashCollapsed] = useState(false);

  // New features
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [busyMode, setBusyMode] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const hasStarted = messages.length > 0;

  // Compute live stats
  const stats = {
    total: hasStarted ? BASE.total + 1 : BASE.total,
    hot: hasStarted && leadData.score === 'hot' ? BASE.hot + 1 : BASE.hot,
    warm: hasStarted && leadData.score === 'warm' ? BASE.warm + 1 : BASE.warm,
    confirmed: hasStarted && (leadData.stage === 'confirmed' || leadData.stage === 'done') ? BASE.confirmed + 1 : BASE.confirmed,
    blocked: isBlocked ? BASE.blocked + 1 : BASE.blocked,
  };

  const saveProfile = (p: Profile) => {
    setProfile(p);
  };

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = { role: 'user', content, timestamp: new Date() };

      if (busyMode) {
        setMessages(prev => [
          ...prev,
          userMessage,
          {
            role: 'assistant',
            content: 'Ahora mismo no puedo atender, te escribo en un rato ❤️',
            timestamp: new Date(),
          },
        ]);
        return;
      }

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsTyping(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map(m => ({ role: m.role, content: m.content })),
            profile,
          }),
        });
        const data = await res.json();
        // Natural typing delay: 1.5–3s depending on response length
        const len = (data.message ?? '').length;
        const delay = Math.min(1500 + len * 18, 3200);
        await new Promise(r => setTimeout(r, delay));
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
    [messages, busyMode, profile]
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setLeadData(initialLeadData);
    setIsBlocked(false);
  }, []);

  const filledFields = [leadData.name, leadData.service, leadData.city, leadData.availability].filter(Boolean).length;
  const hasAlert = leadData.red_flag || leadData.stage === 'needs_confirmation';

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
        <div className="flex items-center gap-3">
          <span className="text-xs hidden sm:block" style={{ color: '#8B949E' }}>
            Sistema de respuesta automática con IA
          </span>
          <button
            onClick={() => setShowConfig(true)}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ width: 32, height: 32, color: '#8B949E' }}
            title="Configurar perfil"
          >
            <GearIcon />
          </button>
        </div>
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
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: '#25D366' }} />
          )}
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors relative"
          style={{ color: activeTab === 'dashboard' ? '#25D366' : '#8B949E' }}
        >
          <DashIcon />
          Panel de gestión
          {(filledFields > 0 || hasAlert) && activeTab !== 'dashboard' && (
            <span
              className="ml-1 text-[10px] font-bold rounded-full px-1.5 py-0.5"
              style={{ background: hasAlert ? '#FF6B6B' : '#25D366', color: 'white' }}
            >
              {hasAlert ? '!' : filledFields}
            </span>
          )}
          {activeTab === 'dashboard' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: '#25D366' }} />
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
              onSend={sendMessage}
              onReset={resetConversation}
              busyMode={busyMode}
              botName={profile.name}
            />
          </div>
        </div>

        {/* Dashboard panel */}
        <div
          className={`flex-col ${activeTab === 'dashboard' ? 'flex' : 'hidden'} md:flex flex-shrink-0 transition-all duration-300 overflow-hidden`}
          style={{ width: dashCollapsed ? 44 : 390, borderLeft: '1px solid #21262D' }}
        >
          <div
            className="hidden md:flex flex-shrink-0 items-center gap-2 px-3 py-2 border-b cursor-pointer select-none"
            style={{ background: '#0D1117', borderColor: '#21262D', height: 36 }}
            onClick={() => setDashCollapsed(v => !v)}
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
          {!dashCollapsed && (
            <div className="flex-1 min-h-0 overflow-auto" style={{ width: 390 }}>
              <DashboardPanel
                leadData={leadData}
                hasStarted={hasStarted}
                busyMode={busyMode}
                onToggleBusy={() => setBusyMode(v => !v)}
                isBlocked={isBlocked}
                onBlockLead={() => setIsBlocked(true)}
                stats={stats}
              />
            </div>
          )}
        </div>
      </div>

      {/* Config modal */}
      {showConfig && (
        <ConfigPanel
          profile={profile}
          onSave={saveProfile}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
}
