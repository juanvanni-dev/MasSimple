interface Props {
  active: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  pendingCount: number;
}

export default function AdminSidebar({ active, onNavigate, onLogout, isOpen, pendingCount }: Props) {
  const items = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'productos', icon: '🥦', label: 'Productos' },
    { id: 'pedidos', icon: '🛎️', label: 'Pedidos', badge: pendingCount },
  ];

  return (
    <aside className={`w-[82vw] max-w-[230px] bg-green flex flex-col flex-shrink-0 fixed top-0 left-0 bottom-0 z-[100] transition-transform md:w-[230px] md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-5 py-6 border-b border-primary-foreground/10">
        <div className="font-display text-xl italic font-bold text-primary-foreground">Más <em className="not-italic text-coral">Simple</em></div>
        <p className="text-[11px] text-primary-foreground/45 mt-0.5">Panel de gestión</p>
      </div>

      <nav className="flex-1 py-3">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary-foreground/30 px-5 pt-4 pb-1.5">General</div>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-5 py-3.5 flex items-center gap-2.5 cursor-pointer font-semibold text-sm border-l-[3px] transition-all select-none
              ${active === item.id
                ? 'text-primary-foreground bg-primary-foreground/[0.08] border-coral'
                : 'text-primary-foreground/55 border-transparent hover:text-primary-foreground hover:bg-primary-foreground/[0.06]'}`}
          >
            <span>{item.icon}</span> {item.label}
            {item.badge ? (
              <span className="ml-auto bg-coral text-primary-foreground text-[10px] font-extrabold px-[7px] py-[2px] rounded-full">
                {item.badge}
              </span>
            ) : null}
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-primary-foreground/10">
        <a href="/" className="flex items-center gap-2 text-primary-foreground/45 text-[13px] font-semibold no-underline py-2 hover:text-primary-foreground transition-colors">🏠 Ver la tienda</a>
        <button onClick={onLogout} className="flex items-center gap-2 text-primary-foreground/30 text-[13px] font-semibold bg-transparent border-none cursor-pointer py-2 hover:text-primary-foreground transition-colors font-sans w-full text-left">🚪 Cerrar sesión</button>
      </div>
    </aside>
  );
}
