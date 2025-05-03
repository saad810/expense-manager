import { axios } from '../utils/axios';
// import { toast } from 'react-toastify';

const expenseApi = {
    getall: () => axios.get('/expenses'),
    createExpense: (data) => axios.post('/expenses', data),
    deleteExpense: (id) => axios.delete(`/expenses/${id}`),
    updateExpense: async (expenseData) => {
        const { id, ...data } = expenseData; 
        console.log("expense Data", expenseData);
        try {
            const response = await axios.put(
                `/expenses/${id}`, // Use the `id` in the URL
                data // Pass the rest of the data in the body
            );
            console.log("Response", response);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

export default expenseApi; 