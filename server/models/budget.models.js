import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true }, // Match with expense category
    amount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    note: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  
const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;