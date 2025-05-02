import { axios } from '../utils/axios';
// import { toast } from 'react-toastify';

const categoryApi = {
    getCategories: () =>  axios.get('/categories'),
}

export default categoryApi; 