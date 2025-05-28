import axios from 'axios';

export let serverUrl = "http://localhost:8001";

export const apiBase = axios.create({
	baseURL: `${serverUrl}/api/v1`,
	withCredentials: true,
});
