// src/App.js
import React, { useState, useEffect } from 'react';
import NoteList from './components/Notes/NoteList';
import CategoryTree from './components/Categories/CategoryTree';
import CategoryForm from './components/Categories/CategoryForm';
import NoteForm from './components/Notes/NoteForm';
import { notesApi } from './services/api';

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const data = await notesApi.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setShowNoteForm(true);
  };

  const handleFormClose = () => {
    setSelectedNote(null);
    setShowNoteForm(false);
    loadNotes();
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleRefresh = () => {
    setSelectedCategory(null);
    setSelectedNote(null);
    setShowNoteForm(false);
    setShowCategoryForm(false);
    loadNotes();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Notes Application</h1>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <aside className="w-1/4">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
            >
              Create New Category
            </button>

            {showCategoryForm && (
              <CategoryForm 
                onClose={() => {
                  setShowCategoryForm(false);
                  loadNotes();
                }}
              />
            )}

            <div className="bg-white rounded-lg shadow p-4">
              <CategoryTree
                notes={notes}
                onSelectNote={handleNoteSelect}
                onSelectCategory={handleCategorySelect}
                selectedCategoryId={selectedCategory}
                onCategoryUpdate={loadNotes}
              />
            </div>
          </aside>

          <div className="w-3/4">
            <button
              onClick={() => setShowNoteForm(true)}
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
            >
              Create New Note
            </button>

            {showNoteForm && (
              <div className="mb-4">
                <NoteForm
                  initialNote={selectedNote}
                  onClose={handleFormClose}
                  onSuccess={handleFormClose}
                />
              </div>
            )}

            <NoteList
              notes={notes}
              selectedCategory={selectedCategory}
              onSelectNote={handleNoteSelect}
              onNotesUpdate={setNotes}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;