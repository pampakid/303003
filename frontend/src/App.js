// src/App.js
import React, { useState, useEffect } from 'react';
import NoteList from './components/Notes/NoteList';
import CategoryTree from './components/Categories/CategoryTree';
import CategoryForm from './components/Categories/CategoryForm';
import NoteForm from './components/Notes/NoteForm';

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setShowNoteForm(true);
  };

  const handleFormClose = () => {
    setSelectedNote(null);
    setShowNoteForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Notes Application</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-1/4 space-y-4">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Create New Category
            </button>

            {showCategoryForm && (
              <CategoryForm 
                onClose={() => setShowCategoryForm(false)}
                onSuccess={() => {
                  setShowCategoryForm(false);
                  // Refresh categories
                }}
              />
            )}

            {/* Category Tree */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Categories</h2>
              <CategoryTree
                notes={notes}
                onSelectNote={handleNoteSelect}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="w-3/4 space-y-4">
            {!showNoteForm && (
              <button
                onClick={() => setShowNoteForm(true)}
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create New Note
              </button>
            )}

            {showNoteForm && (
              <NoteForm
                initialNote={selectedNote}
                onClose={handleFormClose}
                onSuccess={() => {
                  handleFormClose();
                  // Refresh notes list
                }}
              />
            )}

            <NoteList
              onSelectNote={handleNoteSelect}
              notes={notes}
              setNotes={setNotes}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;