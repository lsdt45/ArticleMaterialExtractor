import { BrowserWindow, shell, screen } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import common from './ipcHandlers/handlers/Common';
export class WindowManager {
	private mainWindow: BrowserWindow | null = null;
	private eventHandlers: Map<string, () => void> = new Map([
		['ready-to-show', this.windowShow],
		['maximize', this.sendMaximize],
		['unmaximize', this.sendUnmaximize],
	]);
	public createWindow(): BrowserWindow {
		const { width, height } = screen.getPrimaryDisplay().workAreaSize;
		this.mainWindow = new BrowserWindow({
			width: width * 0.5,
			height: height * 0.65,
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
		this.mainWindow.webContents.setWindowOpenHandler((details) => {
			shell.openExternal(details.url);
			return { action: 'deny' };
		});
		// this.mainWindow.on('ready-to-show', () => {
		// 	this.mainWindow?.show();
		// });
		this.setEventHandle();
		// HMR for renderer base on electron-vite cli.
		// Load the remote URL for development or the local html file for production.
		if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
			this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
		} else {
			this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
		}
		common.getLocalConfig();
		return this.mainWindow;
	}

	/**
	 * @description: 设置事件监听
	 */
	private setEventHandle() {
		this.eventHandlers.forEach((listener, eventName) => {
			this.mainWindow?.on(eventName as any, listener.bind(this));
		});
	}

	/**
	 * @description: 窗口显示
	 */
	public windowShow() {
		this.mainWindow?.show();
	}

	private sendMaximize() {
		this.mainWindow?.webContents.send('maximize');
	}
	private sendUnmaximize() {
		this.mainWindow?.webContents.send('unmaximize');
	}
}
