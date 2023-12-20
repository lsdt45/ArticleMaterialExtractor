<template>
	<div class="version__wrapper">
		<n-dropdown :options="options">
			<n-button>用户资料</n-button>
		</n-dropdown>
	</div>
</template>

<script setup lang="ts">
	import { NIcon } from 'naive-ui';
	import { h } from 'vue';
	import type { Component } from 'vue';
	import { PersonCircleOutline as UserIcon, Pencil as EditIcon, LogOutOutline as LogoutIcon } from '@vicons/ionicons5';

	const renderIcon = (icon: Component) => {
		return () => {
			return h(NIcon, null, {
				default: () => h(icon),
			});
		};
	};
	let options = [
		{
			label: '用户资料',
			key: 'profile',
			icon: renderIcon(UserIcon),
		},
		{
			label: '编辑用户资料',
			key: 'editProfile',
			icon: renderIcon(EditIcon),
		},
		{
			label: '退出登录',
			key: 'logout',
			icon: renderIcon(LogoutIcon),
		},
	];
</script>

<style lang="scss"></style>
