<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		type = "button",
		disabled,
		onclick = () => {},
		children,
	}: {
		type?: "button" | "submit" | "reset";
		disabled?: boolean;
		onclick?: () => Promise<void> | void;
		children: Snippet;
	} = $props();
</script>

<button {disabled} {onclick} {type}>
	{@render children()}
</button>

<style lang="scss">
	button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		background-color: #ff5fa2;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			transform 0.1s ease;

		&:hover {
			background-color: #e84f92;
		}

		&:active {
			transform: scale(0.98);
		}

		&:disabled {
			background-color: #ccc;
			cursor: not-allowed;
		}
	}
</style>
