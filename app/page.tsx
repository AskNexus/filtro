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

  const sendMessage = useCallback(async (content: string) => {
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
  }, [messages]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setLeadData(initialLeadData);
    setHasStarted(false);
  }, []);

  return (
    <main className="flex h-screen overflow-hidden bg-[#111B21]">
      <div className="flex-1 flex flex-col min-w-0">
        <ChatPanel
          messages={messages}
          isTyping={isTyping}
          hasStarted={hasStarted}
          onSend={sendMessage}
          onStart={startConversation}
          onReset={resetConversation}
        />
      </div>
      <div className="w-[400px] flex-shrink-0 border-l border-[#2A3942]">
        <DashboardPanel leadData={leadData} hasStarted={hasStarted} />
      </div>
    </main>
  );
}
