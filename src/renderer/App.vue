<script setup lang="ts">
	import { useStore } from '@renderer/store/index';
	const store = useStore();

	async function initData() {
		const config = await window.api.common.getLocalConfig();
		store.$patch({ settings: config });
	}

	onMounted(async () => {
		await initData();
	});
</script>

<template>
	<div class="App">
		<n-dialog-provider>
			<n-message-provider>
				<router-view />
			</n-message-provider>
		</n-dialog-provider>
	</div>
</template>

<style lang="scss">
	body {
		-webkit-app-region: drag;
	}
</style>
