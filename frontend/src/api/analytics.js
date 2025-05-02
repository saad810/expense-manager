import { axios } from "../utils/axios";

const AnalyticsApi = {
    getAnalyticsOne: () => axios.get("/analytics"),
    getAnalyticsTwo: () => axios.get("/analytics/spending"),
}

export default AnalyticsApi;