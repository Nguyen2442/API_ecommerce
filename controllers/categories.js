const { Category } = require('../models/category');
const express = require('express');


exports.getAllCategory = async (req, res) => {
    try {
        const categoryList = await Category.find();
        res.status(200).send(categoryList);
    } catch (err) {
        res.status(500).json({ success: false })
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).send(category);
    } catch (err) {
        res.status(500).json({ message: 'The category with the given ID was not found', error: err })
    }
}

exports.addCategory = async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    try {
        category = await category.save();
        res.send(category);
    } catch (err) {
        res.status(404).send('The category cannot be created!').json({ error: err })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
            // { new: true }
        )
        res.send(category);
    } catch (err) {
        return res.status(400).send('The category cannot be updated!').json({ error: err })
    }
}

exports.deleteCategory = async (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (category) {
                return res.status(200).json({ success: true, message: 'The category is deleted!' })
            } else {
                return res.status(404).json({ success: false, message: "category not found!" })
            }
        }).catch(err => {
            return res.status(400).json({ success: false, error: err })
        })
}

