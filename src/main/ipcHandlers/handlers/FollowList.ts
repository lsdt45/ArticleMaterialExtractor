import axios from 'axios';

/**
 * 获取关注列表
 * @param event 事件
 * @param homePageUrl 主页地址
 */
async function getFollowList(event, homePageUrl: string) {
	const token = getToken(homePageUrl);
	const resp: any = await axios.get('https://www.toutiao.com/api/pc/user/following', {
		params: {
			cursor: 0,
			count: 20,
			token: token,
		},
	});
	return JSON.stringify(resp.data);
}

/**
 * 获取文章
 * @param event 事件
 * @param userId 用户id
 */
async function getArticleList(event, userId: string) {
	const resp: any = await axios.get('https://www.toutiao.com/api/pc/list/user/feed', {
		params: {
			category: 'profile_all',
			token: userId,
			max_behot_time: 0,
			aid: 24,
			app_name: 'toutiao_web',
		},
	});
	return JSON.stringify(resp.data);
}

/**
 * @description: 提取链接中的token
 * @param {string} url
 * @return {string} token
 */
function getToken(url: string) {
	const reg = /token\/(.+)(?=\/\?)/g;
	const res = reg.exec(url);
	return res ? res[1] : '';
}

export default { getFollowList, getArticleList };
