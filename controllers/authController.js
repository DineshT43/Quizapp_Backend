const express = require('express');
const jwt = require('jsonwebtoken');
const {v4: uuid} = require('uuid');

const userdata = require('../db/users');


const signUpHandler = (req, res) => {
    const {username, password} = req.body;
    // Duplicate User
    const isUserPresent = userdata.users.some(user => user.username === username);
    if(isUserPresent) {
        res.status(422).json({ message: "User Already Exists" })
    } else {
        const id = uuid();
        const newUser = { id, username, password };
        userdata.users = [...userdata.user, newUser];
        const token = jwt.sign({ id: username }, process.env.SECRET_TOKEN);
        res.json({ message: `Success, created new user --> ${username}::${token}` })
    }
}


const loginHandler = (req, res) => {
    const { username, password } = req.body;
    const isUserVerified = userdata.users.some(user => user.username === username && user.password === password);
    if(isUserVerified) {
        const token = jwt.sign({id: username}, process.env.SECRET_TOKEN);
        res.json({username, token, message: "User Verified"})
    } else {
        res.status(401).json({message: "Invalid Credentials"});
    }
}

module.exports = { loginHandler, signUpHandler };