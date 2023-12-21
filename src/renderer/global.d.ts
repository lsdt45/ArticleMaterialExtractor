import { SearchInfo } from './components/Article/ArticleSearch';
import type { ElectronAPI } from '@electron-toolkit/preload';

interface api {
	readDirReply: (callback: (event: Event, result: { canceled: boolean }) => void) => void;
	getArticleSearchList: (searchInfo: string) => Promise<any>;
}

declare global {
	interface Window {
		api: api;
		electron: ElectronAPI;
	}
}

export {};
