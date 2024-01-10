<template>
	<div class="add-follow-dialog__wrapper">
		<div class="add-follow-dialog__body">
			<span>平台主页链接</span>
			<n-input v-model:value="myHomePageUrl" type="text" placeholder="输入你的平台账号主页：" />
			<span class="tooltip">目前仅支持：头条号</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits(['update']);

	let myHomePageUrl = ref('');

	watch(myHomePageUrl, (val) => {
		emit('update', val);
	});

	onMounted(() => {});
</script>

<style lang="scss"></style>
