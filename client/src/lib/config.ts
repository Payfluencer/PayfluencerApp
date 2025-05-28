import axios from 'axios';

export let serverUrl = "http://localhost:8001/api/v1/user/refresh";

export const apiBase = axios.create({
	baseURL: `${serverUrl}/api/v1`,
	withCredentials: true,
});
