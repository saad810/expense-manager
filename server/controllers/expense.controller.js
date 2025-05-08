// CRUD expenses
import Category from '../models/category.models.js';
import Expense from '../models/expense.models.js';

// const userID = "6814e9fb80952b09b0e3dfd8"

export const getAllExpenses = async (req, res) => {
    try {

        const userID = req.user.id;
        
        const expenses = await Expense.find({ userId: userID }).populate('userId', 'email').populate('category', 'name');
        // console.log(expenses);
        const plainExpenses = expenses.map((expense) => ({
            ...expense.toObject(),
            category: expense.category?.name || 'Unknown',
        }));
        res.status(200).json(
            {
                message: "Expenses fetched successfully",
                expenses:plainExpenses
            });
    } catch (error) {
        res.status(500).json({ message: "Error fetching expenses", error });
    }
}

// create
export const createExpense = async (req, res) => {
    try {
        const userID = req.user.id;
        const { category, amount, date, expenseType, description } = req.body;

        if (!category || !amount || !date || !expenseType) {
            return res.status(400).json({ message: "Category, amount, date and type are required" });
        }

        const findCategory = await Category.findById(category);
        if (!findCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        const newExpense = new Expense({
            userId: userID,
            category,
            amount,
            date,
            expenseType,
            description,
        });

        await newExpense.save();

        res.status(201).json({
            message: "Expense created successfully",
            expense: newExpense
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating expense", error });
    }
};


export const updateExpense = async (req, res) => {
    try {
        const userID = req.user.id;
        const { expenseId } = req.params;
        const { category, amount, date, expenseType, description } = req.body;

        if (!category || !amount || !date || !expenseType) {
            return res.status(400).json({ message: "Category, amount, date and type are required" });
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: expenseId, userId: userID },
            { category, amount, date, expenseType, description },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            expense: updatedExpense
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating expense", error });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const userID = req.user.id;
        const { expenseId } = req.params;

        const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, userId: userID });

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            expense: deletedExpense
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting expense", error });
    }
}