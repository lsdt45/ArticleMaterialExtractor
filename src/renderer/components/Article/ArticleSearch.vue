<template>
	<div class="article-search__wrapper">
		<div class="search-area">
			<n-input v-model:value="searchInfo.keyword" class="input-keyword" type="text" size="small" placeholder="关键词" />
			<n-input v-model:value="searchInfo.pageIndex" class="input-pageindex" type="text" size="small" placeholder="要获取的页数" />
			<n-button type="primary" @click="getList"> 获取列表 </n-button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import _ from 'lodash';
	import { searchInfo } from './ArticleSearch';
	const emit = defineEmits(['getList']);

	function getList() {
		emit('getList');
	}
</script>

<style lang="scss">
	.article-search__wrapper {
		.search-area {
			display: flex;
			margin-bottom: 20px;
			.input-keyword,
			.input-pageindex {
				margin-right: 2em;
			}
			.n-input__input {
				display: flex;
				align-items: center;
			}
		}
	}
</style>
