<template>
	<div class="article-search__wrapper">
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
				<n-card style="width: 600px" title="正在获取数据" size="huge" :bordered="false" role="dialog" aria-modal="true">
					<n-progress type="line" :percentage="percentage" :indicator-placement="'inside'" processing />
				</n-card>
			</n-modal>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { type ArticleData, tableColumns } from './ArticleSearch';

	const message = useMessage();

	// 要搜索的关键词和要获取的页数
	let searchInfo = ref({
		keyword: '',
		pageIndex: '',
	});
	// 文章列表数据
	let articleListData = ref<ArticleData[]>([]);
	// 是否显示获取数据的弹窗
	let showModal = ref(false);
	// 获取数据的进度
	let percentage = ref(0);

	/**
	 * @description: 获取数据
	 */
	async function getData() {
		articleListData.value = [];
		// 显示进度条
		showModal.value = true;
		try {
			for (let i = 0; i < Number(searchInfo.value.pageIndex); i++) {
				await getArticleSearchList(i);
				percentage.value = Number((((i + 1) / Number(searchInfo.value.pageIndex)) * 100).toFixed(0));
			}
		} catch (err) {
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
		// 2.commentNum属性里包含'视频'的成员
		data = data.filter((item: ArticleData) => {
			return item.author && !item.commentNum.includes('视频');
		});
		return data;
	}

	async function getArticleSearchList(pageIndex = 0) {
		let url = `https://so.toutiao.com/search?dvpf=pc&source=pagination&keyword=${searchInfo.value.keyword}&pd=synthesis&action_type=pagination&from=search_tab&cur_tab_title=search_tab&filter_vendor=site&index_resource=site&filter_period=all&min_time=0&max_time=1703057141&page_num=${pageIndex}`;
		let data = await window.api.getArticleSearchList(url);
		data = handleData(data);
		articleListData.value = articleListData.value.concat(data);
	}
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
