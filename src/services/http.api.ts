import axios from 'axios';

import { Env } from '@/Env';

export const httpApi = axios.create({
  baseURL: Env.VITE_DOG_API_BASE_URL,
  timeout: 10_000,
  headers: {
    'x-api-key': Env.VITE_DOG_API_KEY,
  },
});
