// src/App.js
import React, { useState } from 'react';
import NoteList from './components/Notes/NoteList';
import CategoryTree from './components/Categories/CategoryTree';
import CategoryForm from './components/Categories/CategoryForm';
import { categoriesApi } from './services/api';

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  const handleNoteUpdate = () => {
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Notes Application
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="w-1/4">
            <div className="mb-4">
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Create New Category
              </button>
              {showCategoryForm && (
                <CategoryForm 
                  onClose={() => setShowCategoryForm(false)}
                />
              )}
            </div>
            <CategoryTree onSelectNote={handleNoteSelect} />
          </div>
          <div className="w-3/4">
            <NoteList 
              selectedNote={selectedNote}
              onNoteUpdate={handleNoteUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;