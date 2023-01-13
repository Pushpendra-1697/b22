const { Router } = require('express');
const todoRouter = Router();
const { TodoModel } = require('../Models/todo.model');

todoRouter.get('/', async (req, res) => {
    let query = req.query;
    try {
        const todos = await TodoModel.find(query);
        res.send(todos);
    } catch (err) {
        console.log(err);
        res.status(404).send({ "Error": "Somthing went wrong" });
    }
});

todoRouter.post('/post', async (req, res) => {
    let payload = req.body;
    try {
        const todo = new TodoModel(payload);
        await todo.save();
        res.status(200).send({"msg":"Succefully added todo"});
    } catch (err) {
        console.log(err);
        res.status(404).send({ "Error": err });
    }
});

todoRouter.patch('/patch/:id', async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        await TodoModel.findByIdAndUpdate({ _id: id }, payload);
        res.send({"msg":`updated successfully todo whose id is ${id}`});
    } catch (err) {
        console.log(err);
        res.status(404).send({ "Error": err.message });
    }
});

todoRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await TodoModel.findByIdAndDelete({ _id: id });
        res.send({"msg":`Deleted successfully todo whose id is ${id}`});
    } catch (err) {
        console.log(err);
        res.status(404).send({ "Error": err.message });
    }
});

module.exports = { todoRouter };