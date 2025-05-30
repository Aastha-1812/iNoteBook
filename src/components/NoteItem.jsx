import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import NoteContext from "../context/notes/NoteContext";

const NoteItem = (props) => {
  const { note, updateNote } = props;
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  return (
    <div className="col-my-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex">
            <h5 className="card-title">{note.title}</h5>
            <FontAwesomeIcon
              className="font-click"
              icon={faTrash}
              style={{ margin: "5px" }}
              onClick={() => {
                deleteNote(note._id);
                props.showAlert("Deleted sucessfully", "success");
              }}
            />
            <FontAwesomeIcon
              className="font-click"
              icon={faPenToSquare}
              style={{ margin: "5px" }}
              onClick={() => {
                updateNote(note);
              }}
            />
          </div>

          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
