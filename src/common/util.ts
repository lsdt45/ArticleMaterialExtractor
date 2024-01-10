/**
 * 将时间转换为时间戳
 * @param {String} timeStr 时间字符串
 * @return {Number} 时间戳
 */
export function convertToTimestamp(timeStr: string): number | null {
	const now = new Date(); // 当前时间
	const timeUnits = {
		小时前: 3600 * 1000,
		分钟前: 60 * 1000,
		秒前: 1000,
		天前: 24 * 3600 * 1000,
		月前: 'month',
		年前: 'year',
		昨天: 24 * 3600 * 1000,
		前天: 24 * 2 * 3600 * 1000,
	};

	// 处理特定关键词
	for (const [key, value] of Object.entries(timeUnits)) {
		if (timeStr.includes(key)) {
			if (typeof value === 'number') {
				return new Date(now.getTime() - parseInt(timeStr) * value).getTime();
			} else if (value === 'month') {
				return new Date(now.setMonth(now.getMonth() - parseInt(timeStr))).getTime();
			} else if (value === 'year') {
				return new Date(now.setFullYear(now.getFullYear() - parseInt(timeStr))).getTime();
			}
		}
	}

	// 处理具体日期
	const reg = /(\d{1,2})月(\d{1,2})日/;
	const match = timeStr.match(reg);
	if (match) {
		return new Date(now.getFullYear(), parseInt(match[1]) - 1, parseInt(match[2])).getTime();
	}

	return null; // 不匹配任何已知格式
}
