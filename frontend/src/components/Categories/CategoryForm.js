// src/components/Categories/CategoryForm.js
import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../services/api';

const CategoryForm = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    parent_id: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await categoriesApi.createCategory({
        name: formData.name,
        parent_id: formData.parent_id || null
      });
      onClose();
      window.location.reload(); // Refresh to update the tree
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mt-2">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Category Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Parent Category (Optional)</label>
          <select
            value={formData.parent_id}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
          >
            <option value="">No Parent</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Category
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;