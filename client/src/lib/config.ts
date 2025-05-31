import axios from 'axios';

export let serverUrl = process.env.VITE_SERVER_URL || "http://localhost:8001";

export const apiBase = axios.create({
	baseURL: `${serverUrl}/api/v1`,
	withCredentials: true,
});
