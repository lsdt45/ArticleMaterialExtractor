// 设置
export const Settings = [
	{
		name: 'settings',
		parent: '',
		children: [
			{
				name: 'savePath',
				parent: 'settings',
			},
			{
				name: 'homePageUrl',
				parent: 'settings',
			},
		],
	},
];

export enum SettingsEnum {
	savePath = 'savePath',
	homePageUrl = 'homePageUrl',
}
