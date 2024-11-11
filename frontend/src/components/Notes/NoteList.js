// src/components/Notes/NoteList.js
import React, { useState, useEffect } from 'react';
import { notesApi } from '../../services/api';
import NoteCard from './NoteCard';
import NoteSearch from './NoteSearch';
import NoteForm from './NoteForm';

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

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

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <NoteForm onNoteCreated={loadNotes} />
      <NoteSearch onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onUpdate={loadNotes} />
        ))}
      </div>
    </div>
  );
};

export default NoteList;