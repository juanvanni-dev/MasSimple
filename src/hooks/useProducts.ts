import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Usamos un valor por defecto vacío para que Vite no se rompa al minificar
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si las llaves no están, frenamos acá y avisamos
    if (!supabaseUrl || !supabaseKey) {
      console.error("⚠️ ERROR: Faltan las variables VITE_ en Vercel.");
      setLoading(false);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const fetchProducts = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('productos') // Confirmado en tu foto que se llama así
          .select('*');

        if (supabaseError) throw supabaseError;

        // Mapeamos los datos de tu tabla image_6db52a.png
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