// src/components/Notes/NoteList.js
import React, { useState, useEffect } from 'react';
import { notesApi } from '../../services/api';
import NoteCard from './NoteCard';
import NoteSearch from './NoteSearch';

const NoteList = ({ onSelectNote, onNotesUpdate }) => {
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
      if (onNotesUpdate) {
        onNotesUpdate(data);
      }
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
      if (onNotesUpdate) {
        onNotesUpdate(data);
      }
    } catch (error) {
      console.error('Error searching notes:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <NoteSearch onSearch={handleSearch} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onUpdate={loadNotes}
            onClick={() => onSelectNote(note)}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteList;