import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Если это запрос на refresh или уже был retry - не обрабатываем
    if (originalRequest.url?.includes('/auth/refresh') || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (isRefreshing) {
        // Если уже идет refresh, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null, null);
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Если refresh не удался, очищаем авторизацию и перенаправляем на логин
        if (typeof window !== 'undefined') {
          // Импортируем authStore динамически
          import('../stores/authStore').then(({ useAuthStore }) => {
            const authStore = useAuthStore.getState();
            if (authStore.logout) {
              authStore.logout();
            }
            // Перенаправляем на страницу логина
            if (window.location.pathname !== '/auth/login') {
              window.location.href = '/auth/login';
            }
          }).catch(() => {
            // Если не удалось импортировать, просто перенаправляем
            if (window.location.pathname !== '/auth/login') {
              window.location.href = '/auth/login';
            }
          });
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;



