const tips = [
  { icon: '❄️', text: 'Conservá los productos en freezer a -18°C' },
  { icon: '🚫', text: 'No volver a congelar un producto descongelado' },
  { icon: '📅', text: 'Consumir antes de la fecha indicada' },
  { icon: '🌡️', text: 'Evitá descongelar a temperatura ambiente, mejor hacelo en heladera' },
  { icon: '🍳', text: 'Podés cocinar sin descongelar' },
];

export default function ConservacionSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-12 bg-card">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-8">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-coral mb-2">Cuidado del producto</div>
          <h2 className="font-display text-[clamp(22px,3.5vw,36px)] italic text-green font-normal">
            ¿Cómo conservar nuestros productos?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-background border border-border rounded-xl p-4">
              <span className="text-[22px] flex-shrink-0">{tip.icon}</span>
              <p className="text-[13px] sm:text-[14px] text-muted-foreground leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-green/[0.07] border border-green/20 rounded-xl px-5 py-4 text-center">
          <p className="text-[13px] sm:text-[14px] text-green font-semibold italic">
            ✨ Para mejores resultados, recomendamos cocinar hasta lograr una textura dorada por fuera y caliente en su interior.
          </p>
        </div>
      </div>
    </section>
  );
}