import axios from 'axios';

export const serverUrl = import.meta.env.VITE_SERVER_URL as string;

export const apiBase = axios.create({
	baseURL: `${serverUrl}/api/v1`,
	withCredentials: true,
});
