<template>
	<div class="article-content__wrapper">
		<div class="article-content__body">
			<n-data-table
				:columns="tableColumns"
				:data="articleListData"
				:pagination="false"
				:bordered="true"
				:style="{ height: `calc(100vh - 200px)` }"
				flex-height />
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { DataTableColumn } from 'naive-ui';
	import { FollowArticleListItem } from 'src/types/FollowList';
	import ArticleTitle from './ArticleTitle.vue';
	const props = defineProps({
		userId: {
			type: String,
			required: true,
		},
	});
	let tableColumns: DataTableColumn<any>[] = [
		{
			title: '标题',
			key: 'title',
			width: 430,
			ellipsis: {
				tooltip: true,
			},
			render(row: FollowArticleListItem) {
				return h(ArticleTitle, {
					data: row,
				});
			},
		},
		{
			title: '类型',
			key: 'type',
		},
		{
			title: '发布时间',
			key: 'publish_time',
			defaultSortOrder: 'descend',
			sorter: (row1: FollowArticleListItem, row2: FollowArticleListItem) => {
				return new Date(row1.publish_time).getTime() - new Date(row2.publish_time).getTime();
			},
		},
		{
			title: '操作',
			key: 'action',
		},
	];
	let articleListData = ref<FollowArticleListItem[]>([]);

	/**
	 * 获取文章列表
	 */
	async function getArticleList() {
		const resp = await window.api.followList.getArticleList(props.userId);
		articleListData.value = resp
			.map((item) => {
				if (!item.itemCell) return {} as FollowArticleListItem;
				return {
					title: item.title,
					article_url: item.article_url,
					type: '头条号',
					publish_time: new Date(Number(item.publish_time) * 1000).toLocaleDateString(),
					itemCell: {
						itemCounter: {
							showCount: item.itemCell.itemCounter.showCount,
							readCount: item.itemCell.itemCounter.readCount,
							repinCount: item.itemCell.itemCounter.repinCount,
							commentCount: item.itemCell.itemCounter.commentCount,
							shareCount: item.itemCell.itemCounter.shareCount,
						},
					},
				};
			})
			.filter((item) => item.title);
	}

	onMounted(() => {
		getArticleList();
	});
</script>

<style lang="scss"></style>
