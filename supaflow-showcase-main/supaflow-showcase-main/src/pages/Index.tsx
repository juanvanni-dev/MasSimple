import { useState } from 'react';
import Navbar from '../components/storefront/Navbar';
import Hero from '../components/storefront/Hero';
import ProductsSection from '../components/storefront/ProductsSection';
import AboutSection from '../components/storefront/AboutSection';
import CTASection from '../components/storefront/CTASection';
import Footer from '../components/storefront/Footer';
import Cart from '../components/storefront/Cart';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

export default function Index() {
  const { products, loading, error } = useProducts();
  const { cart, isOpen, setIsOpen, addToCart, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const [toast, setToast] = useState('');

  const handleAddToCart = (item: Parameters<typeof addToCart>[0]) => {
    addToCart(item);
    setToast('✅ Agregado al pedido');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="min-h-screen">
      <Navbar cartCount={totalItems} onCartOpen={() => setIsOpen(true)} />
      <Hero />
      <ProductsSection products={products} loading={loading} error={error} onAddToCart={handleAddToCart} />
      <AboutSection />
      <CTASection />
      <Footer />
      <Cart
        cart={cart}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onRemove={removeFromCart}
        onClear={clearCart}
        totalItems={totalItems}
        totalPrice={totalPrice}
      />

      {/* Toast */}
      <div className={`fixed bottom-7 left-1/2 -translate-x-1/2 bg-green text-primary-foreground px-6 py-3.5 rounded-full text-sm font-semibold shadow-ms z-[9999] whitespace-nowrap transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
        {toast}
      </div>
    </div>
  );
}
