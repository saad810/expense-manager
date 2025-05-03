// CRUD budgets

import Budget from '../models/budget.models.js';
import Category from '../models/category.models.js';
import Email from '../models/email.model.js';
import sendEmail from '../utils/email.js';
import { advancedMinimalTemplate } from '../utils/emailTempaltes.js';
// const userID = "6814e9fb80952b09b0e3dfd8"


export const getAllBudgets = async (req, res) => {
    try {
        const userID = req.user.id;
        const budgets = await Budget.find({ userId: userID })
            .populate('userId', 'email')
            .populate('category', 'name');

        const plainBudgets = budgets.map((budget) => ({
            ...budget.toObject(),
            category: budget.category?.name || 'Unknown',
        }));

        res.status(200).json({
            message: "Budgets fetched successfully",
            budgets: plainBudgets,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching budgets", error });
    }
};

// create

export const createBudget = async (req, res) => {
    try {
        const userID = req.user.id;
        const { category, amount, startDate, endDate } = req.body;

        if (!category || !amount) {
            return res.status(400).json({ message: "Category, amount are required" });
        }

        const findCategory = await Category.findById(category);
        if (!findCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        const newBudget = new Budget({
            userId: userID,
            category,
            amount,
            startDate,
            endDate,
        });


        const emailOptions = {
            to: req.user.email,
            subject: "Budget Created",
            html: advancedMinimalTemplate({
                title: "Budget Created",
                message: `Your budget for <strong>${newBudget.amount}</strong>, from ${newBudget.startDate} to ${newBudget.endDate} has been Created successfully.`,
                footer: "Smart Finance",
            }),
        };

        try {
            await newBudget.save();
            await sendEmail(emailOptions);

            // Log the sent email
            await Email.create({
                status: 'sent',
                reason: 'create-budget', // or a more specific reason if you define one like 'budget-deletion'
                emailData: {
                    to: emailOptions.to,
                    subject: emailOptions.subject,
                    html: emailOptions.html,
                },
            });
        } catch (error) {
            console.error("❌ Error sending email:", error);

            // Log the failed email
            await Email.create({
                status: 'failed',
                reason: 'create-budget',
                emailData: {
                    to: emailOptions.to,
                    subject: emailOptions.subject,
                    html: emailOptions.html,
                },
            });

            return res.status(500).json({ message: "Error sending email", error });
        }


        res.status(201).json({
            message: "Budget created successfully",
            budget: newBudget
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating budget", error });
    }
}

export const updateBudget = async (req, res) => {
    try {
        const userID = req.user.id;
        const { budgetId } = req.params;
        const { category, amount, startDate, endDate } = req.body;

        console.log(req.body);

        if (!category || !amount) {
            return res.status(400).json({ message: "Category, amount are required" });
        }

        const updatedBudget = await Budget.findOneAndUpdate(
            { _id: budgetId, userId: userID },
            { category, amount, startDate, endDate },
            { new: true }
        );

        if (!updatedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({
            message: "Budget updated successfully",
            budget: updatedBudget
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating budget", error });
    }
}

export const deleteBudget = async (req, res) => {
    try {
        const userID = req.user.id;
        const { budgetId } = req.params;

        const deletedBudget = await Budget.findOneAndDelete(
            { _id: budgetId, userId: userID }
        );

        if (!deletedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        const emailOptions = {
            to: req.user.email,
            subject: "Budget Deleted",
            html: advancedMinimalTemplate({
                title: "Budget Deleted",
                message: `Your budget for <strong>${deletedBudget.amount}</strong>, from ${deletedBudget.startDate} to ${deletedBudget.endDate} has been deleted successfully.`,
                footer: "Smart Finance",
            }),
        };

        try {
            await sendEmail(emailOptions);

            // Log the sent email
            await Email.create({
                status: 'sent',
                reason: 'delete-budget', // or a more specific reason if you define one like 'budget-deletion'
                emailData: {
                    to: emailOptions.to,
                    subject: emailOptions.subject,
                    html: emailOptions.html,
                },
            });
        } catch (error) {
            console.error("❌ Error sending email:", error);

            // Log the failed email
            await Email.create({
                status: 'failed',
                reason: 'delete-budget',
                emailData: {
                    to: emailOptions.to,
                    subject: emailOptions.subject,
                    html: emailOptions.html,
                },
            });

            return res.status(500).json({ message: "Error sending email", error });
        }




        res.status(200).json({
            message: "Budget deleted successfully",
            budget: deletedBudget
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting budget", error });
    }
}