<script setup>
import { ref, computed, onMounted } from 'vue'
import agendamentoService from '@/services/agendamentoService'
import alunoService from '@/services/alunoService'
import { mensagemErro } from '@/utils/erro'


const agendamentos = ref([])
const alunos = ref([])
const carregando = ref(false)
const erro = ref('')
const sucesso = ref('')


const novo = ref({ alunoId: '', dataHora: '', servico: '' })


const editandoId = ref(null)
const novaData = ref('')


const ordenados = computed(() =>
  [...agendamentos.value].sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
)


const alunoSelecionado = computed(() => alunos.value.find((a) => a.id === novo.value.alunoId))


function formatar(dataHora) {
  return new Date(dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}


function paraInput(dataHora) {
  return String(dataHora).slice(0, 16)
}


async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    const [resAg, resAlunos] = await Promise.all([agendamentoService.listar(), alunoService.listar()])
    agendamentos.value = resAg.data
    alunos.value = resAlunos.data
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao carregar os agendamentos.')
  } finally {
    carregando.value = false
  }
}


async function criar() {
  erro.value = ''
  sucesso.value = ''
  const aluno = alunoSelecionado.value
  if (!aluno) {
    erro.value = 'Selecione um aluno.'
    return
  }
  try {
    await agendamentoService.criar({
      alunoId: aluno.id,
      personalId: aluno.personalId,
      dataHora: novo.value.dataHora,
      servico: novo.value.servico
    })
    novo.value = { alunoId: '', dataHora: '', servico: '' }
    sucesso.value = 'Agendamento criado.'
    await carregar()
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao criar o agendamento.')
  }
}


function iniciarEdicao(a) {
  editandoId.value = a.id
  novaData.value = paraInput(a.dataHora)
  erro.value = ''
  sucesso.value = ''
}


async function salvarData(a) {
  erro.value = ''
  try {
    await agendamentoService.atualizar(a.id, {
      dataHora: novaData.value,
      servico: a.servico,
      personalId: a.personal.id,
      alunoId: a.aluno.id
    })
    editandoId.value = null
    sucesso.value = 'Data atualizada.'
    await carregar()
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao atualizar a data.')
  }
}


async function excluir(a) {
  if (!confirm('Excluir este agendamento?')) return
  erro.value = ''
  sucesso.value = ''
  try {
    await agendamentoService.excluir(a.id)
    sucesso.value = 'Agendamento excluído.'
    await carregar()
  } catch (e) {
    erro.value = mensagemErro(e, 'Erro ao excluir o agendamento.')
  }
}


onMounted(carregar)
</script>


<template>
  <main class="page">
    <h1>Agendamentos</h1>
    <p class="muted">Treinos marcados, do mais próximo ao mais distante.</p>


    <p v-if="erro" class="msg-erro" role="alert">{{ erro }}</p>
    <p v-if="sucesso" class="msg-ok" role="status">{{ sucesso }}</p>


    <section class="card">
      <h2>Novo agendamento</h2>
      <form class="form-grid" @submit.prevent="criar">
        <label>Aluno
          <select v-model="novo.alunoId" required>
            <option value="" disabled>Selecione um aluno</option>
            <option v-for="a in alunos" :key="a.id" :value="a.id">{{ a.nome }}</option>
          </select>
        </label>
        <label>Personal do aluno
          <input :value="alunoSelecionado ? 'Vinculado automaticamente' : ''" disabled />
        </label>
        <label>Serviço
          <input v-model="novo.servico" required placeholder="Ex.: Treino de força" />
        </label>
        <label>Data e hora
          <input v-model="novo.dataHora" type="datetime-local" required />
        </label>
        <div class="acoes">
          <button type="submit">Agendar</button>
        </div>
      </form>
    </section>


    <section class="card">
      <p v-if="carregando" class="vazio">Carregando...</p>
      <p v-else-if="!ordenados.length" class="vazio">Nenhum agendamento cadastrado.</p>
      <div v-else class="tabela-wrap">
        <table>
          <thead>
            <tr><th>Data e hora</th><th>Serviço</th><th>Personal</th><th>Aluno</th><th>Ações</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in ordenados" :key="a.id">
              <td>
                <template v-if="editandoId === a.id">
                  <input v-model="novaData" type="datetime-local" aria-label="Nova data e hora" />
                </template>
                <template v-else>{{ formatar(a.dataHora) }}</template>
              </td>
              <td>{{ a.servico }}</td>
              <td>
                {{ a.personal?.nome }}
                <small>{{ a.personal?.email }}</small>
                <small>CPF {{ a.personal?.cpf }}</small>
              </td>
              <td>
                {{ a.aluno?.nome }}
                <small>{{ a.aluno?.email }}</small>
                <small>{{ a.aluno?.telefone }}</small>
              </td>
              <td>
                <div class="acoes">
                  <template v-if="editandoId === a.id">
                    <button @click="salvarData(a)">Salvar data</button>
                    <button class="sec" @click="editandoId = null">Cancelar</button>
                  </template>
                  <template v-else>
                    <button class="sec" @click="iniciarEdicao(a)">Alterar data</button>
                    <button class="perigo" @click="excluir(a)">Excluir</button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>