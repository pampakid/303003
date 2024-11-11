// src/components/Notes/NoteCard.js
import React from 'react';
import { notesApi } from '../../services/api';

const NoteCard = ({ note, onUpdate }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesApi.deleteNote(note.id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold">{note.title}</h3>
      <p className="mt-2 text-gray-600">{note.content}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {note.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard; // Add this export