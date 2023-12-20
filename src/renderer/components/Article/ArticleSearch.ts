export interface ArticleData {
	title: string;
	url: string;
	author: string;
	commentNum: string;
	date: string;
}

export let tableColumns = [
	{
		title: '标题',
		key: 'title',
	},
	{
		title: '文章链接',
		key: 'url',
	},
	{
		title: '作者',
		key: 'author',
	},
	{
		title: '评论数',
		key: 'commentNum',
	},
	{
		title: '发布日期',
		key: 'date',
	},
];
