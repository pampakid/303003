// src/components/Categories/CategoryTree.js
import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../services/api';

const buildCategoryTree = (categories) => {
  const categoryMap = new Map();
  const rootCategories = [];

  // First, create a map of all categories with empty children arrays
  categories.forEach(category => {
    categoryMap.set(category.id, {
      ...category,
      children: []
    });
  });

  // Then, populate children arrays
  categories.forEach(category => {
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(categoryMap.get(category.id));
      }
    } else {
      rootCategories.push(categoryMap.get(category.id));
    }
  });

  return rootCategories;
};

const getTotalNotesCount = (category, notes, categories) => {
  let count = notes.filter(note => note.category_id === category.id).length;
  const children = categories.filter(cat => cat.parent_id === category.id);
  children.forEach(child => {
    count += getTotalNotesCount(child, notes, categories);
  });
  return count;
};

const CategoryTreeItem = ({ 
  category, 
  notes,
  allCategories,
  onSelectNote, 
  onDeleteCategory,
  onSelectCategory,
  selectedCategoryId,
  level = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const totalNotes = getTotalNotesCount(category, notes, allCategories);
  const directNotes = notes.filter(note => note.category_id === category.id);

  const handleCategoryClick = (e) => {
    e.stopPropagation();
    onSelectCategory(category.id);
  };

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

  const isSelected = selectedCategoryId === category.id;

  return (
    <div>
      <div 
        className={`group flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer ${
          isSelected ? 'bg-blue-50' : ''
        }`}
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={handleCategoryClick}
      >
        <div 
          className="flex-1 flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <span className="flex items-center">
            {category.children && category.children.length > 0 ? (
              <span className="w-4 text-gray-600">
                {isExpanded ? '▼' : '▶'}
              </span>
            ) : (
              <span className="w-4"></span>
            )}
            <span className="text-blue-500 ml-1">📁</span>
          </span>
          <span className="truncate">
            {category.name} ({totalNotes})
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
          <div className="ml-6">
            {directNotes.map(note => (
              <div
                key={note.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNote(note);
                }}
              >
                <span className="text-gray-500">📝</span>
                <span className="truncate">{note.title}</span>
              </div>
            ))}
          </div>

          {category.children && category.children.map(childCategory => (
            <CategoryTreeItem
              key={childCategory.id}
              category={childCategory}
              notes={notes}
              allCategories={allCategories}
              onSelectNote={onSelectNote}
              onDeleteCategory={onDeleteCategory}
              onSelectCategory={onSelectCategory}
              selectedCategoryId={selectedCategoryId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTree = ({ notes, onSelectNote, onCategoryUpdate, onSelectCategory, selectedCategoryId }) => {
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

  const rootCategories = buildCategoryTree(categories);

  return (
    <div className="space-y-2">
      {rootCategories.map(category => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          notes={notes}
          allCategories={categories}
          onSelectNote={onSelectNote}
          onDeleteCategory={handleDeleteCategory}
          onSelectCategory={onSelectCategory}
          selectedCategoryId={selectedCategoryId}
        />
      ))}
      
      <div className="mt-4">
        <div 
          className={`p-2 text-gray-500 font-medium cursor-pointer hover:bg-gray-100 rounded ${
            selectedCategoryId === null ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectCategory(null)}
        >
          Uncategorized ({notes.filter(note => !note.category_id).length})
        </div>
        {(!selectedCategoryId || selectedCategoryId === null) && 
          notes
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