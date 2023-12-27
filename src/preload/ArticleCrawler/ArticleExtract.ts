import puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';
import fs from 'fs';
import { ArticleEvent } from './ArticleEvent';
import axios from 'axios';

/**
 * @description: 提取文章内容
 * @param {Electron.IpcMainInvokeEvent} event
 * @param {string} url 文章链接
 * @param {string} title 文章标题
 */
export async function extractArticleContent(event: Electron.IpcMainInvokeEvent, url: string, title: string) {
	let articleContent = {
		text: '',
		image: '',
	};
	const browser = await puppeteer.launch({
		headless: false, //无头模式，默认是隐藏界面的，改成false,显示界面。
		slowMo: 100, //设置浏览器每一步之间的时间间隔，单位毫秒
		defaultViewport: { width: 1366, height: 900 }, // 设置浏览器视窗
	});
	try {
		const page = await browser.newPage();
		await page.goto(url, { timeout: 60000 });
		// 等待文章内容加载完成
		await page.waitForSelector('.article-content', { timeout: 60000 });
		// 提取文章的文本内容
		await getArticleTextContent(page, title);
		// 提取文章的图片
		await getArticleImageContent(page, title);
		// 发送提取完成的消息
		event.sender.send(ArticleEvent.ArticleExtractEnd, title);
	} catch (err) {
		event.sender.send(ArticleEvent.ArticleExtractEnd, false);
		console.log(err);
	}
	await browser.close();
}

/**
 * @description: 提取文章的文本内容
 * @param {Page} page puppeteer page
 * @param {string} title 文章标题
 */
async function getArticleTextContent(page: Page, title: string) {
	const articleText = await page.$$eval('.article-content p', (elements) => {
		return elements.map((element) => {
			return element.innerText;
		});
	});
	let resultText = articleText.join('\n');
	const path = getSavePath(title, 'txt');
	fs.writeFileSync(path, resultText);
}

/**
 * @description: 提取文章的图片
 * @param {Page} page puppeteer page
 * @param {string} title 文章标题
 */
async function getArticleImageContent(page: Page, title: string) {
	// 获取所有图片的链接
	const imageUrls = await page.$$eval('.pgc-img img', (elements) => {
		return elements.map((element) => {
			return element.getAttribute('src') ?? '';
		});
	});
	for (let i = 0; i < imageUrls.length; i++) {
		let url = imageUrls[i];
		const imageResp = await axios({
			url: url,
			responseType: 'arraybuffer',
		});
		// 图片名称
		const path = getSavePath(title, 'jpg', i);
		fs.writeFileSync(path, imageResp.data);
	}
}

/**
 * @description: 返回保存路径
 * @param {String} title 文章标题
 * @param {String} format 保存格式
 * @param {Number} index 保存序号（保存多张图片时使用）
 * @return  {String} 保存路径
 */
export function getSavePath(title: string, format: string, index = 0): string {
	return index
		? `${global.store.savePath ?? './'}/${title.replace(/[<>:"/\\|?*]+/g, '')}-${index}.${format}`
		: `${global.store.savePath ?? './'}/${title.replace(/[<>:"/\\|?*]+/g, '')}.${format}`;
}
