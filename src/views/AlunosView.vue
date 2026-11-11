<script setup>
import { ref, onMounted } from 'vue'
import alunoService from '@/services/alunoService'
import personalService from '@/services/personalService'
import { mensagemErro } from '@/utils/erro'


const alunos = ref([])
const personais = ref([])
const carregando = ref(false)
const erro = ref('')
const sucesso = ref('')


const formVazio = { nome: '', email: '', telefone: '', personalId: '' }
const form = ref({ ...formVazio })
const editandoId = ref(null)


function nomeDoPersonal(id) {
  return personais.value.find((p) => p.id === id)?.nome ?? '-'
}


async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    const [resAlunos, resPersonais] = await Promise.all([
      alunoService.listar(),
      personalService.listar()
    ])
    alunos.value = resAlunos.data
    personais.value = resPersonais.data
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao carregar os dados.')
  } finally {
    carregando.value = false
  }
}


function editar(a) {
  editandoId.value = a.id
  form.value = { nome: a.nome, email: a.email, telefone: a.telefone, personalId: a.personalId }
  sucesso.value = ''
  erro.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


function cancelarEdicao() {
  editandoId.value = null
  form.value = { ...formVazio }
}


async function salvar() {
  erro.value = ''
  sucesso.value = ''
  if (!form.value.personalId) {
    erro.value = 'Associe o aluno a um personal.'
    return
  }
  const dados = { ...form.value, personalId: Number(form.value.personalId) }
  try {
    if (editandoId.value) {
      await alunoService.atualizar(editandoId.value, dados)
      sucesso.value = 'Aluno atualizado.'
    } else {
      await alunoService.criar(dados)
      sucesso.value = 'Aluno cadastrado.'
    }
    cancelarEdicao()
    await carregar()
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao salvar o aluno.')
  }
}


async function excluir(a) {
  if (!confirm(`Excluir o aluno ${a.nome}?`)) return
  erro.value = ''
  sucesso.value = ''
  try {
    await alunoService.excluir(a.id)
    sucesso.value = 'Aluno excluído.'
    await carregar()
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao excluir o aluno.')
  }
}


onMounted(carregar)
</script>


<template>
  <main class="page">
    <h1>Alunos</h1>
    <p class="muted">Todo aluno precisa estar vinculado a um personal.</p>


    <p v-if="erro" class="msg-erro" role="alert">{{ erro }}</p>
    <p v-if="sucesso" class="msg-ok" role="status">{{ sucesso }}</p>


    <section class="card">
      <h2>{{ editandoId ? 'Editar aluno' : 'Novo aluno' }}</h2>
      <form class="form-grid" @submit.prevent="salvar">
        <label>Nome
          <input v-model="form.nome" required />
        </label>
        <label>E-mail
          <input v-model="form.email" type="email" required />
        </label>
        <label>Telefone
          <input v-model="form.telefone" required placeholder="(13) 99999-9999" />
        </label>
        <label>Personal
          <select v-model="form.personalId" required>
            <option value="" disabled>Selecione um personal</option>
            <option v-for="p in personais" :key="p.id" :value="p.id">{{ p.nome }}</option>
          </select>
        </label>
        <div class="acoes">
          <button type="submit">{{ editandoId ? 'Salvar alterações' : 'Cadastrar' }}</button>
          <button v-if="editandoId" type="button" class="sec" @click="cancelarEdicao">Cancelar</button>
        </div>
      </form>
    </section>


    <section class="card">
      <p v-if="carregando" class="vazio">Carregando...</p>
      <p v-else-if="!alunos.length" class="vazio">Nenhum aluno cadastrado.</p>
      <div v-else class="tabela-wrap">
        <table>
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Personal</th><th>Ações</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in alunos" :key="a.id">
              <td>{{ a.nome }}</td>
              <td>{{ a.email }}</td>
              <td>{{ a.telefone }}</td>
              <td>{{ nomeDoPersonal(a.personalId) }}</td>
              <td>
                <div class="acoes">
                  <button class="sec" @click="editar(a)">Editar</button>
                  <button class="perigo" @click="excluir(a)">Excluir</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>