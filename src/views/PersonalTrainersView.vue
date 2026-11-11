<script setup>
import { ref, onMounted } from 'vue'
import personalService from '@/services/personalService'
import { mensagemErro } from '@/utils/erro'


const personais = ref([])
const termo = ref('')
const carregando = ref(false)
const erro = ref('')
const sucesso = ref('')


const formVazio = { nome: '', cpf: '', email: '' }
const form = ref({ ...formVazio })
const editandoId = ref(null)


async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    const { data } = await personalService.listar(termo.value.trim() || undefined)
    personais.value = data
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao carregar os personais.')
  } finally {
    carregando.value = false
  }
}


function limparBusca() {
  termo.value = ''
  carregar()
}


function editar(p) {
  editandoId.value = p.id
  form.value = { nome: p.nome, cpf: p.cpf, email: p.email }
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
  try {
    if (editandoId.value) {
      await personalService.atualizar(editandoId.value, form.value)
      sucesso.value = 'Personal atualizado.'
    } else {
      await personalService.criar(form.value)
      sucesso.value = 'Personal cadastrado.'
    }
    cancelarEdicao()
    await carregar()
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao salvar o personal.')
  }
}


async function excluir(p) {
  if (!confirm(`Excluir o personal ${p.nome}?`)) return
  erro.value = ''
  sucesso.value = ''
  try {
    await personalService.excluir(p.id)
    sucesso.value = 'Personal excluído.'
    await carregar()
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao excluir o personal.')
  }
}


onMounted(carregar)
</script>


<template>
  <main class="page">
    <h1>Personal Trainers</h1>
    <p class="muted">Busque por nome, e-mail ou CPF.</p>


    <p v-if="erro" class="msg-erro" role="alert">{{ erro }}</p>
    <p v-if="sucesso" class="msg-ok" role="status">{{ sucesso }}</p>


    <section class="card">
      <h2>{{ editandoId ? 'Editar personal' : 'Novo personal' }}</h2>
      <form class="form-grid" @submit.prevent="salvar">
        <label>Nome
          <input v-model="form.nome" required />
        </label>
        <label>CPF
          <input v-model="form.cpf" required placeholder="000.000.000-00" />
        </label>
        <label>E-mail
          <input v-model="form.email" type="email" required />
        </label>
        <div class="acoes">
          <button type="submit">{{ editandoId ? 'Salvar alterações' : 'Cadastrar' }}</button>
          <button v-if="editandoId" type="button" class="sec" @click="cancelarEdicao">Cancelar</button>
        </div>
      </form>
    </section>


    <section class="card">
      <form class="form-grid" @submit.prevent="carregar">
        <label>Buscar personal
          <input v-model="termo" placeholder="Digite um nome, e-mail ou CPF" />
        </label>
        <div class="acoes">
          <button type="submit">Buscar</button>
          <button type="button" class="sec" @click="limparBusca">Limpar</button>
        </div>
      </form>
    </section>


    <section class="card">
      <p v-if="carregando" class="vazio">Carregando...</p>
      <p v-else-if="!personais.length" class="vazio">Nenhum personal encontrado.</p>
      <div v-else class="tabela-wrap">
        <table>
          <thead>
            <tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Ações</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in personais" :key="p.id">
              <td>{{ p.nome }}</td>
              <td>{{ p.cpf }}</td>
              <td>{{ p.email }}</td>
              <td>
                <div class="acoes">
                  <button class="sec" @click="editar(p)">Editar</button>
                  <button class="perigo" @click="excluir(p)">Excluir</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>