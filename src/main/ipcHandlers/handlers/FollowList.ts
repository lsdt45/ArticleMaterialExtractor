import axios from 'axios';

/**
 * 获取关注列表
 * @param event 事件
 * @param homePageUrl 主页地址
 */
async function getFollowList(event, homePageUrl: string) {
	const resp: any = await axios.get('https://www.toutiao.com/api/pc/user/following', {
		params: {
			cursor: 0,
			count: 20,
			token: 'MS4wLjABAAAA0sLlYmPICUjgI85aWJaD8PlXi6_2jKTRaqW7Wj3UNL98JxDrfJH4DTot4SAO4j5G',
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
	const reg = /token=(\w+)/;
	const res = reg.exec(url);
	return res ? res[1] : '';
}

export default { getFollowList };
