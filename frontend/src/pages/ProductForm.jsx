// ============================================================================
// Product Form Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  DollarSign,
  Hash,
  Layers,
  Image,
  AlertTriangle,
  Save,
  Upload,
  X,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Select from '../components/common/Select';
import { tokens, cardColors, alertColors, colorScheme } from '../config/colors';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    price: '',
    cost_price: '',
    stock: '0',
    min_stock: '5',
    image_url: '',
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response.categories || []);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.getProduct(id);
      const product = response.product;

      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category_id: product.category_id || '',
        price: product.price || '',
        cost_price: product.cost_price || '',
        stock: product.stock || '0',
        min_stock: product.min_stock || '5',
        image_url: product.image_url || '',
      });
      // Set image preview for existing product
      if (product.image_url) {
        setImagePreview(api.getImageUrl(product.image_url));
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    setError('');

    try {
      const response = await api.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        image_url: response.image_url,
      }));
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: '',
    }));
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        price: parseFloat(formData.price),
        cost_price: parseFloat(formData.cost_price) || 0,
        stock: parseInt(formData.stock) || 0,
        min_stock: parseInt(formData.min_stock) || 5,
      };

      if (isEditing) {
        await api.updateProduct(id, data);
      } else {
        await api.createProduct(data);
      }

      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading product..." />;
  }

  const categoryOptions = [
    { value: '', label: 'Select category' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  return (
    <div className="space-y-6">
      {/* ── Back Button ────────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/products')}
        className={`flex items-center gap-2 ${tokens.text.muted} hover:${tokens.text.primary} transition-colors font-medium`}
      >
        <ArrowLeft size={20} />
        <span>Back to Products</span>
      </button>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: colorScheme.primary[600] }}
        >
          <Package size={24} />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className={tokens.text.muted}>
            {isEditing ? 'Update product information' : 'Fill in the details to create a new product'}
          </p>
        </div>
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

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className={`${cardColors.default} rounded-xl p-6`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left Column ──────────────────────────────────────────────────── */}
          <div className="space-y-5">
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${tokens.text.muted} mb-4`}>
              Basic Information
            </h3>

            <Input
              label="Product Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              icon={Package}
              required
            />

            <Select
              label="Category"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              options={categoryOptions}
              icon={Layers}
            />

            <Input
              label="SKU (Optional)"
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Product SKU"
              icon={Hash}
              helperText="Stock Keeping Unit - unique product identifier"
            />

            {/* Image Upload */}
            <div>
              <label className={`block text-sm font-medium ${tokens.text.secondary} mb-2`}>
                Product Image (Optional)
              </label>

              {imagePreview || formData.image_url ? (
                <div className="relative w-48 aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={imagePreview || api.getImageUrl(formData.image_url)}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Loader2 size={32} className="text-white animate-spin" />
                    </div>
                  )}
                  {!uploading && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center w-48 aspect-square border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    uploading
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={32} className="text-blue-500 animate-spin mb-2" />
                      <span className={`text-sm ${tokens.text.muted}`}>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <span className={`text-sm font-medium ${tokens.text.secondary}`}>
                        Click to upload image
                      </span>
                      <span className={`text-xs ${tokens.text.muted} mt-1`}>
                        JPEG, PNG, GIF, WebP (max 5MB)
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* ── Right Column ─────────────────────────────────────────────────── */}
          <div className="space-y-5">
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${tokens.text.muted} mb-4`}>
              Pricing & Inventory
            </h3>

            <Input
              label="Selling Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              icon={DollarSign}
              required
            />

            <Input
              label="Cost Price (Optional)"
              type="number"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              icon={DollarSign}
              helperText="Used for profit calculations"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stock Quantity"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />

              <Input
                label="Min Stock Alert"
                type="number"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                placeholder="5"
                min="0"
                required
              />
            </div>

            {/* Stock Alert Preview */}
            {formData.stock && formData.min_stock && parseInt(formData.stock) <= parseInt(formData.min_stock) && (
              <div className={`${alertColors.warning.bg} border ${alertColors.warning.border} rounded-xl p-4`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className={alertColors.warning.text} />
                  <div>
                    <p className={`font-medium ${alertColors.warning.text}`}>Low Stock Warning</p>
                    <p className={`text-sm ${tokens.text.muted} mt-1`}>
                      Current stock ({formData.stock}) is at or below the minimum level ({formData.min_stock}).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Action Buttons ───────────────────────────────────────────────── */}
        <div className={`flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t ${tokens.border.default}`}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            icon={Save}
            className="flex-1"
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/products')}
            className="flex-1 sm:flex-initial"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
