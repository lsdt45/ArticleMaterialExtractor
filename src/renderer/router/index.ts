import { createRouter, createWebHashHistory } from 'vue-router';
const routes = [
	{ path: '', redirect: 'Home' },
	{ path: '/home', component: () => import('@renderer/views/Home.vue') },
	{ path: '/article_extract', component: () => import('@renderer/views/Article/ArticleExtract.vue') },
	{ path: '/author_follow', component: () => import('@renderer/views/AuthorFollow/AuthorFollow.vue') },
	{ path: '/version', component: () => import('@renderer/views/Version.vue') },
	{ path: '/:pathMatch(.*)', redirect: 'Home' },
];
const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
