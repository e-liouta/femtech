<script lang="ts">
	import { supabase } from "$lib/supabaseClient";

	let email = "";
	let password = "";
	let message = "";

	async function signUp() {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			message = error.message;
		} else {
			message = "Check your email to confirm your account!";
		}
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
	documentation
</p>

<h2>Sign Up</h2>
<form on:submit|preventDefault={signUp}>
	<input type="email" bind:value={email} placeholder="Email" required />
	<input
		type="password"
		bind:value={password}
		placeholder="Password"
		required
	/>
	<button type="submit">Sign Up</button>
</form>

{#if message}
	<p>{message}</p>
{/if}
