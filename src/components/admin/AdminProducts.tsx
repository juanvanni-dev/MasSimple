import { Product } from '@/types/product';

interface Props {
  products: Product[];
  onNew: () => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

function san(str: string) {
  return String(str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim().slice(0, 500);
}

export default function AdminProducts({ products, onNew, onEdit, onDelete }: Props) {
  return (
    <div className="bg-card rounded-[var(--radius-sm)] shadow-ms-sm overflow-hidden">
      <div className="p-4 px-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-base font-extrabold text-green">🥦 Catálogo de Productos</h3>
        <button onClick={onNew} className="bg-green text-primary-foreground border-none px-4 py-2 rounded-full font-bold text-xs cursor-pointer hover:bg-green-mid transition-all">+ Nuevo Producto</button>
      </div>

      {!products.length ? (
        <div className="text-center py-10 text-muted-foreground">
          <div className="text-4xl mb-3">🥦</div>
          <p className="font-semibold text-sm">No hay productos cargados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[560px]">
            <thead>
              <tr>
                <th className="text-[11px] uppercase text-muted-foreground font-extrabold bg-beige-light p-3 px-4 text-left"></th>
                <th className="text-[11px] uppercase text-muted-foreground font-extrabold bg-beige-light p-3 px-4 text-left">Nombre</th>
                <th className="text-[11px] uppercase text-muted-foreground font-extrabold bg-beige-light p-3 px-4 text-left">Sabores</th>
                <th className="text-[11px] uppercase text-muted-foreground font-extrabold bg-beige-light p-3 px-4 text-left">Precios</th>
                <th className="text-[11px] uppercase text-muted-foreground font-extrabold bg-beige-light p-3 px-4 text-left">Stock</th>
                <th className="text-[11px] uppercase text-muted-foreground font-extrabold bg-beige-light p-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const sabores = p.flavors?.length ? p.flavors.map(f => typeof f === 'string' ? f : f.label).join(', ') : 'Sin sabores';
                return (
                  <tr key={p.id}>
                    <td className="p-3.5 px-4 border-b border-border">
                      {p.foto_url ? (
                        <img src={p.foto_url} alt={p.name} className="w-11 h-11 rounded-lg object-cover" />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-beige flex items-center justify-center text-[22px]">{p.emoji || '🥗'}</div>
                      )}
                    </td>
                    <td className="p-3.5 px-4 border-b border-border font-bold">{san(p.name)}</td>
                    <td className="p-3.5 px-4 border-b border-border text-[13px] text-muted-foreground">{san(sabores)}</td>
                    <td className="p-3.5 px-4 border-b border-border text-[13px]">
                      {(p.options || []).map((o, i) => (
                        <div key={i}>{san(o.label)}: <strong>${Number(o.price).toLocaleString('es-AR')}</strong></div>
                      ))}
                    </td>
                    <td className="p-3.5 px-4 border-b border-border">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase ${p.stock === 'disponible' ? 'bg-[#E2F5E8] text-[#1A6B35]' : 'bg-[#FDEAEA] text-[#C0392B]'}`}>
                        {p.stock === 'disponible' ? '✅ Disponible' : '❌ Agotado'}
                      </span>
                    </td>
                    <td className="p-3.5 px-4 border-b border-border">
                      <button onClick={() => onEdit(p)} className="bg-transparent border border-border text-muted-foreground px-3 py-1.5 rounded-full font-bold text-xs cursor-pointer mr-1 mb-1 hover:border-coral hover:text-coral transition-all">✏️ Editar</button>
                      <button onClick={() => onDelete(p.id)} className="bg-coral text-primary-foreground border-none px-3 py-1.5 rounded-full font-bold text-xs cursor-pointer hover:bg-coral-dark transition-all">🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
