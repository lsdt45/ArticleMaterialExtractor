<template>
	<div class="home__wrapper">
		<div class="home-entry-item__containner">
			<home-entry-item v-for="item in homeEntryList" :key="item.title" :home-item="item" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import HomeEntryItem from '@renderer/components/Home/HomeEntryItem.vue';
	import type { HomeEntryItemType } from '@renderer/components/Home/HomeType';

	const homeEntryList: HomeEntryItemType[] = [
		{
			icon: 'iconfont icon-article-extract',
			title: '文章提取',
			route: '/article_extract',
		},
		{
			icon: 'iconfont icon-follow-list',
			title: '关注列表',
			route: '/author_follow',
		},
	];
</script>

<style lang="scss">
	.home__wrapper {
		height: calc(100vh - 40px);
		padding: 2em 0 0 2em;
		.home-entry-item__containner {
			display: grid;
			grid-template-columns: repeat(auto-fill, 220px);
			grid-gap: 2em;
		}
	}
</style>
