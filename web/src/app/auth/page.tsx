'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) { await login(form.email, form.password); }
      else          { await register(form); }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--bg)' }}>

      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-t1 tracking-tight">NutriDrive</h1>
        <p className="text-t3 mt-2 text-sm">Mange bien, bouge mieux.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl p-7 space-y-5" style={{ background: 'var(--card)' }}>

        {/* Toggle connexion / inscription */}
        <div className="flex rounded-2xl p-1" style={{ background: 'var(--bg)' }}>
          {(['Connexion', 'Inscription'] as const).map((label, i) => (
            <button
              key={label}
              onClick={() => { setIsLogin(i === 0); setError(''); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={
                (i === 0) === isLogin
                  ? { background: 'var(--card)', color: 'var(--t1)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                  : { color: 'var(--t3)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <Field
                placeholder="Prénom"
                value={form.firstName}
                onChange={v => setForm({ ...form, firstName: v })}
                required={!isLogin}
              />
              <Field
                placeholder="Nom"
                value={form.lastName}
                onChange={v => setForm({ ...form, lastName: v })}
                required={!isLogin}
              />
            </div>
          )}

          <Field
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={v => setForm({ ...form, email: v })}
            required
          />
          <Field
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={v => setForm({ ...form, password: v })}
            required
            minLength={8}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-brand-500 text-white font-semibold text-sm
                       hover:bg-brand-600 active:scale-[0.98] transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Chargement…
              </span>
            ) : isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ type = 'text', placeholder, value, onChange, required, minLength }: {
  type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; minLength?: number;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      minLength={minLength}
      className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none
                 transition-all duration-150 border
                 focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
      style={{
        background: 'var(--bg)',
        color: 'var(--t1)',
        borderColor: 'var(--border)',
      }}
    />
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
