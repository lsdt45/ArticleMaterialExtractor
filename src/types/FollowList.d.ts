export interface MainFollowListItem {
	avatar_url: string; // 头像
	name: string; // 关注的人的名称
	user_id: string; // 关注的人的id
	fans: string; // 粉丝数
}

// 关注列表的数据接口
export interface RendererFollowListItem {
	author: string; // 作者
	platform: string; // 平台
	contentUpdate: '有更新' | '未更新'; // 更新状态
	fans: string; // 粉丝数
	user_id: string; // 关注的人的id
}

// 关注的人的文章列表数据接口
export interface FollowArticleListItem {
	title: string; // 文章标题
	article_url: string; // 文章链接
	type: string; // 文章类型
	publish_time: string; // 发布时间
  itemCell: {
    itemCounter: ArticleInfo;
  }
}

export interface ArticleInfo {
	showCount: number; // 展现量
	readCount: number; // 阅读数
	commentCount: number; // 评论数
	repinCount: number; // 转发数
	shareCount: number; // 分享数
}
declare global {
	type GlobalFollowListItem = MainFollowListItem;
	type GlobalFollowArticleListItem = FollowArticleListItem;
}
