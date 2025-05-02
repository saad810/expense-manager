import { axios } from '../utils/axios';
// import { toast } from 'react-toastify';

const expenseApi = {
    getall: () => axios.get('/expenses'),
    createExpense: (data) => axios.post('/expenses', data),
    deleteExpense: (id) => axios.delete(`/expenses/${id}`),
}

export default expenseApi; 