// ============================================================================
// Categories Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, Calendar } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { tokens, cardColors, alertColors, tableColors, colorScheme } from '../config/colors';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getCategories();
      setCategories(response.categories || []);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
      } else {
        await api.createCategory(formData);
      }

      setShowModal(false);
      setFormData({ name: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '' });
    setError('');
  };

  if (loading) {
    return <Loading message="Loading categories..." />;
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>Categories</h1>
          <p className={`${tokens.text.muted} mt-1`}>Organize your products by category</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          icon={Plus}
        >
          Add Category
        </Button>
      </div>

      {/* ── Error Alert ────────────────────────────────────────────────────── */}
      {error && !showModal && (
        <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm flex items-center gap-2`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
          <button onClick={() => setError('')} className="ml-auto hover:opacity-70">×</button>
        </div>
      )}

      {/* ── Categories Table ───────────────────────────────────────────────── */}
      <div className={`${cardColors.default} rounded-xl overflow-hidden`}>
        {categories.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No categories found"
            description="Create your first category to organize your products."
            action={
              <Button onClick={() => setShowModal(true)} variant="primary" icon={Plus}>
                Add Category
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={tableColors.header}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Layers size={14} />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      Created At
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`bg-white divide-y ${tokens.border.light}`}>
                {categories.map((category) => (
                  <tr key={category.id} className={tableColors.row}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${colorScheme.primary[100]}` }}
                        >
                          <Layers size={18} style={{ color: colorScheme.primary[600] }} />
                        </div>
                        <span className={`font-semibold ${tokens.text.primary}`}>
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${tokens.text.muted}`}>
                        {new Date(category.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(category)}
                          variant="primary"
                          size="sm"
                          icon={Edit}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(category.id)}
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Results Summary ────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className={`${cardColors.default} rounded-xl px-5 py-3`}>
          <p className={`text-sm ${tokens.text.muted}`}>
            Total:{' '}
            <span className={`font-semibold ${tokens.text.primary}`}>
              {categories.length}
            </span>{' '}
            {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error in Modal */}
          {error && showModal && (
            <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm flex items-center gap-2`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <Input
            label="Category Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            placeholder="Enter category name"
            icon={Layers}
            required
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
