interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

export default function Navbar({ cartCount, onCartOpen }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-[200] bg-beige/92 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 sm:px-5 md:px-12 h-[60px] sm:h-[70px]">
        <div className="font-display text-[20px] sm:text-[22px] font-extrabold text-green">
          Más<span className="text-coral">Simple</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#productos" className="text-sm font-semibold text-muted-foreground hover:text-coral transition-colors tracking-wide">Productos</a>
          <a href="#nosotras" className="text-sm font-semibold text-muted-foreground hover:text-coral transition-colors tracking-wide">Nosotras</a>
          <a href="#contacto" className="text-sm font-semibold text-muted-foreground hover:text-coral transition-colors tracking-wide">Contacto</a>
        </div>
        <button
          onClick={onCartOpen}
          className="bg-green text-primary-foreground border-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-[13px] sm:text-sm cursor-pointer flex items-center gap-1.5 sm:gap-2 hover:bg-coral hover:scale-[1.04] transition-all"
        >
          🛒 <span className="hidden xs:inline">Mi pedido</span>
          <span className="bg-coral text-primary-foreground w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      </div>
    </nav>
  );
}
