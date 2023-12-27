<template>
	<div class="setting__wrapper"></div>
</template>

<script setup lang="ts">
	import SettingContent from './SettingContent.vue';
	const dialog = useDialog();
	function openDialog() {
		dialog.create({
			title: '设置',
			style: { width: '600px' },
			class: 'setting-dialog',
			content: () => h(SettingContent),
			icon: () => h('div', { class: 'iconfont icon-shezhi', style: { fontSize: '23px' } }),
		});
	}

	defineExpose({ openDialog });
</script>

<style lang="scss"></style>
