<template>
	<div class="home__wrapper">
		<div class="home-top">
			<article-search @get-list="getList"></article-search>
			<div class="iconfont icon-shezhi" title="设置" @click="openSetting"></div>
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

	function openSetting() {
		settingMainRef.value?.openDialog();
	}
</script>

<style lang="scss">
	.home__wrapper {
		padding: 20px;
		.icon-shezhi {
			position: relative;
			left: 1em;
			flex: 1;
			cursor: pointer;
			&::before {
				color: $main-color;
				font-size: 23px;
				position: absolute;
			}
		}
		.home-top {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
