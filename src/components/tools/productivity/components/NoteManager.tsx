
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Search, X } from "lucide-react";
import { useNoteManager, Note } from "../hooks/useNoteManager";

export const NoteManager = () => {
  const { notes, addNote, deleteNote, searchNotes } = useNoteManager();
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
    category: "personal" as Note["category"]
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    addNote({
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: newNote.category
    });
    
    setNewNote({
      title: "",
      content: "",
      tags: "",
      category: "personal"
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
      case "project": return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200";
      case "idea": return "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200";
    }
  };

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Barre de recherche responsive */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans les notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de création responsive */}
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <Plus className="w-5 h-5 text-blue-600" />
            Nouvelle Note
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            <Input
              placeholder="Titre de la note"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Tags (séparés par des virgules)"
              value={newNote.tags}
              onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
            />
            <Select 
              value={newNote.category} 
              onValueChange={(value: Note["category"]) => 
                setNewNote(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">👤 Personnel</SelectItem>
                <SelectItem value="work">💼 Travail</SelectItem>
                <SelectItem value="idea">💡 Idée</SelectItem>
                <SelectItem value="project">🚀 Projet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Contenu de la note..."
            rows={4}
            value={newNote.content}
            onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!newNote.title.trim() || !newNote.content.trim()}
            className="w-full lg:w-auto"
          >
            Créer la note
          </Button>
        </CardContent>
      </Card>

      {/* Liste des notes responsive */}
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl">
            Mes Notes ({filteredNotes.length})
            {searchQuery && (
              <Badge variant="outline" className="ml-2 text-xs">
                Recherche: "{searchQuery}"
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{searchQuery ? "Aucune note trouvée" : "Aucune note créée"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <div key={note.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base lg:text-lg line-clamp-2">{note.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {note.content}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge className={`text-xs ${getCategoryColor(note.category)}`}>
                      {note.category}
                    </Badge>
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {note.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
