// src/App.js
import React, { useState } from 'react';
import NoteList from './components/Notes/NoteList';
import CategoryTree from './components/Categories/CategoryTree';
import CategoryForm from './components/Categories/CategoryForm';
import NoteForm from './components/Notes/NoteForm';

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState([]);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setShowNoteForm(true);
  };

  const handleFormClose = () => {
    setSelectedNote(null);
    setShowNoteForm(false);
  };

  const updateNotesList = (updatedNotes) => {
    setNotes(updatedNotes);
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
          {/* Left Sidebar */}
          <div className="w-1/4">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="w-full mb-4 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Create New Category
            </button>
            
            {showCategoryForm && (
              <CategoryForm onClose={() => setShowCategoryForm(false)} />
            )}
            
            <div className="mt-4 bg-white rounded-lg shadow">
              <CategoryTree 
                notes={notes}
                onSelectNote={handleNoteSelect}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-3/4">
            <button
              onClick={() => setShowNoteForm(true)}
              className="w-full mb-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create New Note
            </button>

            {showNoteForm && (
              <div className="mb-4">
                <NoteForm
                  initialNote={selectedNote}
                  onClose={handleFormClose}
                  onSuccess={() => {
                    handleFormClose();
                    // Refresh notes list
                  }}
                />
              </div>
            )}

            <NoteList
              onSelectNote={handleNoteSelect}
              onNotesUpdate={updateNotesList}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;