import { useState, useEffect } from 'react';
import { Product, ProductOption } from '@/types/product';

interface Props {
  product: Product | null;
  onSave: (product: any, fotoFile: File | null) => void;
  onClose: () => void;
}

export default function ProductModal({ product, onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [stock, setStock] = useState<'disponible' | 'agotado'>('disponible');
  const [flavors, setFlavors] = useState<string[]>([]);
  const [flavorInput, setFlavorInput] = useState('');
  const [options, setOptions] = useState<ProductOption[]>([{ label: '', price: 0 }]);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setEmoji(product.emoji || '');
      setStock(product.stock || 'disponible');
      setFlavors((product.flavors || []).map(f => typeof f === 'string' ? f : f.label));
      setOptions(product.options?.length ? [...product.options] : [{ label: '', price: 0 }]);
      setFotoPreview(product.foto_url || null);
      setDescripcion(product.descripcion || '');
    }
  }, [product]);

  const addFlavor = () => {
    const val = flavorInput.trim().slice(0, 60);
    if (val && !flavors.includes(val) && flavors.length < 20) {
      setFlavors([...flavors, val]);
      setFlavorInput('');
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) return;
    setFotoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setFotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const validOpts = options.filter(o => o.label?.trim() && Number(o.price) > 0);
    if (!validOpts.length) return;

    setSaving(true);
    await onSave({
      id: product?.id || Date.now().toString(),
      name: name.trim(),
      emoji: emoji.trim() || '🥗',
      stock,
      flavors,
      options: validOpts,
      foto_url: fotoPreview && !fotoFile ? product?.foto_url : null,
      descripcion: descripcion.trim() || null,
    }, fotoFile);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-green/65 backdrop-blur-sm flex items-center justify-center z-[2000] p-4" onClick={onClose}>
      <div className="bg-card rounded-lg p-8 w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-ms-lg animate-slide-up" onClick={e => e.stopPropagation()}>
        <h2 className="mb-5 text-green text-xl font-bold">{product ? 'Editar producto' : 'Nuevo producto'}</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">Nombre del producto</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Hamburguesa Completa" maxLength={100}
            className="w-full p-3.5 px-4 border-2 border-border rounded-[var(--radius-sm)] font-sans text-[15px] bg-card outline-none focus:border-coral transition-all" />
        </div>

        {/* Emoji + Stock */}
        <div className="grid grid-cols-[1fr_130px] gap-3.5 mb-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">Emoji (icono)</label>
            <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🍔" maxLength={4}
              className="w-full p-3.5 px-4 border-2 border-border rounded-[var(--radius-sm)] font-sans text-[15px] bg-card outline-none focus:border-coral transition-all" />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">Stock</label>
            <select value={stock} onChange={e => setStock(e.target.value as any)}
              className="w-full p-3.5 px-4 border-2 border-border rounded-[var(--radius-sm)] font-sans text-[15px] bg-card outline-none focus:border-coral transition-all">
              <option value="disponible">✅ Disponible</option>
              <option value="agotado">❌ Agotado</option>
            </select>
          </div>
        </div>

        {/* Photo */}
        <div className="mb-4">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
            Foto Real (Opcional)
            {fotoPreview && <button onClick={() => { setFotoFile(null); setFotoPreview(null); }} className="bg-transparent border-none text-coral text-xs font-bold cursor-pointer ml-2.5">[Quitar foto]</button>}
          </label>
          <label className="w-full h-[140px] bg-beige rounded-[var(--radius-sm)] border-2 border-dashed border-border flex items-center justify-center flex-col gap-2 cursor-pointer hover:border-coral transition-colors overflow-hidden relative">
            {fotoPreview ? (
              <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className="text-center pointer-events-none">
                <span className="text-[28px] block mb-1">📷</span>
                <p className="text-xs text-muted-foreground font-semibold">Toca para subir foto</p>
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFotoChange} className="hidden" />
          </label>
        </div>

        {/* Descripcion */}
        <div className="mb-4">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">Descripción / Ingredientes</label>
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Ej. Rellena de espinaca, ricota y nuez moscada..." maxLength={300} rows={3}
            className="w-full p-3.5 px-4 border-2 border-border rounded-[var(--radius-sm)] font-sans text-[15px] bg-card outline-none focus:border-coral transition-all resize-none" />
        </div>

        {/* Flavors */}
        <div className="mb-4 pt-5 border-t border-border">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">Sabores / Variedades</label>
          <div className="flex gap-2">
            <input type="text" value={flavorInput} onChange={e => setFlavorInput(e.target.value)}
              placeholder="Ej. Pollo, Carne..." maxLength={60}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFlavor(); } }}
              className="flex-1 p-2.5 px-3.5 border border-border rounded-[var(--radius-sm)] font-sans text-sm outline-none focus:border-coral transition-all" />
            <button onClick={addFlavor} className="bg-green text-primary-foreground border-none px-4 py-2 rounded-full font-bold text-xs cursor-pointer hover:bg-green-mid transition-all">Agregar</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {flavors.map((f, i) => (
              <div key={i} className="bg-green-light text-green px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1.5">
                {f}
                <button onClick={() => setFlavors(flavors.filter((_, j) => j !== i))} className="bg-transparent border-none text-coral font-extrabold cursor-pointer text-sm leading-none p-0">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="mb-4 pt-5 border-t border-border">
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Opciones y Precios</label>
            <button onClick={() => setOptions([...options, { label: '', price: 0 }])} className="bg-transparent border border-border text-muted-foreground px-3 py-1 rounded-full font-bold text-xs cursor-pointer hover:border-coral hover:text-coral transition-all font-sans">+ Opción</button>
          </div>
          {options.map((opt, i) => (
            <div key={i} className="grid grid-cols-[1fr_110px_34px] gap-2 mt-2.5 items-center">
              <input type="text" placeholder="Ej: x6 unidades" value={opt.label} maxLength={60}
                onChange={e => { const n = [...options]; n[i] = { ...n[i], label: e.target.value }; setOptions(n); }}
                className="p-2.5 px-3 border border-border rounded-[var(--radius-sm)] font-sans text-sm outline-none focus:border-coral transition-all w-full" />
              <input type="number" placeholder="$ Precio" value={opt.price || ''} min={0}
                onChange={e => { const n = [...options]; n[i] = { ...n[i], price: Math.max(0, Number(e.target.value)) }; setOptions(n); }}
                className="p-2.5 px-3 border border-border rounded-[var(--radius-sm)] font-sans text-sm outline-none focus:border-coral transition-all w-full" />
              <button onClick={() => setOptions(options.filter((_, j) => j !== i))} className="w-[34px] h-[34px] rounded-full bg-coral text-primary-foreground border-none cursor-pointer text-sm flex items-center justify-center flex-shrink-0">✕</button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 mt-6">
          <button onClick={onClose} className="bg-transparent border border-border text-muted-foreground px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:border-coral hover:text-coral transition-all font-sans">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="bg-green text-primary-foreground border-none px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-green-mid transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      </div>
    </div>
  );
}