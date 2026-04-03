import { useState } from 'react';
import { Product, Order } from '@/types/product';

interface Props {
  products: Product[];
  orders: Order[];
}

function san(str: string) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim().slice(0, 500);
}

export default function AdminDashboard({ products, orders }: Props) {
  const [period, setPeriod] = useState('todo');

  const filterByPeriod = (peds: Order[]) => {
    if (period === 'todo') return peds;
    const now = Date.now();
    const limits: Record<string, number> = { hoy: 86400000, semana: 604800000, mes: 2592000000 };
    return peds.filter(o => (now - Number(o.timestamp || 0)) <= (limits[period] || Infinity));
  };

  const filtered = filterByPeriod(orders);
  const confirmed = filtered.filter(o => o.status === 'confirmado');
  const totalSales = confirmed.reduce((s, o) => s + Number(o.total || 0), 0);
  const periodLabel: Record<string, string> = { hoy: 'hoy', semana: 'esta semana', mes: 'este mes', todo: 'en total' };

  // Ranking
  const counts: Record<string, number> = {};
  filtered.forEach(o => {
    if (Array.isArray(o.items_json)) {
      o.items_json.forEach(i => { counts[i.name] = (counts[i.name] || 0) + (i.qty || 1); });
    }
  });
  const ranking = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = ranking[0]?.[1] || 1;

  // Vendedoras
  const vendedoras: Record<string, { total: number; pedidos: number }> = { Camila: { total: 0, pedidos: 0 }, Mayra: { total: 0, pedidos: 0 } };
  filtered.forEach(o => {
    const v = o.vendedora || 'Camila';
    if (vendedoras[v]) { vendedoras[v].total += Number(o.total || 0); vendedoras[v].pedidos++; }
  });
  const vTotal = vendedoras.Camila.total + vendedoras.Mayra.total;

  return (
    <div>
      {/* Period selector */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">Período:</span>
        {['hoy', 'semana', 'mes', 'todo'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full border font-bold text-[13px] cursor-pointer transition-all font-sans
              ${period === p ? 'bg-green text-primary-foreground border-green' : 'bg-card text-muted-foreground border-border hover:border-green hover:text-green'}`}>
            {{ hoy: 'Hoy', semana: 'Esta semana', mes: 'Este mes', todo: 'Todo' }[p]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard color="green" label="Productos" value={products.length} sub="en el menú" />
        <StatCard color="blue" label="Con Stock" value={products.filter(p => p.stock === 'disponible').length} sub="disponibles" />
        <StatCard color="coral" label="Sin Stock" value={products.filter(p => p.stock === 'agotado').length} sub="a reponer" />
        <StatCard color="gold" label="Ventas" value={`$${totalSales.toLocaleString('es-AR')}`} sub={`${confirmed.length} pedido${confirmed.length !== 1 ? 's' : ''} ${periodLabel[period]}`} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Ranking */}
        <div className="bg-card rounded-[var(--radius-sm)] shadow-ms-sm overflow-hidden">
          <div className="p-4 px-5 border-b border-border"><h3 className="text-base font-extrabold text-green">🏆 Más vendidos</h3></div>
          <div className="p-4 px-5">
            {!ranking.length ? (
              <div className="text-center py-8 text-muted-foreground"><div className="text-4xl mb-3">📊</div><p className="font-semibold text-sm">Sin datos todavía</p></div>
            ) : ranking.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3 py-2.5 border-b border-foreground/5 last:border-0">
                <div className={`w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-[#FFF3CD] text-[#856404]' : 'bg-green-light text-green'}`}>{i + 1}</div>
                <div className="flex-1 text-sm font-bold">{san(name)}</div>
                <div className="flex-[2] bg-beige rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-coral rounded-full transition-all" style={{ width: `${Math.round(count / maxCount * 100)}%` }} />
                </div>
                <div className="text-[13px] font-extrabold text-green flex-shrink-0">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendedoras */}
        <div className="bg-card rounded-[var(--radius-sm)] shadow-ms-sm overflow-hidden">
          <div className="p-4 px-5 border-b border-border"><h3 className="text-base font-extrabold text-green">💰 Ventas por vendedora</h3></div>
          <div className="p-4 px-5">
            {['Camila', 'Mayra'].map(name => {
              const pct = vTotal > 0 ? Math.round(vendedoras[name].total / vTotal * 100) : 0;
              return (
                <div key={name} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1.5">
                    <span className="font-bold text-sm text-green">{name === 'Camila' ? '👩‍⚕️' : '👩‍🍳'} {name}</span>
                    <span className="font-extrabold text-coral">${vendedoras[name].total.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="bg-beige rounded-full h-2.5 overflow-hidden mb-1">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: name === 'Camila' ? 'hsl(var(--green))' : 'hsl(var(--coral))' }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{vendedoras[name].pedidos} pedidos · {pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-card rounded-[var(--radius-sm)] shadow-ms-sm overflow-hidden">
        <div className="p-4 px-5 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-extrabold text-green">🛎️ Últimos pedidos</h3>
        </div>
        <div>
          {!filtered.length ? (
            <div className="text-center py-10 text-muted-foreground"><div className="text-4xl mb-3">📭</div><p className="font-semibold text-sm">Sin pedidos todavía</p></div>
          ) : filtered.slice(0, 5).map(o => {
            const cls = o.status === 'confirmado' ? 'bg-[#E2F5E8] text-[#1A6B35]' : o.status === 'cancelado' ? 'bg-[#FDEAEA] text-[#C0392B]' : 'bg-[#FEF6E4] text-[#A07000]';
            return (
              <div key={o.id} className="p-4 px-5 border-b border-border">
                <h4 className="text-[15px] font-extrabold text-green mb-1">
                  👤 {san(o.name)} <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${cls}`}>{o.status}</span>
                  {o.vendedora && <span className="text-[11px] font-semibold text-muted-foreground ml-2">📲 vía {san(o.vendedora)}</span>}
                </h4>
                <p className="text-[13px] text-muted-foreground truncate">📋 {san(o.items)} · 💰 <strong>${Number(o.total || 0).toLocaleString('es-AR')}</strong> · {san(o.date)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ color, label, value, sub }: { color: string; label: string; value: string | number; sub: string }) {
  const borderColors: Record<string, string> = { green: 'border-l-green', coral: 'border-l-coral', blue: 'border-l-[#4A90D9]', gold: 'border-l-[#E9A945]' };
  return (
    <div className={`bg-card rounded-[var(--radius-sm)] p-4 sm:p-5 shadow-ms-sm border-l-4 ${borderColors[color] || ''}`}>
      <div className="text-[11px] font-extrabold uppercase text-muted-foreground mb-1.5">{label}</div>
      <div className="text-[24px] sm:text-[30px] font-extrabold text-green leading-none break-words">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
