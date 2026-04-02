import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// METEMOS LAS LLAVES "A LO GUAPO" PARA MATAR EL ERROR DE LA 'Y'
const supabaseUrl = "https://zahlthwktowwbozbhvxd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGx0aHdrdG93d2JvemJodnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjU1MDcsImV4cCI6MjA4ODQwMTUwN30.o1IYkyuOJ-N0KshEvlBby6t6pg0g2HqF9ewvMXJjkrM";

// Creamos el cliente afuera para que sea más estable
const supabase = createClient(supabaseUrl, supabaseKey);

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

        // Mapeamos los datos de tu tabla para que la web los entienda
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