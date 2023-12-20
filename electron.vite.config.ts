import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer/'),
			},
		},
		plugins: [
			vue(),
			AutoImport({
				imports: [
					'vue',
					'vue-router',
					{
						'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
					},
				],
				dts: 'src/auto-import.d.ts', // 自动引入生成api的地址
			}),
			Components({
				resolvers: [NaiveUiResolver()],
			}),
		],
	},
});
