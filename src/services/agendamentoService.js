import api from './api'


export default {
  listar: () => api.get('/agendamentos'),
  criar: (dados) => api.post('/agendamentos', dados),
  atualizar: (id, dados) => api.put(`/agendamentos/${id}`, dados),
  excluir: (id) => api.delete(`/agendamentos/${id}`)
}