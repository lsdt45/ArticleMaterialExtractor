<template>
	<div class="article-content__wrapper">
		<n-spin :show="showLoading" size="large">
			<div class="article-content__body">
				<n-data-table
					:columns="tableColumns"
					:data="articleListData"
					:pagination="false"
					:loading="loading"
					:bordered="true"
					:style="{ height: `calc(100vh - 200px)` }"
					flex-height />
			</div>
		</n-spin>
	</div>
</template>

<script setup lang="ts">
	import { NButton, type DataTableColumn } from 'naive-ui';
	import { FollowArticleListItem } from 'src/types/FollowList';
	import ArticleTitle from './ArticleTitle.vue';
	import dayjs from 'dayjs';
	import { ArticleEvent } from 'src/common/ArticleEvent';
	const props = defineProps({
		userId: {
			type: String,
			required: true,
		},
	});
	const message = useMessage();
	const { ipcRenderer } = window.electron;
	// 表格加载状态
	let loading = ref(false);
	// 页面加载状态
	let showLoading = ref(false);
	let tableColumns: DataTableColumn<any>[] = [
		{
			title: '标题',
			key: 'title',
			width: '60%',
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
			render(row: FollowArticleListItem) {
				const btns = [
					h(
						NButton,
						{
							type: 'primary',
							size: 'small',
							style: 'margin-right: 10px;',
							onClick: () => {
								showLoading.value = true;
								window.api.extractArticleContent(row.article_url, row.title);
							},
						},
						{ default: () => '提取' }
					),
					h(
						NButton,
						{
							type: 'error',
							size: 'small',
							onClick() {
								window.api.openUrl(row.article_url);
							},
						},
						{ default: () => '原文' }
					),
				];
				return btns;
			},
		},
	];
	let articleListData = ref<FollowArticleListItem[]>([]);

	/**
	 * 获取文章列表
	 */
	async function getArticleList() {
		// 开始加载
		loading.value = true;
		const resp = await window.api.followList.getArticleList(props.userId);
		articleListData.value = resp
			.map((item) => {
				if (!item.itemCell) return {} as FollowArticleListItem;
				return {
					title: item.title,
					article_url: item.article_url,
					publish_time: dayjs(Number(item.publish_time) * 1000).format('YYYY-MM-DD HH:mm:ss'),
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
		// 加载结束
		loading.value = false;
	}
	/**
	 * @description: 监听主进程发送的事件，更新文章提取进度
	 */
	async function listenArticleExtract() {
		ipcRenderer.on(ArticleEvent.ArticleExtractEnd, (event, title: string) => {
			if (!title) {
				message.error('提取失败，请重试！');
				return;
			}
			showLoading.value = false;
			message.success('提取成功！');
		});
	}
	onMounted(() => {
		getArticleList();
		listenArticleExtract();
	});
</script>

<style lang="scss"></style>
src/common/ArticleEvent
