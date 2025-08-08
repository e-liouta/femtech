<script lang="ts">
	let {
		type,
		value = $bindable(),
		placeholder,
		required,
		name,
	}: {
		type?:
			| "text"
			| "email"
			| "number"
			| "password"
			| "textarea"
			| "search"
			| "url";
		value: string;
		placeholder?: string;
		required?: boolean;
		name?: string;
	} = $props();
</script>

<input bind:value {type} {placeholder} {required} {name} />

<style lang="scss">
	input {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: none;
		border-radius: 8px;
		background-color: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 0 2px transparent;
		transition:
			box-shadow 0.2s ease,
			background-color 0.2s ease;
		width: auto;
		min-width: 250px;

		&:focus {
			outline: none;
			box-shadow: 0 0 0 2px #ff5fa2;
			background-color: #fff;
		}
	}
</style>
