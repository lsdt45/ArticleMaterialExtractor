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
	import AddFollowDialog from './AddFollowDialog.vue';
	import { RendererFollowListItem, MainFollowListItem } from 'src/types/FollowList';
	const followList = ref<MainFollowListItem[]>([]);
	const dialog = useDialog();

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
		},
		{
			title: '操作',
			key: 'action',
		},
	];
	// 作者列表数据
	let authorListData = ref<RendererFollowListItem[]>([]);
	/**
	 * @description: 打开添加关注对话框
	 */
	function openDialog() {
		dialog.create({
			title: '添加关注',
			style: { width: '600px' },
			class: 'add-follow-dialog',
			positiveText: '关注',
			onPositiveClick: confirm,
			content: () => h(AddFollowDialog),
		});
	}
	/**
	 * 获取关注列表
	 */
	async function getFollowList() {
		// followList.value = await window.api.followList.getFollowList();
	}

	/**
	 * @description: 确认添加关注
	 */
	function confirm() {
		console.log('confirm');
	}

	function openAddFollow() {
		openDialog();
	}

	onMounted(async () => {
		await getFollowList();
	});
</script>

<style lang="scss">
	.author-follow__wrapper {
		.add-follow {
			margin-right: 1em;
		}
	}
</style>
