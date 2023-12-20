import { createRouter, createWebHashHistory } from 'vue-router';
const routes = [
	{ path: '', redirect: 'Home' },
	{ path: '/home', component: () => import('@renderer/views/Home.vue') },
	{ path: '/version', component: () => import('@renderer/views/Version.vue') },
	{ path: '/:pathMatch(.*)', redirect: 'Home' },
];
const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
