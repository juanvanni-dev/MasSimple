import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // ← importás el cliente ya creado

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('productos')
          .select('*');

        if (supabaseError) throw supabaseError;

        const mappedData = (data || []).map(item => ({
          ...item,
          price: item.options?.[0]?.price || 0,
          image: item.foto_url || item.emoji || "https://via.placeholder.com/150",
          description: item.stock || "Disponible"
        }));

        setProducts(mappedData);
      } catch (err: any) {
        console.error('Error de Supabase:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}