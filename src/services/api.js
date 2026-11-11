import axios from 'axios'


const api = axios.create({
  baseURL: 'https://localhost:7195/api', // troque pela porta da sua API
})


// Anexa o token JWT em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


// Se o token expirar (2h), volta para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)


export default api