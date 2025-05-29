
import { useState, useCallback } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: "personal" | "work" | "idea" | "project";
}

export const useNoteManager = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = useCallback((noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { 
        ...note, 
        ...updates, 
        updatedAt: new Date() 
      } : note
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const searchNotes = useCallback((query: string) => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [notes]);

  const filterByCategory = useCallback((category: Note["category"]) => {
    return notes.filter(note => note.category === category);
  }, [notes]);

  const filterByTag = useCallback((tag: string) => {
    return notes.filter(note => note.tags.includes(tag));
  }, [notes]);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    searchNotes,
    filterByCategory,
    filterByTag
  };
};
