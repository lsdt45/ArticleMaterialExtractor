<template>
	<div class="home-entry-item__wrapper" @click="jumpToPage">
		<div class="home-entry-item">
			<span :class="homeItem.icon" class="home-entry-item__icon"></span>
			<span>{{ homeItem.title }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { HomeEntryItemType } from './HomeType';
	import router from '@renderer/router/index';

	const props = defineProps({
		homeItem: {
			type: Object as PropType<HomeEntryItemType>,
			required: true,
		},
	});

	function jumpToPage() {
		router.push(props.homeItem.route);
	}
</script>

<style lang="scss">
	.home-entry-item__wrapper {
		cursor: pointer;
		user-select: none;
		transition: all 0.3s ease-in-out;
		&:hover {
			transform: scale(1.15);
		}
		.home-entry-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 220px;
			height: 100px;
			border-radius: 5px;
			background: #808080;
			span {
				color: #fff;
			}
			.iconfont {
				font-size: 38px;
			}
		}
	}
</style>
