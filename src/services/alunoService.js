import api from './api'


export default {
  listar: () => api.get('/alunos'),
  criar: (dados) => api.post('/alunos', dados),
  atualizar: (id, dados) => api.put(`/alunos/${id}`, dados),
  excluir: (id) => api.delete(`/alunos/${id}`)
}