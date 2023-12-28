<template>
	<div class="home__wrapper">
		<div class="home-top">
			<article-search @get-list="getList"></article-search>
			<div class="setting-btn__wrapper">
				<n-tooltip trigger="hover" placement="bottom-end" :show-arrow="false">
					<template #trigger>
						<span class="iconfont icon-folderOpen" @click="openFolder"></span>
					</template>
					打开输出文件夹
				</n-tooltip>
				<n-tooltip trigger="hover" placement="bottom-end" :show-arrow="false">
					<template #trigger>
						<span class="iconfont icon-shezhi" @click="openSetting"></span>
					</template>
					设置
				</n-tooltip>
			</div>
		</div>
		<article-result ref="articleResultRef"></article-result>
		<setting-main ref="settingMainRef"></setting-main>
	</div>
</template>

<script setup lang="ts">
	import ArticleSearch from '@renderer/components/Article/ArticleSearch.vue';
	import ArticleResult from '@renderer/components/Article/ArticleResult.vue';
	import SettingMain from '@renderer/components/Setting/SettingMain.vue';

	const articleResultRef = ref<InstanceType<typeof ArticleResult>>();
	const settingMainRef = ref<InstanceType<typeof SettingMain>>();
	function getList() {
		articleResultRef.value?.getList();
	}

	/**
	 * @description: 打开输出文件夹
	 */
	function openFolder() {}

	/**
	 * @description: 打开设置
	 */
	function openSetting() {
		settingMainRef.value?.openDialog();
	}
</script>

<style lang="scss">
	.home__wrapper {
		padding: 20px;
		.icon-shezhi,
		.icon-folderOpen {
			position: relative;
			left: 1em;
			flex: 1;
			display: inline-block;
			width: 23px;
			height: 36px;
			cursor: pointer;
			&::before {
				color: $main-color;
				font-size: 23px;
				position: absolute;
			}
		}
		.icon-folderOpen {
			margin-right: 0.5em;
			&::before {
				font-size: 22px;
			}
		}
		.home-top {
			display: flex;
			justify-content: space-between;
			.setting-btn__wrapper {
				flex: 1;
			}
		}
	}
</style>
