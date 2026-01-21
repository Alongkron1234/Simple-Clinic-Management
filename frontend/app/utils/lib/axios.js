import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // ใส่ URL ของ Node.js Server ของคุณที่นี่
});

export default api;