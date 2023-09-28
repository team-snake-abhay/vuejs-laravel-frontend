import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'home',
      },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/public/LoginPage.vue'),
        name: 'login',
        meta: { onlyUnauthorized: true },
      },
    ],
  },
  {
    path: '/reset-your-account',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/public/ResetPasswordPage.vue'),
        name: 'reset_account',
        meta: { onlyUnauthorized: true },
      },
    ],
  },
  {
    path: '/get-proplus-password',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/public/GetProPlusPasswordPage.vue'),
        name: 'get_proplus_account',
        meta: { onlyUnauthorized: true },
      },
    ],
  },

  {
    path: '/support',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/public/SupportPage.vue'),
        name: 'support',
      },
    ],
  },

  {
    path: '/story/:id?',
    component: () => import('layouts/EmbedLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/story/EmbedStory.vue'),
        name: 'publicStory',
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        name: 'dashboard',
      },
      {
        path: 'story',
        component: () => import('pages/story/StoryPage.vue'),
        name: 'story',
      },
      {
        path: 'story/new',
        component: () => import('src/pages/story/CreateStoryPage.vue'),
        name: 'newStory',
      },
      {
        path: 'training',
        component: () => import('src/pages/trainingPage.vue'),
        name: 'training',
      },
      {
        path: 'story/update/:id',
        component: () => import('src/pages/story/UpdateStoryPage.vue'),
        name: 'updateStory',
      },
      {
        path: 'user',
        component: () => import('src/pages/UserPage.vue'),
        name: 'user',
      },
      {
        path: 'upgrades',
        component: () => import('src/pages/UpgradePage.vue'),
        name: 'upgrades',
      },
      {
        path: 'user/story/:id',
        component: () => import('src/pages/story/StoryPage.vue'),
        name: 'viewStory',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
