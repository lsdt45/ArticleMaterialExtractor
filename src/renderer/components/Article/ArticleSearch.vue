<template>
	<div class="article-search__wrapper">
		<n-spin :show="showLoading" size="large">
			<div class="search-area">
				<n-input v-model:value="searchInfo.keyword" class="input-keyword" type="text" size="small" placeholder="影视名" />
				<n-input v-model:value="searchInfo.pageIndex" class="input-pageindex" type="text" size="small" placeholder="要获取的页数" />
				<n-button type="primary" @click="getData"> 提取数据 </n-button>
			</div>
			<div class="result-area">
				<n-data-table :max-height="500" :columns="tableColumns" :data="articleListData" :pagination="false" :bordered="true" />
			</div>
			<div class="loading-data">
				<n-modal :show="showModal">
					<n-card
						v-if="loadType === LoadType.GET_DATA"
						style="width: 600px"
						title="正在获取数据"
						size="huge"
						:bordered="false"
						role="dialog"
						aria-modal="true">
						<n-progress type="line" :percentage="percentage" :indicator-placement="'inside'" processing />
					</n-card>
				</n-modal>
			</div>
		</n-spin>
	</div>
</template>

<script setup lang="ts">
	import _ from 'lodash';
	import { ArticleEvent } from '../../../preload/ArticleCrawler/ArticleEvent';
	import { type ArticleData, type SearchInfo, LoadType, tableColumns, showModal, loadType, showLoading } from './ArticleSearch';

	const message = useMessage();
	const { ipcRenderer } = window.electron;

	// 要搜索的关键词和要获取的页数
	let searchInfo = ref<SearchInfo>({
		keyword: '',
		pageIndex: '',
	});
	// 文章列表数据
	let articleListData = ref<ArticleData[]>([]);
	// 获取数据的进度
	let percentage = ref(0);
	/**
	 * @description: 获取数据
	 */
	async function getData() {
		articleListData.value = [];
		// 显示进度条
		loadType.value = LoadType.GET_DATA;
		showModal.value = true;
		try {
			await getArticleSearchList();
		} catch (err) {
			console.error(err);
			message.error('获取数据失败，请重试');
		} finally {
			showModal.value = false;
			percentage.value = 0;
		}
	}

	/**
	 * @description: 数据的进一步处理
	 * @param {ArticleData} data 获取到的数据
	 * @return {ArticleData} 处理完的数据
	 */
	function handleData(data: ArticleData[]): ArticleData[] {
		// 筛选:
		// 1.不含author属性的成员
		data = data.filter((item: ArticleData) => {
			return item.author;
		});
		// 删除掉data.commentNum里的'评论'字样
		// 并给每个成员加上isExtracted属性
		data.forEach((item: ArticleData) => {
			item.commentNum = item.commentNum.replace('评论', '');
			item.isExtracted = false;
		});
		return data;
	}

	/**
	 * @description: 监听主进程发送的事件，更新进度条进度
	 */
	async function listenProgress() {
		ipcRenderer.on(ArticleEvent.ArticleSearchListProgress, (event, arg: number) => {
			percentage.value = Number(((arg / Number(searchInfo.value.pageIndex)) * 100).toFixed(0));
		});
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
			// 根据title，将对应的文章的isExtrated的值赋为true
			for (let article of articleListData.value) {
				if (article.title === title) {
					article.isExtracted = true;
				}
			}
			showLoading.value = false;
			message.success('提取成功！');
		});
	}

	/**
	 * @description: 获取文章列表数据
	 */
	async function getArticleSearchList() {
		let data = await window.api.getArticleSearchList(JSON.stringify(searchInfo.value));
		articleListData.value = handleData(data);
	}

	onMounted(() => {
		listenProgress();
		listenArticleExtract();
	});
</script>

<style lang="scss">
	.article-search__wrapper {
		padding: 20px;
		.search-area {
			display: flex;
			margin-bottom: 20px;
			.input-keyword,
			.input-pageindex {
				flex-basis: 20%;
				margin-right: 2em;
			}
			.n-input__input {
				display: flex;
				align-items: center;
			}
		}
	}
</style>
