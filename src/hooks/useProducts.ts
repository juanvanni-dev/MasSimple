import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Creamos el cliente solo si las llaves existen
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!supabase) {
      console.error("❌ No hay conexión con Supabase. Revisá las variables VITE_ en Vercel.");
      setError("Error de configuración.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('productos').select('*');
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
      console.error('Error:', err);
      setError('No pudimos cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}