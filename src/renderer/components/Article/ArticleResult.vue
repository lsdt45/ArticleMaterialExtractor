<template>
	<div class="article-result__wrapper">
		<n-spin :show="showLoading" size="large">
			<div class="result-area">
				<n-data-table
					:columns="tableColumns"
					:data="articleListData"
					:pagination="false"
					:bordered="true"
					:row-props="rowProps"
					:style="{ height: `calc(100vh - 200px)` }"
					flex-height />
				<n-dropdown
					placement="bottom-start"
					trigger="manual"
					:x="x"
					:y="y"
					:options="dropDownOptions"
					:show="showDropdown"
					:on-clickoutside="onClickoutside"
					@select="handleSelect" />
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
	import { type ArticleData, LoadType, tableColumns, showModal, loadType, searchInfo, showLoading } from './ArticleSearch';
	import { ArticleEvent } from 'src/common/ArticleEvent';
	import type { DropdownOption } from 'naive-ui';
	const dropDownOptions: DropdownOption[] = [
		{
			label: '打开链接',
			key: 'openUrl',
		},
	];
	const x = ref(0);
	const y = ref(0);
	const message = useMessage();
	const { ipcRenderer } = window.electron;
	// 文章列表数据
	let articleListData = ref<ArticleData[]>([]);
	// 是否显示下拉菜单
	let showDropdown = ref(false);
	// 获取数据的进度
	let percentage = ref(0);
	// 当前右键点击的行的数据
	let contextMenuRow: ArticleData = {} as ArticleData;
	/**
	 * @description: 获取数据
	 */
	async function getList() {
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
	 * @description: 获取文章列表数据
	 */
	async function getArticleSearchList() {
		// 异常处理
		if (searchInfo.value.keyword === '') {
			message.error('请输入关键词');
			return;
		}
		if (searchInfo.value.pageIndex === '') {
			searchInfo.value.pageIndex = '1';
		}

		let data = await window.api.getArticleSearchList(JSON.stringify(searchInfo.value));
		articleListData.value = handleData(data);
	}
	/**
	 * @description: 点击下拉菜单区域外
	 */
	function onClickoutside() {
		showDropdown.value = false;
	}

	/**
	 * @description: 给每行设置右键菜单
	 */
	function rowProps(row: ArticleData) {
		return {
			onContextmenu: (e: MouseEvent) => {
				e.preventDefault();
				showDropdown.value = false;
				nextTick().then(() => {
					showDropdown.value = true;
					x.value = e.clientX;
					y.value = e.clientY;
					contextMenuRow = row;
				});
			},
		};
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
	 * @description: 下拉菜单选项点击事件
	 * @param {string} key 选项的key
	 */
	function handleSelect(key: string) {
		window.api.openUrl(contextMenuRow.url);
		showDropdown.value = false;
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

	defineExpose({ getList });

	onMounted(() => {
		listenProgress();
		listenArticleExtract();
	});
</script>

<style lang="scss">
	.article-result__wrapper {
		.n-data-table-th {
			user-select: none;
		}
	}
</style>
../../../common/ArticleEvent
