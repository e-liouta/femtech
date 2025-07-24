<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	let email = "";
	let password = "";
	let error = "";

	async function handleLogin() {
		const { data, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (authError) {
			error = authError.message;
		} else {
			goto("/dashboard");
		}
	}
</script>

<h1>Login</h1>

<form on:submit|preventDefault={handleLogin}>
	<input type="email" bind:value={email} placeholder="Email" required />
	<input
		type="password"
		bind:value={password}
		placeholder="Password"
		required
	/>
	<button type="submit">Login</button>
</form>

{#if error}
	<p style="color: red;">{error}</p>
{/if}
