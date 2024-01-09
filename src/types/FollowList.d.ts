export interface MainFollowListItem {
	avatar_url: string; // 头像
	name: string; // 关注的人的名称
	user_id: string; // 关注的人的id
	fans: string; // 粉丝数
}

export interface RendererFollowListItem {
	author: string; // 作者
	platform: string; // 平台
	contentUpdate: string; // 是否有更新
	fans: string; // 粉丝数
}
declare global {
	type GlobalFollowListItem = MainFollowListItem;
}

