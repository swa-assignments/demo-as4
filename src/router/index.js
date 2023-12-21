import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/play',
  },
  {
    path: '/create-user',
    name: 'createUser',
    component: () => import('../views/CreateUserView.vue'),
  },
  {
    path: '/high-scores',
    name: 'highScores',
    component: () => import('../views/HighScoresView.vue'),
    meta: {
      requiresAuthentication: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/play',
    name: 'play',
    component: () => import('../views/PlayView.vue'),
    meta: {
      requiresAuthentication: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuthentication: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to?.meta?.requiresAuthentication) {
    if (!sessionStorage.getItem('token')) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
