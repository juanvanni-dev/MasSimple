import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Order } from '@/types/product';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import ProductModal from '@/components/admin/ProductModal';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) loadData();
    });
  }, []);

  const loadData = async () => {
    const [pr, pe] = await Promise.all([
      supabase.from('productos').select('*').order('created_at', { ascending: true }),
      supabase.from('pedidos').select('*').order('timestamp', { ascending: false }),
    ]);
    if (!pr.error) setProducts(pr.data || []);
    if (!pe.error) setOrders(pe.data || []);

    // Realtime
    const ch = supabase.channel('admin-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, async () => {
        const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: true });
        if (data) setProducts(data);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, async () => {
        const { data } = await supabase.from('pedidos').select('*').order('timestamp', { ascending: false });
        if (data) setOrders(data);
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  };

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    loadData();
    showToast('¡Bienvenido al panel!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProducts([]);
    setOrders([]);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (error) showToast('Error al eliminar', 'error');
    else showToast('Producto eliminado');
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('pedidos').update({ status }).eq('id', id);
    if (error) showToast('Error al actualizar', 'error');
    else {
      const msgs: Record<string, string> = { confirmado: '✅ Pedido confirmado', cancelado: '❌ Pedido cancelado', pendiente: '🔄 Marcado como pendiente' };
      showToast(msgs[status] || 'Actualizado');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    const { error } = await supabase.from('pedidos').delete().eq('id', id);
    if (error) showToast('Error al eliminar', 'error');
    else showToast('Pedido eliminado');
  };

  const handleSaveProduct = async (product: any, fotoFile: File | null) => {
    try {
      let foto_url = product.foto_url || null;
      if (fotoFile) {
        const ext = fotoFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z]/g, '') || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from('fotos-productos').upload(fileName, fotoFile, { upsert: true });
        if (!upErr) {
          const { data: ud } = supabase.storage.from('fotos-productos').getPublicUrl(fileName);
          foto_url = ud.publicUrl;
        } else {
          console.error('Upload error:', upErr);
          showToast('⚠️ Error al subir la foto', 'warning');
        }
      }

      const payload = { ...product, foto_url };
      const { error } = await supabase.from('productos').upsert(payload);
      if (error) throw error;
      setModalOpen(false);
      setEditingProduct(null);
      showToast(product.id ? 'Producto actualizado' : 'Producto agregado');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Error al guardar', 'error');
    }
  };

  if (loading) return <div className="min-h-screen bg-beige flex items-center justify-center text-muted-foreground">Cargando...</div>;

  if (!session) return <AdminLogin onLogin={handleLogin} />;

  const pendingCount = orders.filter(o => o.status === 'pendiente').length;

  return (
    <div className="min-h-screen" style={{ background: '#EDE3D6' }}>
      {/* Sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/50 z-[99] md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex min-h-screen">
        <AdminSidebar
          active={section}
          onNavigate={(s) => { setSection(s); setSidebarOpen(false); }}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          pendingCount={pendingCount}
        />

        <main className="md:ml-[230px] flex-1 flex flex-col min-h-screen">
          <div className="bg-card px-4 md:px-8 h-16 flex items-center justify-between border-b border-border sticky top-0 z-50 shadow-ms-sm">
            <div className="flex items-center gap-3.5">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden bg-transparent border-none cursor-pointer p-1.5 rounded-lg text-green text-[22px]">☰</button>
              <h1 className="font-display text-[22px] italic text-green font-bold">
                {{ dashboard: 'Dashboard', productos: 'Productos', pedidos: 'Pedidos' }[section]}
              </h1>
            </div>
            <span className="text-[13px] text-muted-foreground font-semibold">Más Simple ✦</span>
          </div>

          <div className="p-4 md:p-7 flex-1">
            {section === 'dashboard' && <AdminDashboard products={products} orders={orders} />}
            {section === 'productos' && (
              <AdminProducts
                products={products}
                onNew={() => { setEditingProduct(null); setModalOpen(true); }}
                onEdit={(p) => { setEditingProduct(p); setModalOpen(true); }}
                onDelete={handleDeleteProduct}
              />
            )}
            {section === 'pedidos' && (
              <AdminOrders
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
                onDelete={handleDeleteOrder}
              />
            )}
          </div>
        </main>
      </div>

      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => { setModalOpen(false); setEditingProduct(null); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-7 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-bold text-primary-foreground shadow-ms z-[9999] whitespace-nowrap transition-all ${toast.type === 'error' ? 'bg-coral' : toast.type === 'warning' ? 'bg-[#E9A945]' : 'bg-green'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
