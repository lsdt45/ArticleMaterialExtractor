<script setup lang="ts"></script>

<template>
	<div class="App">
		<n-message-provider>
			<router-view />
		</n-message-provider>
	</div>
</template>

<style lang="scss">
	body {
		-webkit-app-region: drag;
	}
</style>
