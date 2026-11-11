import api from './api'


export default {
  listar: () => api.get('/personal'),
  criar: (dados) => api.post('/personal', dados),
  atualizar: (id, dados) => api.put(`/personal/${id}`, dados),
  excluir: (id) => api.delete(`/personal/${id}`)
}