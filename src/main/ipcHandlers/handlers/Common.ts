import { localStore } from '../../localStore';
import { app } from 'electron';
import { StoreKey } from '../../localStore/types';
/**
 * @description: 把从渲染进程传来的 store，分别更新到主进程全局变量和本地存储
 * @param {string} event 事件
 * @param {StoreKey} key 要保存的键
 * @param {string} store store
 */
function updateStore(event, key: StoreKey, store) {
	global.store[key] = JSON.parse(store);
	localStore.set('config', global.store);
	// localStore.set(key, global.store);
}

/**
 * @description: 读取本地储存的数据，先赋值给全局变量，然后发送给渲染进程
 */
function getLocalConfig(event) {
	global.store = localStore.get('config');
	return localStore.get('config');
}

/**
 * @description: 退出程序
 */
function exitApp() {
	app.quit();
}

/**
 * @description: 最小化窗口
 */
function minimizeWindow() {
	global.mainWindow.minimize();
}

/**
 * @description: 最大化窗口
 */
function maximizeWindow() {
	global.mainWindow.maximize();
}

/**
 * @description: 取消最大化窗口
 */
function unmaximizeWindow() {
	global.mainWindow.unmaximize();
}
export default { updateStore, getLocalConfig, exitApp, minimizeWindow, maximizeWindow, unmaximizeWindow };
