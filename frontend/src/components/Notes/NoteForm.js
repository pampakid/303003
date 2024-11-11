// src/components/Notes/NoteForm.js
import React, { useState } from 'react';
import { notesApi } from '../../services/api';

const NoteForm = ({ onNoteCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert comma-separated tags string to array
      const tagArray = note.tags
        ? note.tags.split(',').map(tag => tag.trim())
        : [];
      
      await notesApi.createNote({
        ...note,
        tags: tagArray
      });
      
      // Reset form
      setNote({ title: '', content: '', tags: '' });
      setIsOpen(false);
      if (onNoteCreated) onNoteCreated();
    } catch (error) {
      console.error('Error creating note:', error);
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
          Create New Note
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
                Save Note
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default NoteForm;