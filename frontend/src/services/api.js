// src/services/api.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Notes API
export const notesApi = {
  // Get all notes
  getAllNotes: async () => {
    const response = await api.get('/notes/');
    return response.data;
  },

  // Get notes by category
  getNotesByCategory: async (categoryId) => {
    const response = await api.get(`/notes/?category_id=${categoryId}`);
    return response.data;
  },

  // Search notes
  searchNotes: async (query) => {
    const response = await api.get(`/notes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Create note
  createNote: async (note) => {
    const response = await api.post('/notes/', note);
    return response.data;
  },

  // Update note
  updateNote: async (id, note) => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },

  // Delete note
  deleteNote: async (id) => {
    await api.delete(`/notes/${id}`);
  }
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  // Create category
  createCategory: async (category) => {
    const response = await api.post('/categories/', category);
    return response.data;
  }
};