import axios from 'axios';
const apikey = "pub_84444f5d95e54955e2aefe372a5cea5e79684"
const newsApi = {
    getNews: () => axios.get(`https://newsdata.io/api/1/news?apikey=${apikey}&q=expense%20management`),
}

export default newsApi; 