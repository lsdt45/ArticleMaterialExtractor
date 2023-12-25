import { getDirPath } from './getDirPath';
import { getElectronVersion } from './version';
import { getArticleSearchList, openUrl } from '../../preload/ArticleCrawler/ArticleResult';
import { extractArticleContent } from '../../preload/ArticleCrawler/ArticleExtract';

// 定义一个对象，其中的键是事件名称，值是处理函数
export const ipcHandlers = {
	getDirPath: getDirPath,
	getElectronVersion: getElectronVersion,
	getArticleSearchList: getArticleSearchList,
	extractArticleContent: extractArticleContent,
	openUrl,
	// 在这里添加新的键值对，为新的事件添加处理函数
};
