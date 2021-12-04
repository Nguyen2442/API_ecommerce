const { User } = require("../models/user");
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

exports.getAllUser = async (req, res) => {
    try {
        const userList = await User.find().select("-passwordHash");
        res.send(userList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-passwordHash");
        res.send(user);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};

exports.addUser = async (req, res) => {
    let user = await new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.genSaltSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    try {
        user = await user.save();
        res.send(user);
    } catch (err) {
        res.status(400).send("The user cannot be created").json({ error: err });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const secret = process.env.secret;

        if (user && bcrypt.compare(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                secret,
                { expiresIn: '1d' }
            )
            res.status(200).send({ user: user.email, token: token })
        } else {
            res.status(400).send('Password is wrong!')
        }
    } catch (err) {
        res.status(400).send("The user not found").json({ error: err });
    }
}

exports.register = async (req, res) => {
    
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.genSaltSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    try {
        user = await user.save();
        res.send(user);
    } catch (err) {
        res.status(400).send("The user cannot be created").json({ error: err });
    }
}

exports.getCountUser = async (req, res) => {
    try {
        const userCount = await User.countDocuments((count) => count)
        res.send({
            userCount: userCount
        })
    } catch (err) {
        return res.status(500).json({ success: false, error: err })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.status(200).json({ success: true, message: 'The user is deleted' })
    } catch (err) {
        res.status(500).json({ success: false, error: err })
    }
}