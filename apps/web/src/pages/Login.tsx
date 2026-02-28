import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  user: {
    id: string;
    email: string;
    blocked: boolean;
    roles: string[];
    permissions: string[];
  };
}

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().includes('@') && password.length >= 8 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
        email: email.trim(),
        password,
      });

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/home');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* ── Branding ── */}
        <div className="text-center mb-8">
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-sky-400 font-medium mb-2">
            FieldOps Telecom Suite
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-50">
            Iniciar Sesión
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Ingresa tus credenciales para acceder al sistema.
          </p>
        </div>

        {/* ── Card ── */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col gap-5"
        >
          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm"
            >
              <span className="text-rose-400 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[0.7rem] uppercase tracking-widest text-slate-400 font-medium"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none select-none">
                ✉️
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@telecom.local"
                autoComplete="email"
                autoFocus
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[0.7rem] uppercase tracking-widest text-slate-400 font-medium"
            >
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none select-none">
                🔒
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              'w-full py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-150',
              canSubmit
                ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed',
            ].join(' ')}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block">↻</span>
                Ingresando…
              </span>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        {/* ── Info de demo ── */}
        <div className="mt-5 bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3">
          <p className="text-[0.65rem] uppercase tracking-widest text-slate-600 mb-2">
            Credenciales de prueba
          </p>
          <div className="flex flex-col gap-1.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Admin</span>
              <code className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[0.7rem]">
                admin@telecom.local / Admin123!
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span>Ventas</span>
              <code className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[0.7rem]">
                ventas@telecom.local / Ventas123!
              </code>
            </div>
          </div>
        </div>

        <p className="text-center text-[0.6rem] text-slate-700 mt-6">
          © 2026 FieldOps Telecom · v1.0
        </p>
      </div>
    </div>
  );
}

export default LoginPage;