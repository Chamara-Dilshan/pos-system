// ============================================================================
// POS Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import { Search, Package, Grid, List, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import Cart from '../components/pos/Cart';
import Loading from '../components/common/Loading';
import { tokens, cardColors, alertColors, colorScheme, statusColors } from '../config/colors';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const { addItem } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === '' ||
      product.category_id === parseInt(selectedCategory);

    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert('This product is out of stock');
      return;
    }
    addItem(product);
  };

  if (loading) {
    return <Loading message="Loading POS..." />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* ── Left Side - Products ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Error Alert */}
          {error && (
            <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2`}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className={`${cardColors.default} p-4 rounded-xl mb-4 flex-shrink-0`}>
            {/* Search Input */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filters + View Toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2 flex-wrap flex-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === ''
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id.toString())}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedCategory === cat.id.toString()
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={`flex-1 ${cardColors.default} rounded-xl p-4 overflow-auto min-h-0`}>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Package size={36} className="text-gray-300" />
                </div>
                <p className={`font-medium ${tokens.text.primary}`}>
                  {products.length === 0 ? 'No products available' : 'No products match your search'}
                </p>
                <p className={`text-sm ${tokens.text.muted} mt-1`}>
                  {products.length === 0 ? 'Add products from the Products page' : 'Try a different search or category'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              // ── Grid View ─────────────────────────────────────────────────
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-400 hover:shadow-lg transition-all text-left group"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Package size={40} className="text-gray-300" />
                      )}
                    </div>

                    {/* Product Info */}
                    <h3 className={`font-semibold ${tokens.text.primary} mb-1 truncate text-sm`} title={product.name}>
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold" style={{ color: colorScheme.primary[600] }}>
                        {settings.currency_symbol}{product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        product.stock <= product.min_stock
                          ? statusColors.lowStock
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        Stock: {product.stock}
                      </span>
                      <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        + Add
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // ── List View ─────────────────────────────────────────────────
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-4 text-left group"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={24} className="text-gray-300" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${tokens.text.primary} truncate`}>
                        {product.name}
                      </h3>
                      <p className={`text-sm ${tokens.text.muted}`}>
                        {product.sku || 'No SKU'}
                      </p>
                    </div>

                    {/* Stock */}
                    <div className="text-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        product.stock <= product.min_stock
                          ? statusColors.lowStock
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-xl font-bold" style={{ color: colorScheme.primary[600] }}>
                        {settings.currency_symbol}{product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Add Button */}
                    <div className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      + Add
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Side - Cart ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-96 flex-shrink-0 lg:min-h-0 lg:h-full">
          <Cart />
        </div>
      </div>
    </div>
  );
};

export default POS;
