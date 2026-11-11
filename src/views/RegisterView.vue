<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import { mensagemErro } from '@/utils/erro'


const router = useRouter()
const form = ref({ nome: '', username: '', password: '', confirmar: '' })
const erro = ref('')
const enviando = ref(false)


async function cadastrar() {
  erro.value = ''
  if (form.value.password.length < 6) {
    erro.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }
  if (form.value.password !== form.value.confirmar) {
    erro.value = 'As senhas não coincidem.'
    return
  }


  enviando.value = true
  try {
    await authService.register({
      nome: form.value.nome,
      username: form.value.username,
      password: form.value.password
    })
    router.push({ name: 'login', query: { cadastrado: '1' } })
  } catch (e) {
    erro.value = mensagemErro(e, 'Não foi possível criar a conta.')
  } finally {
    enviando.value = false
  }
}
</script>


<template>
  <main class="auth">
    <div class="card">
      <h1>Criar conta</h1>
      <p class="muted">Cadastre-se para acessar o sistema da IronFit.</p>


      <p v-if="erro" class="msg-erro" role="alert">{{ erro }}</p>


      <form @submit.prevent="cadastrar">
        <label>Nome completo
          <input v-model="form.nome" required autocomplete="name" />
        </label>
        <label>Usuário
          <input v-model="form.username" required autocomplete="username" />
        </label>
        <label>Senha
          <input v-model="form.password" type="password" required autocomplete="new-password" />
        </label>
        <label>Confirmar senha
          <input v-model="form.confirmar" type="password" required autocomplete="new-password" />
        </label>
        <button type="submit" :disabled="enviando">{{ enviando ? 'Criando...' : 'Criar conta' }}</button>
      </form>


      <p class="muted" style="margin-top:16px">
        Já tem conta? <RouterLink :to="{ name: 'login' }">Entrar</RouterLink>
      </p>
    </div>
  </main>
</template>