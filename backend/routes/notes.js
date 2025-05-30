const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE 1 : fetching all the notes from Notes db
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

//ROUTE 2 : adding a new note , login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title must be more than 3 characters").isLength({ min: 3 }),
    body("description", "description must be more than 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
      }
      const { title, description, tag } = req.body;
      const newNote = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await newNote.save();

      res.send(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//ROUTE 3 : Updating a note on api/notes/updatenote , login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //find the note to be updated and update it
  const requiredNote = await Notes.findById(req.params.id);
  if (!requiredNote) {
    return res.status(404).send("Note Found");
  }

  //check if logged in user is the same as the one who wrote the note
  //requiredNote.user is the ID of the user who created the note (stored when the note was created).req.user.id is the ID of the user who is currently logged in, which is set by the fetchuser middleware (probably from a JWT token).
  if (requiredNote.user.toString() !== req.user.id) {
    return res.status(401).send("Note Allowed");
  }

  let note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
});

//ROUTE 4 : Deleting a note on api/notes/deletenote , login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //find the note to be deleted and delete it
  const requiredNote = await Notes.findById(req.params.id);
  if (!requiredNote) {
    return res.status(404).send("Note Found");
  }

  //check if logged in user is the same as the one who wrote the note
  //requiredNote.user is the ID of the user who created the note (stored when the note was created).req.user.id is the ID of the user who is currently logged in, which is set by the fetchuser middleware (probably from a JWT token).
  if (requiredNote.user.toString() !== req.user.id) {
    return res.status(401).send("Note Allowed");
  }

  let note = await Notes.findByIdAndDelete(req.params.id);
  res.json({ success: "note deleted successfully", note });
});
module.exports = router;
