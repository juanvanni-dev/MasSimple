export default function AboutSection() {
  return (
    <section className="bg-green py-14 sm:py-20 px-4 sm:px-5 md:px-12 relative overflow-hidden" id="nosotras">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(241,91,91,0.12)_0%,transparent_60%)]" />
      <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center relative z-10">
        <div>
          <div className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-coral mb-3">Quiénes somos</div>
          <h2 className="font-display text-[clamp(26px,4vw,44px)] font-normal italic text-primary-foreground leading-[1.2] mb-4 sm:mb-5">
            Camila <strong className="not-italic text-coral">&</strong> Mayra
          </h2>
          <p className="text-[14px] sm:text-base leading-relaxed text-primary-foreground/75 font-light mb-5 sm:mb-7">
            Somos dos amigas apasionadas por la comida real y el bienestar. Camila, nutricionista, y Mayra, cocinera de corazón, creamos juntas una línea de comidas congeladas pensadas para que comer sano sea fácil, rico y accesible.
          </p>
          <p className="text-[14px] sm:text-base leading-relaxed text-primary-foreground/75 font-light">
            Cada producto está elaborado con ingredientes frescos, sin conservantes, y con toda la ciencia nutricional detrás para que tu cuerpo se sienta bien.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          {[
            { icon: '👩‍⚕️', title: 'Camila — Nutricionista', desc: 'Diseña cada receta pensando en el balance nutricional y el bienestar integral.' },
            { icon: '👩‍🍳', title: 'Mayra — Corazón de la cocina', desc: 'Convierte cada receta en algo delicioso, casero y lleno de amor.' },
            { icon: '🌿', title: '100% vegetariano', desc: 'Todos nuestros productos son aptos vegetarianos y libres de conservantes.' },
          ].map(card => (
            <div key={card.title} className="bg-primary-foreground/[0.08] border border-primary-foreground/[0.12] rounded-[var(--radius-sm)] p-4 sm:p-5 px-4 sm:px-6 flex items-start gap-3">
              <div className="text-[24px] sm:text-[28px] flex-shrink-0">{card.icon}</div>
              <div>
                <h4 className="text-[13px] sm:text-[15px] font-bold text-primary-foreground mb-1">{card.title}</h4>
                <p className="text-[12px] sm:text-[13px] text-primary-foreground/60 font-light leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
