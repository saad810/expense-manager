import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  expenseType:  {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  }
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;