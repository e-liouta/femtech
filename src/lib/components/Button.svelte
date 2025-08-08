<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		type = "button",
		disabled,
		onclick = () => {},
		children,
		variant = "primary",
	}: {
		type?: "button" | "submit" | "reset";
		disabled?: boolean;
		onclick?: () => Promise<void> | void;
		children: Snippet;
		variant?: "primary" | "secondary";
	} = $props();
</script>

<button class={variant} {disabled} {onclick} {type}>
	{@render children()}
</button>

<style lang="scss">
	button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			transform 0.1s ease;

		&:active {
			transform: scale(0.98);
		}

		&:disabled {
			background-color: #ccc;
			cursor: not-allowed;
		}
	}

	.primary {
		color: white;
		background-color: #ff5fa2;

		&:hover {
			background-color: #e84f92;
		}
	}

	.secondary {
		color: #ff5fa2;
		background-color: white;
		border: 2px solid #ff5fa2;

		&:hover {
			background-color: #ffe6f0;
		}
	}
</style>
