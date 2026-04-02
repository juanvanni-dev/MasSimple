import { useState } from 'react';
import { Product } from '@/types/product';

interface Props {
  products: Product[];
  loading: boolean;
  error: string | null;
  onAddToCart: (item: { pid: string; oi: number; name: string; emoji: string; label: string; flavor: string; price: number }) => void;
}

const SECTIONS = [
  { title: 'Tartitas', emoji: '🥧', keywords: ['tartita', 'tarta'] },
  { title: 'Hamburguesas', emoji: '🍔', keywords: ['hamburguesa', 'medallon', 'medallón'] },
  { title: 'Clásicos', emoji: '⭐', keywords: ['albóndiga', 'albondiga', 'carita'] },
  { title: 'Prepizzas', emoji: '🍕', keywords: ['prepizza', 'pizza'] },
];

export default function ProductsSection({ products, loading, error, onAddToCart }: Props) {
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  if (loading) return <div className="py-20 text-center text-2xl font-display text-green italic">⏳ Cargando menú...</div>;

  const groupedProducts = SECTIONS.map(section => {
    const items = products.filter(p => section.keywords.some(k => p.name.toLowerCase().includes(k)));
    return { ...section, items };
  }).filter(section => section.items.length > 0);

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-12" id="productos">
      <div className="max-w-[1100px] mx-auto space-y-12">
        {groupedProducts.map((section) => (
          <div key={section.title} className="space-y-6">
            <div className="border-b-2 border-border pb-3 flex items-center gap-3">
              <span className="text-2xl">{section.emoji}</span>
              <h2 className="font-display text-2xl italic text-green font-normal">{section.title}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {section.items.map((p) => (
                <div key={p.id} className="contents">
                  <ProductCard
                    product={p}
                    isOpen={openProductId === p.id}
                    onClick={() => setOpenProductId(openProductId === p.id ? null : p.id)}
                  />
                  {openProductId === p.id && (
                    /* ACÁ ESTÁ EL CAMBIO: w-full y flex justify-center */
                    <div className="col-span-full w-full flex justify-center animate-in fade-in slide-in-from-top-1 duration-200">
                      <OptionsPanel
                        product={p}
                        onAdd={(oi) => {
                          const opt = p.options[oi];
                          onAddToCart({
                            pid: p.id, oi, name: p.name, emoji: p.emoji || '🥗',
                            label: opt.label, flavor: '', price: opt.price
                          });
                          setOpenProductId(null);
                        }}
                        onClose={() => setOpenProductId(null)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TARJETA DE PRODUCTO ───
function ProductCard({ product, onClick, isOpen }: { product: Product, onClick: () => void, isOpen: boolean }) {
  const minPrice = Math.min(...(product.options?.map(o => o.price) || [0]));
  const hasIntegral = product.options?.some(o => o.label.toLowerCase().includes('integral'));

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer border-2 relative group
        ${isOpen ? 'border-coral shadow-ms scale-[1.01]' : 'border-transparent hover:border-coral/20 hover:-translate-y-1'}`}
    >
      <div className="aspect-square bg-beige flex items-center justify-center relative overflow-hidden">
        {product.foto_url ? (
          <img src={product.foto_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-4xl">{product.emoji || '🥗'}</span>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          <span className="flex items-center gap-1 bg-[#2D5A27] text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-tighter">
            🌿 Vegetariano
          </span>
          {hasIntegral && (
            <span className="flex items-center gap-1 bg-[#D97706] text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-tighter">
              🌾 Integral
            </span>
          )}
        </div>
      </div>

      <div className="p-2.5 text-center">
        <h3 className="text-[12px] font-bold text-green mb-0.5 leading-tight">{product.name}</h3>
        <p className="text-coral font-extrabold text-[13px]">desde ${minPrice.toLocaleString('es-AR')}</p>
      </div>
    </div>
  );
}

// ─── PANEL DE OPCIONES COMPACTO Y CENTRADO ───
function OptionsPanel({ product, onAdd, onClose }: { product: Product, onAdd: (oi: number) => void, onClose: () => void }) {
  return (
    <div className="bg-stone-50 rounded-xl border border-coral/30 p-4 my-2 shadow-md relative w-full max-w-[450px]">
      <button onClick={onClose} className="absolute top-1.5 right-2 text-muted-foreground hover:text-coral text-sm">✕</button>
      <p className="text-[10px] font-bold text-green/60 uppercase tracking-widest mb-3 px-1 text-center italic font-display">Elegí una opción:</p>

      <div className="grid gap-2">
        {product.options?.map((opt, i) => {
          const isOptIntegral = opt.label.toLowerCase().includes('integral');

          return (
            <div
              key={i}
              onClick={() => onAdd(i)}
              className="flex justify-between items-center bg-white p-3 rounded-lg border border-border/50 hover:border-coral hover:bg-coral/[0.03] transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex flex-col text-left">
                <span className="text-[13px] font-bold text-muted-foreground group-hover:text-green">
                  {opt.label}
                </span>

                <div className="flex gap-2 mt-0.5">
                  <span className="text-[8px] font-bold text-green/70 uppercase tracking-tighter">🌿 Vegetariano</span>
                  {isOptIntegral && <span className="text-[8px] font-bold text-amber-700/70 uppercase tracking-tighter">🌾 Integral</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <span className="font-black text-coral text-[15px] whitespace-nowrap">${Number(opt.price).toLocaleString('es-AR')}</span>
                <div className="bg-coral text-white w-7 h-7 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">+</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}