import { NButton } from 'naive-ui';
export enum LoadType {
	GET_DATA = 'GET_DATA',
	EXTRACT_DATA = 'EXTRACT_DATA',
}
export interface ArticleData {
	title: string;
	url: string;
	author: string;
	commentNum: string;
	date: string;
	isExtracted: boolean; // 是否已经提取过文章内容
}
export interface SearchInfo {
	keyword: string;
	pageIndex: string;
}
// 是否显示获取数据的弹窗
export let showModal = ref(false);
// 是否显示加载中
export let showLoading = ref(false);
// 加载数据的类型
export let loadType = ref<LoadType>(LoadType.GET_DATA);
export let tableColumns = [
	{
		title: '标题',
		key: 'title',
	},
	{
		title: '文章链接',
		key: 'url',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '作者',
		key: 'author',
	},
	{
		title: '评论数',
		key: 'commentNum',
		sorter: (row1: ArticleData, row2: ArticleData) => Number(row1.commentNum) - Number(row2.commentNum),
	},
	{
		title: '发布日期',
		key: 'date',
	},
	{
		title: '操作',
		key: 'actions',
		render(row: ArticleData) {
			return h(
				NButton,
				{
					type: 'primary',
					size: 'small',
					onClick: () => {
						showLoading.value = true;
						window.api.extractArticleContent(row.url, row.title);
					},
				},
				{ default: () => (row.isExtracted ? '已提取' : '提取') }
			);
		},
	},
];

// 要搜索的关键词和要获取的页数
export let searchInfo = ref<SearchInfo>({
	keyword: '',
	pageIndex: '',
});
