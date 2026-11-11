import api from './api'


export default {
  async login(username, password) {
    const { data } = await api.post('/auth/login', { username, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    return data
  },
  register(dados) {
    return api.post('/auth/register', dados)
  },
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  },
  estaLogado() {
    return !!localStorage.getItem('token')
  }
}