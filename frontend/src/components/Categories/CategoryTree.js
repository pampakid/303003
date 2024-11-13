// src/components/Categories/CategoryTree.js
import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../services/api';

// Helper function to build tree structure
const buildCategoryTree = (categories) => {
  const categoryMap = new Map();
  const rootCategories = [];

  // First, create a map of all categories
  categories.forEach(category => {
    categoryMap.set(category.id, {
      ...category,
      children: []
    });
  });

  // Then, build the tree structure
  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id);
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(categoryWithChildren);
      }
    } else {
      rootCategories.push(categoryWithChildren);
    }
  });

  return rootCategories;
};

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
    e.stopPropagation();
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
            {category.children && category.children.length > 0 ? (
              <span className="w-4 text-gray-600">
                {isExpanded ? '▼' : '▶'}
              </span>
            ) : (
              <span className="w-4" /> {/* Spacer for alignment */}
            )}
            <span className="text-blue-500 ml-1">📁</span>
          </span>
          <span className="truncate">
            {category.name} ({categoryNotes.length})
          </span>
        </div>
        
        <button
          onClick={handleDelete}
          className="hidden group-hover:block px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
        >
          🗑️
        </button>
      </div>

      {isExpanded && (
        <div>
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

          {/* Show subcategories */}
          {category.children && category.children.map(childCategory => (
            <CategoryTreeItem
              key={childCategory.id}
              category={childCategory}
              notes={notes}
              onSelectNote={onSelectNote}
              onDeleteCategory={onDeleteCategory}
              level={level + 1}
            />
          ))}
        </div>
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
      const treeStructure = buildCategoryTree(data);
      setCategories(treeStructure);
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

  return (
    <div className="space-y-2">
      {categories.map(category => (
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