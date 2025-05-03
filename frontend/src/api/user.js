import create from '@ant-design/icons/lib/components/IconFont';
import { axios } from '../utils/axios';
// import { toast } from 'react-toastify';

const userApi = {
    getStatus: () =>  axios.get('/users/status'),
    createUser: (data) => axios.post('/users', data),
    loginUser: (data) => axios.post('/users/login', data),
    updateUser: (data) => axios.put('/users', data),
    deleteUser: () => axios.delete(`/users`),
}

export default userApi; 