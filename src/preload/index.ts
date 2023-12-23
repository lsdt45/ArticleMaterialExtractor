import { SearchInfo } from './../renderer/components/Article/ArticleSearch';
import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
	// 读取目录文件列表回调
	readDirReply: (callback) => {
		ipcRenderer.once('readDir-reply', (event, result) => {
			callback(event, result);
		});
	},
	getArticleSearchList: (SearchInfo: SearchInfo) => {
		return ipcRenderer.invoke('getArticleSearchList', SearchInfo);
	},
	extractArticleContent: (url: string, title: string) => {
		return ipcRenderer.invoke('extractArticleContent', url, title);
	},
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('electron', electronAPI);
		contextBridge.exposeInMainWorld('api', api);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-ignore (define in dts)
	window.electron = electronAPI;
	// @ts-ignore (define in dts)
	window.api = api;
}
