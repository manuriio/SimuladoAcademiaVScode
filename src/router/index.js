import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AlunosView from '@/views/AlunosView.vue'
import AgendamentosView from '@/views/AgendamentosView.vue'
import PersonalTrainersView from '@/views/PersonalTrainersView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue' // faltava este import


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/alunos',
      name: 'alunos',
      component: AlunosView,
      meta: { requiresAuth: true }
    },
    {
      path: '/agendamentos',
      name: 'agendamentos',
      component: AgendamentosView,
      meta: { requiresAuth: true }
    },
    {
      path: '/personaltrainers',
      name: 'personaltrainers',
      component: PersonalTrainersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { public: true }
    }
  ],
})


router.beforeEach((to) => {
  const logado = !!localStorage.getItem('token')


  // Não logado tentando acessar página protegida -> login
  if (to.meta.requiresAuth && !logado) {
    return { name: 'login' }
  }


  // Já logado tentando acessar login/register -> home
  if (to.meta.public && logado) {
    return { name: 'home' }
  }
})


export default router