import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno para que Vercel le pase las llaves reales
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si falta alguna, te lo avisa en la consola del navegador (F12)
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: No se encontraron las llaves VITE_SUPABASE en el entorno.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('productos') 
        .select('*');
        
      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        ...item,
        price: item.options?.[0]?.price || 0,
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