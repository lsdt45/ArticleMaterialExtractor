<template>
	<div class="author-follow__wrapper main-view">
		<div class="author-follow-top">
			<back-button></back-button>
		</div>
		<div class="author-follow__btns">
			<n-button class="add-follow" type="primary" @click="openAddFollow"> 添加关注 </n-button>
			<n-button type="primary" @click="openAddFollow"> 刷新列表 </n-button>
		</div>
		<div class="author-follow__list">
			<n-data-table
				:columns="tableColumns"
				:data="authorListData"
				:pagination="false"
				:bordered="true"
				:style="{ height: `calc(100vh - 200px)` }"
				flex-height />
		</div>
	</div>
</template>

<script setup lang="ts">
	import BackButton from '@renderer/components/BackButton.vue';
	import AddFollowDialog from '@renderer/components/AuthorFollow/AddFollowDialog.vue';
	import ArticleContentDialog from '@renderer/components/AuthorFollow/ArticleContentDialog.vue';
	import { RendererFollowListItem, MainFollowListItem } from 'src/types/FollowList';
	import { useStore } from '@renderer/store/index';
	import { NButton, NTag } from 'naive-ui';
	import { SettingsEnum } from 'src/common/CommonVars';
	const followList = ref<MainFollowListItem[]>([]);
	const dialog = useDialog();
	const store = useStore();
	// 输入的作者主页链接
	let authorHomePageUrl = ref('');
	let tableColumns = [
		{
			title: '作者',
			key: 'author',
		},
		{
			title: '平台',
			key: 'platform',
		},
		{
			title: '内容更新',
			key: 'contentUpdate',
			render(row: RendererFollowListItem) {
				const tags = [
					h(
						NTag,
						{
							type: 'error',
						},
						{ default: () => '有更新' }
					),
					h(
						NTag,
						{
							type: 'error',
						},
						{ default: () => '未更新' }
					),
				];
				return row.contentUpdate === '有更新' ? tags[0] : tags[1];
			},
		},
		{
			title: '操作',
			key: 'action',
			render(row: RendererFollowListItem) {
				const btns = [
					h(
						NButton,
						{
							type: 'primary',
							size: 'small',
							style: 'margin-right: 10px;',
							onClick() {
								openArticleContentDialog(row);
							},
						},
						{ default: () => '查看' }
					),
					h(NButton, { type: 'error', size: 'small' }, { default: () => '删除' }),
				];
				return btns;
			},
		},
	];
	// 作者列表数据
	let authorListData = ref<RendererFollowListItem[]>([]);
	/**
	 * @description: 打开添加关注对话框
	 */
	function openAddFollowDialog() {
		dialog.create({
			title: '添加关注',
			style: { width: '600px' },
			class: 'add-follow-dialog',
			positiveText: '关注',
			onPositiveClick: confirm,
			content: () =>
				h(AddFollowDialog, {
					onUpdate: (val: string) => {
						authorHomePageUrl.value = val;
					},
				}),
		});
	}
	/**
	 * @description: 打开添加关注对话框
	 */
	function openArticleContentDialog(articleData: RendererFollowListItem) {
		dialog.create({
			title: `${articleData.platform}-${articleData.author}`,
			style: { width: '800px' },
			class: 'article-content-dialog',
			onPositiveClick: confirm,
			content: () =>
				h(ArticleContentDialog, {
					userId: articleData.user_id,
				}),
		});
	}
	/**
	 * 获取关注列表
	 */
	async function getFollowList(url: string) {
		followList.value = await window.api.followList.getFollowList(url);
		authorListData.value = followList.value.map((item) => {
			return {
				author: item.name,
				platform: '头条号',
				contentUpdate: '有更新',
				fans: item.fans,
				user_id: item.user_id,
			};
		});
	}

	/**
	 * @description: 确认添加关注
	 */
	async function confirm() {
		await getFollowList(authorHomePageUrl.value);
		store.saveSettings(SettingsEnum.homePageUrl, authorHomePageUrl.value);
	}

	function openAddFollow() {
		openAddFollowDialog();
	}

  onMounted(() => {
    getFollowList(store.settings?.homePageUrl ?? '');
  })
</script>

<style lang="scss">
	.author-follow__wrapper {
		.add-follow {
			margin-right: 1em;
		}
		.author-follow__list {
			margin-top: 1em;
		}
	}
</style>
