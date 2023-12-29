<template>
	<div class="back-button__wrapper">
		<n-tooltip trigger="hover" placement="bottom-end" :show-arrow="false">
			<template #trigger>
				<span class="iconfont icon-back" @click="back"></span>
			</template>
			返回上一级
		</n-tooltip>
	</div>
</template>

<script setup lang="ts">
	import router from '@renderer/router/index';

	function back() {
		router.back();
	}
</script>

<style lang="scss">
	.back-button__wrapper {
		.icon-back {
			font-size: $main-icon-size;
			color: $main-color;
		}
	}
</style>
