export default function Hero() {
  return (
    <section className="min-h-[85vh] sm:min-h-screen flex items-center px-4 sm:px-5 md:px-12 pt-[80px] sm:pt-[100px] pb-10 sm:pb-[60px] relative overflow-hidden">

      {/* Verduras flotantes decorativas */}
 <div className="absolute right-[5%] top-[15%] text-[80px] sm:text-[120px] opacity-50 select-none pointer-events-none" style={{ animation: 'float 6s ease-in-out infinite' }}>🥦</div>
<div className="absolute right-[20%] top-[55%] text-[50px] sm:text-[70px] opacity-45 select-none pointer-events-none" style={{ animation: 'float 8s ease-in-out infinite 1s' }}>🫑</div>
<div className="absolute right-[8%] bottom-[15%] text-[60px] sm:text-[90px] opacity-45 select-none pointer-events-none" style={{ animation: 'float 7s ease-in-out infinite 2s' }}>🥕</div>
<div className="absolute right-[35%] top-[20%] text-[40px] sm:text-[55px] opacity-30 select-none pointer-events-none" style={{ animation: 'float 9s ease-in-out infinite 0.5s' }}>🌿</div>

    
      <div className="relative z-10 max-w-[620px]">
        <div className="inline-flex items-center gap-2 bg-green-light text-green text-[12px] sm:text-[13px] font-bold tracking-wider px-3.5 sm:px-[18px] py-1.5 sm:py-2 rounded-full mb-5 sm:mb-7 animate-fade-up">
          🌿 Comida congelada saludable
        </div>
        <h1 className="font-display text-[clamp(36px,8vw,80px)] font-normal italic leading-[1.1] text-green mb-4 sm:mb-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Comer rico<br /><strong className="not-italic text-coral font-extrabold">sin complicarte</strong><br />la vida
        </h1>
        <p className="text-[15px] sm:text-[17px] leading-relaxed text-muted-foreground max-w-[480px] mb-7 sm:mb-9 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Preparados con amor por Camila y Mayra. Todo apto vegetariano, con el respaldo de la nutrición profesional.
        </p>
        <div className="flex gap-3 sm:gap-3.5 flex-wrap animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <a href="#productos" className="bg-coral text-primary-foreground border-none px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-[14px] sm:text-[15px] cursor-pointer no-underline inline-block hover:bg-coral-dark hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(241,91,91,0.35)]">
            Ver productos 🍽️
          </a>
          <a href="https://wa.me/5493425425527" target="_blank" rel="noopener noreferrer" className="bg-card text-green border-2 border-green px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-[14px] sm:text-[15px] no-underline inline-block hover:bg-green hover:text-primary-foreground transition-all">
            Consultanos
          </a>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap mt-6 sm:mt-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {['🥦 Apto vegetariano', '❄️ Congelado fresco', '👩‍⚕️ Respaldo nutricional', '🏠 Hecho en casa'].map(badge => (
            <span key={badge} className="bg-card border border-border px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-[13px] font-semibold text-muted-foreground flex items-center gap-1">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Keyframes para la animación float */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

    </section>
  );
}