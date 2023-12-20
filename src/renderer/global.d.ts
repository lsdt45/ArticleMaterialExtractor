interface api {
	readDirReply: (callback: (event: Event, result: { canceled: boolean }) => void) => void;
	getArticleSearchList: (url: string) => Promise<any>;
}

declare global {
	interface Window {
		api: api;
	}
}

export {};
