<script lang="ts">
	import type { Snippet } from "svelte";
	import type { LayoutData } from "./$types";

	let { children }: { children: Snippet } = $props();
</script>

<head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
		rel="stylesheet"
	/>
</head>

{@render children()}

<style lang="scss">
	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-family: "Inter", sans-serif;
	}
</style>
