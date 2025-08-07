<script lang="ts">
	export let type: "button" | "submit" | "reset" = "button";
	export let disabled: boolean = false;
	export let label: string = "";
</script>

<button {type} {disabled}>
	<slot>{label}</slot>
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
