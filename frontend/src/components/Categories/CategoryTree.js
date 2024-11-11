// src/components/Categories/CategoryTree.js
import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../services/api';
import { ChevronDown, ChevronRight, Folder, FileText } from 'lucide-react';

const CategoryTreeItem = ({ category, notes, onSelectNote, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryNotes = notes.filter(note => note.category_id === category.id);
  
  const paddingLeft = `${level * 1}rem`;

  return (
    <div>
      <div 
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
        style={{ paddingLeft }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center">
          {category.children?.length > 0 && (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
          <Folder size={16} className="text-blue-500 ml-1" />
        </span>
        <span className="truncate">
          {category.name} ({categoryNotes.length})
        </span>
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
                <FileText size={16} className="text-gray-500" />
                <span className="truncate">{note.title}</span>
              </div>
            ))}
          </div>

          {/* Show subcategories */}
          {category.children?.map(child => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              notes={notes}
              onSelectNote={onSelectNote}
              level={level + 1}
            />
          ))}
        </>
      )}
    </div>
  );
};

const CategoryTree = ({ notes, onSelectNote }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAllCategories();
      // Filter to get only root categories (those without parent)
      const rootCategories = data.filter(cat => !cat.parent_id);
      setCategories(rootCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
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
        />
      ))}
      
      {/* Uncategorized Notes Section */}
      <div className="mt-4">
        <div className="p-2 text-gray-500 font-medium">Uncategorized</div>
        {notes
          .filter(note => !note.category_id)
          .map(note => (
            <div
              key={note.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer ml-4"
              onClick={() => onSelectNote(note)}
            >
              <FileText size={16} className="text-gray-500" />
              <span className="truncate">{note.title}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryTree;