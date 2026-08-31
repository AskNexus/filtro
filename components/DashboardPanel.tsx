'use client';

import { LeadData } from '@/app/page';

interface Stats {
  total: number;
  hot: number;
  warm: number;
  confirmed: number;
  blocked: number;
}

interface DashboardPanelProps {
  leadData: LeadData;
  hasStarted: boolean;
  busyMode: boolean;
  onToggleBusy: () => void;
  isBlocked: boolean;
  onBlockLead: () => void;
  stats: Stats;
}

const SAMPLE_LEADS = [
  { name: 'Marcos R.', service: 'Tarde completa', score: 'hot' as const, time: '14:32' },
  { name: 'J.L.', service: 'Sin especificar', score: 'cold' as const, time: '11:05' },
  { name: 'Roberto M.', service: 'Compañía + cena', score: 'warm' as const, time: 'Ayer' },
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
  location: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  warn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  block: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.68L5.68 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.68L18.32 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
    </svg>
  ),
  bell: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  ),
  moon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
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
      <span className="rounded-full" style={{ width: 6, height: 6, background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}

function LeadField({ label, value, icon }: { label: string; value: string | null; icon: React.ReactNode }) {
  const filled = !!value;
  return (
    <div
      className="flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-300"
      style={{ background: filled ? 'rgba(255,255,255,0.04)' : 'transparent', opacity: filled ? 1 : 0.4 }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-md"
        style={{ width: 30, height: 30, background: filled ? 'rgba(37,211,102,0.12)' : 'rgba(255,255,255,0.05)', color: filled ? '#25D366' : '#8696A0' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8B949E', letterSpacing: '0.08em' }}>{label}</div>
        <div className="text-sm truncate font-medium" style={{ color: filled ? '#E9EDEF' : '#3D5462' }}>{value || '—'}</div>
      </div>
      {filled && <div style={{ color: '#25D366', flexShrink: 0 }}>{icons.check}</div>}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl py-3 px-2"
      style={{ background: '#0D1117', border: '1px solid #21262D' }}
    >
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-center mt-0.5 leading-tight" style={{ color: '#8B949E' }}>{label}</div>
    </div>
  );
}

export default function DashboardPanel({
  leadData,
  hasStarted,
  busyMode,
  onToggleBusy,
  isBlocked,
  onBlockLead,
  stats,
}: DashboardPanelProps) {
  const currentStageIndex = stageOrder.indexOf(leadData.stage);
  const filledFields = [leadData.name, leadData.service, leadData.city, leadData.availability].filter(Boolean).length;
  const progress = hasStarted ? Math.round((filledFields / 4) * 100) : 0;
  const cfg = scoreConfig[leadData.score];

  const needsConfirmation = leadData.stage === 'needs_confirmation';
  const hotPct = stats.total > 0 ? Math.round((stats.hot / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#0D1117' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b" style={{ background: '#161B22', borderColor: '#21262D' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: '#E6EDF3' }}>Panel de gestión</div>
            <div className="text-xs mt-0.5" style={{ color: '#8B949E' }}>Calificación de leads en tiempo real</div>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="rounded-full"
              style={{ width: 7, height: 7, background: hasStarted ? '#25D366' : '#8B949E', display: 'inline-block', animation: hasStarted ? 'pulse 2s infinite' : 'none' }}
            />
            <span className="text-xs" style={{ color: '#8B949E' }}>{hasStarted ? 'En vivo' : 'Esperando'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3">

        {/* ── Busy mode toggle ── */}
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{
            background: busyMode ? 'rgba(255,179,71,0.08)' : '#161B22',
            border: `1px solid ${busyMode ? 'rgba(255,179,71,0.3)' : '#21262D'}`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div style={{ color: busyMode ? '#FFB347' : '#8B949E' }}>{icons.moon}</div>
            <div>
              <div className="text-xs font-semibold" style={{ color: busyMode ? '#FFB347' : '#E6EDF3' }}>
                Modo ocupada
              </div>
              <div className="text-[10px]" style={{ color: '#8B949E' }}>
                {busyMode ? 'Auto-respuesta activa' : 'Responde normalmente'}
              </div>
            </div>
          </div>
          <button
            onClick={onToggleBusy}
            className="relative transition-all"
            style={{ width: 44, height: 24, borderRadius: 12, background: busyMode ? '#FFB347' : '#21262D', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            <span
              className="absolute"
              style={{
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                top: 3, left: busyMode ? 23 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
          </button>
        </div>

        {/* ── Red flag alert ── */}
        {hasStarted && leadData.red_flag && (
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)' }}
          >
            <div className="flex-shrink-0 mt-0.5" style={{ color: '#FF6B6B' }}>{icons.warn}</div>
            <div>
              <div className="text-xs font-semibold mb-0.5" style={{ color: '#FF6B6B' }}>Señal de alerta detectada</div>
              <div className="text-xs leading-relaxed" style={{ color: '#FFB3B3' }}>
                {leadData.flag_reason ?? 'Comportamiento sospechoso. Revisa la conversación antes de continuar.'}
              </div>
            </div>
          </div>
        )}

        {/* ── Needs confirmation alert ── */}
        {hasStarted && needsConfirmation && !isBlocked && (
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)' }}
          >
            <div className="flex-shrink-0 mt-0.5" style={{ color: '#25D366' }}>{icons.bell}</div>
            <div>
              <div className="text-xs font-semibold mb-0.5" style={{ color: '#25D366' }}>Cliente quiere concretar cita</div>
              <div className="text-xs" style={{ color: '#8B949E' }}>
                Revisa la disponibilidad y confirma si la hora te viene bien.
              </div>
            </div>
          </div>
        )}

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard label="Chats hoy" value={stats.total} color="#E6EDF3" />
          <StatCard label="% Calientes" value={`${hotPct}%`} color="#25D366" />
          <StatCard label="Confirmadas" value={stats.confirmed} color="#53BDEB" />
          <StatCard label="Bloqueados" value={stats.blocked} color="#FF6B6B" />
        </div>

        {/* ── Active lead card ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: '#161B22',
            border: `1px solid ${isBlocked ? 'rgba(255,107,107,0.4)' : '#21262D'}`,
            opacity: isBlocked ? 0.7 : 1,
          }}
        >
          <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: '#21262D' }}>
            <div className="flex items-center gap-2">
              <div className="rounded" style={{ width: 8, height: 8, background: isBlocked ? '#FF6B6B' : (hasStarted ? '#25D366' : '#8B949E') }} />
              <span className="text-sm font-medium" style={{ color: isBlocked ? '#FF6B6B' : '#E6EDF3' }}>
                {isBlocked ? 'Lead bloqueado' : 'Lead activo'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasStarted && !isBlocked && <ScoreBadge score={leadData.score} />}
              {hasStarted && !isBlocked && (
                <button
                  onClick={onBlockLead}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                  style={{ background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)' }}
                >
                  <span style={{ color: '#FF6B6B' }}>{icons.block}</span>
                  Bloquear
                </button>
              )}
            </div>
          </div>

          {isBlocked ? (
            <div className="p-4 text-center">
              <p className="text-xs" style={{ color: '#8B949E' }}>
                Este cliente ha sido añadido a la lista negra. La próxima vez que escriba recibirá un rechazo automático.
              </p>
            </div>
          ) : (
            <>
              <div className="p-2">
                <LeadField label="Nombre" value={leadData.name} icon={icons.person} />
                <LeadField label="Servicio buscado" value={leadData.service} icon={icons.target} />
                <LeadField label="Ciudad" value={leadData.city} icon={icons.location} />
                <LeadField label="Disponibilidad" value={leadData.availability} icon={icons.calendar} />
              </div>

              {hasStarted && (
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#8B949E' }}>Perfil completado</span>
                    <span className="text-xs font-semibold" style={{ color: cfg.color }}>{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#21262D' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: cfg.color }} />
                  </div>
                </div>
              )}

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
                            style={{ background: done ? '#25D366' : active ? 'rgba(37,211,102,0.4)' : '#21262D' }}
                          />
                          <span className="text-[9px]" style={{ color: done || active ? '#25D366' : '#8B949E' }}>{stage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasStarted && leadData.notes && (
                <div className="mx-4 mb-4 p-3 rounded-lg flex gap-2" style={{ background: '#0D1117', border: '1px solid #21262D' }}>
                  <div className="flex-shrink-0 mt-0.5" style={{ color: '#8B949E' }}>{icons.info}</div>
                  <p className="text-xs leading-relaxed italic" style={{ color: '#8B949E' }}>{leadData.notes}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Previous leads ── */}
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-2 px-1" style={{ color: '#8B949E', letterSpacing: '0.08em' }}>
            Leads anteriores
          </div>
          <div className="space-y-1.5">
            {SAMPLE_LEADS.map((lead, i) => {
              const lcfg = scoreConfig[lead.score];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: '#161B22', border: '1px solid #21262D' }}
                >
                  <div className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: lcfg.dot }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#E6EDF3' }}>{lead.name}</div>
                    <div className="text-xs truncate" style={{ color: '#8B949E' }}>{lead.service}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] font-semibold" style={{ color: lcfg.color }}>{lcfg.label}</div>
                    <div className="text-[10px]" style={{ color: '#8B949E' }}>{lead.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <div className="text-xs font-semibold mb-3" style={{ color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Cómo funciona
          </div>
          <div className="space-y-2.5">
            {[
              'Responde automáticamente 24/7',
              'Califica cada lead al instante',
              'Detecta clientes problemáticos',
              'Modo ocupada con un clic',
              'Tú decides a quién atender',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: 20, height: 20, background: 'rgba(37,211,102,0.15)', color: '#25D366' }}
                >
                  {icons.check}
                </div>
                <span className="text-xs" style={{ color: '#C9D1D9' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
