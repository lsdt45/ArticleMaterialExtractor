import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { WindowManager } from './WindowManager';
// import icon from '../../resources/icon.png?asset';
// import icon from './resources/icon.ico';
import { ipcHandlers } from './ipcHandlers/index';
function createWindow(): BrowserWindow {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 700,
		show: false,
		autoHideMenuBar: true,
		icon: join(__dirname, '../../resources/icon.png'),
		// ...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			// 禁用同源策略，允许跨域请求
			webSecurity: false,
			devTools: is.dev ? true : false,
		},
		frame: false, // 无边框窗口
	});

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
	}
	return mainWindow;
}

// 程序单例模式
let myWindow: any = null;
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	// 如果已经有同样的该程序正在运行，则不启动
	app.quit();
} else {
	// 如果检测到有同样的该程序正在试图启动...
	app.on('second-instance', () => {
		if (myWindow) {
			// 弹出系统提示对话框
			dialog.showMessageBox({
				message: '此程序已经正在运行',
			});
			// 如果该程序窗口处于最小化状态，则恢复窗口
			if (myWindow.isMinimized()) myWindow.restore();
			// 将该程序窗口置为当前聚焦态
			myWindow.focus();
		}
	});

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.whenReady().then(() => {
		// Set app user model id for windows
		electronApp.setAppUserModelId('com.electron');

		// Default open or close DevTools by F12 in development
		// and ignore CommandOrControl + R in production.
		// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
		app.on('browser-window-created', (_, window) => {
			optimizer.watchWindowShortcuts(window);
		});

		// myWindow = createWindow();
		myWindow = new WindowManager().createWindow();
		global.mainWindow = myWindow;
		app.on('activate', function () {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (BrowserWindow.getAllWindows().length === 0) new WindowManager().createWindow();
			// if (BrowserWindow.getAllWindows().length === 0) createWindow();
		});
	});

	// Quit when all windows are closed, except on macOS. There, it's common
	// for applications and their menu bar to stay active until the user quits
	// explicitly with Cmd + Q.
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});
}
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

addIpcHandlers(ipcHandlers);
/**
 * @description: 循环遍历将对象中的所有键值对都添加到 ipcMain 中
 * @param {object} ipcHandlersParam
 */
function addIpcHandlers(ipcHandlersParam: object) {
	for (let key in ipcHandlersParam) {
		let item = ipcHandlersParam[key];
		// 判断当前键值对的值中，键的数量是否大于 1
		// 如果大于 1，则说明这个值是一个对象，需要进一步遍历
		if (Object.keys(item).length >= 1) {
			addIpcHandlers(item);
			continue;
		} else {
			// 如果不是对象，则直接添加到 ipcMain 中
			ipcMain.handle(key, item);
		}
	}
}

