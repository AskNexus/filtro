'use client';

import { LeadData } from '@/app/page';

interface DashboardPanelProps {
  leadData: LeadData;
  hasStarted: boolean;
}

const SAMPLE_LEADS = [
  { name: 'Marcos R.', service: 'Cena + compañía', city: 'Madrid', score: 'hot' as const, time: '14:32' },
  { name: 'J.L.', service: 'Sin especificar', city: 'Barcelona', score: 'cold' as const, time: '11:05' },
  { name: 'Roberto M.', service: 'Tarde completa', city: 'Madrid', score: 'warm' as const, time: 'Ayer' },
];

const STAGES = ['Saludo', 'Presentación', 'Disponibilidad', 'Confirmar', 'Cerrada'];
const stageOrder = ['greeting', 'presentation', 'availability', 'needs_confirmation', 'confirmed', 'done'];

const scoreConfig = {
  cold: { label: 'Frío', color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.25)', dot: '#FF6B6B' },
  warm: { label: 'Tibio', color: '#FFB347', bg: 'rgba(255,179,71,0.12)', border: 'rgba(255,179,71,0.25)', dot: '#FFB347' },
  hot: { label: 'Caliente', color: '#25D366', bg: 'rgba(37,211,102,0.12)', border: 'rgba(37,211,102,0.25)', dot: '#25D366' },
};

const icons = {
  person: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  location: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    </svg>
  ),
  target: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5S9.51 16.5 12 16.5s4.5-2.01 4.5-4.5S14.49 7.5 12 7.5zm0 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  signal: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  ),
};

function ScoreBadge({ score }: { score: 'cold' | 'warm' | 'hot' }) {
  const cfg = scoreConfig[score];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <span
        className="rounded-full"
        style={{ width: 6, height: 6, background: cfg.dot, display: 'inline-block' }}
      />
      {cfg.label}
    </span>
  );
}

function LeadField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null;
  icon: React.ReactNode;
}) {
  const filled = !!value;
  return (
    <div
      className="flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-300"
      style={{
        background: filled ? 'rgba(255,255,255,0.04)' : 'transparent',
        opacity: filled ? 1 : 0.4,
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-md"
        style={{
          width: 30,
          height: 30,
          background: filled ? 'rgba(37,211,102,0.12)' : 'rgba(255,255,255,0.05)',
          color: filled ? '#25D366' : '#8696A0',
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8696A0', letterSpacing: '0.08em' }}>
          {label}
        </div>
        <div
          className="text-sm truncate font-medium"
          style={{ color: filled ? '#E9EDEF' : '#3D5462' }}
        >
          {value || '—'}
        </div>
      </div>
      {filled && (
        <div style={{ color: '#25D366', flexShrink: 0 }}>
          {icons.check}
        </div>
      )}
    </div>
  );
}

export default function DashboardPanel({ leadData, hasStarted }: DashboardPanelProps) {
  const currentStageIndex = stageOrder.indexOf(leadData.stage);
  const filledFields = [leadData.name, leadData.service, leadData.city, leadData.availability].filter(Boolean).length;
  const progress = hasStarted ? Math.round((filledFields / 4) * 100) : 0;
  const cfg = scoreConfig[leadData.score];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#0D1117' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-4 border-b"
        style={{ background: '#161B22', borderColor: '#21262D' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: '#E6EDF3' }}>
              Panel de gestión
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
              Calificación de leads en tiempo real
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="rounded-full"
              style={{
                width: 7,
                height: 7,
                background: hasStarted ? '#25D366' : '#8B949E',
                display: 'inline-block',
                animation: hasStarted ? 'pulse 2s infinite' : 'none',
              }}
            />
            <span className="text-xs" style={{ color: '#8B949E' }}>
              {hasStarted ? 'En vivo' : 'Esperando'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3">
        {/* Active lead card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: '#161B22',
            border: `1px solid ${hasStarted ? '#21262D' : '#21262D'}`,
          }}
        >
          {/* Card header */}
          <div
            className="px-4 py-3 flex items-center justify-between border-b"
            style={{ borderColor: '#21262D' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="rounded"
                style={{ width: 8, height: 8, background: hasStarted ? '#25D366' : '#8B949E' }}
              />
              <span className="text-sm font-medium" style={{ color: '#E6EDF3' }}>
                Lead activo
              </span>
            </div>
            {hasStarted && <ScoreBadge score={leadData.score} />}
          </div>

          {/* Fields */}
          <div className="p-2">
            <LeadField label="Nombre" value={leadData.name} icon={icons.person} />
            <LeadField label="Servicio buscado" value={leadData.service} icon={icons.target} />
            <LeadField label="Ciudad" value={leadData.city} icon={icons.location} />
            <LeadField label="Disponibilidad" value={leadData.availability} icon={icons.calendar} />
          </div>

          {/* Progress */}
          {hasStarted && (
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: '#8B949E' }}>
                  Perfil completado
                </span>
                <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#21262D' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: cfg.color }}
                />
              </div>
            </div>
          )}

          {/* Conversation stages */}
          {hasStarted && (
            <div className="px-4 pb-4">
              <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8B949E', letterSpacing: '0.08em' }}>
                Etapa del flujo
              </div>
              <div className="flex gap-1">
                {STAGES.map((stage, i) => {
                  const done = i < currentStageIndex;
                  const active = i === currentStageIndex;
                  return (
                    <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="h-1 w-full rounded-full transition-all duration-500"
                        style={{
                          background: done ? '#25D366' : active ? 'rgba(37,211,102,0.4)' : '#21262D',
                        }}
                      />
                      <span
                        className="text-[9px]"
                        style={{ color: done || active ? '#25D366' : '#8B949E' }}
                      >
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bot notes */}
          {hasStarted && leadData.notes && (
            <div
              className="mx-4 mb-4 p-3 rounded-lg flex gap-2"
              style={{ background: '#0D1117', border: '1px solid #21262D' }}
            >
              <div className="flex-shrink-0 mt-0.5" style={{ color: '#8B949E' }}>
                {icons.info}
              </div>
              <p className="text-xs leading-relaxed italic" style={{ color: '#8B949E' }}>
                {leadData.notes}
              </p>
            </div>
          )}
        </div>

        {/* Previous leads */}
        <div>
          <div
            className="text-[10px] uppercase tracking-wider mb-2 px-1"
            style={{ color: '#8B949E', letterSpacing: '0.08em' }}
          >
            Leads anteriores
          </div>
          <div className="space-y-1.5">
            {SAMPLE_LEADS.map((lead, i) => {
              const lcfg = scoreConfig[lead.score];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors"
                  style={{
                    background: '#161B22',
                    border: '1px solid #21262D',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#30363D')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#21262D')}
                >
                  <div
                    className="rounded-full flex-shrink-0"
                    style={{ width: 8, height: 8, background: lcfg.dot }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#E6EDF3' }}>
                      {lead.name}
                    </div>
                    <div className="text-xs truncate" style={{ color: '#8B949E' }}>
                      {lead.service} · {lead.city}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] font-semibold" style={{ color: lcfg.color }}>
                      {lcfg.label}
                    </div>
                    <div className="text-[10px]" style={{ color: '#8B949E' }}>
                      {lead.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How it works */}
        <div
          className="rounded-xl p-4"
          style={{
            background: '#161B22',
            border: '1px solid #21262D',
          }}
        >
          <div className="text-xs font-semibold mb-3" style={{ color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Cómo funciona
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Responde automáticamente 24/7' },
              { label: 'Califica cada lead al instante' },
              { label: 'Solo ves los clientes serios' },
              { label: 'Funciona en WhatsApp y Telegram' },
              { label: 'Tú decides a quién atender' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: 20, height: 20, background: 'rgba(37,211,102,0.15)', color: '#25D366' }}
                >
                  {icons.check}
                </div>
                <span className="text-xs" style={{ color: '#C9D1D9' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
