// src/components/Categories/CategoryTree.js
import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../services/api';

const CategoryTreeItem = ({ 
  category, 
  notes, 
  onSelectNote, 
  onDeleteCategory,
  level = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get notes that belong directly to this category
  const categoryNotes = notes.filter(note => note.category_id === category.id);
  
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent expansion when clicking delete
    if (window.confirm(`Are you sure you want to delete "${category.name}"? All notes will be moved to uncategorized.`)) {
      try {
        await categoriesApi.deleteCategory(category.id);
        onDeleteCategory();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div>
      <div 
        className="group flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
        style={{ paddingLeft: `${level * 1}rem` }}
      >
        <div 
          className="flex-1 flex items-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center">
            <span className="w-4 text-gray-600">
              {isExpanded ? '▼' : '▶'}
            </span>
            <span className="text-blue-500 ml-1">📁</span>
          </span>
          <span className="truncate">
            {category.name} ({categoryNotes.length})
          </span>
        </div>
        
        {/* Delete button - only visible on hover */}
        <button
          onClick={handleDelete}
          className="hidden group-hover:block px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
        >
          🗑️
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Show notes in this category */}
          <div className="ml-6">
            {categoryNotes.map(note => (
              <div
                key={note.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => onSelectNote(note)}
              >
                <span className="text-gray-500">📝</span>
                <span className="truncate">{note.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CategoryTree = ({ notes, onSelectNote, onCategoryUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDeleteCategory = async () => {
    await loadCategories();
    if (onCategoryUpdate) {
      onCategoryUpdate();
    }
  };

  if (loading) {
    return <div className="p-4">Loading categories...</div>;
  }

  // Get root categories
  const rootCategories = categories.filter(cat => !cat.parent_id);

  return (
    <div className="space-y-2">
      {rootCategories.map(category => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          notes={notes}
          onSelectNote={onSelectNote}
          onDeleteCategory={handleDeleteCategory}
        />
      ))}
      
      {/* Uncategorized Notes Section */}
      <div className="mt-4">
        <div className="p-2 text-gray-500 font-medium">
          Uncategorized ({notes.filter(note => !note.category_id).length})
        </div>
        {notes
          .filter(note => !note.category_id)
          .map(note => (
            <div
              key={note.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer ml-4"
              onClick={() => onSelectNote(note)}
            >
              <span className="text-gray-500">📝</span>
              <span className="truncate">{note.title}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryTree;