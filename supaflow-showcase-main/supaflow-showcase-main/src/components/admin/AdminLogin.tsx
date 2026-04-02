import { useState } from 'react';

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email.includes('@')) { setError('Ingresá un email válido.'); return; }
    if (password.length < 6) { setError('Mínimo 6 caracteres.'); return; }
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-green z-[1000] flex items-center justify-center p-5">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
      <div className="relative bg-beige-light rounded-lg p-10 md:p-12 w-full max-w-[420px] shadow-ms-lg animate-slide-up">
        <div className="text-center mb-7">
          <span className="font-display text-[28px] font-bold italic text-green">Más <em className="not-italic text-coral">Simple</em></span>
          <p className="text-[13px] text-muted-foreground mt-1">Panel de administración</p>
        </div>

        {error && <div className="bg-coral/10 text-coral p-2.5 px-3.5 rounded-lg text-[13px] font-semibold mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full p-3.5 px-4 border-2 border-border rounded-[var(--radius-sm)] font-sans text-[15px] bg-card text-foreground outline-none focus:border-coral focus:shadow-[0_0_0_3px_rgba(241,91,91,0.12)] transition-all"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">Contraseña</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full p-3.5 px-4 border-2 border-border rounded-[var(--radius-sm)] font-sans text-[15px] bg-card text-foreground outline-none focus:border-coral focus:shadow-[0_0_0_3px_rgba(241,91,91,0.12)] transition-all"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-2 bg-green text-primary-foreground border-none p-3 rounded-full font-bold text-sm cursor-pointer hover:bg-green-mid transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verificando...' : 'Ingresar al panel'}
        </button>

        <a href="/" className="block text-center mt-5 text-muted-foreground/40 text-[13px] no-underline hover:text-coral transition-colors">
          ← Volver a la tienda
        </a>
      </div>
    </div>
  );
}
