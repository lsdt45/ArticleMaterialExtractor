import type { SearchInfo } from '@renderer/components/Article/ArticleSearch';
import { ArticleEvent } from './ArticleEvent';
import puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';
import _ from 'lodash';
import { shell } from 'electron';

export async function getArticleSearchList(event: Electron.IpcMainInvokeEvent, searchInfo: string) {
	const browser = await puppeteer.launch({
		headless: true, //无头模式，默认是隐藏界面的，改成false,显示界面。
		slowMo: 100, //设置浏览器每一步之间的时间间隔，单位毫秒
		defaultViewport: { width: 0, height: 0 }, // 设置浏览器视窗
	});
	let searchInfoObj: SearchInfo = JSON.parse(searchInfo);
	const page = await browser.newPage(); // 打开一个新页面
	const articleInfo = await getArticleList(event, page, searchInfoObj);
	// await browser.close();
	return articleInfo;
}

/**
 * @description: 打开链接
 * @param title - description.
 * @return
 */
export function openUrl(event: Electron.IpcMainInvokeEvent, url: string) {
	shell.openExternal(url);
}

/**
 * @description: 循环获取文章列表
 * @param {Page} page puppeteer page
 * @param {SearchInfo} searchInfo 搜索信息
 */
async function getArticleList(event: Electron.IpcMainInvokeEvent, page: Page, searchInfo: SearchInfo) {
	let articleInfo: any = [];
	const timeStamps = getTimeStamps(7);
	// 设置用户代理
	const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
	// 循环获取文章列表
	for (let i = 0; i < Number(searchInfo.pageIndex); i++) {
		// let url = `https://so.toutiao.com/search?dvpf=pc&source=search_subtab_switch&keyword=${searchInfo.keyword}&pd=information&action_type=pagination&from=news&cur_tab_title=search_tab&filter_vendor=site&index_resource=site&filter_period=week&min_time=${timeStamps.daysAgoTimestamp}&max_time=${timeStamps.currentTimestamp}&page_num=${i}&search_id=20231220212326511E0B44ED30E84651F6`;
		let url = `https://so.toutiao.com/search?dvpf=pc&source=input&keyword=${searchInfo.keyword}&pd=information&action_type=pagination&from=news&cur_tab_title=news&page_num=${i}`;
		await page.setUserAgent(userAgent);
		let pages: any[] = [];
    let loopCount = 0;
		while (pages.length <= 1 && loopCount < 10) {
      loopCount++;
			await page.goto(url); // 跳转到指定网页
			await page.waitForSelector('.cs-card-content'); // 等待元素加载完成
			pages = await page.$$('.cs-card-content');
		}
    console.log('pages.length', pages.length);
		articleInfo = _.concat(articleInfo, await getArticleInfo(page));
		// 每获取完一页，就发送一次进度
		event.sender.send(ArticleEvent.ArticleSearchListProgress, i);
	}
	return articleInfo;
}

/**
 * @description: 获取文章基础信息
 * @param {any} obj 存放文章基础信息的对象
 * @param {Element} element 文章基础信息所在的元素
 * @return {any} 文章基础信息
 */
async function getArticleBaseInfo(obj: any, element: Element) {
	const urlPrefix = 'https://so.toutiao.com';
	// 可能的时间关键词
	const timeKeywords = ['小时前', '分钟前', '秒前', '天前', '月前', '年前', '昨天', '前天'];
	const reg = /(\d{1,2}月)(\d{1,2}日)/;
	// 先获取链接和标题
	let aElement = element.querySelector('.align-items-center a');
	obj.url = urlPrefix + aElement?.getAttribute('href');
	obj.title = (aElement as HTMLAnchorElement)?.innerText;
	// 然后获取文章基础信息
	let infoElement = element.querySelectorAll('.align-items-center.cs-source-content span');
	if (infoElement.length <= 5) {
		for (let index = 0; index < infoElement.length; index++) {
			let infoElementTemp = infoElement[index] as HTMLAnchorElement;
			// 从第二个开始赋值。第二个必定是作者。
			if (index === 0) continue;
			if (index === 1) {
				obj.author = infoElementTemp?.innerText ?? '未知';
				continue;
			}
			// 判断是否包含'评论'。
			if (infoElementTemp?.innerText.includes('评论')) {
				obj.commentNum = infoElementTemp?.innerText;
			}
			// 判断是否包含时间关键词。
			if (timeKeywords.some((keyword) => infoElementTemp?.innerText.includes(keyword) || reg.test(infoElementTemp?.innerText))) {
				obj.date = infoElementTemp?.innerText ?? '未知';
			}
			// 如果经过上面的处理没有获取到评论数和日期，那么就将它们赋值为 0 和 未知
			if (!obj.commentNum) {
				obj.commentNum = '0';
			}
			if (!obj.date) {
				obj.date = '未知';
			}
		}
	}
	return obj;
}

/**
 * @description: 异步获取文章基础信息
 * @param {Page} page puppeteer page
 * @return {Promise<any>} 文章基础信息
 */
async function getArticleInfo(page: Page) {
	// 将 getArticleBaseInfo 函数转换为字符串，以便在浏览器环境中使用
	let getArticleBaseInfoStr = getArticleBaseInfo.toString();
	// 使用 Puppeteer 的 $$eval 方法在浏览器环境中执行 JavaScript 代码
	// 这个方法会在每个匹配 '.cs-view.cs-view-block.cs-card-content' 选择器的元素上执行第二个参数提供的函数
	let articleInfo = await page.$$eval(
		'.cs-view.cs-view-block.cs-card-content',
		async (elements, getArticleBaseInfoStr) => {
			debugger;
			// 在浏览器环境中，使用 eval 函数将 getArticleBaseInfoStr 转换回函数
			let getArticleBaseInfo = eval('(' + getArticleBaseInfoStr + ')');
			// 去掉第一个和最后一个元素
			// let allElements = elements.slice(1, elements.length - 1);
			let allElements = elements;
			// 对每个元素调用 getArticleBaseInfo 函数，并将结果存入 promises 数组
			let promises = allElements.map(async (element) => {
				let obj: any = {};
				obj = await getArticleBaseInfo(obj, element);
				return obj;
			});
			// 使用 Promise.all 函数等待所有的 Promise 对象都完成，然后返回结果
			return Promise.all(promises);
		},
		// 将 getArticleBaseInfoStr 作为 $$eval 方法的第三个参数传递，这样它就可以在回调函数中使用了
		getArticleBaseInfoStr
	);
	return articleInfo;
}

/**
 * @description: 获取当前时间戳和七天前的时间戳
 * @param {number} daysAgo X天前的时间戳
 * @return {Object} 当前时间戳和七天前的时间戳
 */
export function getTimeStamps(daysAgo: number): { currentTimestamp: number; daysAgoTimestamp: number } {
	const currentDate = new Date();
	const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
	const sevenDaysAgoDate = new Date();
	sevenDaysAgoDate.setDate(currentDate.getDate() - daysAgo);
	const daysAgoTimestamp = Math.floor(sevenDaysAgoDate.getTime() / 1000);
	return {
		currentTimestamp,
		daysAgoTimestamp,
	};
}
