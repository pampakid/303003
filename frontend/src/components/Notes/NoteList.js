// src/components/Notes/NoteList.js
import React, { useState, useEffect } from 'react';
import { notesApi } from '../../services/api';
import NoteCard from './NoteCard';
import NoteSearch from './NoteSearch';
import NoteForm from './NoteForm';

const NoteList = ({ selectedNote, onNoteUpdate }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (selectedNote) {
      setShowForm(true);
    }
  }, [selectedNote]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadNotes();
      return;
    }
    try {
      const data = await notesApi.searchNotes(query);
      setNotes(data);
    } catch (error) {
      console.error('Error searching notes:', error);
    }
  };

  const handleNoteCreated = () => {
    loadNotes();
    setShowForm(false);
    if (onNoteUpdate) onNoteUpdate();
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-6"
      >
        Create New Note
      </button>

      {showForm && (
        <div className="mb-6">
          <NoteForm 
            initialNote={selectedNote}
            onNoteCreated={handleNoteCreated}
            onCancel={() => {
              setShowForm(false);
              if (onNoteUpdate) onNoteUpdate();
            }}
          />
        </div>
      )}

      <NoteSearch onSearch={handleSearch} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {notes.map((note) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onUpdate={loadNotes}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteList;