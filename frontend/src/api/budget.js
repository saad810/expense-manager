import { axios } from "../utils/axios";

const budgetApi = {
    getBudgets: () => axios.get("/budget"),
    createBudget: (data) => axios.post("/budget", data),
    updateBudget: async (budgetData) => {
        const { id, ...data } = budgetData; 
        console.log("Budget Data", budgetData);
        try {
            const response = await axios.put(
                `/budget/${id}`, // Use the `id` in the URL
                data // Pass the rest of the data in the body
            );
            console.log("Response", response);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteBudget: (id) => axios.delete(`/budget/${id}`),
}

export default budgetApi;