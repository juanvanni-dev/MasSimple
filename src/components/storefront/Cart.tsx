import { useState } from 'react';
import { CartItem } from '@/types/product';
import { supabase } from '@/lib/supabase';

interface CartProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (key: string) => void;
  onClear: () => void;
  totalItems: number;
  totalPrice: number;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function Cart({ cart, isOpen, onClose, onRemove, onClear, totalItems, totalPrice }: CartProps) {
  const [clientName, setClientName] = useState('');
  const [busy, setBusy] = useState(false);

  const canCheckout = clientName.trim().length >= 3 && cart.length > 0 && !busy;

  const handleCheckout = async (vendedora: 'Camila' | 'Mayra') => {
    if (!canCheckout) return;
    setBusy(true);

    try {
      await supabase.from('pedidos').insert({
        id: uid(),
        name: clientName.trim(),
        items: cart.map(i => `${i.qty}x ${i.name}${i.flavor ? ` (${i.flavor})` : ''}`).join(', '),
        items_json: cart.map(i => ({ name: i.name, flavor: i.flavor, label: i.label, qty: i.qty, price: i.price })),
        total: totalPrice,
        status: 'pendiente',
        date: new Date().toLocaleString('es-AR'),
        timestamp: Date.now(),
        vendedora,
      });

      let msg = `¡Hola Más Simple! 👋 Soy *${clientName.trim()}*. Quiero hacer este pedido:%0A%0A`;
      cart.forEach(item => {
        msg += `• ${item.name}${item.flavor ? ` (${item.flavor})` : ''} — ${item.label} x${item.qty} = $${(item.price * item.qty).toLocaleString('es-AR')}%0A`;
      });
      msg += `%0A*TOTAL: $${totalPrice.toLocaleString('es-AR')}*%0AGracias! 🥦`;
      const num = vendedora === 'Camila' ? '5493425425527' : '5493425410363';
      window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-green/50 backdrop-blur-sm z-[400] flex items-start justify-end" onClick={onClose}>
      <div className="w-full max-w-[440px] h-[100dvh] bg-card flex flex-col animate-slide-in" onClick={e => e.stopPropagation()}>
        <div className="px-4 sm:px-7 py-4 sm:py-6 border-b border-border flex items-center justify-between bg-beige-light flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-green">🛒 Mi pedido</h2>
          <button onClick={onClose} className="bg-transparent border-none text-[22px] cursor-pointer text-muted-foreground w-9 h-9 flex items-center justify-center rounded-full hover:bg-beige">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-4 sm:py-5 min-h-0">
          {!cart.length ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-[48px] sm:text-[56px] mb-3">🛒</div>
              <p className="text-muted-foreground text-[14px] sm:text-[15px]">Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.key} className="flex items-center gap-3 py-3 border-b border-foreground/[0.06]">
                <div className="text-[26px] sm:text-[30px] flex-shrink-0">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] sm:text-sm font-bold text-green truncate">{item.name}{item.flavor ? ` — ${item.flavor}` : ''}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.label} × {item.qty}</div>
                </div>
                <div className="text-[14px] sm:text-[15px] font-extrabold text-coral flex-shrink-0">${(item.price * item.qty).toLocaleString('es-AR')}</div>
                <button onClick={() => onRemove(item.key)} className="bg-transparent border-none text-muted-foreground text-lg cursor-pointer p-1 rounded hover:text-coral flex-shrink-0">✕</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-4 sm:px-7 py-4 sm:py-5 pb-6 sm:pb-7 border-t border-border bg-beige-light flex-shrink-0">
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs font-extrabold text-green mb-1.5 uppercase tracking-wider">¿Quién hace el pedido?</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full p-2.5 sm:p-3 border-2 border-border rounded-[12px] outline-none focus:border-green transition-colors text-sm font-sans"
              />
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] sm:text-[15px] text-muted-foreground font-semibold">Total</span>
              <strong className="text-[22px] sm:text-[26px] font-extrabold text-green">${totalPrice.toLocaleString('es-AR')}</strong>
            </div>
            <p className="text-xs text-muted-foreground mb-3 sm:mb-4 leading-relaxed">Te vamos a redirigir a WhatsApp con el detalle completo del pedido 🚀</p>

            <button
              onClick={() => handleCheckout('Camila')}
              disabled={!canCheckout}
              className={`w-full flex items-center justify-center gap-2 text-primary-foreground border-none p-3.5 sm:p-4 rounded-full font-bold text-[14px] sm:text-base cursor-pointer transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)] no-underline mb-2 ${canCheckout ? 'bg-[#25D366] hover:bg-[#1eb85a] hover:-translate-y-px' : 'bg-muted cursor-not-allowed opacity-60 shadow-none'}`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir a Camila
            </button>
            <button
              onClick={() => handleCheckout('Mayra')}
              disabled={!canCheckout}
              className={`w-full flex items-center justify-center gap-2 text-primary-foreground border-none p-3.5 sm:p-4 rounded-full font-bold text-[14px] sm:text-base cursor-pointer transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)] no-underline mb-2 ${canCheckout ? 'bg-[#128C7E] hover:bg-[#0e6e63] hover:-translate-y-px' : 'bg-muted cursor-not-allowed opacity-60 shadow-none'}`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir a Mayra
            </button>
            <button onClick={onClear} className="w-full mt-2 bg-transparent border-none text-muted-foreground text-[13px] cursor-pointer p-2 hover:text-coral transition-colors font-sans">
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
