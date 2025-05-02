// get, create category

import Category from '../models/category.models.js';

// create catedory

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const newCategory = new Category({
            name
        });

        await newCategory.save();

        res.status(201).json({
            message: "Category created successfully",
            category: newCategory
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
}

// get all categories

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({
            message: "Categories retrieved successfully",
            categories
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving categories", error });
    }
}