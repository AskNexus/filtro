'use client';

import { useState } from 'react';
import { Profile } from '@/app/page';

interface ConfigPanelProps {
  profile: Profile;
  onSave: (p: Profile) => void;
  onClose: () => void;
}

export default function ConfigPanel({ profile, onSave, onClose }: ConfigPanelProps) {
  const [form, setForm] = useState<Profile>({ ...profile });

  const set = (k: keyof Profile, v: string | number) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#161B22', border: '1px solid #30363D' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#21262D' }}
        >
          <div>
            <div className="text-sm font-semibold" style={{ color: '#E6EDF3' }}>
              Configurar perfil
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
              Personaliza el bot para cada modelo
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ width: 32, height: 32, color: '#8B949E' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          <Field label="Nombre del bot">
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Luna"
              style={inputStyle}
            />
          </Field>

          <Field label="Ubicación del piso">
            <input
              type="text"
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="La Guindalera, Madrid"
              style={inputStyle}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tarifa 1 hora (€)">
              <input
                type="number"
                value={form.price1h}
                onChange={e => set('price1h', Number(e.target.value))}
                min={0}
                style={inputStyle}
              />
            </Field>
            <Field label="Tarifa 30 min (€)">
              <input
                type="number"
                value={form.price30min}
                onChange={e => set('price30min', Number(e.target.value))}
                min={0}
                style={inputStyle}
              />
            </Field>
          </div>

          <div
            className="p-3 rounded-lg text-xs"
            style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.15)', color: '#8B949E' }}
          >
            Los cambios afectan solo a conversaciones nuevas. Los adicionales y el flujo se ajustan automáticamente.
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 pb-5"
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: '#25D366', color: 'white' }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B949E' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0D1117',
  border: '1px solid #30363D',
  borderRadius: 10,
  padding: '9px 12px',
  color: '#E6EDF3',
  fontSize: 14,
  outline: 'none',
};
