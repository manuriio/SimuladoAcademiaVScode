<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'


const router = useRouter()
const username = ref('')
const password = ref('')
const erro = ref('')


async function entrar() {
  try {
    await authService.login(username.value, password.value)
    router.push('/personal')
  } catch (e) {
    erro.value = 'Usuário ou senha inválidos.'
  }
}
</script>


<template>
  <form @submit.prevent="entrar">
    <input v-model="username" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Senha" required />
    <button type="submit">Entrar</button>
    <p v-if="erro">{{ erro }}</p>
  </form>
</template>