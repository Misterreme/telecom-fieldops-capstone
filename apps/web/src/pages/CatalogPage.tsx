import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductDetail } from '../components/catalog/ProductDetail';
import type { Product } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const CATEGORY_LABELS: Record<string, string> = {
  ALL: 'Todos',
  ROUTER: 'Routers',
  MODEM: 'Modems',
  ONT: 'ONT',
  STB: 'Decodificadores',
  CABLE: 'Cables',
  SIM: 'SIM',
  ANTENNA: 'Antenas',
};

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/v1/products`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError('No se pudieron cargar los productos. Verifica que el servidor esté activo.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filter === 'ALL' || p.category === filter;
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['ALL', ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-slate-700">
        <div>
          <button
            onClick={() => navigate('/home')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 flex items-center gap-1"
          >
            ← Panel Principal
          </button>
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-violet-400 font-medium mb-1">
            Catálogo de Equipos
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50">
            Productos
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {products.length} productos registrados
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
            <span className="text-lg font-bold text-violet-400">{products.length}</span>
            <span className="block text-[0.6rem] text-slate-500 uppercase tracking-widest">Total</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
            <span className="text-lg font-bold text-emerald-400">
              {products.filter((p) => p.isSerialized).length}
            </span>
            <span className="block text-[0.6rem] text-slate-500 uppercase tracking-widest">Serializados</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-center">
            <span className="text-lg font-bold text-sky-400">
              {new Set(products.map((p) => p.category)).size}
            </span>
            <span className="block text-[0.6rem] text-slate-500 uppercase tracking-widest">Categorías</span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
                filter === cat
                  ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500',
              ].join(' ')}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-20 mb-4" />
              <div className="h-5 bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-full mb-6" />
              <div className="h-8 bg-slate-700 rounded w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 text-center">
          <p className="text-rose-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Reintentar
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
          <p className="text-slate-500 text-sm">No se encontraron productos con los filtros actuales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};