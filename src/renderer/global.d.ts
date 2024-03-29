import { SearchInfo } from './components/Article/ArticleSearch';
import type { ElectronAPI } from '@electron-toolkit/preload';
import { StoreKey } from '../main/localStore/types';
interface api {
	readDirReply: (callback: (event: Event, result: { canceled: boolean }) => void) => void;
	getArticleSearchList: (searchInfo: string) => Promise<any>;
	extractArticleContent: (url: string, title: string) => Promise<string>;
	openUrl: (url: string) => Promise<string>;
	getDirPath: () => Promise<string>;
	/**
	 * @description: 更新store
	 * @param {any} store
	 */
	updateStore: (key: StoreKey, store: any) => Promise<any>;
	common: {
		/**
		 * @description: 把从渲染进程传来的 store，分别更新到主进程全局变量和本地存储
		 * @param {string} event 事件
		 * @param {StoreKey} key 要保存的键
		 * @param {string} store store
		 */
		updateStore: (key: StoreKey, store: string) => void;
		/**
		 * @description: 读取本地储存的数据，发送给渲染进程
		 */
		getLocalConfig: () => any;
		/**
		 * @description: 退出程序
		 */
		exitApp: () => void;
		/**
		 * @description: 最小化窗口
		 */
		minimizeWindow: () => void;
		/**
		 * @description: 最大化窗口
		 */
		maximizeWindow: () => void;
		/**
		 * @description: 取消最大化窗口
		 */
		unmaximizeWindow: () => void;
		/**
		 * @description: 接收主进程发送的消息
		 * @param {string} channel 事件
		 * @param {string} func 回调函数
		 */
		receiveMessage: (channel: string, func: Function) => void;
	};
	followList: {
		/**
		 * 获取关注列表
		 */
		getFollowList: (url: string) => Promise<GlobalFollowListItem[]>;
		/**
		 * 获取文章列表
		 */
		getArticleList: (userId: string) => Promise<GlobalFollowArticleListItem[]>;
	};
}

interface MyGlobal {
	store: object; // 你可以将 any 替换为你的实际类型
}

declare global {
	interface Window {
		api: api;
		electron: ElectronAPI;
	}
}

export {};
