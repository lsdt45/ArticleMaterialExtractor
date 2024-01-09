import { ipcRenderer } from 'electron';

const followList = {
	getFollowList: async (homePageUrl: string) => {
		const resp = await ipcRenderer.invoke('getFollowList', homePageUrl);
    return JSON.parse(resp.data);
	},
};

export default { ...followList };
