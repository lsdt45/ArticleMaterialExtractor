<template>
	<div class="article-title__wrapper">
		<div class="title-top">{{ data.title }}</div>
		<div class="title-bottom">
			<div class="article-title-item" v-for="item in articleInfo">
				<span>{{ item.label }}:</span>
				<span>{{ formatCount(data.itemCell.itemCounter[item.key]) }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { FollowArticleListItem } from 'src/types/FollowList';

	const articleInfo = [
		{
			label: '展现',
			key: 'showCount',
		},
		{
			label: '阅读',
			key: 'readCount',
		},
		{
			label: '评论',
			key: 'commentCount',
		},
		{
			label: '分享',
			key: 'shareCount',
		},
		{
			label: '转发',
			key: 'repinCount',
		},
	];

	const props = defineProps({
		data: {
			type: Object as PropType<FollowArticleListItem>,
			default: () => {},
		},
	});

	/**
	 * 格式化阅读量，大于1万的显示为x.xx万
	 * @param readCount  阅读量
	 * @return 格式化后的阅读量
	 */
	function formatCount(count: number) {
		if (count > 10000) {
			return `${(count / 10000).toFixed(2)}万`;
		} else {
			return count;
		}
	}
</script>

<style lang="scss">
	.article-title__wrapper {
		display: flex;
		flex-direction: column;
		.title-bottom {
			display: flex;
			.article-title-item {
				margin-right: 1em;
				color: #999;
			}
		}
	}
</style>
