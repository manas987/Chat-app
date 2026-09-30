const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3100';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  WS_URL: WS_URL,
  ENDPOINTS: {
    SIGNIN: `${API_BASE_URL}/signin`,
    SIGNUP: `${API_BASE_URL}/signup`,
    USERS_SEARCH: `${API_BASE_URL}/users`,
  },
};
