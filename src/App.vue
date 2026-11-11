<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/authService'


const route = useRoute()
const router = useRouter()


// A navbar só aparece em rotas que não são públicas
const mostrarNavbar = computed(() => !route.meta.public)


function sair() {
  authService.logout()
  router.push({ name: 'login' })
}
</script>


<template>
  <header v-if="mostrarNavbar">
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/alunos">Alunos</RouterLink>
        <RouterLink to="/agendamentos">Agendamentos</RouterLink>
        <RouterLink to="/personaltrainers">Personal Trainers</RouterLink>
        <button @click="sair">Sair</button>
      </nav>
    </div>
  </header>


  <RouterView />
</template>