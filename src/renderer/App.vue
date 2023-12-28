<script setup lang="ts">
	import { useStore } from '@renderer/store/index';
	import WindowTitle from '@renderer/components/WindowTitle.vue';
	const store = useStore();

	async function initData() {
		const config = await window.api.common.getLocalConfig();
		if (config) {
			store.$patch({ settings: config });
		}
	}

	onMounted(async () => {
		await initData();
	});
</script>

<template>
	<div class="App">
		<window-title class="window-title"></window-title>
		<n-dialog-provider>
			<n-message-provider>
				<router-view />
			</n-message-provider>
		</n-dialog-provider>
	</div>
</template>

<style lang="scss">
	.window-title {
		-webkit-user-select: none;
		user-select: none;
	}
</style>
