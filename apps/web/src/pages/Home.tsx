import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface NavCard {
  title: string;
  description: string;
  icon: string;
  path: string;
  accent: string;
}

const NAV_CARDS: NavCard[] = [
  {
    title: 'Catálogo de Planes',
    description: 'Gestiona la disponibilidad de planes comerciales. Activa, desactiva y consulta el catálogo.',
    icon: '📋',
    path: '/plans',
    accent: 'sky',
  },
  {
    title: 'Catálogo de Productos',
    description: 'Explora el catálogo de equipos y productos disponibles. Consulta detalles y categorías.',
    icon: '🛒',
    path: '/catalog',
    accent: 'violet',
  },
  {
    title: 'Reserva de Inventario',
    description: 'Consulta inventario por sucursal y reserva equipos para órdenes de trabajo.',
    icon: '📦',
    path: '/reserve',
    accent: 'emerald',
  },
  {
    title: 'Ver inventario por sucursal',
    description: 'Revisa cuántos productos hay disponibles en cada sucursal.',
    icon: '📦',
    path: '/inventory',
    accent: 'emerald',
  },
];

const ACCENT_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  sky:     { border: 'hover:border-sky-500',     bg: 'bg-sky-500/10',     text: 'text-sky-400' },
  violet:  { border: 'hover:border-violet-500',  bg: 'bg-violet-500/10',  text: 'text-violet-400' },
  emerald: { border: 'hover:border-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }
    // Try to get user info from stored user data or JWT
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUsername(user.email?.split('@')[0] ?? '');
      } else {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.email?.split('@')[0] ?? payload.sub ?? '');
      }
    } catch {
      setUsername('');
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-slate-700">
        <div>
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-sky-400 font-medium mb-1">
            FieldOps Telecom Suite
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50 leading-tight">
            Panel Principal
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Bienvenido{username ? `, ${username}` : ''}. Selecciona un módulo para comenzar.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-400 text-xs font-medium hover:border-rose-500 hover:text-rose-400 transition-all duration-150 whitespace-nowrap shrink-0 w-full sm:w-auto justify-center sm:justify-start"
        >
          ⏻ Cerrar Sesión
        </button>
      </header>

      {/* ── Módulos ── */}
      <section>
        <h2 className="text-[0.7rem] uppercase tracking-widest text-slate-600 font-medium mb-4">
          Módulos disponibles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {NAV_CARDS.map((card) => {
            const style = ACCENT_STYLES[card.accent] ?? ACCENT_STYLES.sky;
            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className={[
                  'group text-left bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200',
                  style.border,
                  'hover:shadow-lg hover:shadow-slate-900/50 active:scale-[0.98]',
                ].join(' ')}
              >
                {/* Icon */}
                <div className={[
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  style.bg,
                ].join(' ')}>
                  {card.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <h3 className={[
                    'text-base font-bold text-slate-200 group-hover:text-slate-50 transition-colors',
                  ].join(' ')}>
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className={[
                  'flex items-center gap-1 text-xs font-medium mt-auto pt-2',
                  style.text,
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                ].join(' ')}>
                  Ir al módulo
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Quick Stats ── */}
      <section className="mt-8 sm:mt-10 pt-6 border-t border-slate-700">
        <h2 className="text-[0.7rem] uppercase tracking-widest text-slate-600 font-medium mb-4">
          Información del sistema
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex flex-col gap-0.5">
            <span className="text-lg font-bold text-slate-300">v1.0</span>
            <span className="text-[0.6rem] text-slate-500 uppercase tracking-widest">Versión</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex flex-col gap-0.5">
            <span className="text-lg font-bold text-emerald-400">●&nbsp;Online</span>
            <span className="text-[0.6rem] text-slate-500 uppercase tracking-widest">API Status</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex flex-col gap-0.5">
            <span className="text-lg font-bold text-slate-300">2</span>
            <span className="text-[0.6rem] text-slate-600 uppercase tracking-widest">Módulos</span>
          </div>
        </div>
      </section>

      <p className="text-center text-[0.6rem] text-slate-700 mt-10">
        © 2026 FieldOps Telecom · v1.0
      </p>
    </div>
  );
}
