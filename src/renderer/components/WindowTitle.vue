<template>
	<div class="window-title__wrapper">
		<div class="window-title__left">
			<img class="window-icon" src="../assets/icon.png" alt="素材提取" />
		</div>
		<div class="window-title__right">
			<span class="iconfont icon-minimize"></span>
			<span class="iconfont icon-maximize"></span>
			<span class="iconfont icon-close" @click="exitApp"></span>
		</div>
	</div>
</template>

<script setup lang="ts">
	function exitApp() {
		window.api.common.exitApp();
	}
</script>

<style lang="scss">
	.window-title__wrapper {
		display: flex;
		justify-content: flex-end;
		padding: 2px 0;
		background-color: #4e4e4e;
		.window-title__left {
			flex: 1;
			-webkit-app-region: drag;
			.window-icon {
				position: relative;
				left: 0.9em;
				top: 3px;
				width: 28px;
				height: 28px;
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
