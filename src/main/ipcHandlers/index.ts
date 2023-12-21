import { readDir } from './readDir';
import { getElectronVersion } from './version';
import { getArticleSearchList } from '../../preload/ArticleCrawler/ArticleResult';

// 定义一个对象，其中的键是事件名称，值是处理函数
export const ipcHandlers = {
	readDir: readDir,
	getElectronVersion: getElectronVersion,
	getArticleSearchList: getArticleSearchList,
	// 在这里添加新的键值对，为新的事件添加处理函数
};
