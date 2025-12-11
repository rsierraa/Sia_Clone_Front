import React, { useState, useEffect } from "react";
import API_BASE_URL from "./config";

function NotesDashboard({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: "GET",
        headers: {
          "client-id": user.userId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      } else {
        setError("Error al cargar las notas");
      }
    } catch (err) {
      setError("Error de red al cargar las notas");
      console.error("Fetch notes error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    
    if (!newNoteText.trim()) {
      setError("El texto de la nota no puede estar vacío");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-id": user.userId
        },
        body: JSON.stringify({ text: newNoteText })
      });

      if (response.ok) {
        // Refresh notes list
        await fetchNotes();
        setNewNoteText("");
        setShowNewNoteForm(false);
      } else {
        setError("Error al crear la nota");
      }
    } catch (err) {
      setError("Error de red al crear la nota");
      console.error("Create note error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Mis Notas</h1>
        <div className="user-info">
          <span>Bienvenido, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="notes-actions">
        <button 
          onClick={() => setShowNewNoteForm(!showNewNoteForm)} 
          className="new-note-btn"
        >
          {showNewNoteForm ? "Cancelar" : "+ Nueva Nota"}
        </button>
      </div>

      {showNewNoteForm && (
        <div className="new-note-form">
          <form onSubmit={createNote}>
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Escribe tu nota aquí..."
              rows="5"
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Nota"}
            </button>
          </form>
        </div>
      )}

      {loading && !showNewNoteForm && (
        <div className="loading">Cargando notas...</div>
      )}

      <div className="notes-list">
        {notes.length === 0 && !loading ? (
          <div className="no-notes">
            No tienes notas aún. ¡Crea tu primera nota!
          </div>
        ) : (
          notes.map((note, index) => (
            <div key={note.id || index} className="note-card">
              <div className="note-text">{note.text}</div>
              {note.createdAt && (
                <div className="note-date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotesDashboard;
