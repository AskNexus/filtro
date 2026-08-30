'use client';

import { LeadData } from '@/app/page';

interface DashboardPanelProps {
  leadData: LeadData;
  hasStarted: boolean;
}

const SAMPLE_LEADS = [
  { name: 'Marcos R.', service: 'Cena + compañía', city: 'Madrid', score: 'hot' as const, time: 'Hace 2h' },
  { name: 'J.L.', service: 'No especificó', city: 'Barcelona', score: 'cold' as const, time: 'Hace 5h' },
  { name: 'Roberto M.', service: 'Tarde completa', city: 'Madrid', score: 'warm' as const, time: 'Ayer' },
];

const STAGES = [
  { key: 'greeting', label: 'Saludo' },
  { key: 'service', label: 'Servicio' },
  { key: 'city', label: 'Ciudad' },
  { key: 'availability', label: 'Hora' },
  { key: 'closing', label: 'Cierre' },
];

const stageOrder = ['greeting', 'service', 'city', 'availability', 'closing', 'done'];

const scoreConfig = {
  cold: {
    label: 'FRÍO',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    dot: 'bg-red-400',
    emoji: '🔴',
    bar: 'bg-red-400',
  },
  warm: {
    label: 'TIBIO',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    dot: 'bg-yellow-400',
    emoji: '🟡',
    bar: 'bg-yellow-400',
  },
  hot: {
    label: 'CALIENTE',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
    dot: 'bg-green-400',
    emoji: '🟢',
    bar: 'bg-green-400',
  },
};

function ScoreBadge({ score }: { score: 'cold' | 'warm' | 'hot' }) {
  const cfg = scoreConfig[score];
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.bg}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      <span className={`text-[10px] font-bold tracking-wide ${cfg.color}`}>
        {cfg.label}
      </span>
    </div>
  );
}

function LeadField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null;
  icon: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-2.5 rounded-lg transition-all duration-300 ${
        value ? 'bg-[#1A2835] field-appear' : 'opacity-35'
      }`}
    >
      <span className="text-base mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[#8696A0] text-[10px] uppercase tracking-wider mb-0.5">{label}</div>
        <div className={`text-sm font-medium truncate ${value ? 'text-[#E9EDEF]' : 'text-[#3D5462]'}`}>
          {value || '—'}
        </div>
      </div>
      {value && <span className="text-[#25D366] text-xs mt-1">✓</span>}
    </div>
  );
}

export default function DashboardPanel({ leadData, hasStarted }: DashboardPanelProps) {
  const currentStageIndex = stageOrder.indexOf(leadData.stage);
  const cfg = scoreConfig[leadData.score];

  const filledFields = [leadData.name, leadData.service, leadData.city, leadData.availability].filter(Boolean).length;
  const progress = hasStarted ? Math.round((filledFields / 4) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#0B141A] overflow-y-auto">
      {/* Header */}
      <div className="bg-[#202C33] px-4 py-3 border-b border-[#2A3942] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">👑</span>
          <div>
            <div className="text-white font-semibold text-sm">Panel de la Dueña</div>
            <div className="text-[#8696A0] text-xs">Leads en tiempo real</div>
          </div>
          <div className="ml-auto">
            <div className={`w-2 h-2 rounded-full ${hasStarted ? 'bg-[#25D366] animate-pulse' : 'bg-[#8696A0]'}`} />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3">
        {/* Active Lead Card */}
        <div className={`rounded-xl border transition-all ${
          hasStarted
            ? 'bg-[#151E26] border-[#2A3942]'
            : 'bg-[#151E26]/60 border-[#2A3942]/50'
        }`}>
          {/* Card header */}
          <div className="px-4 py-3 border-b border-[#2A3942] flex items-center justify-between">
            <span className="text-[#E9EDEF] text-sm font-semibold">
              {hasStarted ? 'Conversación activa' : 'Esperando cliente...'}
            </span>
            {hasStarted && <ScoreBadge score={leadData.score} />}
          </div>

          {/* Fields */}
          <div className="p-3 space-y-1">
            <LeadField label="Nombre" value={leadData.name} icon="👤" />
            <LeadField label="¿Qué busca?" value={leadData.service} icon="🎯" />
            <LeadField label="Ciudad" value={leadData.city} icon="📍" />
            <LeadField label="Disponibilidad" value={leadData.availability} icon="📅" />
          </div>

          {/* Progress bar */}
          {hasStarted && (
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#8696A0] text-[10px] uppercase tracking-wider">Perfil completado</span>
                <span className={`text-[10px] font-bold ${cfg.color}`}>{progress}%</span>
              </div>
              <div className="h-1.5 bg-[#2A3942] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stage flow */}
          {hasStarted && (
            <div className="px-4 pb-4">
              <div className="text-[#8696A0] text-[10px] uppercase tracking-wider mb-2">Flujo de conversación</div>
              <div className="flex gap-1">
                {STAGES.map((stage, i) => {
                  const done = i < currentStageIndex;
                  const active = i === currentStageIndex;
                  return (
                    <div key={stage.key} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`h-1 w-full rounded-full transition-all duration-500 ${
                          done ? 'bg-[#25D366]' : active ? 'bg-[#25D366]/40' : 'bg-[#2A3942]'
                        }`}
                      />
                      <span
                        className={`text-[9px] ${
                          done || active ? 'text-[#25D366]' : 'text-[#3D5462]'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bot notes */}
          {hasStarted && leadData.notes && (
            <div className="mx-4 mb-4 p-3 bg-[#0B141A] rounded-lg border border-[#2A3942]">
              <div className="text-[#8696A0] text-[10px] uppercase tracking-wider mb-1">
                Observación del bot
              </div>
              <div className="text-[#8696A0] text-xs italic">{leadData.notes}</div>
            </div>
          )}
        </div>

        {/* Previous leads */}
        <div>
          <div className="text-[#8696A0] text-[10px] uppercase tracking-wider mb-2 px-1">
            Leads anteriores
          </div>
          <div className="space-y-2">
            {SAMPLE_LEADS.map((lead, i) => {
              const lcfg = scoreConfig[lead.score];
              return (
                <div
                  key={i}
                  className="bg-[#151E26] border border-[#2A3942] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[#3D5462] transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${lcfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[#E9EDEF] text-sm font-medium truncate">{lead.name}</div>
                    <div className="text-[#8696A0] text-xs truncate">
                      {lead.service} · {lead.city}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm mb-0.5">{lcfg.emoji}</div>
                    <div className="text-[#8696A0] text-[10px]">{lead.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Value prop */}
        <div className="bg-[#005C4B]/15 border border-[#25D366]/20 rounded-xl p-4">
          <div className="text-[#25D366] text-xs font-semibold mb-2 flex items-center gap-1.5">
            <span>⚡</span> ¿Qué hace el sistema?
          </div>
          <ul className="text-[#8696A0] text-xs space-y-1.5 leading-relaxed">
            <li>✓ Responde automáticamente 24/7</li>
            <li>✓ Califica cada lead en segundos</li>
            <li>✓ Solo llegan clientes serios y filtrados</li>
            <li>✓ Funciona en WhatsApp y Telegram</li>
            <li>✓ Tú decides a quién atender</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
