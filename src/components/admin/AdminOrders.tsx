import { useState } from 'react';
import { Order } from '@/types/product';

interface Props {
  orders: Order[];
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

function san(str: string) {
  return String(str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim().slice(0, 500);
}

export default function AdminOrders({ orders, onUpdateStatus, onDelete }: Props) {
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  let filtered = orders;
  if (filter !== 'todos') filtered = filtered.filter(o => o.status === filter);
  if (search) filtered = filtered.filter(o => o.name?.toLowerCase().includes(search.toLowerCase()) || o.items?.toLowerCase().includes(search.toLowerCase()));

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-card rounded-[var(--radius-sm)] shadow-ms-sm overflow-hidden">
      <div className="p-4 px-4 sm:px-5 border-b border-border flex gap-2.5 flex-wrap items-center">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por cliente o producto..."
          className="w-full sm:flex-1 sm:min-w-[200px] px-4 py-2.5 border border-border rounded-full font-sans text-sm bg-beige-light outline-none focus:border-coral transition-colors"
        />
        <div className="flex gap-1.5 flex-wrap">
          {['todos', 'pendiente', 'confirmado', 'cancelado'].map(f => {
            const activeClass = filter === f
              ? f === 'confirmado' ? 'bg-green text-primary-foreground border-green'
              : f === 'cancelado' ? 'bg-coral text-primary-foreground border-coral'
              : f === 'pendiente' ? 'bg-[#E9A945] text-primary-foreground border-[#E9A945]'
              : 'bg-green text-primary-foreground border-green'
              : 'bg-card text-muted-foreground border-border hover:border-coral hover:text-coral';
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-bold cursor-pointer transition-all font-sans ${activeClass}`}>
                {{ todos: 'Todos', pendiente: 'Pendientes', confirmado: 'Confirmados', cancelado: 'Cancelados' }[f]}
              </button>
            );
          })}
        </div>
        <span className="sm:ml-auto text-[13px] text-muted-foreground font-semibold">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {!filtered.length ? (
        <div className="text-center py-10 text-muted-foreground"><div className="text-4xl mb-3">🔍</div><p className="font-semibold text-sm">No se encontraron pedidos</p></div>
      ) : (
        filtered.map(o => {
          const cls = o.status === 'confirmado' ? 'bg-[#E2F5E8] text-[#1A6B35]' : o.status === 'cancelado' ? 'bg-[#FDEAEA] text-[#C0392B]' : 'bg-[#FEF6E4] text-[#A07000]';
          const isExpanded = expandedItems.has(o.id);

          return (
            <div key={o.id} className="p-4 px-4 sm:px-5 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-[15px] font-extrabold text-green mb-1">
                  👤 {san(o.name)}{' '}
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${cls}`}>{o.status}</span>
                  {o.vendedora && <span className="text-[11px] font-semibold text-muted-foreground ml-2">📲 vía {san(o.vendedora)}</span>}
                </h4>
                <p className="text-sm">💰 <strong>${Number(o.total || 0).toLocaleString('es-AR')}</strong> · 📅 {san(o.date)}</p>
                <p className="text-[13px] text-muted-foreground truncate mt-1">📋 {san(o.items)}</p>

                {Array.isArray(o.items_json) && o.items_json.length > 0 && (
                  <>
                    <button onClick={() => toggleExpand(o.id)} className="bg-transparent border-none text-coral text-xs font-bold cursor-pointer p-0 mt-1 underline underline-offset-2 font-sans">
                      {isExpanded ? 'Ocultar detalle ▴' : 'Ver detalle ▾'}
                    </button>
                    {isExpanded && (
                      <div className="mt-2 bg-beige-light rounded-[var(--radius-sm)] p-2.5 px-3.5 text-[13px] leading-relaxed">
                        {o.items_json.map((item, i) => (
                          <div key={i} className="flex justify-between items-center gap-2 py-0.5 border-b border-border last:border-0">
                            <span className="text-muted-foreground font-semibold">
                              {item.qty}× {item.name}{item.flavor ? ` (${item.flavor})` : ''}{item.label ? ` — ${item.label}` : ''}
                            </span>
                            <span className="font-extrabold text-green flex-shrink-0">${Number((item.price || 0) * (item.qty || 1)).toLocaleString('es-AR')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
                <select
                  value={o.status}
                  onChange={e => onUpdateStatus(o.id, e.target.value)}
                  className="px-3 py-2 border border-border rounded-full font-sans text-[13px] font-bold bg-beige-light cursor-pointer outline-none w-full md:w-auto"
                >
                  <option value="pendiente">⏳ Pendiente</option>
                  <option value="confirmado">✅ Confirmado</option>
                  <option value="cancelado">❌ Cancelado</option>
                </select>
                <button onClick={() => onDelete(o.id)} className="bg-coral text-primary-foreground border-none px-3 py-2 rounded-full font-bold text-xs cursor-pointer hover:bg-coral-dark transition-all shrink-0">🗑️</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
