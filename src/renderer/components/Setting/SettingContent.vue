<template>
	<div class="setting-content__wrapper">
		<div class="setting-item__wrapper">
			<div class="setting-item path-setting">
				<span>保存路径</span>
				<n-input v-model:value="dirPath" type="text" placeholder="请选择路径" />
				<n-button class="path-setting-btn" type="primary" @click="openDirDialog"> 浏览 </n-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useStore } from '@renderer/store/index';
	const store = useStore();
	let dirPath = ref('');

	async function openDirDialog() {
		const path = await window.api.getDirPath();
		dirPath.value = path ?? '';
		store.setSavePath(path);
	}

	function initData() {
		dirPath.value = store.settings?.savePath;
	}

	function pathChange(value: string) {
		store.setSavePath(value);
	}

	watch(dirPath, (val) => {
		pathChange(val);
	});

	onMounted(() => {
		initData();
	});
</script>

<style lang="scss">
	.setting-content__wrapper {
		margin: 2em 0;
		.path-setting {
			display: flex;
			justify-content: space-between;
			& > span {
				display: flex;
				align-items: center;
				flex-basis: 20%;
			}
			.path-setting-btn {
				flex-basis: 18%;
				margin-left: 1em;
			}
		}
	}
</style>
