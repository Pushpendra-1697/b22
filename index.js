const express = require('express');
const { connection } = require('./Configs/db');
require('dotenv').config();
const cors = require('cors');
const { todoRouter } = require('./Routes/todos.router');
const { auth } = require('./middlewares/auth.middleware');
const { userRouter } = require('./Routes/user.router');
const { NoteRouter } = require('./Routes/Note.route');

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", (req, res) => {
    res.send({"msg": "Home Page"});
});

app.use("/users", userRouter);

app.use(auth);
app.use("/notes", NoteRouter);
app.use("/todos", todoRouter);

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("connected to DB")
    } catch (err) {
        console.log(err);
        console.log("Trouble connecting to DB");
    }
    console.log(`Server is running on ${process.env.port} port`)
});
