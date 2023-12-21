export interface ArticleData {
	title: string;
	url: string;
	author: string;
	commentNum: string;
	date: string;
}
export interface SearchInfo {
	keyword: string;
	pageIndex: string;
}

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
];
