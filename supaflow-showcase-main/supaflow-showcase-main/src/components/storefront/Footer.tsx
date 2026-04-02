export default function Footer() {
  return (
    <footer className="bg-green py-8 sm:py-10 px-4 sm:px-5 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
      <div className="font-display text-lg font-extrabold text-primary-foreground">
        Más<span className="text-coral">Simple</span>
      </div>
      <div className="text-center">
        <p className="text-primary-foreground/45 text-[12px] sm:text-[13px] mb-1">© 2026 Más Simple — Comida saludable congelada</p>
        <p className="text-primary-foreground/60 text-[11px] sm:text-xs">
          Design & Code by{' '}
          <a href="https://www.linkedin.com/in/juanvanni/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground font-extrabold no-underline hover:text-coral transition-colors">
            Juanjo Vanni
          </a>
        </p>
      </div>
      <a href="https://www.instagram.com/massimple.sf/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 text-sm no-underline font-bold hover:text-coral transition-colors">
        📸 @massimple.sf
      </a>
    </footer>
  );
}
