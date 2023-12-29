<template>
	<div class="window-title__wrapper">
		<div class="window-title-left__wrapper">
			<div class="window-title-left">
				<img class="window-icon" src="../assets/icon.png" alt="素材提取" />
				<span class="window-title-text">文章素材提取器</span>
			</div>
		</div>
		<div class="window-title__right">
			<span class="iconfont icon-minimize" @click="minimizeWindow"></span>
			<span class="iconfont" :class="windowClass" @click="switchWindowSize"></span>
			<span class="iconfont icon-close" @click="exitApp"></span>
		</div>
	</div>
</template>

<script setup lang="ts">
	let windowIcon = ref<'maximize' | 'unmaximize'>('maximize');

	const windowClass = computed(() => {
		return windowIcon.value === 'maximize' ? 'icon-maximize' : 'icon-unmaximize';
	});

	function exitApp() {
		window.api.common.exitApp();
	}
	function minimizeWindow() {
		window.api.common.minimizeWindow();
	}
	function switchWindowSize() {
		if (windowIcon.value === 'maximize') {
			window.api.common.maximizeWindow();
			windowIcon.value = 'unmaximize';
		} else {
			window.api.common.unmaximizeWindow();
			windowIcon.value = 'maximize';
		}
	}

	function listenMainMessage() {
		window.api.common.receiveMessage('maximize', () => {
			windowIcon.value = 'unmaximize';
		});
		window.api.common.receiveMessage('unmaximize', () => {
			windowIcon.value = 'maximize';
		});
	}

	onMounted(() => {
		listenMainMessage();
	});
</script>

<style lang="scss">
	.window-title__wrapper {
		display: flex;
		justify-content: flex-end;
		padding: 4px 0;
		background-color: #4e4e4e;
		.window-title-left__wrapper {
			position: relative;
			display: flex;
			flex: 1;
			-webkit-app-region: drag;
			.window-icon {
				width: 28px;
				height: 28px;
			}
			.window-title-text {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-left: 1em;
				font-weight: bold;
				color: #fff;
			}
			.window-title-left {
				position: relative;
				left: 2em;
				display: flex;
			}
		}
		.window-title__right {
			display: flex;
		}
		.iconfont {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 32px;
			height: 32px;
			margin-right: 1em;
			border-radius: 5px;
			color: #fff;
			&:hover {
				background-color: #6c6c6c;
			}
		}
	}
</style>
