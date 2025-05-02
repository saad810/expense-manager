// axios.js
import Axios from 'axios';

export const axios = Axios.create({
  baseURL: "http://localhost:8000",
});

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log({ error });
    return Promise.reject(error);
  }
);
