// import axios from 'axios';
// import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';
import _ from 'lodash';
export async function getArticleSearchList(event: Electron.IpcMainInvokeEvent, url: string) {
	const browser = await puppeteer.launch({
		headless: true, //无头模式，默认是隐藏界面的,true.改成false,显示界面。
		slowMo: 100, //设置浏览器每一步之间的时间间隔，单位毫秒
		defaultViewport: { width: 1366, height: 760 }, // 设置浏览器视窗
	});
	const page = await browser.newPage(); // 打开一个新页面
	await page.goto(url); // 跳转到指定网页
	await page.waitForSelector('.cs-card-content'); // 等待元素加载完成
	const articleInfo = await getArticleBaseInfo(page);
	await browser.close();
	return articleInfo;
}

/**
 * @description: 获取文章基础信息
 * @param {Page} page puppeteer page
 * @return {Promise<any>} 文章基础信息
 */
async function getArticleBaseInfo(page: Page) {
	let articleInfo = await page.$$eval('.cs-view.cs-view-block.cs-card-content', (elements) => {
		let allElements = elements.slice(4, elements.length - 1);
		return allElements.map((element) => {
			let obj: any = {};
			// 先获取链接和标题
			let aElement = element.querySelector('.align-items-center a');
			obj.url = aElement?.getAttribute('href');
			obj.title = (aElement as HTMLAnchorElement)?.innerText;
			// 然后获取文章基础信息
			let infoElement = element.querySelectorAll('.align-items-center.cs-source-content span');
			if (infoElement.length <= 4) {
				obj.author = (infoElement[1] as HTMLAnchorElement)?.innerText ?? '未知';
				obj.commentNum = (infoElement[2] as HTMLAnchorElement)?.innerText ?? '0';
				obj.date = (infoElement[3] as HTMLAnchorElement)?.innerText ?? '未知';
			}
			return obj;
		});
	});
	return articleInfo;
}
