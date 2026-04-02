import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Tus datos de conexión (No los toqué)
const supabaseUrl = 'https://zahlthwktowwbozbhvxd.supabase.co';
const supabaseKey = 'sb_publishable_b5bqQfQaZ7I8ecfe7-c2UA_X0Wja5eU';
const supabase = createClient(supabaseUrl, supabaseKey);

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('productos') // 1. Cambiado a 'productos' (español)
        .select('*');
        // Saqué el .eq('activo') porque en tu foto no se veía esa columna
        
      if (error) throw error;

      // 2. Traductor: Convertimos tus datos de Supabase al formato que espera la web
      const mappedData = (data || []).map(item => ({
        ...item,
        // Sacamos el precio de adentro de 'options' (que es 4000 o 3000 según tu foto)
        price: item.options?.[0]?.price || 0,
        // Si no tenés URL de foto, usamos el emoji que pusiste en la tabla
        image: item.foto_url || item.emoji || "https://via.placeholder.com/150",
        description: item.stock || "Disponible"
      }));

      setProducts(mappedData);
      setError(null);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError('No pudimos cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Suscripción al tiempo real (también en la tabla 'productos')
    const channel = supabase
      .channel('products-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}