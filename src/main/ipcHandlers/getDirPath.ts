import { dialog } from 'electron';
import fs from 'fs';
import path from 'path';

// 递归遍历文件
const loadFilesInDir = (dir) => {
	let fileList: any[] = [];
	// 读取目录下全部文件及子目录
	let files = fs.readdirSync(dir);
	for (var i = 0; i < files.length; i++) {
		let filePath = path.join(dir, files[i]);
		// 获取信息
		let fileData = fs.statSync(filePath);
		// 判断是文件还是目录
		if (fileData.isFile()) {
			// 如果是文件，则记录下来
			fileList.push(filePath);
		} else {
			// 如果是目录，则递归遍历，并拼接结果
			fileList = fileList.concat(loadFilesInDir(filePath));
		}
	}
	return fileList;
};

// 打开选择目录对话框并遍历目录里的所有文件
const getDirPath = async () => {
	const result = await dialog.showOpenDialog({
		// 只允许选择目录
		properties: ['openDirectory'],
	});
	if (result.canceled) {
		return;
	} else {
		return result.filePaths[0];
	}
};

export { getDirPath };
