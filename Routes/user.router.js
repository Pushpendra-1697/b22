const { Router } = require('express');
const userRouter = Router();
const jwt = require('jsonwebtoken');
const { UserModel } = require('../Models/user.model');
const bcrypt = require('bcrypt');
require('dotenv').config();


userRouter.get('/', async (req, res) => {
    try {
        let users = await UserModel.find();
        res.send(users);
    } catch (err) {
        console.log(err);
        res.send({ "Error": err.message });
    }
});

userRouter.post('/register', async (req, res) => {
    const { email, pass, name, age } = req.body;
    try {
        bcrypt.hash(pass, Number(process.env.rounds), async (err, secure_password) => {
            if (err) {
                console.log(err)
            } else {
                const user = new UserModel({ name, pass: secure_password, email, age });
                await user.save();
                res.send({"msg": 'Registered'});
            }
        });
    } catch (err) {
        res.send({"msg": "Error in registration"});
        console.log(err)
    }
});

userRouter.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.find({ email });
        // console.log(user);
        if (user.length > 0) {
            bcrypt.compare(pass, user[0]["pass"], (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user[0]["_id"] }, process.env.key , { expiresIn: "1h" });
                    res.send({ "masssage": "Login successful", "token": token, "username": user[0]["name"] });

                } else {
                    res.send({"msg": 'Wrong Credntials'});
                }
            });
        } else {
            res.send({"msg": 'Wrong Credntials'});
        }
    } catch (err) {
        res.send({"msg": "Something went wrong"});
        console.log(err);
    }
});

module.exports = { userRouter };