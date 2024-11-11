// src/components/Notes/NoteForm.js
import React, { useState, useEffect } from 'react';
import { notesApi, categoriesApi } from '../../services/api';

const NoteForm = ({ initialNote, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: '',
    category_id: ''
  });

  useEffect(() => {
    loadCategories();
    if (initialNote) {
      setNote({
        ...initialNote,
        tags: initialNote.tags.join(', ')
      });
    }
  }, [initialNote]);

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
      const tagArray = note.tags
        ? note.tags.split(',').map(tag => tag.trim())
        : [];

      const noteData = {
        ...note,
        tags: tagArray
      };

      if (initialNote) {
        await notesApi.updateNote(initialNote.id, noteData);
      } else {
        await notesApi.createNote(noteData);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <select
            value={note.category_id || ''}
            onChange={(e) => setNote({ ...note, category_id: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={note.tags}
            onChange={(e) => setNote({ ...note, tags: e.target.value })}
            placeholder="tag1, tag2, tag3"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {initialNote ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NoteForm;