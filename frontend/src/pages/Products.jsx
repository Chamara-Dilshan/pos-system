// ============================================================================
// Products Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package, Filter, Box } from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { StatusBadge } from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { tokens, cardColors, alertColors, colorScheme, inputColors } from '../config/colors';

const Products = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // all, inStock, lowStock, outOfStock
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(id);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
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

    // Stock filter logic
    let matchesStock = true;
    if (stockFilter === 'inStock') {
      matchesStock = product.stock > product.min_stock;
    } else if (stockFilter === 'lowStock') {
      matchesStock = product.stock > 0 && product.stock <= product.min_stock;
    } else if (stockFilter === 'outOfStock') {
      matchesStock = product.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Get stock status for a product
  const getStockStatus = (product) => {
    if (product.stock === 0) return 'outOfStock';
    if (product.stock <= product.min_stock) return 'lowStock';
    return 'inStock';
  };

  if (loading) {
    return <Loading message="Loading products..." />;
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>Products</h1>
          <p className={`${tokens.text.muted} mt-1`}>Manage your product inventory</p>
        </div>
        <Button
          onClick={() => navigate('/products/new')}
          variant="primary"
          icon={Plus}
        >
          Add Product
        </Button>
      </div>

      {/* ── Error Alert ────────────────────────────────────────────────────── */}
      {error && (
        <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm flex items-center gap-2`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
          <button onClick={() => setError('')} className="ml-auto hover:opacity-70">×</button>
        </div>
      )}

      {/* ── Search and Filter ──────────────────────────────────────────────── */}
      <div className={`${cardColors.default} rounded-xl p-5`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${tokens.text.muted}`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${inputColors.base} ${inputColors.focus} rounded-xl transition-all`}
            />
          </div>
          <div className="relative">
            <Filter
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${tokens.text.muted}`}
              size={18}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`pl-10 pr-8 py-3 ${inputColors.base} ${inputColors.focus} rounded-xl transition-all min-w-[180px] appearance-none cursor-pointer`}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Box
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${tokens.text.muted}`}
              size={18}
            />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className={`pl-10 pr-8 py-3 ${inputColors.base} ${inputColors.focus} rounded-xl transition-all min-w-[160px] appearance-none cursor-pointer`}
            >
              <option value="all">All Stock</option>
              <option value="inStock">In Stock</option>
              <option value="lowStock">Low Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Products Grid ──────────────────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={
            products.length === 0
              ? 'Get started by adding your first product.'
              : 'Try adjusting your search or filters.'
          }
          action={
            products.length === 0 && (
              <Button onClick={() => navigate('/products/new')} variant="primary" icon={Plus}>
                Add Product
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`${cardColors.default} rounded-xl overflow-hidden hover:shadow-lg transition-all group`}
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <img
                    src={api.getImageUrl(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Package size={64} className="text-gray-300" />
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3
                  className={`font-semibold ${tokens.text.primary} mb-1 truncate`}
                  title={product.name}
                >
                  {product.name}
                </h3>
                <p className={`text-sm ${tokens.text.muted} mb-3`}>
                  {product.category_name || 'Uncategorized'}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span
                    className="text-xl font-bold"
                    style={{ color: colorScheme.primary[600] }}
                  >
                    {settings.currency_symbol}{product.price.toFixed(2)}
                  </span>
                  <StatusBadge
                    status={getStockStatus(product)}
                    size="sm"
                  />
                </div>

                <div className={`text-xs ${tokens.text.muted} mb-3`}>
                  Stock: <span className={`font-semibold ${tokens.text.primary}`}>{product.stock}</span>
                  {product.min_stock > 0 && (
                    <span> / Min: {product.min_stock}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/products/${product.id}`)}
                    variant="primary"
                    size="sm"
                    fullWidth
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(product.id)}
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Results Summary ────────────────────────────────────────────────── */}
      <div className={`${cardColors.default} rounded-xl px-5 py-3`}>
        <p className={`text-sm ${tokens.text.muted}`}>
          Showing{' '}
          <span className={`font-semibold ${tokens.text.primary}`}>
            {filteredProducts.length}
          </span>{' '}
          of{' '}
          <span className={`font-semibold ${tokens.text.primary}`}>
            {products.length}
          </span>{' '}
          products
        </p>
      </div>
    </div>
  );
};

export default Products;
