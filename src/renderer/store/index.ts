import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
	state: () => {
		return {
			settings: {
				savePath: '',
			},
		};
	},
	actions: {
		setSavePath(path: string) {
			if (!this.settings) return;
			this.settings.savePath = path;
			window.api.common.updateStore(JSON.stringify(this.$state.settings));
		},
	},
});
