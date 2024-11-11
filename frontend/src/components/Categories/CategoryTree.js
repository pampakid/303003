// src/components/Notes/NoteForm.js
import React, { useState, useEffect } from 'react';
import { notesApi, categoriesApi } from '../../services/api';

const NoteForm = ({ onNoteCreated, initialNote = null }) => {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(true);
      setNote({
        ...initialNote,
        tags: initialNote.tags.join(',')
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
        tags: tagArray,
        category_id: note.category_id || null
      };

      if (initialNote) {
        await notesApi.updateNote(initialNote.id, noteData);
      } else {
        await notesApi.createNote(noteData);
      }
      
      setNote({ title: '', content: '', tags: '', category_id: '' });
      setIsOpen(false);
      if (onNoteCreated) onNoteCreated();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {initialNote ? 'Edit Note' : 'Create New Note'}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={note.title}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                name="category_id"
                value={note.category_id}
                onChange={handleChange}
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
                name="content"
                value={note.content}
                onChange={handleChange}
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
                name="tags"
                value={note.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {initialNote ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default NoteForm;