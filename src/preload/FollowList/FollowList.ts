import { ipcRenderer } from 'electron';

const followList = {
	/**
	 * 获取关注列表
	 * @param {string} homePageUrl 主页地址
	 */
	getFollowList: async (homePageUrl: string) => {
		const resp = await ipcRenderer.invoke('getFollowList', homePageUrl);
		return JSON.parse(resp).data.data;
	},

	/**
	 * 获取文章列表
	 * @param {string} userId 用户id
	 */
	getArticleList: async (userId: string) => {
		const resp = await ipcRenderer.invoke('getArticleList', userId);
		return JSON.parse(resp).data;
	},
};

export default { ...followList };
