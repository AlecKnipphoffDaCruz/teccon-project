import axios from "axios";

// Injeta o token JWT em TODAS as requisições automaticamente
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Redireciona para login se o token expirar (401)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Sem export — apenas registra os interceptors na instância global do axios
// Todos os services que fazem `import axios from "axios"` serão afetados
// desde que este arquivo seja importado antes deles (no main.tsx)