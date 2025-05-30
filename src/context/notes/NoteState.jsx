import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  //fetch all notes
  const getNotes = async () => {
    //TODO = API call to fetch user data from database
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch notes", await response.json());
      return;
    }
    const json = await response.json();
    setNotes(json);
  };

  //function to add a note
  const addNote = async (title, description, tag) => {
    //TODO = API call to fetch user data from database
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setNotes(notes.concat(note));
  };

  //function to delete a note
  const deleteNote = async (id) => {
    //TODO = API call to delete note from backend as well
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  //function to update a note
  const editNote = async (id, title, description, tag) => {
    //API call to edit in backend
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    const newNotes = JSON.parse(JSON.stringify(notes));
    //You can't directly modify React state (notes), so copying it is necessary.
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        (newNotes[index].title = title),
          (newNotes[index].description = description),
          (newNotes[index].tag = tag);
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
