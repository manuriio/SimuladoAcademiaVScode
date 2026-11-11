<script setup>
import { computed } from 'vue'


const usuario = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('usuario')) || {}
  } catch {
    return {}
  }
})
</script>


<template>
  <main class="page">
    <h1>Olá, {{ usuario.nome || 'usuário' }}</h1>
    <p class="muted">Escolha o que você quer gerenciar.</p>


    <div class="atalhos">
      <RouterLink to="/personaltrainers">


      </RouterLink>
      <RouterLink to="/alunos">
      </RouterLink>
      <RouterLink to="/agendamentos">
      </RouterLink>
    </div>
  </main>
</template>