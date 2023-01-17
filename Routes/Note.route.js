const { Router } = require('express');
const { NoteModel } = require('../Models/Note.model');
const NoteRouter = Router();

NoteRouter.get('/', async (req, res) => {
    let query = req.query;
    try {
        const notes = await NoteModel.find(query);
        res.send(notes);
    } catch (err) {
        console.log(err)
        res.send({ "msg": "Something went wrong" })
    }
});
NoteRouter.post('/create', async (req, res) => {
    const data = req.body;
    try {
        const note = new NoteModel(data);
        await note.save();
        res.send({"msg": "new note created successfully"});
    } catch (err) {
        console.log(err)
        res.send({ "msg": "Something went wrong" })
    }
});
//same author should can update/delete own note; 
NoteRouter.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const note = await NoteModel.findOne({ _id: id });
    const userID_in_note = note.userID;
    const userID_making_req = req.body.userID;
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "msg": "You are not authorized to update" })
        } else {
            await NoteModel.findByIdAndUpdate({ _id: id }, payload);
            res.send({"msg":`updated successfully note whose id is ${id}`});
        }
    } catch (err) {
        res.status(404).send({ "msg": "You are not authorized to update" });
    }
});

NoteRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const note = await NoteModel.findOne({ _id: id });
    const userID_in_note = note.userID;
    const userID_making_req = req.body.userID;
    // console.log(userID_in_note, userID_making_req,id);
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "msg": "You are not authorized to delete" })
        } else {
            await NoteModel.findByIdAndDelete({ _id: id });
            res.send({"msg":`Deleted successfully note whose id is ${id}`});
        }
    } catch (err) {
        console.log(err);
        res.status(404).send({ "msg": "You are not authorized to delete" });
    }
});

module.exports = { NoteRouter };