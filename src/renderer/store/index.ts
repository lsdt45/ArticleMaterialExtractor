import { defineStore } from 'pinia';
import { SettingsEnum } from 'src/common/CommonVars';
export const useStore = defineStore('main', {
	state: () => {
		return {
			settings: {
				savePath: '',
				homePageUrl: '',
			},
		};
	},
	actions: {
		saveSettings(key: SettingsEnum, value: string) {
			if (!this.settings) return;
			this.$state.settings[key] = value;
			window.api.common.updateStore(JSON.stringify(this.$state.settings));
		},
	},
});
